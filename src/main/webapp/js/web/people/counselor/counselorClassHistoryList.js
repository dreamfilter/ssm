var counselorClassHistoryListObj = function () {
    
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function (counselorId) {
        var dataTable = new Datatable();
        dataTable.init({
            src: $("#classDateTable"),
            onQuery: function (data) {
                data.counselorId = jQuery.trim($("#counselorId").val());
                data.accountNum = $.trim($("#accountNumClassQuery").val());
                data.teach = $.trim($("#teachQuery").val());
                var $teachTimeQuery = $("#teachTimeQuery");
                data.teachTimeFrom = $.trim($teachTimeQuery.data("from"));
                data.teachTimeTo = $.trim($teachTimeQuery.data("to"));
                data.teachStatus = $.trim($("#teachStatusQuery").val());
                data.cardName = $.trim($("#cardNameClassQuery").val());
                data.teachLanguageId = $.trim($("#teachLanguageClassQuery").val());

                var $digestionTime = $("#digestionTimeQuery");
                data.digestionTimeFrom = $digestionTime.attr("valueFrom");
                data.digestionTimeTo = $digestionTime.attr("valueTo");

                var $compensateTimeQuery = $("#compensateTimeQuery");
                data.compensateTimeFrom = $compensateTimeQuery.attr("valueFrom");
                data.compensateTimeTo = $compensateTimeQuery.attr("valueTo");


            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/counselor/getClassHistory"
                },
                "columns": [
                    {data: 'accountNum', orderable: false,
                        render: function (data, type, full) {
                            return "<a href='w/people/studentList/studentListDetail/" + full.studentId + "'>" + full.accountNum + "</a>"
                        }},
                    {data: 'teach', orderable: false,
                        render:function (data,type,full) {
                            return "<a href='w/people/teacherList/teacherListDetail/"+full.teacherId+"'>"+full.teach+"</a>"
                        }},
                    {data: 'teachTime', orderable: false},
                    {data: 'teachStatus', orderable: false},
                    {data: 'cardName', orderable: false},
                    {data: 'teachLanguage', orderable: false},
                    {data: 'digestionTime', orderable: false},
                    {data: 'compensateTime', orderable: false},
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
