var suggestObj  = function () {

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
                data.nickName = $.trim($("#nickNameQuery").val());
                data.disposeStatus = $.trim($("#disposeStatusQuery").val());
                data.suggestTimeFrom = $("#suggestTimeQuery").data("from");
                data.suggestTimeTo = $("#suggestTimeQuery").data("to");
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/platform/suggest/getListPage",
                    type: "POST"
                },
                "columns": [
                    {data: 'suggestTime', orderable: false},
                    {
                        data: 'nickName', orderable: false,
                        render: function (data, type, full) {
                            return "<a href='w/people/studentList/studentListDetail/"+full.studentId+"'>"+full.nickName+"</a>"
                        }
                    },
                    {data: 'suggestContent', orderable: false},
                    {
                        data: 'disposeStatus', orderable: false,
                        render: function (data, type, full) {

                            return customGlobal.getDictValue("disposeStatus", data);
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

        $table.on("click", "a.dispose", function () {
            var $this = $(this);
            var options = {
                confirmContent: i18n.disposePrompt
            };
            customGlobal.showConfirm(options);
            $("#confirmBtn").on("click.dispose", function () {
                $.ajax({
                    url: "w/platform/suggest/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
                    type: "PUT",
                    dataType: "json"

                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        });

        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/platform/suggest/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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











