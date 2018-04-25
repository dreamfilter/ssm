(function ($) {
    $.extend($.validator.messages, {
        autoCompleteRequired: "This field should be selected from autocomplete.",
        optionRequired: "This select should be selected.",
        afterBeginTime: "This field should be before start time."
    });
    $.validator.regexp = {
        chinese: {
            regexp: /^[\u4e00-\u9fa5]+$/,//中文
            message: "This field should be Chinese."
        },
        nonChinese: {
            regexp: /^[^\u4E00-\u9fa5]+$/,//非中文
            message: "This field should not be Chinese."
        }
    };
}(jQuery));

$(function () {
    for(var i in $.validator.regexp) {
        var reg = $.validator.regexp[i];
        (function(reg){
            $.validator.addMethod("regExp_" + i, function (value, element, param) {
                return this.optional(element) || reg.regexp.test(value);
            }, reg.message);
        }(reg));
    }

    /**
     * 必须从自动完成中选择
     */
    $.validator.addMethod("autoCompleteRequired", function (value, element, param) {
        if (param) {
            var hiddenValue = $(element).getGAutoHiddenValue();
            return this.optional(element) || (hiddenValue != undefined && hiddenValue != "");
        } else {
            return true;
        }
    }, $.validator.messages.autoCompleteRequired);

    /**
     * 左右select选择时，判断必选
     */
    $.validator.addMethod("optionRequired", function (value, element, param) {
        if (param) {
            return $(element).find("option").size() != 0;
        } else {
            return true;
        }
    }, $.validator.messages.optionRequired);
    /**
     * 开始时间必须小于结束时间
     */
    $.validator.addMethod("afterBeginTime", function (value, element, param) {
        var beginTime = $(param).val();
        if (beginTime == undefined) {
            console.log("参数不正确，开始日期未找到");
            return false;
        }
        return this.optional(element) || value.dateFormat() >= beginTime.dateFormat();
    }, $.validator.messages.afterBeginTime);
    /**
     * 检查是否是符合要求的数字
     */
    $.validator.addMethod("num", function (value, element, param) {
        var params = param.split(",");
        return this.optional(element) || value.checkNum(params[0], params[1]);
    }, $.validator.messages.number);
});
