var studentBuyHistoryObj = function () {

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
                data.buyStudentId = $("#id").val();
                data.orderNum=$.trim($("#orderNumQuery").val());
                data.name=$.trim($("#cardNameQuery").val());
                data.cardType=$.trim($("#cardTypeQuery").val());
                var $createTimeQuery = $("#buyTimeQuery");
                data.buyTimeFrom = $.trim($createTimeQuery.data("from"));
                data.buyTimeTo = $.trim($createTimeQuery.data("to"));
                data.payType=$.trim($("#payTypeQuery").val());
                data.status=$.trim($("#statusQuery").val());
                var $moneyQuery = $("#moneyQuery");
                data.valueFrom=$moneyQuery.attr("valueFrom");
                data.valueTo=$moneyQuery.attr("valueTo");
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/studentList/getStudentBuyHistoryListPage"
                },
                "columns": [
                    {data: 'orderNum', orderable: false},
                    {data: 'name', orderable: false},
                    {data: 'cardType', orderable: false},
                    {data: 'buyTime', orderable: false},
                    {data: 'presentPrice', orderable: false},
                    {data: 'sumPeriodShow', orderable: false},
                    {data: 'validity', orderable: false,
                        render: function (data, type, full) {
                            if(full.cardType=='1'||full.cardType=='2'){
                                return "";
                            }else {
                                return full.validity;
                            }
                        }},
                    {data: 'payType', orderable: false},
                    {data: 'status', orderable: false},
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
        $("#basicInfo").on("click", function () {
            location.href = basePath + "w/people/studentList/studentListDetail/" + $("#id").val() + "?menuId=020601";
        });

        $("#class").on("click", function () {
            location.href = basePath + "w/people/studentList/studentSchedule/" + $("#id").val() + "?menuId=020601";
        });

        $("#accountFlow").on("click", function () {
            location.href = basePath + "w/people/studentList/studentBuyHistoryList/" + $("#id").val() + "?menuId=020601";
        });
        $("#goToClassHistory").on("click", function () {
            location.href = basePath + "w/people/studentList/attendClass/" + $("#id").val() + "?menuId=020601";
        });

        $("#cancelHistory").on("click", function () {
            location.href = basePath + "w/people/studentList/cancelCourse/" + $("#id").val() + "?menuId=020601";
        });

        $("#freezeLog").on("click", function () {
            location.href = basePath + "w/people/studentList/studentFreezeLogPage/" + $("#id").val() + "?menuId=020601";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath+"w/people/studentList?menuId=020601"
        });

        $table.on("click", "a.view", function () {
            $.get("w/people/studentList/getStudentBuyView/" + $(this).attr("id"), function (data) {
                var studentBuy = data.returnData.studentBuy;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/student/viewStudent.html",
                    {
                        studentBuy: studentBuy
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
            });
        })
    };
    function getSum() {
        var $createTimeQuery = $("#buyTimeQuery");
        var $moneyQuery = $("#moneyQuery");
        $.get("w/people/studentList/getStudentBuyHistoryTotal/", {
            "buyStudentId": $("#id").val(),
            "orderNum": $.trim($("#orderNumQuery").val()),
            "name": $.trim($("#cardNameQuery").val()),
            "cardType": $.trim($("#cardTypeQuery").val()),
            "buyTimeFrom ": $.trim($createTimeQuery.data("from")),
            "buyTimeTo ": $.trim($createTimeQuery.data("to")),
            "payType": $.trim($("#payTypeQuery").val()),
            "status": $.trim($("#statusQuery").val()),
            "valueFrom": $moneyQuery.attr("valueFrom"),
            "valueTo": $moneyQuery.attr("valueTo")
        },  function (data) {
            var total = data.returnData.total;
            if (total != "" && total != null) {
                $("#sumMoney").html(total.moneyCount);
                $("#buyCardCount").html(total.buyCount);
            }else {
                $("#allSumMoney").hide();
                $("#allBuyCardCount").hide();
            }
        });
    }
    return {
        init: function () {
            handleRecords();
            handleEvent();
        }
    };
}();
