var messageListTable = function () {

    var dataTable;
    var $table = $("#dataTable");
    var messageList;
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.id = jQuery.trim($("#idQuery").val());
                var $publishTimeQuery = $("#publishTimeQuery");
                data.publishTimeQueryFrom = $.trim($publishTimeQuery.data("from"));
                data.publishTimeQueryTo = $.trim($publishTimeQuery.data("to"));
                data.title = jQuery.trim($("#titleQuery").val());
                data.receivePlatformTypes = jQuery.trim($("#receivePlatformTypesQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/platform/message/getMessageListPage"
                },
                "columns": [
                    {data: 'publishTime', orderable: false},
                    {data: 'title', orderable: false},
                    {
                        data: 'receivePlatformTypes', orderable: false,
                        render: function (data, type, full) {
                            return data.replace(1,i18n['messageStudent']).replace(2, i18n['messageCounselor']).replace(3, i18n['messageTeacher']).replace(new RegExp(",",'igm'),'、');
                        }
                    },
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return template("actionBtn", {data: data, type: type, full: full, i18n: i18n});
                        }
                    }
                ]
            }
        });
    };

    var handleEvent = function () {

        //添加
        $("#addMessage").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/platform/message/addMessage.html", {}));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                $("#title").focus();
                $("#title").blur();
            }).modal('show');
            initAddBtn();
            ckEditor();
        });

        function initAddBtn() {
            $("#addBtn").on("click", function () {
                    if ($("#dialogForm").validate({
                            rules: {
                                content: {
                                    contentIsBlank: true,//富文本非空校验
                                    contentIsOverflow: true,//富文本字数校验
                                    ignoreDragImage: true
                                }
                            }
                        }).form()) {
                        customGlobal.blockUI("#modalContent");
                        var receivePlatformTypes = [];
                        $('input[name="receivePlatformTypes"]:checked').each(function () {
                            console.log($(this).val());
                            receivePlatformTypes.push($(this).val());
                        });
                        $.ajax({
                            url: "w/platform/message/addMessage",
                            data: JSON.stringify({
                                title: $.trim($("#title").val()),
                                content: CKEDITOR.instances.content.getData(),//获取富文本
                                receivePlatformTypes: receivePlatformTypes.join(",")

                            }),
                            contentType: "application/json; charset=utf-8",
                            type: "post",
                            dataType: "json"
                        }).done(function (data) {
                            if (customGlobal.ajaxCallback(data)) {
                                $("#modalDialog").modal("hide");
                                dataTable.reloadTable();
                            }
                        });
                    }
                
            });
        
        }

        function ckEditor() {
            //富文本初始化
            CKEDITOR.replace('content', {
                customConfig:　basePath + 'js/global/scripts/ckeditor_config.js',
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
                if (strlen(CKEDITOR.instances.content.getData()) > 20000) {
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
        }


        $table.on("click", "a.view", function () {
            $.get("w/platform/message/getMessage/" + $(this).attr("messageId"), function (data) {
                var message = data.returnData.message;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/platform/message/messageDetail.html",
                    {
                        message: message
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
                $("#content").html(message.content);
            });
        });
        //删除
        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/platform/message/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
                    type: "DELETE",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        });
    };

    return {
        init: function (messageListDate) {
            handleRecords();
            handleEvent();
            messageList = messageListDate
        }
    };
}();
