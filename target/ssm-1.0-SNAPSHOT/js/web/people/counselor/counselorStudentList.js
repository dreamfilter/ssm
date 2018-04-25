var counselorStudentListObj = function () {
    var dataTable;
    var $table = $("#dataTable");
    
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function (counselorId) {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.counselorId = counselorId;
                data.nickname = jQuery.trim($("#nickNameQuery").val());
                data.buyStatus = jQuery.trim($("#buyStatusQuery").val());
                data.mobilephone = jQuery.trim($("#phoneQuery").val());

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/counselor/getCounselorStudentListPage"
                },
                "columns": [
                    {
                        data: 'nickname', orderable: false,
                        render: function (data, type, full) {
                            return "<a href='w/people/studentList/studentListDetail/" + full.id + "'>" + full.nickname + "</a>"
                        }
                    },
                    {
                        data: 'buyStatus', orderable: false, render: function (data, type, full) {
                        return customGlobal.getDictValue("studentBuyStatus", data);
                    }
                    },
                    {data: 'mobilephone', orderable: false},
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
