var withdrawLogObj = function () {

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
                data.flowNo = $.trim($("#flowNoQuery").val());
                data.studentId = $.trim($("#studentIdQuery").val());
                data.nickName = $.trim($("#nickNameQuery").val());
                data.bankCardNum = $.trim($("#bankCardNumQuery").val());
                data.status = $.trim($("#statusQuery").val());
                var $createTimeQuery = $("#createTimeQuery");
                data.createTimeQueryFrom = $.trim($createTimeQuery.data("from"));
                data.createTimeQueryTo = $.trim($createTimeQuery.data("to"));
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/money/withdrawalsLog/getWithdrawLogListPage"
                },
                "columns": [
                    {data: 'studentId', orderable: false},
                    {data: 'nickName', orderable: false},
                    {data: 'amount', orderable: false},
                    {data: 'poundage', orderable: false},
                    {data: 'receiveAmount', orderable: false},
                    {data: 'createTime', orderable: false},
                    {data: 'bankCardNum', orderable: false},
                    {data: 'flowNo', orderable: false},
                    {
                        data: 'status', orderable: false,
                        render: function (data, type, full) {
                            if (data === "1") {
                                return "成功";
                            } else {
                                return "失败";
                            }

                        }
                    },
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return template("actionBtn", {data: data, type: type, full: full, i18n: i18n});
                        }
                    }
                ],
                "infoCallback": function(oSettings) {
                    var sum = oSettings.jqXHR.responseJSON.sum;
                    $("#amountTotal").html(sum.amountTotal.toFixed(2));
                    $("#poundageTotal").html(sum.poundageTotal.toFixed(2));
                    $("#receiveAmountTotal").html(sum.receiveAmountTotal.toFixed(2));

                }
            }
        });
    };

    return {
        init: function () {
            handleRecords();
        }
    };
}();
