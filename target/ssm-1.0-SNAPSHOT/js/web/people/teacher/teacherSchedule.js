var teacherScheduleObj = function () {
    var teachLanguageList;

    var initCalendar = function () {
        if (!jQuery().fullCalendar) {
            return;
        }


        var $calendar = $('#calendar');
        $calendar.fullCalendar('destroy');// destroy the calendar
        $calendar.fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaWeek,agendaDay'
            },
            defaultView: 'agendaWeek',
            editable: false,
            disableDragging: false,
            allDaySlot: false,
            timeFormat: 'H:mm',
            axisFormat: 'H:mm',
            firstHour: 12,
            weekends: true, //周末是否显示：true，false
            firstDay: 1,
            defaultTimedEventDuration: '00:30:00',
            exceptTime: "00:00",
            exceptTimeTo: "00:00",
            allDay: false,
            allDayDefault: false, //周末是否显示：true，false
            weekNumbers: false, //周次是否显示：true，false
            weekMode: 'liquid',//fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
            eventLimit: 1,//设置events个数的限制多于三个的都是more显示
            aspectRatio: 2.054,// 	设置日历单元格宽度与高度的比例。
            handleWindowResize: true,// 	是否随浏览器窗口大小变化而自动变化。
            currentTimezone: 'Asia / Beijing',

            //日程数据源
            events: function (start, end, timezone, callback) {
                var startTime = new Date(start._d);
                var startShow = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate();
                var endTime = new Date(end._d);
                var endShow = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
                var eventList = [];
                var utc = $('#timezone option:selected').val();
                $.post("w/people/teacherList/getTeacherSchedule", {
                    "teacherId": $("#teacherId").val(),
                    "startTime": startShow,
                    "endTime": endShow,
                    "utc": utc
                }, function (data) {
                    //教师请假
                    var teacherLeaveList = data.returnData.teacherLeaveList;
                    //教师禁用
                    var teacherOffList = data.returnData.teacherOffList;
                    //已上课记录
                    var completeLessonList = data.returnData.completeLessonList;
                    //未开始上课记录
                    var waitingLessonList = data.returnData.waitingLessonList;
                    //后台预约未开始
                    var waitingLessonBackgroundList = data.returnData.waitingLessonBackgroundList;
                    //未上课记录
                    var noLessonList = data.returnData.noLessonList;

                    for (var i = 0; i < teacherLeaveList.length; i++) {
                        var event0
                            = {
                            id: teacherLeaveList[i].id,
                            title: "",
                            start: teacherLeaveList[i].startTime,
                            end: teacherLeaveList[i].endTime,
                            allDay: false,
                            color: "#ccc4e6",
                            className: "teacherLeave",
                            textColor: "#0065b3"
                        };
                        eventList.push(event0);
                    }

                    for (var j = 0; j < teacherOffList.length; j++) {
                        var event1
                            = {
                            id: teacherOffList[j].id,
                            title: "时间不可用",
                            start: teacherOffList[j].startTime,
                            end: teacherOffList[j].endTime,
                            allDay: false,
                            color: "#f9cfcf",
                            className: "teacherOff",
                            textColor: "#0065b3"
                        };
                        eventList.push(event1);
                    }


                    for (var k = 0; k < completeLessonList.length; k++) {
                        var event2
                            = {
                            id: completeLessonList[k].id,
                            title: completeLessonList[k].studentName,
                            start: completeLessonList[k].dtsStartTime,
                            end: completeLessonList[k].dtsEndTime,
                            allDay: false,
                            color: "#f8f8f8",
                            className: "completeLesson",
                            textColor: "#0065b3"
                        };
                        eventList.push(event2);
                    }

                    for (var m = 0; m < waitingLessonList.length; m++) {
                        var event3 = {
                            id: waitingLessonList[m].id,
                            title: waitingLessonList[m].studentName,
                            start: waitingLessonList[m].dtsStartTime,
                            end: waitingLessonList[m].dtsEndTime,
                            allDay: false,
                            color: "#c5e5cc",
                            className: "waitingLesson",
                            textColor: "#0065b3"
                        };
                        eventList.push(event3);
                    }

                    for (var n = 0; n < waitingLessonBackgroundList.length; n++) {
                        var event4 = {
                            id: waitingLessonBackgroundList[n].id,
                            title: waitingLessonBackgroundList[n].studentName,
                            start: waitingLessonBackgroundList[n].dtsStartTime,
                            end: waitingLessonBackgroundList[n].dtsEndTime,
                            allDay: false,
                            color: "#bae7ff",
                            className: "waitingLessonBackground",
                            textColor: "#0065b3"
                        };
                        eventList.push(event4);
                    }

                    for (var o = 0; o < noLessonList.length; o++) {
                        var event5 = {
                            id: noLessonList[o].id,
                            title: noLessonList[o].studentName,
                            start: noLessonList[o].dtsStartTime,
                            end: noLessonList[o].dtsEndTime,
                            allDay: false,
                            color: "#fad8a6",
                            className: "noLesson",
                            textColor: "#0065b3"
                        };
                        eventList.push(event5);
                    }
                    callback(eventList);
                });
            }
            ,
            eventRender: function (event, element) {
                element.html(event.title);
            }
            ,
            //单击查看页面
            eventClick: function (calEvent) {
                if ("completeLesson" == calEvent.className || "waitingLesson" == calEvent.className ||
                    "waitingLessonBackground" == calEvent.className || "noLesson" == calEvent.className) {
                    var timezone = $('#timezone option:selected').val();
                    $.get("w/people/teacherList/getLessonDetailByLessonId/" + calEvent.id + "/" + timezone, function (data) {
                        var lessonDetail = data.returnData.lessonDetail;
                        var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/lessonDetail/teacherLessonDetail.html",
                            {
                                lessonDetail: lessonDetail
                            }));
                        $("#modalDialog").html($templateHtml).modal("show");
                    });
                }
                if ("teacherOff" == calEvent.className) {
                    var changeTeacherOff = {
                        confirmTitle: i18n.common.ok,
                        confirmContent: "将该时间段置为可用?",
                        confirmBtn: i18n.common.ok,
                        cancelBtn: i18n.common.cancel,
                        confirmDialogId: "confirmDialog",
                        confirmBtnId: "confirmBtn",
                        confirmDialogWrapperId: "confirmDialogWrapper"
                    };
                    customGlobal.showConfirm(changeTeacherOff);
                    $("#confirmBtn").on("click", function () {
                        $("#confirmDialog").modal("hide");
                        var data = {
                            id: calEvent.id
                        };
                        $.ajax({
                            url: "w/people/teacherList/teacherOn",
                            data: JSON.stringify(data),
                            type: "post",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        }).done(function (data) {
                            if (data.returnState == "OK") {
                                toast.success("设置成功");
                                initCalendar();
                            } else {
                                toast.error("设置失败");
                            }
                        });
                    });
                }

            }
            ,
            dayClick: function (allDay) {
                var changeTeacherOff = {
                    confirmTitle: i18n.common.ok,
                    confirmContent: "将该时间段置为不可用?",
                    confirmBtn: i18n.common.ok,
                    cancelBtn: i18n.common.cancel,
                    confirmDialogId: "confirmDialog",
                    confirmBtnId: "confirmBtn",
                    confirmDialogWrapperId: "confirmDialogWrapper"
                };
                customGlobal.showConfirm(changeTeacherOff);
                $("#confirmBtn").on("click", function () {
                    $("#confirmDialog").modal("hide");
                    var teacherId = $("#teacherId").val();
                    var startTime = new Date(allDay).dateMinuteFormat();
                    var utc = $('#timezone option:selected').val();
                    var data = {
                        teacherId: teacherId,
                        startTime: startTime,
                        status: 1,
                        utc: utc
                    };
                    $.ajax({
                        url: "w/people/teacherList/teacherOff",
                        data: JSON.stringify(data),
                        type: "post",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        if (data.returnState == "OK") {
                            toast.success("设置成功");
                            $("#timezone").find("option[value='" + utc + "']").attr("selected", true);
                            initCalendar();
                        } else {
                            toast.error("设置失败");
                        }
                    });
                });


            }
        });
        $(".fc-time").attr("data-full", "");
    };


    $("#timezone").on("change", function () {
        initCalendar();
    });

    var handleRecords = function () {
        $("#basicInfo").on("click", function () {
            location.href = basePath + "w/people/teacherList/teacherListDetail/" + $("#teacherId").val() + "?menuId=020801";
        });

        $("#class").on("click", function () {
            location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
        });

        $("#student").on("click", function () {
            location.href = basePath + "w/people/teacherList/studentList/" + $("#teacherId").val() + "?menuId=020801";
        });

        $("#goToClassHistory").on("click", function () {
            location.href = basePath + "w/people/teacherList/goToClassHistoryList/" + $("#teacherId").val() + "?menuId=020801";
        });

        $("#leaveHistory").on("click", function () {
            location.href = basePath + "w/people/teacherList/leaveHistoryList/" + $("#teacherId").val() + "?menuId=020801";
        });
        $("#freezeLog").on("click", function () {
            location.href = basePath + "w/people/teacherList/teacherFreezeLogPage/" + $("#id").val() + "?menuId=020801";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath + "w/people/teacherList?menuId=020801"
        });

        $("#appointment").on("click", function () {
            var teacherId = $("#teacherId").val();
            var data = {
                id: teacherId
            };
            $.ajax({
                url: "w/people/teacherList/getTeacherByTeacherId",
                data: JSON.stringify(data),
                type: "post",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                if (data.returnState != "OK") {
                    toast.error("该教师已被冻结不能进行约课!");
                } else {
                    var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/addAppointment.html", {
                        teacherId: teacherId,
                        teachLanguageList: teachLanguageList
                    }));
                    customGlobal.inputInit($templateHtml);
                    $("#modalDialog").html($templateHtml).modal('show');
                    $("#startTime").datetimepicker("setStartDate", new Date());
                    $("#endTime").datetimepicker("setStartDate", new Date());
                    $("#nickname").blur(function () {
                        var studentId = $(this).getGAutoHiddenValue();
                        var languageId = $("input[name=teachLanguage]:checked").val();
                        if (studentId != "" && languageId != undefined) {
                            getCardList(studentId, languageId);
                        }
                    });
                    $("input[name=teachLanguage]").on("click", function () {
                        var studentId = $("#nickname").getGAutoHiddenValue();
                        var languageId = $("input[name=teachLanguage]:checked").val();
                        if (studentId != undefined && languageId != "") {
                            getCardList(studentId, languageId);
                        }
                    })
                }
            });
        });

        function getCardList(studentId, languageId) {
            $.get("w/people/teacherList/getStudentCard/" + studentId + "/" + languageId, function (data) {
                var studentCardList = data.returnData.studentCardList;
                if (studentCardList.length > 0) {
                    $("#card").html("");
                    for (var i = 0; i < studentCardList.length; i++) {
                        var $html = "<label class='radio-inline'>" + "<input type='hidden' name='cardType' value='" + studentCardList[i].cardType + "'>" + "<input type='radio' name='studentGoodId' value='" + studentCardList[i].id + "' id='" + studentCardList[i].id + "' required>" +
                            "<input type='hidden' name='remainPeriod' value='" + studentCardList[i].remainPeriod + "'>" + "<label for='" + studentCardList[i].id + "'>" + studentCardList[i].cardName + "</label></label>";
                        $("#card").append($html);
                    }
                    $("#addAppointmentBtn").attr("disabled", false);
                    initAddAppointmentBtn();
                } else {
                    $("#card").html("<div class='margin-top-5'>无可用教学卡</div>");
                    $("#addAppointmentBtn").attr("disabled", true);
                }
            })
        }

        function initAddAppointmentBtn() {
            $("#addAppointmentBtn").on("click", function () {
                var startTime = $.trim($("#startTime").val());
                var endTime = $.trim($("#endTime").val());
                var $card = $("input[name=studentGoodId]:checked");
                var remainPeriod = $card.next().val();
                var cardType = $card.prev().val();
                var date1 = new Date(startTime.replace(/-/g, '/'));
                var date2 = new Date(endTime.replace(/-/g, '/'));
                var hours = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
                validatePlace();
                if ($("#dialogForm").validate().form()) {
                    if (parseFloat(hours) <= 0) {
                        toast.error("课程结束时间不能小于等于开始时间！")
                    } else {
                        if (startTime.substring(0, 10) != endTime.substring(0, 10)) {
                            if (parseInt(startTime.substring(14, 16)) == 30) {
                                toast.error("一节课程预约时间不能跨天！")
                            } else {
                                if (parseInt(cardType) == 1) {
                                    if (parseFloat(hours) == 0.5) {
                                        customGlobal.blockUI("#modalContent");
                                        $.ajax({
                                            url: "w/people/teacherList/saveAppointment",
                                            data: JSON.stringify({
                                                startTime: startTime,
                                                endTime: endTime,
                                                teacherId: $.trim($("#teacherId").val()),
                                                studentGoodId: $card.val(),
                                                studentId: $("#nickname").getGAutoHiddenValue(),
                                                languageId: $("input[name=teachLanguage]:checked").val()
                                            }),
                                            contentType: "application/json; charset=utf-8",
                                            type: "post",
                                            dataType: "json"
                                        }).done(function (data) {
                                            if (customGlobal.ajaxCallback(data)) {
                                                $("#modalDialog").modal("hide");
                                                location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
                                            }
                                        });

                                    } else {
                                        toast.error("试听卡请选择以半小时为单位的课时预约！")
                                    }
                                } else {
                                    if (hours.toString().indexOf(".5") > 0) {
                                        if (parseFloat(hours) == parseFloat(remainPeriod)) {
                                            customGlobal.blockUI("#modalContent");
                                            $.ajax({
                                                url: "w/people/teacherList/saveAppointment",
                                                data: JSON.stringify({
                                                    startTime: startTime,
                                                    endTime: endTime,
                                                    teacherId: $.trim($("#teacherId").val()),
                                                    studentGoodId: $card.val(),
                                                    studentId: $("#nickname").getGAutoHiddenValue(),
                                                    languageId: $("input[name=teachLanguage]:checked").val()
                                                }),
                                                contentType: "application/json; charset=utf-8",
                                                type: "post",
                                                dataType: "json"
                                            }).done(function (data) {
                                                if (customGlobal.ajaxCallback(data)) {
                                                    $("#modalDialog").modal("hide");
                                                    location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
                                                }
                                            });
                                        } else {
                                            toast.error("请选择以一小时为单位的课时预约！")
                                        }
                                    } else {
                                        customGlobal.blockUI("#modalContent");
                                        $.ajax({
                                            url: "w/people/teacherList/saveAppointment",
                                            data: JSON.stringify({
                                                startTime: startTime,
                                                endTime: endTime,
                                                teacherId: $.trim($("#teacherId").val()),
                                                studentGoodId: $card.val(),
                                                studentId: $("#nickname").getGAutoHiddenValue(),
                                                languageId: $("input[name=teachLanguage]:checked").val()
                                            }),
                                            contentType: "application/json; charset=utf-8",
                                            type: "post",
                                            dataType: "json"
                                        }).done(function (data) {
                                            if (customGlobal.ajaxCallback(data)) {
                                                $("#modalDialog").modal("hide");
                                                location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
                                            }
                                        });
                                    }

                                }
                            }
                        } else {
                            if (parseInt(cardType) == 1) {
                                if (parseFloat(hours) == 0.5) {
                                    customGlobal.blockUI("#modalContent");
                                    $.ajax({
                                        url: "w/people/teacherList/saveAppointment",
                                        data: JSON.stringify({
                                            startTime: startTime,
                                            endTime: endTime,
                                            teacherId: $.trim($("#teacherId").val()),
                                            studentGoodId: $card.val(),
                                            studentId: $("#nickname").getGAutoHiddenValue(),
                                            languageId: $("input[name=teachLanguage]:checked").val()
                                        }),
                                        contentType: "application/json; charset=utf-8",
                                        type: "post",
                                        dataType: "json"
                                    }).done(function (data) {
                                        if (customGlobal.ajaxCallback(data)) {
                                            $("#modalDialog").modal("hide");
                                            location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
                                        }
                                    });
                                } else {
                                    toast.error("试听卡请选择以半小时为单位的课时预约！")
                                }
                            } else {
                                if (hours.toString().indexOf(".5") > 0) {
                                    if (parseFloat(hours) == parseFloat(remainPeriod)) {
                                        customGlobal.blockUI("#modalContent");
                                        $.ajax({
                                            url: "w/people/teacherList/saveAppointment",
                                            data: JSON.stringify({
                                                startTime: startTime,
                                                endTime: endTime,
                                                teacherId: $.trim($("#teacherId").val()),
                                                studentGoodId: $card.val(),
                                                studentId: $("#nickname").getGAutoHiddenValue(),
                                                languageId: $("input[name=teachLanguage]:checked").val()
                                            }),
                                            contentType: "application/json; charset=utf-8",
                                            type: "post",
                                            dataType: "json"
                                        }).done(function (data) {
                                            if (customGlobal.ajaxCallback(data)) {
                                                $("#modalDialog").modal("hide");
                                                location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
                                            }
                                        });
                                    } else {
                                        toast.error("请选择以一小时为单位的课时预约！")
                                    }
                                } else {
                                    customGlobal.blockUI("#modalContent");
                                    $.ajax({
                                        url: "w/people/teacherList/saveAppointment",
                                        data: JSON.stringify({
                                            startTime: startTime,
                                            endTime: endTime,
                                            teacherId: $.trim($("#teacherId").val()),
                                            studentGoodId: $card.val(),
                                            studentId: $("#nickname").getGAutoHiddenValue(),
                                            languageId: $("input[name=teachLanguage]:checked").val()
                                        }),
                                        contentType: "application/json; charset=utf-8",
                                        type: "post",
                                        dataType: "json"
                                    }).done(function (data) {
                                        if (customGlobal.ajaxCallback(data)) {
                                            $("#modalDialog").modal("hide");
                                            location.href = basePath + "w/people/teacherList/teacherSchedule/" + $("#teacherId").val() + "?menuId=020801";
                                        }
                                    });
                                }
                            }

                        }
                    }
                }
            });
        }
    };
    //更改必填校验的提示位置
    function validatePlace() {
        $.validator.setDefaults({
            errorPlacement: function (error, element) {//error为错误提示对象，element为出错的组件对象
                if (element.is(":radio")) {
                    error.css("display", "block").appendTo(element.parent().parent());
                } else {
                    element.after(error);//默认是加在 输入框的后面。这个else必须写。不然其他非radio的组件 就无法显示错误信息了。
                }
            }

        });
    }

    return {
        init: function (teachLanguageListData) {
            initCalendar();
            handleRecords();
            teachLanguageList = teachLanguageListData;
        }
    };
}();
