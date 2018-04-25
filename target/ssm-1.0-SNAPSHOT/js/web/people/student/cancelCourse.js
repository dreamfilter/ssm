var cancelCourseObj = function () {

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
                data.applyId = $("#id").val();
                var $cancelTime = $("#cancelTimeFromQuery");
                data.cancelTimeFrom = $.trim($cancelTime.data("from"));
                data.cancelTimeTo = $.trim($cancelTime.data("to"));
                var $startTime = $("#startTimeQuery");
                data.schoolTimeFrom = $.trim($startTime.data("from"));
                data.schoolTimeTo = $.trim($startTime.data("to"));
                data.teacherName = $("#teacherNameQuery").val();
                data.consumeTime = $("#consumeTimeQuery").val();
                var $consumeTimeQuery = $("#consumeTimeQuery");
                data.consumeClassFrom=$consumeTimeQuery.attr("valueFrom");
                data.consumeClassTo=$consumeTimeQuery.attr("valueTo");
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/studentList/cancelCourseListPage"
                },
                "columns": [
                    {data: 'applyTime', orderable: false},
                    {data: 'timeShow', orderable: false},
                    {data: 'teacherName', orderable: false},
                    {data: 'consumeLesson', orderable: false},
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
    };

    return {
        init: function (counselorData) {
            handleRecords();
            handleEvent();
        }
    };
}();
