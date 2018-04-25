var absentObj = function () {

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
                data.lessonStatus = jQuery.trim($("#userStatusQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/lesson/exceptionDeal/getAbsentListPage"
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


        $table.on("click", "a.absent", function () {
            var id = $(this).attr("id");
            customGlobal.latefirm();
            $("#confirmBtn").on("click", function () {
                customGlobal.blockUI("#modalContent");
                var data = {
                    id: id,
                    isStudentAbsent: 0,
                    isTeacherAbsent: 1,
                };
                $.ajax({
                    url: "w/lesson/exceptionDeal/updateAbsent/",
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
