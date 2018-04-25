var TestObj = function () {

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
                data.question = $.trim($("#questionQuery").val());
                data.answer = $.trim($("#answerQuery").val());
                data.status = $.trim($("#statusQuery").val());
                var $createTimeQuery = $("#createTimeQuery");
                data.createTimeQueryFrom = $.trim($createTimeQuery.data("from"));
                data.createTimeQueryTo = $.trim($createTimeQuery.data("to"));
            },
            dataTable: {
                order:[],
                "ajax": {
                    "url": basePath + "b/Test/getTestListPage"
                },
                "columns": [
                    {data: 'question', orderable: false},
                    {data: 'answer', orderable: false},
                    {data: 'status', orderable: false},
                    {data: 'createTime', orderable: false},
                    {data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return template("actionBtn",{data:data,type:type,full:full,i18n:i18n});
                        }
                    }
                ]
            }
        });
    };

    var handleEvent = function () {
        $("#addTest").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/b/Test/addTest.html",
                {i18n:i18n}));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).modal("show");
        });

        $("#modalDialog").on("click", "#addBtn",function () {
            if ($("#dialogForm").validate().form()) {
                customGlobal.blockUI("#modalContent");
                $.ajax({
                    url: "b/Test",
                    data: JSON.stringify({
                        question: $("#question").val(),
                        answer: $("#answer").val(),
                        status: $("#status").val(),
                        createTime: $("#createTime").val()
                    }),
                    contentType: "application/json; charset=utf-8",
                    type: "post",
                    dataType:"json"
                }).done(function (data) {
                    if (customGlobal.ajaxCallback(data)) {
                        $("#modalDialog").modal("hide");
                        dataTable.reloadTable();
                    }
                });
            }
        }).on("click","#updateBtn", function () {
            if ($("#dialogForm").validate().form()) {
                customGlobal.blockUI("#modalContent");
                var data = {
                    id: $("#id").val(),
                    question: $("#question").val(),
                    answer: $("#answer").val(),
                    status: $("#status").val(),
                    createTime: $("#createTime").val()
                };
                $.ajax({
                    url: "b/Test",
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

        $table.on("click", "a.edit", function () {
            $.get("b/Test/" + $(this).attr("id"), function (data) {
                var Test = data.returnData.Test;
                var $templateHtml = $(customGlobal.remoteTemplate("template/b/Test/updateTest.html",
                    {
                        Test: Test
                        
                    }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).modal("show");
            });
        }).on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "b/Test/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
                    type: "DELETE",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        }).on("click", "a.view", function () {
            $.get("b/Test/" + $(this).attr("id"), function (data) {
                var Test = data.returnData.Test;
                var $templateHtml = $(customGlobal.remoteTemplate("template/b/Test/viewTest.html",
                    {
                        Test: Test
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
            });
        });
    };

    return {
        init: function () {
            handleRecords();
            handleEvent();
        }
    };
}();
