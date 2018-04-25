var studentDetailObj = function () {
    var handleRecords = function () {

        $("#change").click(function () {
            $(".con").addClass("hide");   
            $("#update ,#counselorId").removeClass("hide");
            var counselorId = $("#counselorId").getGAutoHiddenValue();
        });
        var flag=true;
        $("#update").click(function () {
            validatePlace();
            if ($("#dialogForm").validate().form()) {
                if(flag){
                    flag=false;
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        id: $("#id").val(),
                        counselorId: $("#counselorId").getGAutoHiddenValue()
                    };
                    $.ajax({
                        url: "w/people/studentList/updateCounselor/",
                        data: JSON.stringify(data),
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(function (data) {
                        if (customGlobal.ajaxCallback(data)) {
                            flag=true;
                            $("#modalDialog").modal("hide");
                            location.href = basePath + "w/people/studentList/studentListDetail/" + $("#id").val() + "?menuId=020601";
                        }
                    });
                }
            }
        });

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
    };

    //更改必填校验的提示位置
    function validatePlace() {
        $.validator.setDefaults({
            errorPlacement: function (error, element) {//error为错误提示对象，element为出错的组件对象
                if (element.is(":text")) {
                    $("#js-update").parent().addClass("has-error");
                    error.css("display", "block").appendTo(element.parent().parent());
                } else {
                    element.after(error);//默认是加在 输入框的后面。这个else必须写。不然其他非radio的组件 就无法显示错误信息了。
                }
            },
            success:function(){
                $("#js-update").parent().removeClass("has-error");
            }
        });
    }
    return {
        init: function () {
            handleRecords();
        }
    };
}();
