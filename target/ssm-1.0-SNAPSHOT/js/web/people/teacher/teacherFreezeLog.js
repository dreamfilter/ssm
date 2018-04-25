var teacherFreezeLogObj = function () {

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
                    data.freezedUserType = 3
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/teacherList/getFreezeLogListPage"
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
        init: function () {
            handleRecords();
            handleEvent();
        }


    };
}();
