var orderManageObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    var counselorList;
    var payTypeValue;
    var cardTypeValue;
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.orderNum = $.trim($("#orderNumQuery").val());
                var $createTimeQuery = $("#createTimeQuery");
                data.createTimeFrom = $.trim($createTimeQuery.data("from"));
                data.createTimeTo = $.trim($createTimeQuery.data("to"));
                data.accountNum = $.trim($("#accountNumQuery").val());
                data.cardType = jQuery.trim($("#cardTypeQuery").val());
                data.cardName = $.trim($("#cardNameQuery").val());
                data.payType = jQuery.trim($("#payTypeQuery").val());

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/order/order/getOrderManageListPage",
                    type: "POST"
                },
                "columns": [
                    {data: 'orderNum', orderable: false},
                    {data: 'buyTime', orderable: false},
                    {data: 'accountNum', orderable: false},
                    {
                        data: 'cardType', orderable: false,
                        render: function (data, type, full) {
                            return customGlobal.getDictValue("cardType", data);
                        }
                    },

                    {data: 'name', orderable: false},
                    {data: 'presentPrice', orderable: false},
                    {data: 'sumPeriod', orderable: false},
                    {data: 'validity', orderable: false},
                    {
                        data: 'payType', orderable: false,
                        render: function (data, type, full) {
                            return customGlobal.getDictValue("paymentMethod", data);

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
            $.get("w/order/order/OrderManageForView/" + $(this).attr("id"), function (data) {
                var orderManage = data.returnData.orderManage;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/order/orderManage/updateOrderManage.html",
                    {
                        orderManage: orderManage
                    }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).modal("show");
            });
        });
    };

    function getSum() {
        var $createTimeQuery = $("#createTimeQuery");

        $.get("w/order/order/getOrderTotal/", {
            "orderNum": $.trim($("#orderNumQuery").val()),
            "createTimeFrom": $.trim($createTimeQuery.data("from")),
            "createTimeTo": $.trim($createTimeQuery.data("to")),
            "accountNum": $.trim($("#accountNumQuery").val()),
            "cardType": jQuery.trim($("#cardTypeQuery").val()),
            "cardName": $.trim($("#cardNameQuery").val()),
            "payType": jQuery.trim($("#payTypeQuery").val())

        }, function (data) {
            var total = data.returnData.total;
            if (total != "" && total != null) {
                $("#sumMoney").html(total.moneyCount);
                $("#buyCardCount").html(total.buyCount)
            } else {
                $("#allSumMoney").hide();
                $("#allBuyCardCount").hide()
            }
        });
    }

    return {
        init: function (counselorData, payTypeValueData, cardTypeValueData) {
            handleRecords();
            handleEvent();
            counselorList = counselorData
            payTypeValue = payTypeValueData
            cardTypeValue = cardTypeValueData
        }
    };
}();
