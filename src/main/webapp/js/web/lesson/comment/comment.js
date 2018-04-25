var commentObj= function () {

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
                var $commentTimeQuery =$("#commentTimeQuery");
                data.commentTimeFrom = $.trim($commentTimeQuery.data("from"));
                data.commentTimeTo = $.trim($commentTimeQuery.data("to"));
                data.commentUserNickname = jQuery.trim($("#commentUserNicknameQuery").val());
                data.attendClassTeacher = jQuery.trim($("#attendClassTeacherQuery").val());
                var $star = $("#starQuery");
                data.starFrom=$star.attr("valueFrom");
                data.starTo=$star.attr("valueTo");
                data.replyStatus = jQuery.trim($("#replyStatusQuery").val());
            },
            dataTable: {
                order:[],
                "ajax": {
                    "url": basePath + "w/lesson/comment/getCommentListPage"
                },
                "columns": [
                    {data: 'commentTime', orderable: false},
                    {data: 'commentUserNickname', orderable: false},
                    {data: 'attendClassTeacher', orderable: false},
                    {data: 'star', orderable: false},
                    {data: 'replyStatus', orderable: false,
                        render: function (data) {
                            if (data == 0) {
                                return i18n.unReply;
                            }else if(data==1){
                                return i18n.replyed;
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

        $table.on("click", "a.view", function () {
            var $this = $(this);
            $.get("w/lesson/comment/" + $table.DataTable().row($this.parents('tr')[0]).data().id, function (data) {
                var comment = data.returnData.commentResponse;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/comment/viewComment.html",
                    {
                        comment: comment
                    }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initStarBtn();
            });
        });

        $table.on("click", "a.reply", function () {
            var $this = $(this);
            $.get("w/lesson/comment/" + $table.DataTable().row($this.parents('tr')[0]).data().id, function (data) {
                var comment = data.returnData.commentResponse;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/lesson/comment/replyComment.html",
                    {
                        comment: comment
                    }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initReplyBtn();
                initStarBtn();
            });
        });


        //显示分数
        function initStarBtn() {
            $(".show_number li p").each(function (index, element) {
                var num = $(this).attr("tip");
                var www = num * 2 * 14;//
                $(this).css("width", www);
            });
        }
        function initReplyBtn() {
            $("#replyBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        id : $.trim($("#commentId").val()),
                        replyContent: $.trim($("#replyContent").val()),
                        replyTime:$.trim($("#replyTime").val())
                    };

                    $.ajax({
                        url: "w/lesson/comment/",
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

        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/lesson/comment/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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

    };


    return {
        init: function () {
            handleRecords();
            handleEvent();
        }
    };
}();
