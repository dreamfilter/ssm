var classHistoryObj = function () {
    var dataTable;
    var $table = $("#dataTable");

    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function (teacherId) {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.accountNum = $("#accountNumQuery").val();
                data.teacherName = $("#teacherNameQuery").val();
                data.cardName = $("#cardNameQuery").val();
                data.languageId = $("#languageQuery").getGAutoHiddenValue();
                var $startTimeQuery = $("#startTimeQuery");
                data.startTimeFrom = $.trim($startTimeQuery.data("from"));
                data.startTimeTo = $.trim($startTimeQuery.data("to"));
                var $consumeQuery = $("#consumeQuery");
                data.consumeFrom = $consumeQuery.attr("valueFrom");
                data.consumeTo = $consumeQuery.attr("valueTo");
                var $compensateQuery = $("#compensateQuery");
                data.compensationFrom = $compensateQuery.attr("valueFrom");
                data.compensationTo = $compensateQuery.attr("valueTo");
                data.stateClass = $("#teachStatusQuery").val();

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/teacherList/goToClassHistoryListPage/" + teacherId
                },
                "columns": [
                    {
                        data: 'accountNum', orderable: false,
                        render: function (data, type, full) {
                            return "<a href='w/people/studentList/studentListDetail/" + full.studentId + "'>" + full.accountNum + "</a>"
                        }
                    },
                    {data: 'timeShow', orderable: false},
                    {data: 'status', orderable: false},
                    {data: 'name', orderable: false},
                    {data: 'lessonLanguage', orderable: false},
                    {data: 'consumeValue', orderable: false},
                    {data: 'compensationValue', orderable: false},
                    {
                        data: 'courseWareShow', orderable: false,
                        render: function (data, type, full) {
                            return '<a  href="w/people/teacherList/download/' + full.id + '">' + data + '</a>'
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

    /*课件上传*/
    var fileUpload = new FileUpload();
    var options = {
        server: basePath + 'b/core/attachment',
        pick: {
            id: '#courseware',
            multiple: false
        },
        dialogContainer: $("#dialogForm"),
        resize: false,// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        },
        duplicate: true,
        auto: true,
        formData: {
            tableName: 'l_lesson',
            attachmentType: '1'
        },
        initTypes: '1'
    };

    var handleEvent = function () {

        $table.on("click", "a.view", function () {
            $.get("w/people/teacherList/getAttendClassBuyView/" + $(this).attr("id"), function (data) {
                var attendClassDetail = data.returnData.attendClassDetail;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/student/attendClass.html",
                    {
                        attendClassDetail: attendClassDetail
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
            });
        });

        /*添加上课记录*/
        $table.on("click", "a.addLessonRecord", function () {
            $.get("w/people/teacherList/getAttendClassBuyView/" + $(this).attr("id"), function (data) {
                var attendClassDetail = data.returnData.attendClassDetail;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/addLessonRecord.html", {
                    attendClassDetail: attendClassDetail
                }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    fileUpload.init(options);
                }).modal('show');
                initAddLessonRecordBtn();
            });
        });

        function initAddLessonRecordBtn() {
            $("#addBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    var attachmentList = fileUpload.getAttachmentList();
                    customGlobal.blockUI("#modalContent");
                    var duration = $.trim($("#duration").val());
                    if (duration == "") {
                        duration = null;
                    }
                    $.ajax({
                        url: "w/people/teacherList/addLessonRecord",
                        data: JSON.stringify({
                            lessonId: $.trim($("#lessonId").val()),
                            platform: $.trim($("#platform").val()),
                            duration: duration,
                            content: $.trim($("#content").val()),
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

        /*调课*/
        $table.on("click", "a.addAdjust", function () {
            $.get("w/people/teacherList/getAttendClassBuyView/" + $(this).attr("id"), function (data) {
                var attendClassDetail = data.returnData.attendClassDetail;
                if (parseInt(attendClassDetail.lessonStatus) == 7) {
                    toast.error("无法调整调课待审批的课程！")
                } else if (parseInt(attendClassDetail.lessonStatus) == 8) {
                    toast.error("无法调整取消待审批的课程！")
                } else {
                    var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/addAdjust.html", {
                        attendClassDetail: attendClassDetail
                    }));
                    customGlobal.inputInit($templateHtml);
                    $("#modalDialog").html($templateHtml).modal('show');
                    initAddAdjustBtn();
                    $("#startTime").datetimepicker("setStartDate", new Date());
                    $("#endTime").datetimepicker("setStartDate", new Date());
                }
            });
        });

        function initAddAdjustBtn() {
            $("#addAdjustBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    var oldStartTime = $.trim($("#oldStartTime").val());
                    var oldEndTime = $.trim($("#oldEndTime").val());
                    var startTime = $.trim($("#startTime").val());
                    var endTime = $.trim($("#endTime").val());
                    var oldTime = eval("new Date(" + oldEndTime.replace(/\D+/g, ",") + ")").getTime() - eval("new Date(" + oldStartTime.replace(/\D+/g, ",") + ")").getTime();
                    var newTime = eval("new Date(" + endTime.replace(/\D+/g, ",") + ")").getTime() - eval("new Date(" + startTime.replace(/\D+/g, ",") + ")").getTime();
                    if (oldTime != newTime) {
                        toast.error("调课后的课时与原预约的课时不符！");
                    } else {
                        customGlobal.blockUI("#modalContent");
                        $.ajax({
                            url: "w/people/teacherList/addAdjust",
                            data: JSON.stringify({
                                lessonId: $.trim($("#lessonId").val()),
                                teacherId: $.trim($("#teacherId").val()),
                                studentId: $.trim($("#studentId").val()),
                                startTime: startTime,
                                endTime: endTime,
                                content: $.trim($("#reason").val()),
                                compensationValue: $("#compensationValue").html()
                            }),
                            contentType: "application/json; charset=utf-8",
                            type: "post",
                            dataType: "json"
                        }).done(function (data) {
                            if (data.returnState == "OK") {
                                toast.success();
                                $("#modalDialog").modal("hide");
                                dataTable.reloadTable();
                            } else {
                                $("#compensationValue").html("0.5");
                                toast.warning("产生补偿课时，确认后点击保存！");
                            }
                        });
                    }
                }
            });
        }

        /*取消预约*/
        $table.on("click", "a.addCancel", function () {
            var lessonId = $(this).attr("id");
            $.get("w/people/teacherList/getAttendClassBuyView/" + lessonId, function (data) {
                var attendClassDetail = data.returnData.attendClassDetail;
                if (parseInt(attendClassDetail.lessonStatus) == 7) {
                    toast.error("无法取消调课待审批的课程！")
                } else if (parseInt(attendClassDetail.lessonStatus) == 8) {
                    toast.error("无法取消取消待审批的课程！")
                } else {
                    var compensationValue = attendClassDetail.compensationValue;
                    var confirmContent;
                    if (compensationValue != 0.0) {
                        confirmContent = "您确定取消该课程的预约吗？已产生" + compensationValue + "课时的补偿！"
                    } else {
                        confirmContent = "您确定取消该课程的预约吗？"
                    }
                    var $templateHtml1 = $(customGlobal.remoteTemplate("template/core/common/eventConfirm.html", {confirmContent: confirmContent}));
                    customGlobal.inputInit($templateHtml1);
                    $("#modalDialog").html($templateHtml1).modal("show");
                    initAddCancelBtn(lessonId, compensationValue);
                }
            });

            function initAddCancelBtn(lessonId, compensationValue) {
                $("#confirmBtn").on("click", function () {
                    customGlobal.blockUI("#modalContent");
                    $.ajax({
                        url: "w/people/teacherList/addCancel",
                        data: JSON.stringify({
                            lessonId: lessonId,
                            compensationValue: compensationValue
                        }),
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        dataType: "json"
                    }).done(function (data) {
                        if (data.returnState == "OK") {
                            toast.success();
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        } else {
                            $(".form-group .col-md-12").html("您确定取消该课程的预约吗？已产生0.5课时的补偿！");
                            toast.warning("产生补偿课时，确认后点击保存！");
                        }
                    });
                });
            }
        });

        $("#basicInfo").on("click", function () {
            location.href = basePath + "w/people/teacherList/teacherListDetail/" + $("#id").val() + "?menuId=020801";
        });

        $("#class").on("click", function () {
            location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#id").val() + "?menuId=020801";
        });

        $("#student").on("click", function () {
            location.href = basePath + "w/people/teacherList/studentList/" + $("#id").val() + "?menuId=020801";
        });

        $("#goToClassHistory").on("click", function () {
            location.href = basePath + "w/people/teacherList/goToClassHistoryList/" + $("#id").val() + "?menuId=020801";
        });

        $("#leaveHistory").on("click", function () {
            location.href = basePath + "w/people/teacherList/leaveHistoryList/" + $("#id").val() + "?menuId=020801";
        });
        $("#freezeLog").on("click", function () {
            location.href = basePath + "w/people/teacherList/teacherFreezeLogPage/" + $("#id").val() + "?menuId=020801";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath + "w/people/teacherList?menuId=020801"
        });
    };

    return {
        init: function (teacherId) {
            handleRecords(teacherId);
            handleEvent();
        }
    };
}();
