var studentScheduleObj = function () {

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
            //日程数据源
            events: function (start, end, timezone, callback) {
                var startTime = new Date(start._d);
                var startShow=startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate();
                var endTime = new Date(end._d);
                var endShow=endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
                var eventList = [];
                $.get("w/people/studentList/getStudentLesson/" + $("#studentId").val()+"/"+startShow+"/"+endShow, function (data) {
                    //已上课记录
                    var completeLessonList = data.returnData.completeLessonList;
                    //未开始上课记录
                    var waitingLessonList = data.returnData.waitingLessonList;
                    //未上课记录
                    var noLessonList = data.returnData.noLessonList;
                    for (var i = 0; i < completeLessonList.length; i++) {
                        var event1
                            = {
                            id: completeLessonList[i].id,
                            title: completeLessonList[i].teacherName,
                            start: completeLessonList[i].dtsStartTime,
                            end: completeLessonList[i].dtsEndTime,
                            allDay: false,
                            color: "#f8f8f8",
                            className: "completeLesson",
                            textColor: "#0065b3"
                        };
                        eventList.push(event1);
                    }

                    for (var j = 0; j < waitingLessonList.length; j++) {
                        var event2 = {
                            id: waitingLessonList[j].id,
                            title: waitingLessonList[j].teacherName,
                            start: waitingLessonList[j].dtsStartTime,
                            end: waitingLessonList[j].dtsEndTime,
                            allDay: false,
                            color: "#c5e5cc",
                            className: "waitingLesson",
                            textColor: "#0065b3"
                        };
                        eventList.push(event2);
                    }

                    for (var k = 0; k < noLessonList.length; k++) {
                        var event3 = {
                            id: noLessonList[k].id,
                            title: noLessonList[k].teacherName,
                            start: noLessonList[k].dtsStartTime,
                            end: noLessonList[k].dtsEndTime,
                            allDay: false,
                            color: "#fad8a6",
                            className: "noLesson",
                            textColor: "#0065b3"
                        };
                        eventList.push(event3);
                    }
                    callback(eventList);
                });
            }
            ,
            eventRender: function (event, element) {
                element.html(event.title);
            },
            //单击查看页面
            eventClick: function (calEvent) {
                $.get("w/people/studentList/getLessonDetailByLessonId/" + calEvent.id, function (data) {
                    var lessonDetail = data.returnData.lessonDetail;
                    var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/lessonDetail/lessonDetail.html",
                        {
                            lessonDetail: lessonDetail
                        }));
                    $("#modalDialog").html($templateHtml).modal("show");
                });
            }
        });
        $(".fc-time").attr("data-full", "");
    };

    $("#basicInfo").on("click", function () {
        location.href = basePath + "w/people/studentList/studentListDetail/" + $("#studentId").val() + "?menuId=020601";
    });

    $("#class").on("click", function () {
        location.href = basePath + "w/people/studentList/studentSchedule/" + $("#studentId").val() + "?menuId=020601";
    });

    $("#cancelHistory").on("click", function () {
        location.href = basePath + "w/people/studentList/cancelCourse/" + $("#studentId").val() + "?menuId=020601";
    });
    $("#goToClassHistory").on("click", function () {
        location.href = basePath + "w/people/studentList/attendClass/" + $("#studentId").val() + "?menuId=020601";
    });

    $("#accountFlow").on("click", function () {
        location.href = basePath + "w/people/studentList/studentBuyHistoryList/" + $("#studentId").val() + "?menuId=020601";
    });

    $("#freezeLog").on("click", function () {
        location.href = basePath + "w/people/studentList/studentFreezeLogPage/" + $("#id").val() + "?menuId=020601";
    });

    //返回按钮功能实现
    $("#goBack").on("click", function () {
        location.href = basePath + "w/people/studentList?menuId=020601"
    });

    return {
        init: function () {
            initCalendar();
        }
    };
}();
