var lessonScheduleObj = function () {

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
                eventOrder:function (e1, e2) {
                    console.log(123);
                },
                //日程数据源
                events: function (start, end, timezone, callback) {
                    var startTime = new Date(start._d);
                    var startShow=startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate();
                    var endTime = new Date(end._d);
                    var endShow=endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate();
                    var eventList = [];
                    $.get("w/lesson/lessonTeable/getLessonSchedule/"+startShow+"/"+endShow, function (data) {
                            var freeList = data.returnData.freeList;
                            var freeSum, competeSum, waitSum, noLessonSum;
                            for (var i = 0; i < freeList.length; i++) {
                                if (freeList[i].teacherType == 0) {
                                    freeSum = freeList[i].sum;
                                    var freeEvent
                                        = {
                                        id:freeList[i].teacherType,
                                        title: "(" + freeSum + ")",
                                        sortId:3,
                                        start: freeList[i].dtsStartTime,
                                        end: freeList[i].dtsEndTime,
                                        allDay: false,
                                        color: "#fff",
                                        className: "margin-right-25 break-content bordered",
                                        textColor: "#0065b3"

                                    };
                                    eventList.push(freeEvent);
                                } else if (freeList[i].teacherType == 1) {
                                    noLessonSum = freeList[i].sum;
                                    var noLessonEvent = {
                                        id:freeList[i].teacherType,
                                        title: "(" + noLessonSum + ")",
                                        sortId:1,
                                        start: freeList[i].dtsStartTime,
                                        end: freeList[i].dtsEndTime,
                                        allDay: false,
                                        color: "#fad8a6",
                                        className: "margin-right-25 break-content bordered",
                                        textColor: "#0065b3"
                                    };
                                    eventList.push(noLessonEvent);
                                } else if (freeList[i].teacherType == 2) {
                                    competeSum = freeList[i].sum;
                                    var competeEvent = {
                                        id:freeList[i].teacherType,
                                        title: "(" + competeSum + ")",
                                        sortId:2,
                                        start: freeList[i].dtsStartTime,
                                        end: freeList[i].dtsEndTime,
                                        allDay: false,
                                        color: "#f8f8f8",
                                        className: "margin-right-25 break-content bordered",
                                        textColor: "#0065b3"
                                    };
                                    eventList.push(competeEvent);
                                } else {
                                    waitSum = freeList[i].sum;
                                    var waitEvent = {
                                        id:freeList[i].teacherType,
                                        title: "(" + waitSum + ")",
                                        sortId:4,
                                        start: freeList[i].dtsStartTime,
                                        end: freeList[i].dtsEndTime,
                                        allDay: false,
                                        color: "#c5e5cc",
                                        className: "break-content bordered",
                                        textColor: "#0065b3"

                                    };
                                    eventList.push(waitEvent);
                                }
                            }
                        callback(eventList.sort());
                    });
                },
                eventRender: function (event, element) {
                    element.html(event.title);
                },
                //教师列表
                eventClick: function (calEvent) {
                    var startTime = calEvent._start._i;
                    $.get("w/lesson/lessonTeable/getTeacherList/"+calEvent.id+"/"+startTime, function (data) {
                        var teacherList = data.returnData.teacherList;
                        var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/lessonDetail/lessonSchedule.html",
                            {
                                teacherList:teacherList
                            }));
                        $("#modalDialog").html($templateHtml).modal("show");
                    });
                }
            });
        $(".fc-time").attr("data-full", "");
    };

    return {
        init: function () {
            initCalendar();
        }
    };
}();
