var ActivityObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    var packageList;


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
            tableName: 'g_activity',
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
                data.title = $.trim($("#titleQuery").val());
                data.publishTimeFrom = $("#publishTimeQuery").data("from");
                data.publishTimeTo = $("#publishTimeQuery").data("to");
                data.startTimeFrom = $("#startTimeQuery").data("from");
                data.startTimeTo = $("#startTimeQuery").data("to");
                data.endTimeFrom = $("#endTimeQuery").data("from");
                data.endTimeTo = $("#endTimeQuery").data("to");
                data.activityStatus = $.trim($("#activityStatusQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/goods/activity/getActivityListPage",
                    type: "POST"

                },
                "columns": [
                    {data: 'title', orderable: false},
                    {data: 'publishTime', orderable: false},
                    {data: 'startTime', orderable: false},
                    {data: 'endTime', orderable: false},
                    {
                        data: 'activityStatus', orderable: false,
                        render: function (data, type, full) {

                            return customGlobal.getDictValue("activityStatus", data);
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
        $("#addCard").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/activity/addActivity.html", {
                packageList: packageList
            }));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                imgUpload1.init(imgOptions1);
            }).modal('show');
            initAddBtn();
            initDatePicker();
            ckEditor();
            $('#packageList').select2();
        });

        function initAddBtn() {
            $("#addBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                validatePlace();
                if ($("#dialogForm").validate({
                        rules: {
                            content: {
                                contentIsBlank: true,//富文本非空校验
                                contentIsOverflow: true,//富文本字数校验
                                ignoreDragImage: true
                            }
                        }
                    }).form()) {
                    var startTime = $.trim($("#startTime").val());
                    var endTime = $.trim($("#endTime").val());
                    if(startTime == '' || startTime == null || endTime =='' || endTime == null){
                        toast.error("开始日期与结束日期不能为空！")
                        return;
                    }
                    var date1 = new Date(startTime.replace(/-/g, '/'));
                    var date2 = new Date(endTime.replace(/-/g, '/'));
                    var hours = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
                    if (parseFloat(hours) <= 0) {
                        toast.error("结束日期不能小于等于开始日期！")
                        return;
                    }

                    if (attachmentList.length<=0){
                        toast.error("请上传活动主图");
                        return;
                    }
                    customGlobal.blockUI("#modalContent");
                    $.ajax({
                        url: "w/goods/activity/addActivity",
                        data: JSON.stringify({
                            title: $.trim($("#title").val()),
                            content: CKEDITOR.instances.content.getData(),//获取富文本
                            startTime: $("#startTime").val(),
                            endTime: $("#endTime").val(),
                            packageList: $("#packageList").val(),
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
            $.get("w/goods/activity/" + $(this).attr("id"), function (data) {
                var activity = data.returnData.activity;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/activity/updateActivity.html",
                    {
                        packageList: packageList,
                        activity: activity
                    }));
                customGlobal.inputInit($templateHtml);
                var $packageList = $templateHtml.find("#packageList");
                $packageList.find("option").removeAttr("selected");
                var packageListData = data.returnData.activityDtsList;
                for (var i = 0; i < packageListData.length; i++) {
                    var str = "option[value=" + packageListData[i].packageId + "]";
                    $packageList.find(str).attr("selected", "selected")
                }
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    imgUpload1.init(imgOptions1);
                    imgUpload1.showAttachmentList(activity.id);
                }).modal('show');

                initDatePicker();
                ckEditor();
                $('#packageList').select2();
                initUpdateBtn();
            });

        });


        function initUpdateBtn() {
            validatePlace();
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
                        var startTime = $.trim($("#startTime").val());
                        var endTime = $.trim($("#endTime").val());
                        if(startTime == '' || startTime == null || endTime =='' || endTime == null){
                            toast.error("开始日期与结束日期不能为空！")
                            return;
                        }
                        var date1 = new Date(startTime.replace(/-/g, '/'));
                        var date2 = new Date(endTime.replace(/-/g, '/'));
                        var hours = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
                        if (parseFloat(hours) <= 0) {
                            toast.error("结束日期不能小于等于开始日期！")
                            return;
                        }
                        if (attachmentList.length<=0){
                            toast.error("请上传活动主图");
                            return;
                        }
                        customGlobal.blockUI("#modalContent");
                        var data = {
                            id: $.trim($("#id").val()),
                            title: $.trim($("#title").val()),
                            content: CKEDITOR.instances.content.getData(),//获取富文本
                            startTime: $("#startTime").val(),
                            endTime: $("#endTime").val(),
                            packageList: $("#packageList").val(),
                            attachmentList: attachmentList
                        };

                        $.ajax({
                            url: "w/goods/activity",
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
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/goods/activity/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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

        var initDatePicker = function () {
            $('#startTime').datepicker({
                language: 'zh-CN',
                format: "yyyy-mm-dd",
                todayBtn : "linked",
                minView: 2,
                autoclose : true,
                todayHighlight : true,
                startDate : new Date()
            }).on('changeDate',function(e){
                var startTime = e.date;
                $('#endTime').datepicker('setStartDate',startTime);
            });
            $('#endTime').datepicker({
                language: 'zh-CN',
                format: "yyyy-mm-dd",
                todayBtn : "linked",
                minView: 2,
                autoclose : true,
                todayHighlight : true,
                startDate : new Date()
            }).on('changeDate',function(e){
                var endTime = e.date;
                $('#startTime').datepicker('setEndDate',endTime);
            });
            // $(".date-picker").datetimepicker({
            //     language: 'zh-CN',
            //     format: "yyyy-mm-dd",
            //     todayBtn: true,
            //     minView: 2,
            //     autoclose: true,
            //     todayHighlight: true
            // });
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

        function validatePlace() {
            $.validator.setDefaults({
                success:function (error) {
                    error.css("display","none !important");
                }
            });
        }
    };

    return {
        init: function (packageListData) {
            handleRecords();
            handleEvent();
            packageList = packageListData;
        }
    };
}();








