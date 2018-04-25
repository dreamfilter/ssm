var faqObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.id = $.trim($("#idQuery").val());
                data.question = $.trim($("#questionQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/platform/faq/getFaqListPage"
                },
                "columns": [
                    {data: 'question', orderable: false},
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
        $("#addFaq").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/platform/faq/addFaq.html", {}));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                $("#question").focus();
                $("#question").blur();
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
                    $.ajax({
                        url: "w/platform/faq",
                        data: JSON.stringify({
                            question: $.trim($("#question").val()),
                            answer: CKEDITOR.instances.content.getData()//获取富文本
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

        $table.on("click", "a.edit", function () {
            $.get("w/platform/faq/" + $(this).attr("id"), function (data) {
                var faq = data.returnData.faq;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/platform/faq/updateFaq.html",
                    {
                        faq: faq
                    }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    $("#question").focus();
                    $("#question").blur();
                }).modal('show');
                initUpdateBtn();
                ckEditor();
            });
        });


        function initUpdateBtn() {
            $("#updateBtn").on("click", function () {
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
                    var data = {
                        id: $.trim($("#id").val()),
                        question: $.trim($("#question").val()),
                        answer: CKEDITOR.instances.content.getData()//获取富文本
                    };
                    $.ajax({
                        url: "w/platform/faq",
                        data: JSON.stringify(data),
                        type: "put",
                        contentType: "application/json; charset=utf-8",
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

            $table.on("click", "a.delete", function () {
                var $this = $(this);
                customGlobal.showConfirm();
                $("#confirmBtn").on("click.deleteFaq", function () {
                    $.ajax({
                        url: "w/platform/faq/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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

        function ckEditor() {
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

        return {
            init: function () {
                handleRecords();
                handleEvent();
            }

    };
}();
