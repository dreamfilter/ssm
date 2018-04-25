var messageDetailListTable = function () {
    var zTreeObj;
    var zNodes;
    var handleRecords = function () {

        $("#change").click(function () {
            $(".con").addClass("hide");   
            $("#update ,#expressId").removeClass("hide");
            var expressId = $("#expressId").find("option:selected").text();
            var courierId = $("#courierId").val();
        });
        $("#update").click(function () {
            $("#update ,#expressId").addClass("hide");
            $(".con").removeClass("hide");
        });
        
        $("#basicInfo").on("click", function () {
            location.href = basePath + "b/core/user/viewBasicInfo/" + $("#userId").val() + "?menuId=0501";
        });
        $("#accountFlow").on("click", function () {
            location.href = basePath + "b/core/user/viewAccountFlow/" + $("#userId").val() + "?menuId=0501";
        });
        //返回按钮功能实现
        $("#goBack").on("click", function () {
            location.href = basePath + "w/platform/message?menuId=0218";
        });
    };
    var zTreeInit = function (node) {
        node = node == undefined ? zNodes : node;
        zTreeObj = $.fn.zTree.init($("#userDistributorTree"), {
            check: {
                enable: false
            },
            view: {
                showLine: false,
                fontCss : {color:"#337ab7"}
            },
            callback: {
                onClick: zTreeOnClick
            },
            data: {
                key: {
                    name: "usernameShow"
                },
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId"
                }
            }
        }, node);
    };
    function zTreeOnClick(event, treeId, treeNode) {
        location.href = basePath + "b/core/user/viewBasicInfo/" + treeNode.userId + "?menuId=0501";
    }


    return {
        init: function (userDistributorTreeNodes) {
            handleRecords();
            zTreeInit(userDistributorTreeNodes);
        }
    };
}();
