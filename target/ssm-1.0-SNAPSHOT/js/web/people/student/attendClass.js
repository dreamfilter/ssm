var attendClassObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.studentId = $("#id").val();
                data.teacherName = $("#teacherNameQuery").val();
                var $startTimeQuery = $("#startTimeQuery");
                data.startTimeFrom = $.trim($startTimeQuery.data("from"));
                data.startTimeTo = $.trim($startTimeQuery.data("to"));
                var $consumeQuery = $("#consumeQuery");
                data.consumeFrom=$consumeQuery.attr("valueFrom");
                data.consumeTo=$consumeQuery.attr("valueTo");
                var $compensateQuery = $("#compensateQuery");
                data.compensationFrom=$compensateQuery.attr("valueFrom");
                data.compensationTo=$compensateQuery.attr("valueTo");
                data.stateClass = $("#teachStatusQuery").val();
                
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/studentList/attendClassListPage"
                },
                "columns": [
                    {data: 'teacherName', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/teacherList/teacherListDetail/"+full.teacherId+"'>"+full.teacherName+"</a>"
                        }
                    },
                    {data: 'timeShow', orderable: false},
                    {data: 'status', orderable: false},
                    {data: 'consumeValue', orderable: false,
                        render:function(data,type,full){
                            if(data == null){
                                return '0.0';
                            }else{
                                return data;
                            }
                        }},
                    {data: 'compensationValue', orderable: false,
                        render:function(data,type,full){
                            if(data == null){
                                return '0.0';
                            }else{
                                return data;
                            }
                        }
                    },
                    {
                        data: 'courseWareShow', orderable: false,
                        render: function (data, type, full) {
                            return '<a  href="w/people/studentList/download/' + full.id + '">' + data + '</a>'
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
        $("#basicInfo").on("click", function () {
            location.href = basePath + "w/people/studentList/studentListDetail/" + $("#id").val() + "?menuId=020601";
        });

        $("#class").on("click", function () {
            location.href = basePath + "w/people/studentList/studentSchedule/" + $("#id").val() + "?menuId=020601";
        });
        $("#goToClassHistory").on("click", function () {
            location.href = basePath + "w/people/studentList/attendClass/" + $("#id").val() + "?menuId=020601";
        });

        $("#accountFlow").on("click", function () {
            location.href = basePath + "w/people/studentList/studentBuyHistoryList/" + $("#id").val() + "?menuId=020601";
        });
        $("#cancelHistory").on("click", function () {
            location.href = basePath + "w/people/studentList/cancelCourse/" + $("#id").val() + "?menuId=020601";
        });
        $("#freezeLog").on("click", function () {
            location.href = basePath + "w/people/studentList/studentFreezeLogPage/" + $("#id").val() + "?menuId=020601";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath+"w/people/studentList?menuId=020601"
        });

        $table.on("click", "a.view", function () {
            $.get("w/people/studentList/getAttendClassBuyView/" + $(this).attr("id"), function (data) {
                var attendClassDetail = data.returnData.attendClassDetail;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/student/attendClass.html",
                    {
                        attendClassDetail: attendClassDetail
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
            });
        })
    };

    return {
        init: function (counselorData,dictValueLessonData ) {
            handleRecords();
            handleEvent();
        }


    };
}();
