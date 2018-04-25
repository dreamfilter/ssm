/**
 * 复选框校验方法
 * @param checkboxName
 * @return {bool}若为true不可继续操作，调用此函数的方法需要return;
 */


function checkValidate(checkboxName) {
    var $checkbox = $("input[name=" + checkboxName + "]:checkbox");
    if ($checkbox.size() <= 0) {
        toast.warning("Remarks cannot be empty!");
        return true;
    }
    if ($checkbox.filter(":checked").size() < 1) {
        toast.warning("Please select at least one record!");
        return true
    }
    return false;
}

function getCheckedVal(checkboxName) {
    var checkIds = [];
    $("input[name=" + checkboxName + "]:checked").each(function () {
        checkIds.push(this.value);
    });
    return checkIds;
}

//导出excel取动态显示列的值
function getCheckedColumnsNum() {
    return $("#dataTableToggleColumn").find("input:checked").size();
}

//验证单个标签是中文方法 target是目标标签的id
function validateZHCode(target, message) {
    target = "#" + target;
    var flag = false;
    if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test($(target).val())) {
        toast.error(message);
        flag = true;
    }
    return flag;
};

/**
 * jquery,validate框架.公共验证方法
 */
$(function () {
    //验证框架: 开始日期不能晚于结束日期(可以等于)
    jQuery.validator.addMethod("compareDate", function (value, element, param) {
        var startStrArray = jQuery("#" + param).val().split("-");
        var endStrArray = value.split("-");

        var startDate = new Date(startStrArray[0], startStrArray[1], startStrArray[2]);
        var endDate = new Date(endStrArray[0], endStrArray[1], endStrArray[2]);

        return startDate <= endDate;

    }, i18n['endDateBeforeStartDate']);

    //验证框架: google框不能为空,就是必须选择google框中的值
    jQuery.validator.addMethod("googleNotNull", function (value, element, param) {
        if (param) {
            var hiddenValue = jQuery("#" + element.id).getGAutoHiddenValue();
            if (hiddenValue == "") {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, function (param, element) {
        return jQuery("#" + element.id).attr("placeholder") + " " + i18n['notInGoogle'];
    });

    //验证框架: 时间格式验证,带+-,以及"0"
    jQuery.validator.addMethod("timeType", function (value, element, param) {
        if (param) {
            var value = jQuery("#" + element.id).val();
            // XX:XX:XX -XX:XX:XX +XX:XX:XX 0-true
            if (value == "0") {
                return true;
            } else {
                var reg = /^[+|-]?(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/;//匹配 HH:mm:ss , -HH:mm:ss , +HH:mm:ss
                if (reg.test(value)) {
                    return true;
                } else {
                    return false;
                }
            }

        } else {
            return true;
        }
    }, i18n['notTimeType']);

    //验证框架: 输入不能相同
    jQuery.validator.addMethod("notEqualTo", function (value, element, param) {

        var a = jQuery("#" + element.id).val();
        var b = jQuery("#" + param).val();

        if (a == b) {
            return false;
        } else {
            return true;
        }

    }, i18n['notEqualTo']);

    //验证框架: 特殊字符
    jQuery.validator.addMethod("specialCharacters", function (value) {
        return /^[^\`~#$^&%*={}'<>——]*$/.test(value);
    }, "请不要输入特殊字符");
    //验证框架: 特殊字符(包括百分号)
    jQuery.validator.addMethod("specialCharactersForIndicators", function (value) {
        return /^[^\`~#$^&%*={}'<>]*$/.test(value);
    }, "请不要输入特殊字符");
    //验证框架: 非中文
    jQuery.validator.addMethod("nonChinese", function (value) {
        return /^[^\u4E00-\u9FA0]+$/.test(value);
    }, "请不要输入中文");

    jQuery.validator.addMethod("onlyCharacters", function (value) {
        var onlyCharacters = /^[\u4e00-\u9fa5a-zA-Z\d]*$/;
        if (!onlyCharacters.test(value) && value != "" && value != undefined) {
            return false;
        } else {
            return true;
        }
    }, "请输入正确格式的数据，不能含有表情符号等其他内容");

    jQuery.validator.addMethod("passwordValidate", function (value) {
        var onlyCharacters = /^[A-Za-z0-9-`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]*$/;
        if (!onlyCharacters.test(value) && value != "" && value != undefined) {
            return false;
        } else {
            return true;
        }
    }, "请输入正确的密码格式，可包含数字、字母和特殊字符");

    //验证框架: 正整数
    jQuery.validator.addMethod("integer", function (value) {
        return !/[^1-9]/g.test(value);
    }, "请输入正整数");

    //验证框架: 6的倍数
    // jQuery.validator.addMethod("sixMultiple", function (value) {
    //         var  num = $.trim($("#sumPeriod").val());
    //     if( num%6 == 0 )
    //         {
    //             return "请输入6的倍数";
    //
    //         }
    //
    // }, "请输入6的倍数");

    //验证框架: 原价必须比现价大
    jQuery.validator.addMethod("valueCompare", function (value) {
        var  originalPrice = $.trim($("#originalPrice").val());
        var presentPrice =$.trim($("#presentPrice").val());
        if(originalPrice !="" ||  presentPrice !="")
        {
           if(originalPrice > presentPrice){
               return "原价必须比现价大";
           }

        }


    }, "原价必须比现价大");


    //验证框架: 正整数保留两位小数
    jQuery.validator.addMethod("IntFloatNum", function (value) {
        return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);
    }, "请输入大于0的整数或者保留两位小数");

    jQuery.validator.addMethod("emailRight", function (value) {
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
    }, "请输入正确格式的邮箱地址");
    
    jQuery.validator.addMethod("mobileRight", function (value) {
        var mobile = $(".mobileRight").val();
        var myRegTel = /(\d{2,5}-\d{7,8}(-\d{1,})?)/;
        var myRegMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(14[5-7]{1})|(17[0135678]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myRegMobile.test(value) && value != "" && value != undefined) {
            if (!myRegTel.test(value) && value != "" && value    != undefined) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }, "请输入正确格式的手机");
});
