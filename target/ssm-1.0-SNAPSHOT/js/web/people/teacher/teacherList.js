var teacherObj = function () {
    var dataTable;
    var $table = $("#dataTable");
    var yesOrNotList, teacherTypeList, genderList, languageList;
    var date = new Date;
    var year = date.getFullYear();//当前年；用于计算教龄和年龄
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.name = jQuery.trim($("#nameQuery").val());
                data.username = jQuery.trim($("#usernameQuery").val());
                data.mobilephone = jQuery.trim($("#mobilephoneQuery").val());
                data.type = jQuery.trim($("#typeQuery").val());
                data.isAudition = jQuery.trim($("#isAuditionQuery").val());
                data.isShowTop = jQuery.trim($("#isShowTopQuery").val());
                data.isOnduty = jQuery.trim($("#isOndutyQuery").val());
                data.freezeStatus = jQuery.trim($("#statusQuery").val());
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/people/teacherList/getTeacherListPage"
                },
                "columns": [
                    {data: 'name', orderable: false},
                    {data: 'username', orderable: false},
                    {data: 'mobilephone', orderable: false},
                    {
                        data: 'type', orderable: false, render: function (data, type, full) {
                        return customGlobal.getDictValue("teacherType", data);
                    }
                    },
                    {
                        data: 'isAudition', orderable: false, render: function (data, type, full) {
                        return customGlobal.getDictValue("yesOrNot", data);
                    }
                    },
                    {
                        data: 'isShowTop', orderable: false, render: function (data, type, full) {
                        return customGlobal.getDictValue("yesOrNot", data);
                    }
                    },
                    {
                        data: 'isOnduty', orderable: false, render: function (data, type, full) {
                        return customGlobal.getDictValue("teacherStatus", data);
                    }
                    },
                    {
                        data: 'status', orderable: false, render: function (data, type, full) {
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

    /*头像上传*/
    var fileUploadHeadPic = new FileUpload();
    var optionsHeadPic = {
        server: basePath + 'b/core/attachment',
        pick: {
            id: '#headPic',
            multiple: false
        },
        dialogContainer: $("#dialogForm"),
        fileNumLimit: 1,
        resize: false,// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'
        },
        duplicate: true,
        auto: true,
        formData: {
            tableName: 'p_teacher',
            attachmentType: '1'
        },
        initTypes: '1'
    };

    var handleEvent = function () {
        $("#addTeacher").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/addTeacher.html", {
                yesOrNotList: yesOrNotList,
                teacherTypeList: teacherTypeList,
                genderList: genderList,
                languageList: languageList
            }));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                fileUploadHeadPic.init(optionsHeadPic);
            }).modal('show');
            $('#teachLanguage').select2();
            initAddBtn();
            $("#teachingDate").datepicker("setEndDate", new Date());
            /*教师的必须满18岁，过出生日期为当前日期的18年前*/
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
            $("#teachingDate").change(function () {
                if ($("#teachingDate").val() != "") {
                    var teachAge = parseInt(year) - parseInt($("#teachingDate").val());
                    $("#teachingAge").html("：" + teachAge + "年");
                } else {
                    $("#teachingAge").html("");
                }
            });
            $("#birthday").change(function () {
                if ($("#birthday").val() != "") {
                    var age = parseInt(year) - parseInt($("#birthday").val().substring(0, 4));
                    $("#age").html("：" + age + "岁");
                } else {
                    $("#age").html("");
                }
            });
            $("#addBtn").on("click", function () {
                validatePlace();
                if ($("#dialogForm").validate().form()) {
                    var headPicAttachmentList = fileUploadHeadPic.getAttachmentList();
                    customGlobal.blockUI("#modalContent");
                    $.ajax({
                        url: "w/people/teacherList",
                        data: JSON.stringify({
                            username: $.trim($("#username").val()),
                            name: $.trim($("#name").val()),
                            password: $.trim($("#password").val()).md5(),
                            nickname: $.trim($("#nickName").val()),
                            gender: $("input[name=sex]:checked").val(),
                            teachingDate: $.trim($("#teachingDate").val()),
                            type: $("input[name=type]:checked").val(),
                            teachLanguage: $.trim($("#teachLanguage").val()),
                            nationalityId: $("#nationality").getGAutoHiddenValue(),
                            isAudition: $("input[name=isAudition]:checked").val(),
                            isShowTop: $("input[name=idShow]:checked").val(),
                            education: $.trim($("#education").val()),
                            experience: $.trim($("#experience").val()),
                            birthday: $.trim($("#birthday").val()),
                            mobilephone: $.trim($("#mobilePhone").val()),
                            userType: 3,
                            isOnduty: 1,
                            attachmentList: headPicAttachmentList
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

        $table.on("click", "a.view", function () {
            location.href = basePath + "w/people/teacherList/teacherListDetail/" + $(this).attr("teacherId") + "?menuId=020801";
        });

        $table.on("click", "a.freeze", function () {
            var $this = $(this);
            $.get("w/people/teacherList/" + $table.DataTable().row($this.parents('tr')[0]).data().id, function (data) {
                var teacher = data.returnData.teacher;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/freezeTeacher.html",
                    {
                        teacher: teacher
                    }));
                customGlobal.inputInit($templateHtml);

                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                }).modal('show');
                initFreezeBtn();
            });
        }).on("click", "a.unFreeze", function () {
            var $this = $(this);
            $.get("w/people/teacherList/" + $table.DataTable().row($this.parents('tr')[0]).data().id, function (data) {
                var teacher = data.returnData.teacher;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/unFreezeTeacher.html",
                    {
                        teacher: teacher
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
                        url: "w/people/teacherList/freeze",
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
                        url: "w/people/teacherList/unFreeze",
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
        $table.on("click", "a.edit", function () {
            $.get("w/people/teacherList/" + $(this).attr("teacherId"), function (data) {
                var teacher = data.returnData.teacher;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/updateTeacher.html", {
                    yesOrNotList: yesOrNotList,
                    teacherTypeList: teacherTypeList,
                    genderList: genderList,
                    languageList: languageList,
                    teacher: teacher
                }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    fileUploadHeadPic.init(optionsHeadPic);
                    fileUploadHeadPic.showAttachmentList(teacher.id);
                }).modal('show');
                var $teachLanguageId = $("#teachLanguage");
                $teachLanguageId.find("option").removeAttr("selected");
                var teachLanguageList = data.returnData.teachLanguageList;

                for (var i = 0; i < teachLanguageList.length; i++) {
                    var str = "option[value=" + teachLanguageList[i].id + "]";
                    $teachLanguageId.find(str).attr("selected", "selected")
                }
                $teachLanguageId.select2();
                initUpdateBtn();
                $("#teachingDate").datepicker("setEndDate", new Date());
                var begin=new Date();
                var s=new Date(begin.setYear((new Date().getFullYear()-18)));
                var beginDay= s.getFullYear() + '-12-' + getDaysInMonth(s.getFullYear(),12);
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

        /*计算某年某月的天数*/
        function getDaysInMonth(year, month) {
            var date = new Date(year, month, 1);
            return new Date(date.getTime() - 864e5).getDate();
        }

        function initUpdateBtn() {
            $("#teachingDate").change(function () {
                if ($("#teachingDate").val() != "") {
                    var teachAge = parseInt(year) - parseInt($("#teachingDate").val());
                    $("#teachingAge").html("：" + teachAge + "年");
                } else {
                    $("#teachingAge").html("");
                }
            });
            $("#birthday").change(function () {
                if ($("#birthday").val() != "") {
                    var age = parseInt(year) - parseInt($("#birthday").val().substring(0, 4));
                    $("#age").html("：" + age + "岁");
                } else {
                    $("#age").html("");
                }
            });
            $("#updateBtn").on("click", function () {
                validatePlace();
                if ($("#dialogForm").validate().form()) {
                    var headPicAttachmentList = fileUploadHeadPic.getAttachmentList();
                    customGlobal.blockUI("#modalContent");
                    var password = $.trim($("#password").val());
                    var passWordMD5 = "";
                    if (password != "") {
                        passWordMD5 = password.md5()
                    }
                    $.ajax({
                        url: "w/people/teacherList",
                        data: JSON.stringify({
                            id: $.trim($("#id").val()),
                            userId: $.trim($("#userId").val()),
                            username: $.trim($("#username").val()),
                            name: $.trim($("#name").val()),
                            password: passWordMD5,
                            nickname: $.trim($("#nickName").val()),
                            gender: $("input[name=sex]:checked").val(),
                            teachingDate: $.trim($("#teachingDate").val()),
                            type: $("input[name=type]:checked").val(),
                            teachLanguage: $.trim($("#teachLanguage").val()),
                            nationalityId: $("#nationality").getGAutoHiddenValue(),
                            isAudition: $("input[name=isAudition]:checked").val(),
                            isShowTop: $("input[name=idShow]:checked").val(),
                            education: $.trim($("#education").val()),
                            experience: $.trim($("#experience").val()),
                            birthday: $.trim($("#birthday").val()),
                            mobilephone: $.trim($("#mobilePhone").val()),
                            userType: 3,
                            attachmentList: headPicAttachmentList
                        }),
                        contentType: "application/json; charset=utf-8",
                        type: "put",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }
            })
        }

        var flag = true;
        $table.on("click", "a.delete", function () {
            if (flag) {
                flag=false;
                var teacherId = $(this).attr("teacherId");
                $.get("w/people/teacherList/lesson/" + teacherId, function (data) {
                    var lessonList = data.returnData.lessonList;
                    if (lessonList.length == 0) {
                        var $templateHtml1 = $(customGlobal.remoteTemplate("template/core/common/eventConfirm.html", {confirmContent: i18n.common.deletePrompt}));
                        customGlobal.inputInit($templateHtml1);
                        flag = true;
                        $("#modalDialog").html($templateHtml1).modal("show");
                        $("#confirmBtn").on("click.deleteRow", function () {
                            customGlobal.blockUI("#modalContent");
                            $.ajax({
                                url: "w/people/teacherList/" + teacherId,
                                type: "DELETE",
                                dataType: "json"
                            }).done(function (data) {
                                $("#modalDialog").modal("hide");
                                if (customGlobal.ajaxCallback(data)) {
                                    dataTable.reloadTable();
                                }
                            })
                        })
                    } else {
                        var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/viewLesson.html", {i18n: i18n}));
                        customGlobal.inputInit($templateHtml);
                        flag = true;
                        $("#modalDialog").html($templateHtml).modal("show");
                        initLessonDataTable(teacherId);
                    }
                });
            }

        });

        /*请假*/
        $table.on("click", "a.leave", function () {
            var teacherId = $(this).attr("teacherId");
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/leave.html", {i18n: i18n}));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).modal("show");
            $("#id").val(teacherId);
            initLeaveBtn();
            $("#startDate").datepicker("setStartDate", new Date());
            $("#endDate").datepicker("setStartDate", new Date());
            $(".js-date").change(function () {
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var days = intervalDays(startDate, endDate);
                if (startDate != "" && endDate != "") {
                    if (days <= 0) {
                        toast.error("结束日期不能小于等于开始日期！")
                    } else {
                        var data = {
                            teacherId: teacherId,
                            startTime: startDate,
                            endTime: endDate
                        };
                        $.ajax({
                            url: "w/people/teacherList/leave",
                            data: JSON.stringify( {
                                teacherId: teacherId,
                                startTime: new Date(startDate).dateMinuteFormat(),
                                endTime: new Date(endDate).dateMinuteFormat()
                            }),
                            contentType: "application/json; charset=utf-8",
                            type: "post",
                            dataType: "json"
                        }).done(function () {
                            $("#js-lesson").removeClass("hide");
                            $("#leaveBtn").attr("disabled",false);
                            initLessonDataTableForLeave(data);
                        });
                    }
                }
            });
        });

        function initLeaveBtn() {
            $("#leaveBtn").on("click", function () {
                customGlobal.blockUI("#modalContent");
                var startDate = $("#startDate").val();
                var endDate = $("#endDate").val();
                var teacherId = $("#id").val();
                if (startDate != "" && endDate != "") {
                    var data = {
                        teacherId: teacherId,
                        startTime: new Date(startDate).dateMinuteFormat(),
                        compensationValue: $("#js-lesson table tr:eq(1) td:eq(2)").html(),
                        endTime: new Date(endDate).dateMinuteFormat()
                    };
                    $.ajax({
                        url: "w/people/teacherList/saveLeave",
                        data: JSON.stringify(data),
                        contentType: "application/json; charset=utf-8",
                        type: "post",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            $("#modalDialog").modal("hide");
                            dataTable.reloadTable();
                        }
                    });
                }else{
                    toast.error("开始日期和结束日期不能为空！")
                }
            })
        }

        /*两个日期相差的天数*/
        function intervalDays(startDate, endDate) {
            var startDateShow = startDate,
                endDateShow = endDate;
            startDateShow = new Date(startDateShow.replace(/-/g, "/"));
            endDateShow = new Date(endDateShow.replace(/-/g, "/"));
            var times = endDateShow.getTime() - startDateShow.getTime();
            return parseInt(times / (1000 * 60 * 60 * 24)) + 1;
        }

        /*导入教师*/
        $("#importTeacher").on("click", function () {
            $("#modalDialog").modal("show");
            //上传附件按钮解禁,遮盖层隐藏
            $("#uploadFileBtn").attr("disabled", true);
            $("#closeBtn").attr("disabled", false);
            $("#uploadFileDiv").removeClass("fileinput-exists").addClass("fileinput-new");
        });

        $("#uploadFile").fileupload({
            url: "w/people/teacherList/importTeacher",
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
                $("#modalDialog").modal("hide");
                dataTable.reloadTable();
            } else if (data.result.error) {
                var error = data.result.returnMsg;
                error = error.split(",");
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/people/teacher/viewError.html",
                    {
                        error: error
                    }));
                $("#modalDialog2").html($templateHtml).modal("show");
                return false;
            } else if (data.result.warn) {
                toast.warn(data.result.returnMsg);
                return true;
            }
        });
    };


    //删除 获取未上课记录列表
    var initLessonDataTable = function (teacherId) {
        var dataTableTeam;
        var $subjectTable = $("#browseDataTable");
        dataTableTeam = new Datatable();
        dataTableTeam.init({
            src: $subjectTable,
            dataTable: {
                "order": [],
                "mDataProp": null,
                "destroy": true,
                "ajax": {
                    "url": basePath + "w/people/teacherList/lesson/getLessonListPage/" + teacherId
                },
                "columns": [
                    {
                        data: 'nickname', orderable: false
                    },
                    {
                        data: 'lessonTime', orderable: false
                    }
                ]
            }
        });
    };

    //请假 获取未上课记录列表
    var initLessonDataTableForLeave = function (data) {
        var searchData = data;
        var dataTableForLeave;
        var $leaveTable = $("#browseDataTable1");
        dataTableForLeave = new Datatable();
        dataTableForLeave.init({
            src: $leaveTable,
            onQuery: function (data) {
                $.extend(data, searchData);
            },
            dataTable: {
                "order": [],
                "mDataProp": null,
                "destroy": true,
                "ajax": {
                    url: basePath + "w/people/teacherList/leave/getLessonListPage"
                },
                "columns": [
                    {
                        data: 'nickname', orderable: false
                    },
                    {
                        data: 'lessonTime', orderable: false
                    },
                    {
                        data: 'compensationValue', orderable: false
                    }
                ]
            }
        });
    };

    //更改必填校验的提示位置
    function validatePlace() {
        $.validator.setDefaults({
            errorPlacement: function (error, element) {//error为错误提示对象，element为出错的组件对象
                if (element.is(":radio")) {
                    error.css("display", "block").appendTo(element.parent().parent());
                } else {
                    error.css("display", "block").appendTo(element.parent());
                }
            },
            success:function (error) {
                error.css("display","none !important");
            }
        });
    }

    return {
        init: function (yesOrNotListData, teacherTypeListData, genderListData, languageListData) {
            handleRecords();
            handleEvent();
            yesOrNotList = yesOrNotListData;
            teacherTypeList = teacherTypeListData;
            genderList = genderListData;
            languageList = languageListData;
        }
    };
}();
