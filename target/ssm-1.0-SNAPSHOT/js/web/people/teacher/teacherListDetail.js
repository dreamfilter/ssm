

var teacherDetailObj = function () {
    var teacher;

    var handleRecords = function () {
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
            location.href = basePath+"w/people/teacherList?menuId=020801"
        });
    };

    return {
        init: function () {
            handleRecords();

        }
    };
}();
