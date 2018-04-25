var teacherCancelTable = function () {

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
                var $firstTimeQuery = $("#firstTimeQuery");
                data.firstTimeQueryFrom = $.trim($firstTimeQuery.data("from"));
                data.firstTimeQueryTo = $.trim($firstTimeQuery.data("to"));
                data.reason = jQuery.trim($("#reasonQuery").val());
                data.cancelStatus = jQuery.trim($("#cancelStatusQuery").val());
                var $compensationQuery = $("#compensateTimeQuery");
                data.changeValueQueryFrom=$compensationQuery.attr("valueFrom");
                data.changeValueQueryTo=$compensationQuery.attr("valueTo");
            },
            dataTable: {
                order:[],
                "ajax": {
                    "url": basePath + "w/lesson/teacherCancel/getTeacherCancelListPage"
                },
                "columns": [
                    {data: 'applyTime', orderable: false},
                    {data: 'username', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/teacherList/teacherListDetail/"+full.teacherId+"'>"+full.username+"</a>"
                        }
                    },
                    {data: 'accountNum', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/studentList/studentListDetail/"+full.studentId+"'>"+full.accountNum+"</a>"
                        }
                    },
                    {data: 'mobilephone', orderable: false},
                    {data: 'changeValue', orderable: false},
                    {data: 'firstTime', orderable: false},
                    {data: 'cancelStatus', orderable: false,
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
        $table.on("click", "a.refuseBtn", function () {
            var $this = $(this);
            customGlobal.refuseConfirm();
            $("#confirmBtn").on("click.refuse", function () {
                customGlobal.blockUI("#modalContent");
                $.ajax({
                    url: "w/lesson/teacherCancel/refuse/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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
            customGlobal.agreeConfirm();
            $("#confirmBtn").on("click.agree", function () {
                customGlobal.blockUI("#modalContent");
                $.ajax({
                    url: "w/lesson/teacherCancel/agree/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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
            $.get("w/lesson/teacherCancel/" + $(this).attr("id"), function (data) {
                var teacherCancel = data.returnData.teacherCancel;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/teacherCancel/viewTeacherCancel.html",
                    {
                        teacherCancel: teacherCancel
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
