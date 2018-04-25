/**
 * 区间查询脚本
 */
function initRange() {
    //验证框架: 前面的值不能大于后面的值(可以等于)
    jQuery.validator.addMethod("compareNum", function (value, element, param) {
        return Number.parseInt($(param).val()) <= Number.parseInt(value);
    }, "最大值应大于等于最小值");

    jQuery.validator.addMethod("compareFloatNum", function (value, element, param) {
        return parseFloat($(param).val()) <= parseFloat(value);
    }, "最大值应大于等于最小值");

    $(".rangeQuery").powerFloat({
        eventType: "click",
        target: "template/core/system/range.html",
        targetMode: "ajax",
        showCall: function () {
            var $this = $(this);
            $(".confirmRange").on("click", function () {
                if ($("#rangeForm").validate({
                        rules: {
                            valueFrom: {required: true},
                            valueTo: {required: true, compareNum: "#valueFrom"}
                        }
                    }).form()) {
                    var $valueFrom =$("#valueFrom").val();
                    var $valueTo =$("#valueTo").val();
                    $this.val($valueFrom + "-" + $valueTo);
                    $this.removeAttrs("valueFrom");
                    $this.removeAttrs("valueTo");
                    $this.attr("valueFrom",$valueFrom);
                    $this.attr("valueTo",$valueTo);
                    $(".float_ajax_box").hide();
                    $(".float_corner").hide();
                }
            });
            $(".cancelRange").on("click", function () {
                $("#valueFrom").val("");
                $("#valueTo").val("");
                $this.attr("valueFrom","");
                $this.attr("valueTo","");
                $(".float_ajax_box").hide();
                $(".float_corner").hide();
                $this.val("");
            })
        }
    });

    $(".moneyRangeQuery").powerFloat({
        eventType: "click",
        target: "template/core/system/moneyRange.html",
        targetMode: "ajax",
        showCall: function () {
            var $this = $(this);
            $(".confirmRange").on("click", function () {
                if ($("#rangeForm").validate({
                        rules: {
                            valueFrom: {required: true},
                            valueTo: {required: true, compareFloatNum: "#valueFrom"}
                        }
                    }).form()) {
                    var $valueFrom =$("#valueFrom").val();
                    var $valueTo =$("#valueTo").val();
                    $this.val($valueFrom + "-" + $valueTo);
                    $this.removeAttrs("valueFrom");
                    $this.removeAttrs("valueTo");
                    $this.attr("valueFrom",$valueFrom);
                    $this.attr("valueTo",$valueTo);
                    $(".float_ajax_box").hide();
                    $(".float_corner").hide();
                }
            });
            $(".cancelRange").on("click", function () {
                $("#valueFrom").val("");
                $("#valueTo").val("");
                $this.attr("valueFrom","");
                $this.attr("valueTo","");
                $(".float_ajax_box").hide();
                $(".float_corner").hide();
                $this.val("");
            })
        }
    });

    $(".classHourRangeQuery").powerFloat({
        eventType: "click",
        target: "template/core/system/classHourRange.html",
        targetMode: "ajax",
        showCall: function () {
            var $this = $(this);
            $(".confirmRange").on("click", function () {
                if ($("#rangeForm").validate({
                        rules: {
                            valueFrom: {required: true},
                            valueTo: {required: true, compareFloatNum: "#valueFrom"}
                        }
                    }).form()) {
                    var $valueFrom =$("#valueFrom").val();
                    var $valueTo =$("#valueTo").val();
                    $this.val($valueFrom + "-" + $valueTo);
                    $this.removeAttrs("valueFrom");
                    $this.removeAttrs("valueTo");
                    $this.attr("valueFrom",$valueFrom);
                    $this.attr("valueTo",$valueTo);
                    $(".float_ajax_box").hide();
                    $(".float_corner").hide();
                }
            });
            $(".cancelRange").on("click", function () {
                $("#valueFrom").val("");
                $("#valueTo").val("");
                $this.attr("valueFrom","");
                $this.attr("valueTo","");
                $(".float_ajax_box").hide();
                $(".float_corner").hide();
                $this.val("");
            })
        }
    });

}

