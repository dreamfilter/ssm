var TurnLogObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    var cardList;
    var languageType;
    var dictValue;

    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {
                data.fromUserName = $.trim($("#giveUserNicknameQuery").val());
                data.toUserName = $.trim($("#getUserNicknameQuery").val());
                data.tranTimeFrom = $("#tranTimeQuery").data("from");
                data.tranTimeTo = $("#tranTimeQuery").data("to");
                data.cardName = $.trim($("#cardNameQuery").val());
                data.cardType = $.trim($("#cardTypeQuery").val());
                var $sumPeriodQuery = $("#allSumPeriodQuery");
                data.sumPeriodFrom = $sumPeriodQuery.attr("valueFrom");
                data.sumPeriodTo = $sumPeriodQuery.attr("valueTo");
                var $surplusHourQuery = $("#surplusHourQuery");
                data.remainPeriodFrom = $surplusHourQuery.attr("valueFrom");
                data.remainPeriodTo = $surplusHourQuery.attr("valueTo");
                data.expirationTimeFrom = $("#expirationTimeQuery").data("from");
                data.expirationTimeTo = $("#expirationTimeQuery").data("to");
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/appointment/turnLog/getListPage",
                    type: "POST"

                },
                "columns": [
                    {data: 'fromUserName', orderable: false},
                    {data: 'toUserName', orderable: false},
                    {data: 'transferTime', orderable: false},
                    {data: 'cardName', orderable: false},
                    {
                        data: 'cardType', orderable: false,
                        render: function (data, type, full) {
                            return customGlobal.getDictValue("cardType", data);
                        }
                    },

                    {data: 'sumPeriod', orderable: false},
                    {data: 'remainPeriod', orderable: false},
                    {data: 'expirationTime', orderable: false},
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
        $("#addCard").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/card/addCard.html", {
                cardList: cardList,
                languageType: languageType,
                dictValue: dictValue
            }));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).modal("show");
            onChangeSelect();
            initAddBtn();
        });

        function initAddBtn() {
            $("#addBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    var originalPrice = $.trim($("#originalPrice").val());
                    var presentPrice = $.trim($("#presentPrice").val());
                    if ( parseFloat(originalPrice) < parseFloat(presentPrice)) {
                        toast.error("现价需小于等于原价！");
                        return;
                    }
                    var nianka =  $.trim($("#cardType").val());
                    var sumPeriod = $.trim($("#sumPeriod").val());
                    if(nianka == 5){
                        if(parseFloat(sumPeriod)%6 != 0){
                            toast.error("年卡的课时数应为6的倍数！");
                            return;
                        }
                    }

                    $.ajax({
                        url: "w/goods/card/addCard",
                        data: JSON.stringify({
                            name: $.trim($("#name").val()),
                            cardType: $.trim(nianka),
                            languageId: $.trim($("#languageId").getGAutoHiddenValue()),
                            originalPrice: $.trim(originalPrice),
                            presentPrice: $.trim(presentPrice),
                            validity: $.trim($("#validity").val()),
                            sumPeriod: $.trim(sumPeriod),
                            stock: $.trim($("#stock").val()),
                            introduction: $.trim($("#introduction").val())

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

        $table.on("click", "a.edit", function () {
            $.get("w/goods/card/" + $(this).attr("id"), function (data) {
                var card = data.returnData.card;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/card/updateCard.html",
                    {
                        languageType: languageType,
                        card: card,
                        dictValue: dictValue
                    }));

                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).modal("show");
                if (card.cardType != 1) {
                    $("#validity").removeAttr("readonly");
                }

                var type = $("#cardType").find("option:selected").val();
                if (type == 1) {
                    $("#validity").attr("readonly", "readonly");
                    $("#validity").removeAttr("required");
                    $("#validity").val("");
                    $("#sumPeriod").attr("readonly", "readonly");
                    $("#sumPeriod").val("0.5");

                } else {
                    $("#validity").removeAttr("readonly");
                    $("#validity").attr("required", "required");
                    $("#sumPeriod").removeAttr("readonly");
                }

                if(type == 2){
                    $("#validity").attr("readonly", "readonly");
                    $("#validity").removeAttr("required");
                    $("#validity").val("");
                }
                onChangeSelect();
                initUpdateBtn();

            });

        });


        function initUpdateBtn() {
            $("#updateBtn").on("click", function () {
                if ($("#dialogForm").validate().form()) {
                    var originalPrice = $.trim($("#originalPrice").val());
                    var presentPrice = $.trim($("#presentPrice").val());
                    if ( parseFloat(originalPrice) < parseFloat(presentPrice)) {
                        toast.error("现价需小于等于原价！");
                        return;
                    }
                    var nianka =  $.trim($("#cardType").val());
                    var sumPeriod = $.trim($("#sumPeriod").val());
                    if(nianka == 5){
                        if(parseFloat(sumPeriod)%6 != 0){
                            toast.error("年卡的课时数应为6的倍数！");
                            return;
                        }
                    }

                    if(nianka ==1){
                        $("#sumPeriod").removeAttr("range");
                    }
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        cardId: $.trim($("#cardId").val()),
                        name: $.trim($("#name").val()),
                        cardType: $.trim(nianka),
                        languageId: $.trim($("#languageId").getGAutoHiddenValue()),
                        originalPrice: $.trim(originalPrice),
                        presentPrice: $.trim(presentPrice),
                        validity: $.trim($("#validity").val()),
                        sumPeriod: $.trim(sumPeriod),
                        stock: $.trim($("#stock").val()),
                        introduction: $.trim($("#introduction").val()),
                        id: $.trim($("#id").val())
                    };

                    $.ajax({
                        url: "w/goods/card",
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


        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/goods/card/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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


    };

    return {
        init: function (counselorData, languageTypeData, dictValueData) {
            handleRecords();
            handleEvent();

            cardList = counselorData;
            languageType = languageTypeData;
            dictValue = dictValueData;

        }
    };
}();

function original() {
    $("#originalPrice").bind("input propertychange change", function (event) {
        $("#dialogForm").validate().form();
    });
}

function onChangeSelect(){
    $("#cardType").on("change", function (event) {
        ctx();
    });
}


function ctx() {
    var type = $("#cardType").find("option:selected").val();
    if (type == 1) {
        $("#validity").attr("disabled", "disabled");
        $("#sumPeriod").attr("disabled", "disabled");
        $("#validity").removeAttr("required");
        $("#sumPeriod").removeAttr("required");
        $("#validity").val("");
        $("#sumPeriod").val("0.5");
        $("#sumPeriod").parent().parent().removeClass("has-error");
        $("#sumPeriod").next().html("");
        $("#sumPeriod").attr("data-i-type","float");
    }else {
        $("#validity").removeAttr("disabled");
        $("#validity").attr("required", "required");
        $("#sumPeriod").removeAttr("disabled");
        $("#sumPeriod").attr("required", "required");
        $("#validity").removeAttr("readonly");
        $("#sumPeriod").removeAttr("readonly");
        $("#sumPeriod").attr("data-i-type","int");
    }
    if(type == 2){
        $("#validity").attr("disabled", "disabled");
        $("#validity").removeAttr("required");
        $("#validity").val("");
        $("#sumPeriod").val("");
        $("#sumPeriod").removeAttr("readonly");
        $("#sumPeriod").removeAttr("disabled");
        $("#sumPeriod").attr("data-i-type","int");
    }
    if(type == 5){
        $("#sumPeriod").val("");
    }
}








