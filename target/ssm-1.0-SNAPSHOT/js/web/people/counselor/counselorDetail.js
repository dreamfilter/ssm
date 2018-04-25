var counselorDetailObj = function () {
    var handleRecords = function () {
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
        }
    };
}();
