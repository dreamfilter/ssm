(function ($) {
    $.fn.extend({
        iType: function () {
            var $this = $(this);
            initNumType($this);
            $().datepicker && initDatePicker($this);
            $().datetimepicker && initDatetimePicker($this);
            $().daterangepicker && initDateRangePicker($this);
        }
    });

    function initNumType($inputs) {
        $inputs.filter("[data-i-type=int]").unbind(".intDeal")
            .bind("keydown.intDeal keyup.intDeal blur.intDeal focus.intDeal", intDeal);
        $inputs.filter("[data-i-type=float]").unbind(".floatDeal")
            .bind("keydown.floatDeal keyup.floatDeal blur.floatDeal focus.floatDeal", floatDeal);
    }

    function initDatePicker($inputs) {
        var yearInput = $inputs.filter("[data-i-type=year]");
        yearInput.datepicker("remove");
        yearInput.datepicker({
            clearBtn: true,
            autoclose: true,
            format: "yyyy",
            minViewMode: 2
        });
        var monthInput = $inputs.filter("[data-i-type=yearMonth]");
        monthInput.datepicker("remove");
        monthInput.datepicker({
            clearBtn: true,
            autoclose: true,
            format: "yyyy-mm",
            minViewMode: 1
        });
        var dateInput = $inputs.filter("[data-i-type=date]");
        dateInput.datepicker("remove");
        dateInput.datepicker({
            clearBtn: true,
            autoclose: true,
            format: "yyyy-mm-dd",
            todayBtn: "linked",
            todayHighlight: true
        });
        var dateCustomInput = $inputs.filter("[data-i-type=dateCustom]");
        dateCustomInput.datepicker("remove");
        dateCustomInput.datepicker({
            autoclose: true
        });
    }

    function initDatetimePicker($inputs) {
        var dateMinuteInput = $inputs.filter("[data-i-type=dateMinute]");
        dateMinuteInput.datetimepicker("remove");
        dateMinuteInput.datetimepicker({
            autoclose: true,
            format: "yyyy-mm-dd hh:ii",
            bootcssVer: 3,
            todayBtn: "linked",
            todayHighlight: true
        });
        var dateSecondInput = $inputs.filter("[data-i-type=dateSecond]");
        dateSecondInput.datetimepicker("remove");
        dateSecondInput.datetimepicker({
            autoclose: true,
            format: "yyyy-mm-dd hh:ii:ss",
            todayBtn: "linked",
            bootcssVer: 3,
            todayHighlight: true
        });
        var datetimeCustomInput = $inputs.filter("[data-i-type=datetimeCustom]");
        datetimeCustomInput.datetimepicker("remove");
        datetimeCustomInput.datetimepicker({
            autoclose: true,
            bootcssVer: 3
        });
    }

    function initDateRangePicker($inputs) {
        var dateRangeInput = $inputs.filter("[data-i-type=dateRange]");
        var range = {};
        range[$.iType.i18n.today] = [moment(), moment()];
        range[$.iType.i18n.yesterday] = [moment().subtract('days', 1), moment().subtract('days', 1)];
        range[$.iType.i18n.last7days] = [moment().subtract('days', 6), moment()];
        range[$.iType.i18n.last30days] = [moment().subtract('days', 29), moment()];
        range[$.iType.i18n.thisMonth] = [moment().startOf('month'), moment().endOf('month')];
        range[$.iType.i18n.lastMonth] = [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')];
        dateRangeInput.daterangepicker({
            autoUpdateInput: false,
            showDropdowns: true,
            alwaysShowCalendars: true,
            applyClass:"green",
            locale: {
                format: 'YYYY-MM-DD',
                applyLabel: $.iType.i18n.applyLabel,
                cancelLabel: $.iType.i18n.cancelLabel,
                weekLabel: $.iType.i18n.weekLabel,
                customRangeLabel: $.iType.i18n.customRangeLabel
            },
            ranges: range,
            "startDate": moment(),
            "endDate": moment()
        }).on('apply.daterangepicker', function (ev, picker) {
            var from = picker.startDate.format('YYYY-MM-DD');
            var to = picker.endDate.format('YYYY-MM-DD');
            var $input;
            if ($(this).is("input")) {
                $input = $(this);
            } else {
                $input = $(this).find("input")
            }
            $input.val(from + " " + $.iType.i18n.to + " " + to).data("from", from).data("to", to);
        }).on('cancel.daterangepicker', function (ev, picker) {
            var $input;
            if ($(this).is("input")) {
                $input = $(this);
            } else {
                $input = $(this).find("input")
            }
            $input.val('').data("from", "").data("to", "");
        });
    }

    /**
     * @description 将input处理为int型
     * @param {Object} e 事件对象
     * @example  $("input[itype=int]").unbind(".intDeal").bind("keydown.intDeal keyup.intDeal blur.intDeal mousemove.intDeal", intDeal);
     * &lt;input type="text" itype="int" max="100" min="10" positive="positive"/&gt;
     *     max(可选参数)限制最大值
     *     min(可选参数)限制最小值
     *     positive(可选参数)限制为正
     *     changeRange(可选参数)上下键变化数字的时候每次增减值
     */
    function intDeal(e) {
        if ($(this).attr("readonly"))return;
        var eType = e.type;
        var max = $(this).attr("max");
        var min = $(this).attr("min");
        var changeRange = $(this).attr("changeRange");
        var defaultVal = $(this).attr("defaultVal");
        //当为keydown事件时
        if (eType == "keydown") {
            changeRange = changeRange == undefined ? 1 : parseInt(changeRange, 10);
            var key = e.which;
            //若shift键按下则使所有按键失效
            if (e.shiftKey)return false;
            if (e.ctrlKey)return true;
            //若按下向上键，且非空，小于最大值则加一
            if (key == 38 && this.value.isNotEmpty() && (max == undefined || (max != undefined && parseInt(this.value, 10) + changeRange <= parseInt(max, 10)))) {
                this.value = parseInt(this.value, 10) + changeRange;
                return true;
            }
            //若按下向下键，且非空，大于最小值则减一
            if (key == 40 && this.value.isNotEmpty() && (min == undefined || (min != undefined && parseInt(this.value, 10) - changeRange >= parseInt(min, 10)))) {
                if ($(this).attr("positive") == "positive" && parseInt(this.value, 10) - changeRange < "0") {
                    return true
                }
                this.value = parseInt(this.value, 10) - changeRange;
                return true;
            }

            var currentValue = this.value;
            var valueLength = currentValue.length;
            var currentSite = commonUtil.getPositionForInput(this);
            //处理小数点后第一位
            if ((key == 110 || key == 190) && valueLength >= 2 && currentValue.substring(valueLength - 2) == "00") {
                commonUtil.setPositionForInput(this, currentSite);
            }
            else if (currentSite == (valueLength - 1) && currentValue.substring(valueLength - 2) != "00") {
                commonUtil.setPositionForInput(this, currentSite);
            }
            else if (currentSite == (valueLength - 1) && currentValue.substring(valueLength - 2) == "00") {
                //
            }

            //若按下向左，向右，退格，删除，tab则正常执行按键
            if (key == 37 || key == 39 || key == 8 || key == 46 || key == 9)return true;
            //若按下数字键则正常执行按键
            if ((key <= 57 && key >= 48) || (key >= 96 && key <= 105)) {
                //若设定了最大值且当前值等于最大值则阻止输入
                return max == undefined || this.value != max || commonUtil.getSelectText(this).length > 0;
            }
            if (key == 229) {
                return true;
            }
            else {
                //处理负号
                if ((key == 109 || key == 189 ) && $(this).attr("positive") != "positive") {
                    this.value = "-" + this.value.replace("-", "")
                }
                return false;
            }
        }
        //当为keyup事件时
        if (eType == "keyup") {
            key = e.which;
            if (key == 37 || key == 39 || key == 8 || key == 46 || key == 9)return true;
            //去除特殊字符
            if (this.value.search(/[^\d\-]/) != -1) {
                this.value = this.value.replace(/[^\d\-]/g, '');
            }
            //超过最大值时用最大值填充
            if (max != undefined && parseInt(this.value, 10) > parseFloat(max)) {
                this.value = max;
            }
        }
        if (eType == "blur" || eType == "mouseout") {
            //去除特殊字符
            if (this.value.search(/[^\d\-]/) != -1) {
                this.value = this.value.replace(/[^\d\-]/g, '');
            }
            var value = this.value;
            //处理负号
            if (value.indexOf("-") != -1) {
                this.value = "-" + value.replace(/\-/g, '')
            }
            if (this.value == "-")this.value = "";
            //若为正数则去掉负号
            $(this).attr("positive") == "positive" && $(this).val(this.value.replace(/\-/g, ''));
            //若小于最小值则用最小值填充
            if (min != undefined && parseInt(this.value, 10) < parseFloat(min)) {
                this.value = min;
            }
            this.value = this.value == "" ? "" : parseInt(this.value, 10);
            if ((this.value == "0" || this.value == "") && defaultVal != undefined) {
                this.value = defaultVal
            }
        }
        if (eType == "focus") {
            this.select();
        }
    }

    /**
     * @description 将input处理为float型
     * @param {Object} e 事件对象
     * @example  $("input[itype=float]").unbind(".floatDeal").bind("keydown.floatDeal keyup.floatDeal blur.floatDeal mousemove.floatDeal", floatDeal);
     * &lt;input type="text" itype="float" max="100" min="10" positive="positive" precision="2"/&gt;
     *     max(可选参数)限制最大值
     *     min(可选参数)限制最小值
     *     positive(可选参数)限制为正
     *     precision(可选参数)限制小数点后面精度
     */
    function floatDeal(e) {
        if ($(this).attr("readonly"))return;
        var eType = e.type;
        var max = $(this).attr("max");
        var min = $(this).attr("min");
        var changeRange = $(this).attr("changeRange");
        var positive = $(this).attr("positive");
        var precision = $(this).attr("precision");
        var toFix = $(this).attr("toFix");
        var noZero = $(this).attr("noZero");
        var defaultVal = $(this).attr("defaultVal");
        //当为keydown事件时
        if (eType == "keydown") {
            changeRange = changeRange == undefined ? 1 : parseInt(changeRange, 10);
            var key = e.which;
            //若shift键按下则使所有按键失效
            if (e.shiftKey)return false;
            //若按下向上键，且非空，小于最大值则加一
            if (key == 38 && this.value.isNotEmpty() && (max == undefined || (max != undefined && parseFloat(this.value) + changeRange <= parseFloat(max)))) {
                var minusValue = this.value.split(".");
                minusValue[0] = parseInt(minusValue[0], 10) + changeRange;
                this.value = minusValue.length == 1 ? minusValue[0] : minusValue[0] + "." + minusValue[1];
                return true;
            }
            //若按下向下键，且非空，大于最小值则减一
            if (key == 40 && this.value.isNotEmpty() && (min == undefined || (min != undefined && parseFloat(this.value) - changeRange >= parseFloat(min)))) {
                var resultValue = parseFloat(this.value) - changeRange;
                if ($(this).attr("positive") == "positive" && resultValue < 0) {
                    return true
                }
                var plusValue = this.value.split(".");
                plusValue[0] = parseInt(plusValue[0], 10) - changeRange;
                this.value = plusValue.length == 1 ? plusValue[0] : plusValue[0] + "." + plusValue[1];
                return true;
            }
            //若按下向左，向右，home，end，退格，删除，tab则正常执行按键
            if (key == 37 || key == 39 || key == 8 || key == 46 || key == 9 || key == 35 || key == 36)return true;
            //若按下数字键则正常执行按键
            if ((key <= 57 && key >= 48) || (key >= 96 && key <= 105)) {
                //若设定了最大值且当前值等于最大值，或者超过设定的精度则阻止输入
                return (max == undefined || this.value != max)
                    && (precision == undefined
                    || this.value.split(".").length < 2
                    || (this.value.split(".")[1]).length != parseInt(precision, 10)
                    || commonUtil.getPositionForInput(this) < this.value.indexOf(".") + 1
                    || commonUtil.getSelectText(this).length > 0)
            }
            if (key == 110 || key == 190) {
                return this.value.indexOf(".") == -1;
            }
            if (key == 229) {
                return true;
            }
            else {
                //处理负号
                if ((key == 109 || key == 189 ) && positive != "positive") {
                    this.value = "-" + this.value.replace("-", "")
                }
                return false;
            }
        }
        //当为keyup事件时
        if (eType == "keyup") {
            key = e.which;
            if (key == 37 || key == 39 || key == 8 || key == 46 || key == 9)return true;
            //去除特殊字符
            if (this.value.search(/[^\d\-\.]/) != -1) {
                this.value = this.value.replace(/[^\d\-\.]/g, '')
            }
            //超过最大值时用最大值填充
            if (max != undefined && parseFloat(this.value) > parseFloat(max)) {
                this.value = max;
            }
        }
        if (eType == "blur") {
            //去除特殊字符
            var value = this.value;
            if (value.search(/[^\d\-\.]/) != -1) {
                this.value = value.replace(/[^\d\-\.]/g, '')
            }
            //处理负号
            value = this.value;
            if (value.indexOf("-") != -1) this.value = "-" + value.replace(/\-/g, '');
            //处理小数点，只保留多个小数点中最后一个
            value = this.value;
            var pos = value.lastIndexOf('.');
            if (pos != value.indexOf('.'))this.value = value.substring(0, pos).replace(/\./g, "") + value.substring(pos);
            //如果小数点在首位或者末尾则去掉
            value = this.value;
            if (value.indexOf(".") == 0 || value.indexOf(".") + 1 == value.length) this.value = value.replace(/\./g, "");
            //若只剩下一个负号则去掉
            this.value = this.value == "-" ? "" : this.value;
            //若非负则去掉负号
            value = this.value;
            if (positive == "positive" && value.indexOf("_") != -1)this.value = value.replace(/\-/g, '');
            //若小于最小值则用最小值填充
            value = this.value;
            if (min != undefined && parseFloat(value) < parseFloat(min)) {
                this.value = min;
            }
            value = this.value;
            if (noZero == "noZero" && parseFloat(value) == 0) {
                this.value = "";
            }
            //处理精度
            value = this.value;
            if (precision != undefined && value.indexOf('.') != -1) {
                value = parseFloat(value.substring(0, value.indexOf('.') + parseInt(precision, 10) + 1));
                this.value = value;
            }
            if (this.value != "" && precision != undefined && toFix == "toFix") {
                this.value = parseFloat(this.value).toFixed(precision)
            }
            else if (this.value != "") {
                this.value = parseFloat(value)
            }
            if ((this.value == "0" || this.value == "") && defaultVal != undefined) {
                this.value = defaultVal
            }
        }
        if (eType == "focus") {
            this.select();
        }
    }

    $.iType = function () {
        $("[data-i-type]").iType();
    };

    $.iType.i18n ={
        to:"To",
        today:"Today",
        yesterday:"Yesterday",
        last7days:"Last 7 Days",
        last30days:"Last 30 Days",
        thisMonth:"This Month",
        lastMonth:"Last Month",
        applyLabel:"apply",
        cancelLabel:"cancel",
        weekLabel:"W",
        customRangeLabel:"Custom Range"
    };

})(jQuery);
