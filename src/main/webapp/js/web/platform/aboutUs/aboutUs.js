var aboutUsObj = function () {


    var handleEvent = function () {
        //富文本初始化
        CKEDITOR.replace('content', {
            customConfig: basePath + 'js/global/scripts/ckeditor_config.js',
            width: '99.8%'
        }).on('change', function (event) {
            var $content = $("#content");
            if (CKEDITOR.instances.content.getData() != "" && $content.next().find("span").length == 0) {
                $content.next().remove();
            }
        });

        //富文本非空校验
        jQuery.validator.addMethod("contentIsBlank", function (value, element) {
            return CKEDITOR.instances.content.getData() != "";
        }, i18n.common.required);

        //富文本字数校验
        jQuery.validator.addMethod("contentIsOverflow", function (value, element) {
            var flag = true;
            if (strlen(CKEDITOR.instances.content.getData()) > 50000) {
                flag = false
            }
            return flag;
        }, i18n.common.ckeditorMaxlength);

        jQuery.validator.addMethod("ignoreDragImage", function () {
            var checkString = /<img.*src="data:/;
            return checkString.exec(CKEDITOR.instances.content.getData()) == null;
        }, i18n.common.picture);

        function strlen(str) {
            //<summary>获得字符串实际长度，中文2，英文1</summary>
            //<param name="str">要获得长度的字符串</param>
            var regExp = new RegExp(" ", "g");
            str = str.replace(regExp, "");
            str = str.replace(/\r\n/g, "");
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        }

        $("#confirm").on("click", function () {
            if ($("#protocolForm").validate({
                    rules: {
                        content: {
                            contentIsBlank: true,//富文本非空校验
                            contentIsOverflow: true,//富文本字数校验
                            ignoreDragImage: true
                        }
                    }
                }).form()) {
                customGlobal.blockUI("#modalContent");
                $.ajax({
                    url: "w/platform/aboutUs",
                    data: JSON.stringify({
                        id: $("#id").val(),
                        title: $("#title").val(),
                        content: CKEDITOR.instances.content.getData()//获取富文本
                    }),
                    contentType: "application/json; charset=utf-8",
                    type: "put",
                    dataType: "json"
                }).done(function (data) {
                    customGlobal.unblockUI("#modalContent");
                    if (customGlobal.ajaxCallback(data)) {
                    }
                });
            }
        });
    };


    return {
        init: function () {
            handleEvent();
        }
    };
}();
