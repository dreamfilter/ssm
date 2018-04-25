var teacherStatisticsObj = function () {

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
                data.teacherName = $.trim($("#teacherNameQuery").val());
                data.type = jQuery.trim($("#typeQuery").val());
                data.createTimeQueryFrom = jQuery.trim($("#createTimeQueryFrom").val());
                data.createTimeQueryTo = jQuery.trim($("#createTimeQueryTo").val());
                data.teacherLanguageName = $.trim($("#teacherLanguageNameQuery").val());
                var $teachingValueQuery = $("#teachingValueQuery");
                data.teachingValueQueryFrom = $teachingValueQuery.attr("valueFrom");
                data.teachingValueQueryTo = $teachingValueQuery.attr("valueTo");
                data.teachingValue = $.trim($teachingValueQuery.val());
                var $compensationValueQuery = $("#compensationValueQuery");
                data.compensationValueQueryFrom = $compensationValueQuery.attr("valueFrom");
                data.compensationValueQueryTo = $compensationValueQuery.attr("valueTo");
                data.compensationValue = $.trim($compensationValueQuery.val());
                var $studentNum = $("#studentNumQuery");
                data.studentNumQueryFrom = $studentNum.attr("valueFrom");
                data.studentNumQueryTo = $studentNum.attr("valueTo");
                data.studentNum = $.trim($studentNum.val());
            },
            dataTable: {

                order: [],
                "ajax": {
                    "url": basePath + "w/statistics/statisticsLesson/getStatisticsTeacherListPage"
                },
                "columns": [
                    {data: 'teacherName', orderable: false},
                    {
                        data: 'type', orderable: false, render: function (data, type, full) {
                        return customGlobal.getDictValue("teacherType", data);
                       }
                    },
                    {data: 'teacherLanguageName', orderable: false},
                    {data: 'teachingValue', orderable: false},
                    {data: 'compensationValue', orderable: false},
                    {data: 'studentNum', orderable: false},
                    {data: 'star', orderable: false}
                ]
            },
            onSuccess: function () {
                getSum();
            }
        });
    };

    function getSum() {
        var teacherName = $.trim($("#teacherNameQuery").val());
        var teacherLanguageName = $.trim($("#teacherLanguageNameQuery").val());
        var $studentNum = $("#studentNumQuery");
        var $teachingValueQuery = $("#teachingValueQuery");
        var $compensationValueQuery = $("#compensationValueQuery");
        var type =jQuery.trim($("#typeQuery").val());
        var createTimeQueryFrom = jQuery.trim($("#createTimeQueryFrom").val());
        var createTimeQueryTo = jQuery.trim($("#createTimeQueryTo").val());
        $.post("w/statistics/statisticsLesson/getTeacherTotal", {
            "teacherName": teacherName,
            "teacherLanguageName": teacherLanguageName,
            "type": type,
            "teachingValueQueryFrom": $teachingValueQuery.attr("valueFrom"),
            "teachingValueQueryTo": $teachingValueQuery.attr("valueTo"),
            "compensationValueQueryFrom":  $compensationValueQuery.attr("valueFrom"),
            "compensationValueQueryTo":  $compensationValueQuery.attr("valueTo"),
            "studentNumQueryFrom": $studentNum.attr("valueFrom"),
            "studentNumQueryTo": $studentNum.attr("valueTo"),
            "createTimeQueryFrom": createTimeQueryFrom,
            "createTimeQueryTo": createTimeQueryTo

        }, function (data) {
            var total = data.returnData.total;
            $("#teachingValue").html(total.teachingValue);
            $("#compensationValue").html(total.compensationValue);
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

    var handleEvent = function () {
        //导出 传查询条件
        var $teachingValueQuery = $("#teachingValueQuery");
        var $compensationValueQuery = $("#compensationValueQuery");
        var $studentNum = $("#studentNumQuery");
        $("#export").on("click", function () {
            var data = [];
            data.push({name: "day", value: $("#dayQuery").val()});
            data.push({name: "teacherName", value: $("#teacherNameQuery").val()});
            data.push({name: "teacherLanguageName", value: $("#teacherLanguageNameQuery").val()});
            data.push({name: "teachingValueQueryFrom", value: $teachingValueQuery.attr("valueFrom")});
            data.push({name: "teachingValueQueryTo", value: $teachingValueQuery.attr("valueTo")});
            data.push({name: "compensationValueQueryFrom", value: $compensationValueQuery.attr("valueFrom")});
            data.push({name: "compensationValueQueryTo", value: $compensationValueQuery.attr("valueTo")});
            data.push({name: "studentNumQueryFrom", value: $studentNum.attr("valueFrom")});
            data.push({name: "studentNumQueryTo", value: $studentNum.attr("valueTo")});
            data.push({name: "type", value:$("#typeQuery").val()});
            data.push({name: "createTimeQueryFrom", value:jQuery.trim($("#createTimeQueryFrom").val())});
            data.push({name: "createTimeQueryTo", value:jQuery.trim($("#createTimeQueryTo").val())});
            customGlobal.formSubExport("w/statistics/statisticsLesson/statisticsTeacherExportExcel", data);
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
            handleRecords();
            handleEvent();
            getSum();
        }
    };
}();
