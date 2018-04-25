var counselorObj = function () {
    var yesOrNotList;
    var date = new Date;
    var year = date.getFullYear();//当前年；用于计算教龄和年龄

    var imgUpload1 = new FileUpload();
    var imgOptions1 = {
        server: basePath + 'b/core/attachment',
        pick: {
            id: '#images1',
            multiple: false
        },
        dialogContainer: $("#dialogForm"),
        fileNumLimit: 1,
        resize: false,// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        chunked: true, // 是否分片
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        },
        duplicate: true,
        auto: true,
        imageShow: true,
        formData: {
            tableName: 'p_counselor',
            attachmentType: '1'
        },
        initTypes: '1'
    };

    var dataTable;
    var $table = $("#dataTable");
    var nationality;

    var attachmentList = [];
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.counselorId = jQuery.trim($("#counselorId").val());
                data.name = $.trim($("#nameQuery").val());
                data.status = $.trim($("#statusQuery").val());
                data.username = $.trim($("#usernameQuery").val());
                data.mobilephone = $.trim($("#phoneQuery").val());
                data.nationalityName = $.trim($("#nationalityNameQuery").val());
                var $moneyQuery = $("#moneyQuery");
                data.moneyFrom = $moneyQuery.attr("valueFrom");
                data.moneyTo = $moneyQuery.attr("valueTo");
                data.buy = $.trim($("#buyQuery").val());
                var $buyQuery = $("#buyQuery");
                data.buyFrom = $buyQuery.attr("valueFrom");
                data.buyTo = $buyQuery.attr("valueTo");

            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": basePath + "w/people/counselor/getCounselorListPage"
                },
                "columns": [

                    {data: 'name', orderable: false},
                    {data: 'username', orderable: false},
                    {data: 'mobilephone', orderable: false},
                    {data: 'nationalityName', orderable: false},
                    {data: 'money', orderable: false},
                    {data: 'buy', orderable: false},
                    {
                        data: 'status', orderable: false,
                        render: function (data, type, full) {

                            return customGlobal.getDictValue("userStatus", data);
                        }
                    },
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return template("actionBtn", {data: data, type: type, full: full, i18n: i18n});
                        }
                    }
                ]
            }
        });
    };

    var handleEvent = function () {

        $("#addCounselor").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/counselor/addCounselor.html", {
                nationality: nationality,
                yesOrNotList:yesOrNotList
            }));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                imgUpload1.init(imgOptions1);
            }).modal('show');
            initAddBtn();
            /*顾问的必须满18岁，过出生日期为当前日期的18年前*/
            var begin=new Date();
            var s=new Date(begin.setYear((new Date().getFullYear()-18)));
            var beginDay= s.getFullYear() + '-12-' + getDaysInMonth(s.getFullYear(),12);
            /*当前时间控件 清除操作后,会定位到当前日期,目前需求只能是18年之前,故做处理*/
            $("#birthday").datepicker(
                {
                    clearBtn: true,
                    autoclose: true,
                    format: "yyyy-mm-dd",
                    todayHighlight: true,
                    endDate: beginDay
                }).on('changeDate', function(ev){
                if(ev.date){
                }else{
                    $("#birthday").datepicker('setEndDate',beginDay);
                }
            });
        });

        function initAddBtn() {
            $("#birthday").change(function () {
                if ($("#birthday").val() != "") {
                    var age = parseInt(year) - parseInt($("#birthday").val().substring(0, 4));
                    $("#age").html("：" + age + "岁");
                }else{
                    $("#age").html("");
                }
            });
            $("#addBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var sex = document.getElementsByName('sex');
                    var gender;
                    for (var i = 0; i < sex.length; i++) {
                        if (sex[i].checked == true) {//如果选中，下面的alert就会弹出选中的值
                            gender = sex[i].value;
                        }
                    }
                    $.ajax({
                        url: "w/people/counselor/addCounselor",
                        data: JSON.stringify({
                            username: $.trim($("#userName").val()),
                            name: $.trim($("#name").val()),
                            nickname: $.trim($("#nickName").val()),
                            password: $.trim($("#password").val()).md5(),
                            gender: gender,
                            nationalityId: $("#nationalityName").getGAutoHiddenValue(),
                            mobilephone: $.trim($("#mobilePhone").val()),
                            isDefault:  $("input[name=isDefault]:checked").val(),
                            birthday: $.trim($("#birthday").val()),
                            userType:2,
                            attachmentList: attachmentList
                        }),
                        contentType: "application/json; charset=utf-8",
                        type: "post",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }
            });
        }

        //删除
        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                customGlobal.blockUI("#modalContent");
                $.ajax({
                    url: "w/people/counselor/" + $table.DataTable().row($this.parents('tr')[0]).data().counselorId,
                    type: "DELETE",
                    dataType: "json"
                }).done(function (data) {
                    $("#confirmDialog").modal("hide");
                    if (customGlobal.ajaxCallback(data)) {
                        dataTable.reloadTable();
                    }
                })
            })
        });
        $table.on("click", "a.edit", function () {
            $.get("w/people/counselor/getCounselorForView/" + $(this).attr("id"), function (data) {
                var counselor = data.returnData.counselor;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/counselor/updateCounselor.html",
                    {
                        counselor: counselor,
                        yesOrNotList:yesOrNotList
                    }));
                customGlobal.inputInit($templateHtml);

                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    imgUpload1.init(imgOptions1);
                    imgUpload1.showAttachmentList(counselor.counselorId);
                }).modal('show');
                initUpdateBtn();
                /*顾问的必须满18岁，过出生日期为当前日期的18年前*/
                var begin=new Date();
                var s=new Date(begin.setYear((new Date().getFullYear()-18)));
                var beginDay= s.getFullYear() + '-12-' + getDaysInMonth(s.getFullYear(),12);
                /*当前时间控件 清除操作后,会定位到当前日期,目前需求只能是18年之前,故做处理*/
                $("#birthday").datepicker(
                    {
                        clearBtn: true,
                        autoclose: true,
                        format: "yyyy-mm-dd",
                        todayHighlight: true,
                        endDate: beginDay
                    }).on('changeDate', function(ev){
                    if(ev.date){
                    }else{
                        $("#birthday").datepicker('setEndDate',beginDay);
                    }
                });
            });


        });

        $table.on("click", "a.freeze", function () {
            $.get("w/people/counselor/getCounselorForView/" + $(this).attr("id"), function (data) {
                var counselor = data.returnData.counselor;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/counselor/freezeCounselor.html",
                    {
                        counselor: counselor,
                        yesOrNotList:yesOrNotList
                    }));
                customGlobal.inputInit($templateHtml);

                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initFreezeBtn()
            });
        }).on("click", "a.unFreeze", function () {
            $.get("w/people/counselor/getCounselorForView/" + $(this).attr("id"), function (data) {
                var counselor = data.returnData.counselor;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/counselor/unFreezeCounselor.html",
                    {
                        counselor: counselor,
                        yesOrNotList:yesOrNotList
                    }));
                customGlobal.inputInit($templateHtml);

                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initUnFreezeBtn();
            });
        });

        function initFreezeBtn() {

            $("#freezeBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        remark: $.trim($("#remark").val()),
                        peopleId: $.trim($("#id").val())
                    };
                    $.ajax({
                        url: "w/people/counselor/freeze",
                        data: JSON.stringify(data),
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }
            });
        }

        function initUnFreezeBtn() {

            $("#unFreezeBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        remark: $.trim($("#remark").val()),
                        peopleId: $.trim($("#id").val())
                    };
                    $.ajax({
                        url: "w/people/counselor/unFreeze",
                        data: JSON.stringify(data),
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }
            });
        }

        function initUpdateBtn() {
            $("#birthday").change(function () {
                if ($("#birthday").val() != "") {
                    var age = parseInt(year) - parseInt($("#birthday").val().substring(0, 4));
                    $("#age").html("：" + age + "岁");
                }else{
                    $("#age").html("");
                }
            });
            $("#updateBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                if ($("#dialogForm").validate().form()) {
                    customGlobal.blockUI("#modalContent");
                    var sex = document.getElementsByName('sex');
                    var gender;
                    for (var i = 0; i < sex.length; i++) {
                        if (sex[i].checked == true) {//如果选中，下面的alert就会弹出选中的值
                            gender = sex[i].value;
                        }
                    }
                    var password=$.trim($("#password").val());
                    var passWordMD5="";
                    if(password!=""){
                        passWordMD5=password.md5()
                    }
                    var data = {
                        id: $.trim($("#id").val()),
                        userId: $.trim($("#userId").val()),
                        username: $.trim($("#userName").val()),
                        name: $.trim($("#name").val()),
                        nickname: $.trim($("#nickName").val()),
                        password: passWordMD5,
                        gender: gender,
                        nationalityId: $("#nationalityName").getGAutoHiddenValue(),
                        mobilephone: $.trim($("#mobilePhone").val()),
                        isDefault: $("input[name=isDefault]:checked").val(),
                        birthday: $.trim($("#birthday").val()),
                        userType:2,
                        attachmentList: attachmentList
                    };
                    $.ajax({
                        url: "w/people/counselor/",
                        data: JSON.stringify(data),
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }
            });
        }

        /*计算某年某月的天数*/
        function getDaysInMonth(year, month) {
            var date = new Date(year, month, 1);
            return new Date(date.getTime() - 864e5).getDate();
        }

        $table.on("click", "a.view", function () {

            location.href = basePath + "w/people/counselor/" + $(this).attr("id");
        });


        //导入
        $("#importCounselor").on("click", function () {
            $("#modalDialog2").modal("show");
            //上传附件按钮解禁,遮盖层隐藏
            $("#uploadFileBtn").attr("disabled", true);
            $("#closeBtn").attr("disabled", false);
            $("#uploadFileDiv").removeClass("fileinput-exists");
            $("#uploadFileDiv").addClass("fileinput-new");
        });

        $("#uploadFile").fileupload({
            url: "w/people/counselor/importCounselor",
            dataType: 'json',
            autoUpload: false
        }).on("fileuploadadd", function (e, data) {
            $("#titleImageError").html("");
            $("#uploadFileBtn").attr("disabled", false).off("click").on("click", function () {
                //上传附件按钮解禁,遮盖层隐藏
                $("#uploadFileBtn").attr("disabled", true);
                $("#closeBtn").attr("disabled", false);
                customGlobal.blockUI("#modalContent");
                data.submit();
            })
        }).on("fileuploadprocessalways", function (e, data) {
            var index = data.index,
                file = data.files[index];
            if (file.error) {
                $("#titleImageError").html(file.error)
            }
        }).on("fileuploaddone", function (e, data) {
            if (data.result.ok) {
                toast.success(data.result.returnMsg);
                $("#modalDialog2").modal("hide");
                dataTable.reloadTable();
            } else if (data.result.error) {
                var error = data.result.returnMsg;
                error = error.split(",");
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/viewError.html",
                    {
                        error: error
                    }));
                $("#modalDialog").html($templateHtml).modal("show");
                return false;
            } else if (data.result.warn) {
                toast.warn(data.result.returnMsg);
                return true;
            }
        });
    };

    return {
        init: function (nationalityData,yesOrNotListData) {
            handleRecords();
            handleEvent();
            nationality = nationalityData;
            yesOrNotList = yesOrNotListData;
        }
    };
}();
