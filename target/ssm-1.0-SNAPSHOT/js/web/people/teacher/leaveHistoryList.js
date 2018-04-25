var leaveHistoryObj = function () {
    var dataTable;
    var $table = $("#dataTable");
    
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function (teacherId) {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            dataTable: {
                order:[],
                "ajax": {
                    "url": basePath + "w/people/teacherList/leaveHistoryListPage/"+teacherId
                },
                "columns": [
                    {data: 'submitTimeShow', orderable: false},
                    {data: 'leaveTimeShow', orderable: false},
                    {data: 'cancelTimeShow', orderable: false},
                    {data: 'daysBetween', orderable: false},
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            if(full.cancelFlag){
                                return template("actionBtn", {data: data, type: type, full: full, i18n: i18n});
                            }else {
                                return "";
                            }
                        }
                    }
                ]
            }
        });

        /*取消预约*/
        $table.on("click", "a.sickLeave", function () {
            var leaveId=$(this).attr("id");
            var options = {
                confirmContent: "您确定销假吗？"
            };
            customGlobal.showConfirm(options);
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/people/teacherList/saveSickLeave/" + leaveId,
                    type: "DELETE",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        });

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
        init: function (teacherId) {
            handleRecords(teacherId);
        }
    };
}();
