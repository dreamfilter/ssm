var teacherLanguageObj = function () {

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
                data.languageName = $.trim($("#nameQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/goods/language/getLanguageListPage",
                    type: "POST"

                },
                "columns": [
                    {data: 'languageName', orderable: false},
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
        $("#addLanguage").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/card/addLanguage.html", {

            }));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
            }).modal('show');
            initAddBtn();
        });

        function initAddBtn() {
            $("#addBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    $.ajax({
                        url: "w/goods/language/addLanguage",
                        data: JSON.stringify({
                            languageName: $.trim($("#languageName").val())
                        }),
                        contentType: "application/json; charset=utf-8",
                        type: "post",
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
                    url: "w/goods/language/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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

function original() {
    $("#originalPrice").bind("input propertychange change", function (event) {
        $("#dialogForm").validate().form();
    });

}








