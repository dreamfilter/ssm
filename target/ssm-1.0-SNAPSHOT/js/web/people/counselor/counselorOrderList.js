var counselorOrderListObj = function () {
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function (counselorId) {
        var dataTable = new Datatable();
        dataTable.init({
            src: $("#orderDateTable"),
            onQuery: function (data) {
                data.counselorId = jQuery.trim($("#counselorId").val());
                data.orderNum = $.trim($("#orderNumQuery").val());
                var $buyTimeQuery = $("#buyTimeQuery");
                data.buyTimeQueryFrom = $.trim($buyTimeQuery.data("from"));
                data.buyTimeQueryTo = $.trim($buyTimeQuery.data("to"));


                var $presentPrice = $("#moneyQuery");
                data.presentPriceFrom = $presentPrice.attr("valueFrom");
                data.presentPriceTo = $presentPrice.attr("valueTo");
                data.presentPrice = $.trim($presentPrice.val());

                data.accountNum = $.trim($("#accountNumQuery").val());
                data.cardName = $.trim($("#cardNameQuery").val());
                data.language = $.trim($("#teachLanguageQuery").val());

                var $sumPeriod = $("#buyQuery");
                data.sumPeriodFrom = $sumPeriod.attr("valueFrom");
                data.sumPeriodTo = $sumPeriod.attr("valueTo");

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/counselor/getOrderListPage"
                },
                "columns": [
                    {data: 'orderNum', orderable: false},
                    {data: 'buyTime', orderable: false},
                    {data: 'accountNum', orderable: false},
                    {data: 'cardName', orderable: false},
                    {data: 'language', orderable: false},
                    {data: 'presentPrice', orderable: false},
                    {data: 'sumPeriod', orderable: false},
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return "";
                        }
                    }
                ]
            }
        });

        $("#basicInfoTab").on("click", function () {
            location.href = basePath + "w/people/counselor/" + $("#counselorId").val() + "?menuId=020701";
        });

        $("#studentListTab").on("click", function () {
            location.href = basePath + "w/people/counselor/studentList/" + $("#counselorId").val() + "?menuId=020701";
        });

        $("#orderListTab").on("click", function () {
            location.href = basePath + "w/people/counselor/counselorOrderList/" + $("#counselorId").val() + "?menuId=020701";
        });

        $("#goToClassHistoryTab").on("click", function () {
            location.href = basePath + "w/people/counselor/counselorClassHistoryList/" + $("#counselorId").val() + "?menuId=020701";
        });
        $("#freezeLog").on("click", function () {
            location.href = basePath + "w/people/counselor/counselorFreezeLogPage/" + $("#counselorId").val() + "?menuId=020701";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath+"w/people/counselor?menuId=0207"
        });
        
    };

    return {
        init: function (counselorId) {
            handleRecords(counselorId);
        }
    };
}();
