var rewardLogObj  = function () {

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
                data.awardUserId = $.trim($("#awardUserIdQuery").val());
                data.awardUserNickname = $.trim($("#awardUserNicknameQuery").val());
                data.awardTimeFrom = $("#awardTimeQuery").data("from");
                data.awardTimeTo = $("#awardTimeQuery").data("to");
                data.buyUserId = $.trim($("#buyUserIdQuery").val());
                data.buyUserNickname = $.trim($("#buyUserNicknameQuery").val());
                data.buyOrderNum = $.trim($("#buyOrderNumQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/money/rewardLog/getListPage",
                    type: "POST"
                },
                "columns": [
                    {data: 'awardUserId', orderable: false},
                    {data: 'awardUserNickname', orderable: false},
                    {data: 'awardMoney', orderable: false},
                    {data: 'awardTime', orderable: false},
                    {data: 'buyUserId', orderable: false},
                    {data: 'buyUserNickname', orderable: false},
                    {data: 'buyOrderNum', orderable: false},
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

    function getSum() {
        var $awardTimeQuery = $("#awardTimeQuery");
        $.get("w/money/rewardLog/getHistoryTotal/", {
            "awardUserId": $("#awardUserIdQuery").val(),
            "awardUserNickname": $.trim($("#awardUserNicknameQuery").val()),
            "awardTimeFrom ": $.trim($awardTimeQuery.data("from")),
            "awardTimeTo ": $.trim($awardTimeQuery.data("to")),
            "buyUserId": $.trim($("#buyUserIdQuery").val()),
            "buyUserNickname": $.trim($("#buyUserNicknameQuery").val()),
            "buyOrderNum": $.trim($("#buyOrderNumQuery").val())

        },  function (data) {
            var total = data.returnData.total.toFixed(2);
            if (total != "" && total != null) {
                $("#sumMoney").html(total);
            }else {
                $("#allSumMoney").hide();
            }
        });
    }
    return {
        init: function () {
            handleRecords();
        }
    };
}();











