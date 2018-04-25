var tweetTable = function () {

    var dataTable;
    var $table = $("#dataTable");
    var messageList;
    var imgUpload1 = new FileUpload();
    var imgOptions1 = {
        server: basePath + 'b/core/attachment',
        pick: {
            id: '#images1',
            multiple: false
        },
        dialogContainer: $("#dialogForm"),
        fileNumLimit: 1,
        resize: false,// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        chunked: true, // 是否分片
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        },
        duplicate: true,
        auto: true,
        imageShow: true,
        formData: {
            tableName: 'p_tweet',
            attachmentType: '1'
        },
        initTypes: '1'
    };
    var attachmentList = [];


    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.title = jQuery.trim($("#titleQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/platform/tweet/getTweetListPage"
                },
                "columns": [

                    {data: 'title', orderable: false},
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
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/platform/tweet/addTweet.html", {}));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                $("#title").focus();
                $("#title").blur();
                imgUpload1.init(imgOptions1);
            }).modal('show');
            initAddBtn();
            ckEditor();
        });

        function initAddBtn() {
            $("#addBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                    if ($("#dialogForm").validate({
                            rules: {
                                content: {
                                    contentIsBlank: true,//富文本非空校验
                                    contentIsOverflow: true,//富文本字数校验
                                    ignoreDragImage: true
                                }
                            }
                        }).form()) {
                        if (attachmentList.length<=0){
                            toast.error("请上传封面图");
                            return;
                        }
                        customGlobal.blockUI("#modalContent");
                        $.ajax({
                            url: "w/platform/tweet/addTweet",
                            data: JSON.stringify({
                                title: $.trim($("#title").val()),
                                content: CKEDITOR.instances.content.getData(),//获取富文本
                                attachmentList: attachmentList
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
            $.get("w/platform/tweet/" + $(this).attr("id"), function (data) {
                var tweet = data.returnData.tweet;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/platform/tweet/updateTweet.html",
                    {
                        tweet: tweet
                    }));

                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    $("#title").focus();
                    $("#title").blur();
                    imgUpload1.init(imgOptions1);
                    imgUpload1.showAttachmentList(tweet.id);
                }).modal('show');
                initUpdateBtn();
                ckEditor();
            });

        });

        function initUpdateBtn() {
            $("#updateBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                if ($("#dialogForm").validate({
                        rules: {
                            content: {
                                contentIsBlank: true,//富文本非空校验
                                contentIsOverflow: true,//富文本字数校验
                                ignoreDragImage: true
                            }
                        }
                    }).form()) {
                    if (attachmentList.length<=0){
                        toast.error("请上传封面图");
                        return;
                    }
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        title: $.trim($("#title").val()),
                        content: CKEDITOR.instances.content.getData(),//获取富文本
                        id: $.trim($("#id").val()),
                        attachmentList: attachmentList
                    };

                    $.ajax({
                        url: "w/platform/tweet",
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


        //删除
        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/platform/tweet/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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
