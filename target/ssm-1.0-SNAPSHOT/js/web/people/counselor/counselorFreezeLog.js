var counselorFreezeLogObj = function () {

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
                    data.peopleId = $("#counselorId").val(),
                    data.freezedUserType = 2
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/counselor/getFreezeLogListPage"
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
        $("#basicInfoTab").on("click", function () {
            location.href = basePath + "w/people/counselor/" + $("#counselorId").val() + "?menuId=020701";
        });

        $("#studentListTab").on("click", function () {
            location.href = basePath + "w/people/counselor/studentList/" + $("#counselorId").val() + "?menuId=020701";
        });

        $("#orderListTab").on("click", function () {
            location.href = basePath + "w/people/counselor/counselorOrderList/" + $("#counselorId").val() + "?menuId=020701";
        });

        $("#goToClassHistoryTab").on("click", function () {
            location.href = basePath + "w/people/counselor/counselorClassHistoryList/" + $("#counselorId").val() + "?menuId=020701";
        });
        $("#freezeLog").on("click", function () {
            location.href = basePath + "w/people/counselor/counselorFreezeLogPage/" + $("#counselorId").val() + "?menuId=020701";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath+"w/people/counselor?menuId=0207"
        });
    };

    return {
        init: function () {
            handleRecords();
            handleEvent();
        }


    };
}();
