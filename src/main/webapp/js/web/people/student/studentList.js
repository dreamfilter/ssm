var studentObj = function () {

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
                data.accountNum = $.trim($("#accountNumQuery").val());
                data.nickname = $.trim($("#nickNameQuery").val());
                data.mobilephone = $.trim($("#phoneQuery").val());
                data.status = $.trim($("#statusQuery").val());
                var $createTimeQuery = $("#createTimeQuery");
                data.createTimeFrom = $.trim($createTimeQuery.data("from"));
                data.createTimeTo = $.trim($createTimeQuery.data("to"));
                data.counselorName = $.trim($("#accountQuery").val());
                
                var $moneyQuery = $("#moneyQuery");
                data.allMoneyFrom=$moneyQuery.attr("valueFrom");
                data.allMoneyTo=$moneyQuery.attr("valueTo");
                
                var $buyQuery = $("#buyQuery");
                data.buyPeriodFrom=$buyQuery.attr("valueFrom");
                data.buyPeriodTo=$buyQuery.attr("valueTo");
                var $digestionQuery = $("#digestionQuery");
                data.consumeValueFrom=$digestionQuery.attr("valueFrom");
                data.consumeValueTo=$digestionQuery.attr("valueTo");
                var $compensationQuery = $("#compensationQuery");
                data.compensationValueFrom=$compensationQuery.attr("valueFrom");
                data.compensationValueTo=$compensationQuery.attr("valueTo");
                var $remainPeriodQuery = $("#remainPeriodQuery");
                data.remainPeriodFrom=$remainPeriodQuery.attr("valueFrom");
                data.remainPeriodTo=$remainPeriodQuery.attr("valueTo");

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/studentList/getStudentListPage"
                },
                "columns": [
                    {data: 'accountNum', orderable: false},
                    {data: 'nickname', orderable: false},
                    {data: 'mobilephone', orderable: false},
                    {data: 'createTime', orderable: false},
                    {
                        data: 'name', orderable: false,
                        render: function (data, type, full) {
                            return "<a href='w/people/counselor/" + full.counselorId + "'>" + full.name + "</a>"
                        }
                    },
                    {data: 'money', orderable: false},
                    {data: 'buyPeriod', orderable: false},
                    {data: 'consumeValue', orderable: false},
                    {data: 'compensationValue', orderable: false},
                    {data: 'remainPeriod', orderable: false},
                    {
                        data: 'status', orderable: false,
                        render: function (data, type, full) {

                            return customGlobal.getDictValue("userStatus", data);
                        }
                    },
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return template("actionBtn", {data: data, type: type, full: full, i18n: i18n});
                        }
                    }
                ]
            },
            onSuccess: function () {
                getSum();
            }
        });
    };

    var handleEvent = function () {
        $table.on("click", "a.view", function () {
            location.href = basePath + "w/people/studentList/studentListDetail/" + $(this).attr("id") + "?menuId=020601";
        }).on("click", "a.resetPassword", function () {
            var $this = $(this);
            var userId = $this.attr("data-userId");
            var nickname = $this.attr("data-nickName");
            customGlobal.showConfirm(
                {
                    confirmContent: i18n.common.resetPrompt1 + nickname + i18n.common.resetPrompt2
                }
            );
            $("#confirmBtn").on("click.deleteRow", function () {
                customGlobal.blockUI("#modalContent");
                var data = {
                    userId: userId,
                    password: "123456".md5()
                };
                $.ajax({
                    url: "w/people/studentList",
                    data: JSON.stringify(data),
                    type: "put",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        $("#modalDialog").modal("hide");
                        dataTable.reloadTable();
                    }
                });
            })
        }).on("click", "a.freeze", function () {
            $.get("w/people/studentList/getStudent/" + $(this).attr("id"), function (data) {
                var student = data.returnData.student;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/student/freezeStudent.html",
                    {
                        student: student
                    }));
                customGlobal.inputInit($templateHtml);

                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initFreezeBtn();
            });
        }).on("click", "a.unFreeze", function () {
            $.get("w/people/studentList/getStudent/" + $(this).attr("id"), function (data) {
                var student = data.returnData.student;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/student/unFreezeStudent.html",
                    {
                        student: student
                    }));
                customGlobal.inputInit($templateHtml);

                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initUnFreezeBtn();
            });
        });

        function initFreezeBtn() {

            $("#freezeBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        remark: $.trim($("#remark").val()),
                        peopleId: $.trim($("#id").val())
                    };
                    $.ajax({
                        url: "w/people/studentList/freeze",
                        data: JSON.stringify(data),
                        type: "put",
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

        function initUnFreezeBtn() {

            $("#unFreezeBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        remark: $.trim($("#remark").val()),
                        peopleId: $.trim($("#id").val())
                    };
                    $.ajax({
                        url: "w/people/studentList/unFreeze",
                        data: JSON.stringify(data),
                        type: "put",
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



        /*导入学生教学卡*/
        $("#importCard").on("click", function () {
            $("#modalDialogCard").modal("show");
            //上传附件按钮解禁,遮盖层隐藏
            $("#uploadFileBtnCard").attr("disabled", true);
            $("#closeBtnCard").attr("disabled", false);
            $("#uploadFileCardDiv").removeClass("fileinput-exists").addClass("fileinput-new");
        });

        $("#uploadFileCard").fileupload({
            url: "w/people/studentList/importCard",
            dataType: 'json',
            autoUpload: false
        }).on("fileuploadadd", function (e, data) {
            $("#titleImageErrorCard").html("");
            $("#uploadFileBtnCard").attr("disabled", false).off("click").on("click", function () {
                //上传附件按钮解禁,遮盖层隐藏
                $("#uploadFileBtnCard").attr("disabled", true);
                $("#closeBtnCard").attr("disabled", false);
                customGlobal.blockUI("#modalContent");
                data.submit();
            })
        }).on("fileuploadprocessalways", function (e, data) {
            var index = data.index,
                file = data.files[index];
            if (file.error) {
                $("#titleImageErrorCard").html(file.error)
            }
        }).on("fileuploaddone", function (e, data) {
            if (data.result.ok) {
                toast.success(data.result.returnMsg);
                $("#modalDialogCard").modal("hide");
                dataTable.reloadTable();
            } else if (data.result.error) {
                var error = data.result.returnMsg;
                error = error.split(",");
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/viewError.html",
                    {
                        error: error
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
                return false;
            } else if (data.result.warn) {
                toast.warn(data.result.returnMsg);
                return true;
            }
        });
        
        //导入
        $("#importStudent").on("click", function () {
            $("#modalDialog2").modal("show");
            //上传附件按钮解禁,遮盖层隐藏
            $("#uploadFileBtn").attr("disabled", true);
            $("#closeBtn").attr("disabled", false);
            $("#uploadFileDiv").removeClass("fileinput-exists");
            $("#uploadFileDiv").addClass("fileinput-new");
        });

        $("#uploadFile").fileupload({
            url: "w/people/studentList/importStudent",
            dataType: 'json',
            autoUpload: false
        }).on("fileuploadadd", function (e, data) {
            $("#titleImageError").html("");
            $("#uploadFileBtn").attr("disabled", false).off("click").on("click", function () {
                //上传附件按钮解禁,遮盖层隐藏
                $("#uploadFileBtn").attr("disabled", true);
                $("#closeBtn").attr("disabled", false);
                customGlobal.blockUI("#modalContent");
                data.submit();
            })
        }).on("fileuploadprocessalways", function (e, data) {
            var index = data.index,
                file = data.files[index];
            if (file.error) {
                $("#titleImageError").html(file.error)
            }
        }).on("fileuploaddone", function (e, data) {
            if (data.result.ok) {
                toast.success(data.result.returnMsg);
                $("#modalDialog2").modal("hide");
                dataTable.reloadTable();
            } else if (data.result.error) {
                var error = data.result.returnMsg;
                error = error.split(",");
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/viewError.html",
                    {
                        error: error
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
                return false;
            } else if (data.result.warn) {
                toast.warn(data.result.returnMsg);
                return true;
            }
        });
    };

    function getSum() {
        var $createTimeQuery = $("#createTimeQuery");
        var $moneyQuery = $("#moneyQuery");
        var $buyQuery = $("#buyQuery");
        var $digestionQuery = $("#digestionQuery");
        var $compensationQuery = $("#compensationQuery");
        var $remainPeriodQuery = $("#remainPeriodQuery");

        $.get("w/people/studentList/getStudentTotal/", {
            "accountNum": $.trim($("#accountNumQuery").val()),
            "nickname": $.trim($("#nickNameQuery").val()),
            "mobilephone": $.trim($("#phoneQuery").val()),
            "createTimeFrom": $.trim($createTimeQuery.data("from")),
            "createTimeTo": $.trim($createTimeQuery.data("to")),
            "counselorName": $.trim($("#accountQuery").val()),
            "allMoneyFrom": $moneyQuery.attr("valueFrom"),
            "allMoneyTo": $moneyQuery.attr("valueTo"),
            "buyPeriodFrom": $buyQuery.attr("valueFrom"),
            "buyPeriodTo": $buyQuery.attr("valueTo"),
            "consumeValueFrom": $digestionQuery.attr("valueFrom"),
            "consumeValueTo": $digestionQuery.attr("valueTo"),
            "compensationValueFrom": $compensationQuery.attr("valueFrom"),
            "compensationValueTo": $compensationQuery.attr("valueTo"),
            "remainPeriodFrom": $remainPeriodQuery.attr("valueFrom"),
            "remainPeriodTo": $remainPeriodQuery.attr("valueTo")
        }, function (data) {
            var total = data.returnData.total;
            if (total != "" && total != null) {
                $("#sumMoney").html(total.moneyCount);
                $("#buyCardCount").html(total.buyCount);
                $("#consumeCardCount").html(total.consumeCount);
                $("#compensationCardCount").html(total.compensationCount);
                $("#pastCardCount").html(total.pastCount);
            } else {
                $("#allSumMoney").hide();
                $("#allBuyCardCount").hide();
                $("#allConsumeCardCount").hide();
                $("#allCompensationCardCount").hide();
                $("#allPastCardCount").hide();

            }
        });
    }


    return {
        init: function (counselorData) {
            handleRecords();
            handleEvent();
            getSum();
        }
    };
}();
