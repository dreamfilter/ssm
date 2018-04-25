var studentStatisticsObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        $("#dataTable").dataTable().fnDestroy();
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.username=$.trim($("#studentNameQuery").val());
                data.studentId=$.trim($("#studentIdQuery").val());
                data.languageId=$.trim($("#teachLanguageQuery").getGAutoHiddenValue());
                var $overallHoursQuery = $("#overallHoursQuery");
                data.overallHoursQueryFrom=$overallHoursQuery.attr("valueFrom");
                data.overallHoursQueryTo=$overallHoursQuery.attr("valueTo");


            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/statistics/statisticsLesson/getStatisticsStudentListPage"
                },
                "columns": [
                    {data: 'studentId', orderable: false},
                    {data: 'nickname', orderable: false},
                    {data: 'overallHours', orderable: false}
                ]
            },
            onSuccess: function () {
                getSum();
            }
        });
    };

    $("#query").on("click", function () {
        handleRecords();
    });

    function getSum() {
        var username=$.trim($("#studentNameQuery").val());
        var $overallHoursQuery = $("#overallHoursQuery");
        var studentId = $.trim($("#studentIdQuery").val());
        var languageId=$.trim($("#teachLanguageQuery").getGAutoHiddenValue());

        $.post("w/statistics/statisticsLesson/getStudentTotal", {
            "username": username,
            "studentId": studentId,
            "languageId": languageId,
            "overallHoursQueryFrom":  $overallHoursQuery.attr("valueFrom"),
            "overallHoursQueryTo":  $overallHoursQuery.attr("valueTo")

        }, function (data) {
            var total = data.returnData.total;
            $("#totalOverallHours").html(total.totalOverallHours);
        })
    }

    var handleEvent = function () {
        //导出
        var $overallHoursQuery = $("#overallHoursQuery");
        $("#export").on("click", function () {
            var data = [];
            data.push({name: "username", value: $("#studentNameQuery").val()});
            data.push({name: "studentId", value: $("#studentIdQuery").val()});
            data.push({name: "languageId", value: $("#teachLanguageQuery").getGAutoHiddenValue()});
            data.push({name: "overallHoursQueryFrom", value: $overallHoursQuery.attr("valueFrom")});
            data.push({name: "overallHoursQueryTo", value: $overallHoursQuery.attr("valueTo")});
            customGlobal.formSubExport("w/statistics/statisticsLesson/statisticsStudentExportExcel", data);
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

    return {
        init: function () {
            handleEvent();
            handleRecords();
            getSum();
        }
    };
}();
