/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
(function($) {
    $.extend($.validator.messages, {
        autoCompleteRequired: "该项必须从自动完成中选择。",
        optionRequired: "该项必须选择。",
        afterBeginTime: "结束时间必须在开始时间之后。"
    });
    $.extend(true,$.validator.regexp, {
        chinese: {
            message:"该项必须为中文。"
        },
        nonChinese: {
            message:"该项不能为中文。"
        }
    });

}(jQuery));
