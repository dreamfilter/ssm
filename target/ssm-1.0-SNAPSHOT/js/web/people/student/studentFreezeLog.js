var studentFreezeLogObj = function () {

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
                    data.peopleId = $("#id").val(),
                    data.freezedUserType = 1
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/studentList/getFreezeLogListPage"
                },
                "columns": [
                    {data: 'operateTime', orderable: false},
                    {data: 'operation', orderable: false},
                    {data: 'operateorId', orderable: false},
                    {data: 'remark', orderable: false}
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
            location.href = basePath + "w/people/studentList?menuId=020601"
        });
    };

    return {
        init: function () {
            handleRecords();
            handleEvent();
        }


    };
}();
