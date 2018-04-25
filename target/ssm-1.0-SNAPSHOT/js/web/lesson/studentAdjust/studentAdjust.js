var studentAdjustObj = function () {

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
                var $applyTimeQuery = $("#applyTimeQuery");
                data.applyTimeFrom = $.trim($applyTimeQuery.data("from"));
                data.applyTimeTo = $.trim($applyTimeQuery.data("to"));
                data.studentNickName = $.trim($("#nickNameQuery").val());
                data.accountNum = $.trim($("#idQuery").val());
                data.mobilephone = $.trim($("#phoneQuery").val());
                data.teacherName = $.trim($("#teacherQuery").val());
                var $oldStartTimeQuery = $("#oldStartTimeQuery");
                data.oldStartTimeFrom = $.trim($oldStartTimeQuery.data("from"));
                data.oldStartTimeTo = $.trim($oldStartTimeQuery.data("to"));
                var $newTimeQuery = $("#newTimeQuery");
                data.newStartTimeFrom = $.trim($newTimeQuery.data("from"));
                data.newStartTimeTo = $.trim($newTimeQuery.data("to"));

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/lesson/studentAdjust/getStudentAdjustListPage"
                },
                "columns": [
                    {data: 'applyTime', orderable: false},
                    {data: 'studentNickName', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/studentList/studentListDetail/"+full.studentId+"'>"+full.studentNickName+"</a>"
                        }
                    },
                    {data: 'accountNum', orderable: false},
                    {data: 'mobilephone', orderable: false},
                    {data: 'teacherName', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/teacherList/teacherListDetail/"+full.teacherId+"'>"+full.teacherName+"</a>"
                        }
                    },
                    {data: 'oldTimeShow', orderable: false},
                    {data: 'newTimeShow', orderable: false},
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
        $table.on("click", "a.view", function () {
            $.get("w/lesson/studentAdjust/getStudentAdjustBuyView/" + $(this).attr("id"), function (data) {
                var studentAdjust = data.returnData.studentAdjust;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/lessonAdjust/lessonAdjust.html",
                    {
                        studentAdjust: studentAdjust
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
            });
        })



    };


    return {
        init: function (counselorData) {
            handleRecords();
            handleEvent();
        }
    };
}();
