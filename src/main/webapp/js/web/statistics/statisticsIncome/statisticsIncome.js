var statisticsIncomeObj = function () {
    var handleRecords = function () {
        $("#createTimeQueryFrom").datepicker("setEndDate", new Date());
        $("#createTimeQueryTo").datepicker("setEndDate", new Date());
        var timeFrom = $.trim($("#createTimeQueryFrom").val());
        var timeTo = $.trim($("#createTimeQueryTo").val());
        var cardName = $.trim($("#cardNameQuery").val());
        var cardType = $.trim($("#cardTypeQuery").val());

        $.post("w/statistics/statisticsIncome/getStatisticsIncomeListPage", {
            "createTimeFrom": timeFrom,
            "createTimeTo": timeTo,
            "cardName": cardName,
            "cardType": cardType
        }, function (data) {
            for (var i in data.data) {
                $("#show").append('<tr>' +
                    '<td id="buyTime">' + data.data[i].buyTime + '</td>' +
                    '<td id="orderQuantity">' + data.data[i].orderQuantity + '</td>' +
                    '<td id="amountMoney">' + data.data[i].amountMoney + '</td>' +
                    '</tr>');
            }
        });
    };
    $("#search").on("click", function () {
        var cardName = $.trim($("#cardNameQuery").val());
        var cardType = $.trim($("#cardTypeQuery").val());
        var timeFrom = $.trim($("#createTimeQueryFrom").val());
        var timeTo = $.trim($("#createTimeQueryTo").val());
        if (timeFrom == "" || timeTo == "") {
            if (!(timeFrom == "" && timeTo == "")) {
                toast.error("请输入开始日期和结束日期");
                return;
            }
        }else {
            if (timeFrom > timeTo) {
                toast.error("结束日期不能小于开始日期");
                return;
            }
        }
        $.post("w/statistics/statisticsIncome/getStatisticsIncomeListPage", {
            "createTimeFrom": timeFrom,
            "createTimeTo": timeTo,
            "cardName": cardName,
            "cardType": cardType

        }, function (data) {
            $("#show").html("");
            for (var i in data.data) {
                $("#show").append('<tr>' +
                    '<td id="buyTime">' + data.data[i].buyTime + '</td>' +
                    '<td id="orderQuantity">' + data.data[i].orderQuantity + '</td>' +
                    '<td id="amountMoney">' + data.data[i].amountMoney + '</td>' +
                    '</tr>');
            }
        });
        initChart();
        getSum();
    });

    //导出
    $("#exportExcel").on("click", function () {
        var data = [];
        data.push({name: "createTimeFrom", value: $("#createTimeQueryFrom").val()});
        data.push({name: "createTimeTo", value: $("#createTimeQueryTo").val()});
        data.push({name: "cardName", value: $("#cardNameQuery").val()});
        data.push({name: "cardType", value: $("#cardTypeQuery").val()});

        customGlobal.formSubExport("w/statistics/statisticsIncome/statisticsIncomeExportExcel", data);
    });
    
    /*e-chart 折线图*/
    var initChart = function () {
        var timeFrom = $.trim($("#createTimeQueryFrom").val());
        var timeTo = $.trim($("#createTimeQueryTo").val());
        var cardName = $.trim($("#cardNameQuery").val());
        var cardType = $.trim($("#cardTypeQuery").val());
        $.ajax({
            url: "w/statistics/statisticsIncome/getStatisticsDay",
            type: "post",
            dataType: "json",
            data: {'createTimeFrom': timeFrom, 'createTimeTo': timeTo ,"cardName": cardName,"cardType": cardType}
        }).done(function (data) {
                var dom = document.getElementById("main");
                var myChart = echarts.init(dom);
                option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap : false,
                        data: data.statisticsDay
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '收入',
                            type: 'line',
                            data: data.statisticsMoney
                        }
                    ]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }
        );
    };
    
    function getSum() {
        var cardName = $.trim($("#cardNameQuery").val());
        var cardType = $.trim($("#cardTypeQuery").val());
        var timeFrom = $.trim($("#createTimeQueryFrom").val());
        var timeTo = $.trim($("#createTimeQueryTo").val());
        $.post("w/statistics/statisticsIncome/getSumTotal", {
            "createTimeFrom": timeFrom,
            "createTimeTo": timeTo,
            "cardName": cardName,
            "cardType": cardType

        }, function (data) {
            var total = data.returnData.total;
            $("#totalAmount").html(total.totalAmount);
            $("#tOrderNum").html(total.tOrderNum);
        })
    }

    return {
        init: function () {
            handleRecords();
            initChart();
            getSum();
        }
    };
}();
