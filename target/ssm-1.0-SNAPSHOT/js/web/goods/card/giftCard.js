var giftCardObj  = function () {

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
                data.acquireTimeFrom = $("#acquireTimeQuery").data("from");
                data.acquireTimeTo = $("#acquireTimeQuery").data("to");
                data.acquireUserID = $.trim($("#acquireUserIDQuery").val());
                data.acquireUserNickname = $.trim($("#acquireUserNicknameQuery").val());
                data.cardName = $.trim($("#cardNameQuery").val());
                data.cardKind = $.trim($("#cardKindQuery").val());
                data.teachLanguage =  $.trim($("#teachLanguageQuery").getGAutoHiddenValue());
                data.inviteUserID = $.trim($("#inviteUserIDQuery").val());
                data.inviteUserNickname = $.trim($("#inviteUserNicknameQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/goods/giftCard/getListPage",
                    type: "POST"
                },
                "columns": [
                    {data: 'acquireTime', orderable: false},
                    {data: 'acquireUserID', orderable: false},
                    {data: 'acquireUserNickname', orderable: false},
                    {data: 'cardName', orderable: false},
                    {
                        data: 'cardKind', orderable: false,
                        render: function (data, type, full) {
                            return customGlobal.getDictValue("cardType", data);
                        }
                    },
                    {data: 'teachLanguage', orderable: false},
                    {data: 'sumPeriod', orderable: false},
                    {data: 'inviteUserID', orderable: false},
                    {data: 'inviteUserNickname', orderable: false},
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
        var $acquireTimeQuery = $("#acquireTimeQuery");
        $.get("w/goods/giftCard/getHistoryTotal/", {
            "acquireTimeFrom ": $.trim($acquireTimeQuery.data("from")),
            "acquireTimeTo ": $.trim($acquireTimeQuery.data("to")),
            "acquireUserID": $("#acquireUserIDQuery").val(),
            "acquireUserNickname": $.trim($("#acquireUserNicknameQuery").val()),
            "cardName": $.trim($("#cardNameQuery").val()),
            "cardKind": $.trim($("#cardKindQuery").val()),
            "teachLanguage": $.trim($("#teachLanguageQuery").val()),
            "inviteUserID": $.trim($("#inviteUserIDQuery").val()),
            "inviteUserNickname": $.trim($("#inviteUserNicknameQuery").val())

        },  function (data) {
            var total = data.returnData.total.toFixed(1);
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








