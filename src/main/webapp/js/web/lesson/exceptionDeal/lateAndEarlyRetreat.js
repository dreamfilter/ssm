var lateAndEarlyRetreatObj = function () {

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
                var $createTimeQuery = $("#createTimeQuery");
                data.createTimeFrom = $.trim($createTimeQuery.data("from"));
                data.createTimeTo = $.trim($createTimeQuery.data("to"));
                data.accountNum = jQuery.trim($("#uidNumQuery").val());
                data.userName = jQuery.trim($("#teacherAccountQuery").val());
                data.iStatus = jQuery.trim($("#userStatusQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/lesson/exceptionDeal/getExceptionListPage"
                },
                "columns": [
                    {data: 'startEndTime', orderable: false},
                    {data: 'accountNum', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/studentList/studentListDetail/"+full.studentId+"'>"+full.accountNum+"</a>"
                        }},
                    {data: 'userName', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/teacherList/teacherListDetail/"+full.teacherId+"'>"+full.userName+"</a>"
                        }},
                    {data: 'studentArriveTime', orderable: false},
                    {data: 'teacherArriveTime', orderable: false},
                    {data: 'studentLeaveTime', orderable: false},
                    {data: 'teacherLeaveTime', orderable: false},
                    {data: 'teachStatus', orderable: false},
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

        $("#accountFlow").on("click", function () {
            location.href = basePath + "w/lesson/exceptionDeal?menuId=0211";

        });
        $("#goToClassHistory").on("click", function () {
            location.href = basePath + "w/lesson/exceptionDeal/absentList?menuId=0211";
        });


        $table.on("click", "a.late", function () {
            var id = $(this).attr("id");
            customGlobal.latefirm();
            $("#confirmBtn").on("click", function () {
                customGlobal.blockUI("#modalContent");
                var data = {
                    id: id,
                    isStudentLate: 0,
                    isTeacherLate: 1,
                };
                $.ajax({
                    url: "w/lesson/exceptionDeal/late/",
                    data: JSON.stringify(data),
                    type: "put",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })

            })
        })

        $table.on("click", "a.early", function () {
            var id = $(this).attr("id");
            customGlobal.latefirm();
            $("#confirmBtn").on("click", function () {
                customGlobal.blockUI("#modalContent");
                var data = {
                    id: id,
                    isStudentEarly: 0,
                    isTeacherEarly: 1,
                };
                $.ajax({
                    url: "w/lesson/exceptionDeal/early/",
                    data: JSON.stringify(data),
                    type: "put",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })

            })
        })

    };



    return {
        init: function () {
            handleRecords();
            handleEvent();
        }
    };
}();
