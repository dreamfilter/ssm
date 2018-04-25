var counselorStatisticsObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        $("#createTimeQueryFrom").datepicker("setEndDate", new Date());
        $("#createTimeQueryTo").datepicker("setEndDate", new Date());
        $("#dataTable").dataTable().fnDestroy();
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                var $purchaseAmountStudentsQuery = $("#purchaseAmountStudentsQuery");
                data.purchaseAmountStudentsQueryFrom = $purchaseAmountStudentsQuery.attr("valueFrom");
                data.purchaseAmountStudentsQueryTo = $purchaseAmountStudentsQuery.attr("valueTo");

                var $studentPurchaseQuery = $("#studentPurchaseQuery");
                data.studentPurchaseQueryFrom = $studentPurchaseQuery.attr("valueFrom");
                data.studentPurchaseQueryTo = $studentPurchaseQuery.attr("valueTo");

                var $classHoursQuery = $("#classHoursQuery");
                data.classHoursQueryFrom = $classHoursQuery.attr("valueFrom");
                data.classHoursQueryTo = $classHoursQuery.attr("valueTo");

                data.counselorName = $.trim($("#counselorNameQuery").val());
                data.nationality = $.trim($("#nationalityQuery").val());
                var $studentNum = $("#studentNumQuery");
                data.studentNumQueryFrom = $studentNum.attr("valueFrom");
                data.studentNumQueryTo = $studentNum.attr("valueTo");
                data.studentNum = $.trim($studentNum.val());
                data.createTimeQueryFrom = jQuery.trim($("#createTimeQueryFrom").val());
                data.createTimeQueryTo = jQuery.trim($("#createTimeQueryTo").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/statistics/statisticsLesson/getStatisticsCounselorListPage"
                },
                "columns": [
                    {data: 'counselorName', orderable: false},
                    {data: 'nationality', orderable: false},
                    {data: 'studentNum', orderable: false},
                    {data: 'purchaseAmountStudents', orderable: false},
                    {data: 'studentPurchase', orderable: false},
                    {data: 'classHours', orderable: false}
                ]
            },
            onSuccess: function () {
                getSum();
            }
        });
    };

    var handleEvent = function () {
        var $purchaseAmountStudentsQuery = $("#purchaseAmountStudentsQuery");
        var $studentPurchaseQuery = $("#studentPurchaseQuery");
        var $classHoursQuery = $("#classHoursQuery");
        var $studentNum = $("#studentNumQuery");
        var createTimeQueryFrom = jQuery.trim($("#createTimeQueryFrom").val());
        var createTimeQueryTo = jQuery.trim($("#createTimeQueryTo").val());
        
        //导出
        $("#export").on("click", function () {
            var data = [];
            data.push({name: "counselorName", value: $("#counselorNameQuery").val()});
            data.push({name: "nationality", value: $("#nationalityQuery").val()});
            data.push({name: "studentNum", value: $("#studentNumQuery").val()});
            data.push({name: "purchaseAmountStudents", value: $purchaseAmountStudentsQuery.val()});
            data.push({name: "purchaseAmountStudentsQueryFrom", value: $purchaseAmountStudentsQuery.attr("valueFrom")});
            data.push({name: "purchaseAmountStudentsQueryTo", value: $purchaseAmountStudentsQuery.attr("valueTo")});
            data.push({name: "studentPurchase", value: $studentPurchaseQuery.val()});
            data.push({name: "studentPurchaseQueryFrom", value: $studentPurchaseQuery.attr("valueFrom")});
            data.push({name: "studentPurchaseQueryTo", value: $studentPurchaseQuery.attr("valueTo")});
            data.push({name: "classHours", value: $classHoursQuery.val()});
            data.push({name: "classHoursQueryFrom", value: $classHoursQuery.attr("valueFrom")});
            data.push({name: "classHoursQueryTo", value: $classHoursQuery.attr("valueTo")});
            data.push({name: "studentNumQueryFrom", value: $studentNum.attr("valueFrom")});
            data.push({name: "studentNumQueryTo", value: $studentNum.attr("valueTo")});
            data.push({name: "createTimeQueryTo", value: createTimeQueryTo});
            data.push({name: "createTimeQueryFrom", value: createTimeQueryFrom});
            customGlobal.formSubExport("w/statistics/statisticsLesson/statisticsCounselorExportExcel", data);
        });
        $("#accountFlow").on("click", function () {
            location.href = basePath + "w/statistics/statisticsLesson?menuId=021401";
        });
        $("#goToClassHistory").on("click", function () {
            location.href = basePath + "w/statistics/statisticsLesson/counselorStatistics?menuId=021401";
        });
        $("#cancelHistory").on("click", function () {
            location.href = basePath + "w/statistics/statisticsLesson/studentStatistics?menuId=021401";
        });

    };

    function getSum() {
        var counselorName = $.trim($("#counselorNameQuery").val());
        var nationality = $.trim($("#nationalityQuery").val());
        var $studentNum = $("#studentNumQuery");
        var $purchaseAmountStudentsQuery = $("#purchaseAmountStudentsQuery");
        var $studentPurchaseQuery = $("#studentPurchaseQuery");
        var $classHoursQuery = $("#classHoursQuery");
        var createTimeQueryFrom = jQuery.trim($("#createTimeQueryFrom").val());
        var createTimeQueryTo = jQuery.trim($("#createTimeQueryTo").val());
        $.post("w/statistics/statisticsLesson/getCounselorTotal", {
            "counselorName": counselorName,
            "nationality": nationality,
            "purchaseAmountStudentsQueryFrom": $purchaseAmountStudentsQuery.attr("valueFrom"),
            "purchaseAmountStudentsQueryTo": $purchaseAmountStudentsQuery.attr("valueTo"),
            "studentPurchaseQueryFrom": $studentPurchaseQuery.attr("valueFrom"),
            "studentPurchaseQueryTo": $studentPurchaseQuery.attr("valueTo"),
            "classHoursQueryFrom": $classHoursQuery.attr("valueFrom"),
            "classHoursQueryTo": $classHoursQuery.attr("valueTo"),
            "studentNumQueryFrom": $studentNum.attr("valueFrom"),
            "studentNumQueryTo": $studentNum.attr("valueTo"),
            "createTimeQueryFrom": createTimeQueryFrom,
            "createTimeQueryTo": createTimeQueryTo

        }, function (data) {
            var total = data.returnData.total;
            $("#purchaseAmountStudents").html(total.purchaseAmountStudents);
            $("#classHours").html(total.classHours);
            $("#studentPurchase").html(total.tPurchase);
            $("#studentNum").html(total.studentNum);
        })
    }

    $("#query").on("click", function () {
        var createTimeQueryFrom=jQuery.trim($("#createTimeQueryFrom").val());
        var createTimeQueryTo=jQuery.trim($("#createTimeQueryTo").val());
        if(createTimeQueryFrom!="" && createTimeQueryTo!=""){
            if (createTimeQueryFrom > createTimeQueryTo) {
                toast.error("结束日期不能小于开始日期");
                return;
            }
        }
        handleRecords();
    });

    return {
        init: function () {
            handleEvent();
            handleRecords();
            getSum();
        }
    };
}();
