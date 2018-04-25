var teacherAdjustObj= function () {

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
                var $applyTime =$("#applyTimeQuery");
                data.applyTimeQueryFrom = $.trim($applyTime.data("from"));
                data.applyTimeQueryTo = $.trim($applyTime.data("to"));
                data.username = jQuery.trim($("#usernameQuery").val());
                data.accountNum = jQuery.trim($("#accountNumQuery").val());
                data.mobilephone = jQuery.trim($("#mobilephoneQuery").val());
                var $oldDayQuery = $("#oldDayQuery");
                data.oldDayQueryFrom = $.trim($oldDayQuery.data("from"));
                data.oldDayQueryTo= $.trim($oldDayQuery.data("to"));
                var $newDayQuery = $("#newDayQuery");
                data.newDayQueryFrom = $.trim($newDayQuery.data("from"));
                data.newDayQueryTo = $.trim($newDayQuery.data("to"));
                data.reason = jQuery.trim($("#reasonQuery").val());
                data.adjustStatus = jQuery.trim($("#adjustStatusQuery").val());
                var $compensationQuery = $("#compensateTimeQuery");
                data.changeValueQueryFrom=$compensationQuery.attr("valueFrom");
                data.changeValueQueryTo=$compensationQuery.attr("valueTo");
            },
            dataTable: {
                order:[],
                "ajax": {
                    "url": basePath + "w/lesson/teacherAdjust/getTeacherAdjustListPage"
                },
                "columns": [
                    {data: 'applyTime', orderable: false},
                    {data: 'username', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/teacherList/teacherListDetail/"+full.teacherId+"'>"+full.username+"</a>"
                        }},
                    {data: 'accountNum', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/studentList/studentListDetail/"+full.studentId+"'>"+full.accountNum+"</a>"
                        }},
                    {data: 'mobilephone', orderable: false},
                    {data: 'changeValue', orderable: false},
                    {data: 'oldTimeShow', orderable: false},
                    {data: 'newTimeShow', orderable: false},
                    {data: 'reason', orderable: false},
                    {data: 'adjustStatus', orderable: false,
                        render: function (data) {
                            if (data == 0) {
                                return i18n.common.unapproved;
                            }else if(data==1){
                                return i18n.common.agree;
                            }else if(data==2){
                                return i18n.common.refuse;
                            }
                            else {
                                return i18n.common.overtime;
                            }
                        }
                    },
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





        function initActionBtn() {
            $("#actionBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        applyTime: $.trim($("#applyTime").val()),
                        username: $.trim($("#username").val()),
                        accountNum: $.trim($("#accountNum").val()),
                        mobilephone: $.trim($("#mobilephone").val()),
                        firstTime: $.trim($("#firstTime").val()),
                        reason: $.trim($("#reason").val()),
                        cancelStatus: $.trim($("#cancelStatus").val())
                    };

                    $.ajax({
                        url: "w/lesson/teacherAdjust",
                        data: JSON.stringify(data),
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }
            });
        }

        $table.on("click", "a.refuseBtn", function () {
            var $this = $(this);
            var options = {
                confirmContent: i18n.common.adjustRefusePrompt
            };
            customGlobal.showConfirm(options);
            $("#confirmBtn").on("click.refuse", function () {
                $.ajax({
                    url: "w/lesson/teacherAdjust/refuse/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
                    type: "POST",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        }).on("click", "a.agreeBtn", function () {
            var $this = $(this);
            var options = {
                confirmContent: i18n.common.adjustAgreePrompt
            };
            customGlobal.showConfirm(options);
            $("#confirmBtn").on("click.agree", function () {
                $.ajax({
                    url: "w/lesson/teacherAdjust/agree/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
                    type: "POST",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        }).on("click", "a.view", function () {
            $.get("w/lesson/teacherAdjust/" + $(this).attr("id"), function (data) {
                var lessonAdjust = data.returnData.lessonAdjust;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/lessonAdjust/viewTeacherAdjust.html",
                    {
                        lessonAdjust: lessonAdjust
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
            });
        })

    };


    return {
        init: function () {
            handleRecords();
            handleEvent();
        }
    };
}();
