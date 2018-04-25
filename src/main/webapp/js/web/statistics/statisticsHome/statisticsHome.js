var statisticsHomeObj = function () {

    var getNode = function () {
        customGlobal.blockUI("nodeRow");
        $.ajaxSetup({async: false});
        $("#nodeRow").find("input").each(function () {
            var $this = $(this);
            $.get($this.val(), function (data) {
                $("#nodeRow").append(data);
            });
        });
        $.ajaxSetup({async: true});
        App.unblockUI("nodeRow");

        $.post("w/statistics/statisticsHome/getStatisticsHomeTotal",{
            "createTimeFrom": $("#startTime").val(),
            "createTimeTo": $("#endTime").val()
        }, function (data) {
            var orderNum = data.returnData.orderNum;
            var studentUserNum = data.returnData.studentUserNum;
            var totalAmount = data.returnData.totalAmount;
            $("#orderNum").html(orderNum);
            $("#studentUserNum").html(studentUserNum);
            $("#totalAmount").html(totalAmount);
        });
    };

    var search = function () {
        $("#startTime").datepicker("setEndDate", new Date());
        $("#endTime").datepicker("setEndDate", new Date());
        $("#search").on("click", function () {
            if ($("#formSum").validate().form()) {
                var start = $.trim($("#startTime").val());
                var end = $.trim($("#endTime").val());
                if(start!="" && end!=""){
                    if (start > end) {
                        toast.error("结束日期不能小于开始日期");
                        return;
                    }
                }
                $.post("w/statistics/statisticsHome/getStatisticsHomeTotal",{
                    "createTimeFrom": start,
                    "createTimeTo": end
                }, function (data) {
                    var orderNum = data.returnData.orderNum;
                    var studentUserNum = data.returnData.studentUserNum;
                    var totalAmount = data.returnData.totalAmount;
                    $("#orderNum").html(orderNum);
                    $("#studentUserNum").html(studentUserNum);
                    $("#totalAmount").html(totalAmount);

                });
            }
        });

    };
    return {
        //main function to initiate the module
        init: function () {
            getNode();
            search();
        }
    };

}();
