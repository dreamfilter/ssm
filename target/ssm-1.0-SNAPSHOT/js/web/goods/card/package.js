var packageObj = function () {

    var dataTable;
    var $table = $("#dataTable");
    var cardList;
    var languageType;
    var dictValue;
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
            tableName: 'g_package',
            attachmentType: '1'
        },
        initTypes: '1'
    };
    var attachmentList = [];
    /**
     * dataTable事件初始化方法
     */
    var handleRecords = function () {
        dataTable = new Datatable();
        dataTable.init({
            src: $table,
            onQuery: function (data) {

                data.name = $.trim($("#nameQuery").val());
                var $validityQuery = $("#validityQuery");
                data.validityFrom = $validityQuery.attr("valueFrom");
                data.validityTo = $validityQuery.attr("valueTo");
                var $sumPeriodQuery = $("#sumPeriodQuery");
                data.sumPeriodFrom = $sumPeriodQuery.attr("valueFrom");
                data.sumPeriodTo = $sumPeriodQuery.attr("valueTo");
                var $originalPriceQuery = $("#originalPriceQuery");
                data.originalPriceFrom = $originalPriceQuery.attr("valueFrom");
                data.originalPriceTo = $originalPriceQuery.attr("valueTo");
                var $presentPriceQuery = $("#presentPriceQuery");
                data.presentPriceFrom = $presentPriceQuery.attr("valueFrom");
                data.presentPriceTo = $presentPriceQuery.attr("valueTo");
                data.useStatus = $("#useStatusQuery").val();
            },
            dataTable: {
                order: [],
                "ajax": {
                    "url": "w/goods/package/getPackageListPage",
                    type: "POST"

                },
                "columns": [
                    {data: 'name', orderable: false},
                    {data: 'validity', orderable: false},
                    {
                        data: 'sumPeriod', orderable: false,
                        render: function (data, type, full) {
                            return data.toFixed(1);
                        }
                    },
                    {
                        data: 'originalPrice', orderable: false,
                        render: function (data, type, full) {
                            return data.toFixed(2);
                        }
                    },
                    {
                        data: 'presentPrice', orderable: false,
                        render: function (data, type, full) {
                            return data.toFixed(2);
                        }
                    },

                    {
                        data: 'useStatus', orderable: false,
                        render: function (data, type, full) {
                            return customGlobal.getDictValue("useStatus", data);
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
        $("#addPackage").on("click", function () {
            var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/card/addPackage.html", {
                cardList: cardList,
                languageType: languageType,
                dictValue: dictValue
            }));
            customGlobal.inputInit($templateHtml);
            $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                imgUpload1.init(imgOptions1);
            }).modal('show');
            initFunction();
            initAddBtn();
        });

        function initAddBtn() {
            $("#addBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                if ($("#dialogForm").validate().form()) {
                    var originalPrice = $.trim($("#originalPrice").val());
                    var presentPrice = $.trim($("#presentPrice").val());
                    if (parseFloat(originalPrice) < parseFloat(presentPrice)) {
                        toast.error("现价需小于等于原价！");
                        return;
                    }
                    var sumPeriod = $.trim($("#sumPeriod").val());
                    var list = [];
                    $("tr.formContact").each(function () {
                        var $this = $(this);
                        var contact = {
                            partPeriod: $this.find("td.partPeriod").find("input").val(),
                            languageId: $this.find("td.languageId").find("input").getGAutoHiddenValue()
                        };
                        list.push(contact);
                    });
                    if (list.length <= 0) {
                        toast.error("请选择套餐内容");
                        return;
                    }
                    for (var i=0;i<list.length;i++){
                        var partPeriods=list[i].partPeriod;
                        if (partPeriods==0){
                            toast.error("授课语言课时数不能为零!");
                            return;
                        }
                    }
                    if (list.length>=2){
                        var languageList =[];
                        for (var i=0;i<list.length;i++){
                            languageList.push(list[i].languageId);
                        }
                      var newList= languageList.sort();
                        for (var i = 0; i < languageList.length; i++) {
                            if (newList[i]== newList[i + 1]) {
                                toast.error("套餐中授课语言不能重复，请重新选择");
                                return;
                            }
                        }
                    }
                    if (attachmentList.length <= 0) {
                        toast.error("请上传套餐图片");
                        return;
                    }
                    customGlobal.blockUI("#modalContent");
                    $.ajax({
                        url: "w/goods/package/addPackage",
                        data: JSON.stringify({
                            name: $.trim($("#comboName").val()),
                            originalPrice: $.trim(originalPrice),
                            presentPrice: $.trim(presentPrice),
                            validity: $.trim($("#validity").val()),
                            sumPeriod: $.trim(sumPeriod),
                            introduction: $.trim($("#introduction").val()),
                            packageDtsList: list,
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

        $table.on("click", "a.edit", function () {
            $.get("w/goods/package/" + $(this).attr("id"), function (data) {
                var package = data.returnData.package;
                var languageType = data.returnData.languageType;
                console.log(package);
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/card/updatePackage.html",
                    {
                        packageList: package,
                        languageType: languageType
                    }));

                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    imgUpload1.init(imgOptions1);
                    imgUpload1.showAttachmentList(package.id);
                }).modal('show');
                initFunction();
                initUpdateBtn();
                initDeleteContact();

            });

        });


        function initUpdateBtn() {
            $("#updateBtn").on("click", function () {
                attachmentList = imgUpload1.getAttachmentList();
                if ($("#dialogForm").validate().form()) {
                    var originalPrice = $.trim($("#originalPrice").val());
                    var presentPrice = $.trim($("#presentPrice").val());
                    if (parseFloat(originalPrice) < parseFloat(presentPrice)) {
                        toast.error("现价需小于等于原价！");
                        return;
                    }
                    if (attachmentList.length <= 0) {
                        toast.error("请上传套餐图片");
                        return;
                    }
                    var sumPeriod = $.trim($("#sumPeriod").val());
                    var list = [];
                    $("tr.formContact").each(function () {
                        var $this = $(this);
                        var contact = {
                            partPeriod: $this.find("td.partPeriod").find("input").val(),
                            languageId: $this.find("td.languageId").find("input").getGAutoHiddenValue()
                        };
                        list.push(contact);
                    });

                    if (list.length <= 0) {
                        toast.error("请选择套餐内容");
                        return;
                    }
                    for (var i=0;i<list.length;i++){
                        var partPeriods=list[i].partPeriod;
                        if (partPeriods==0){
                            toast.error("授课语言课时数不能为零!");
                            return;
                        }
                    }
                    if (list.length>=2){
                        var languageList =[];
                        for (var i=0;i<list.length;i++){
                            languageList.push(list[i].languageId);
                            }
                        var newList= languageList.sort();
                        for (var i = 0; i < languageList.length; i++) {
                            if (newList[i]== newList[i + 1]) {
                                toast.error("套餐中授课语言不能重复，请重新选择");
                                return;
                            }
                        }
                    }
                    customGlobal.blockUI("#modalContent");
                    var data = {
                        name: $.trim($("#comboName").val()),
                        originalPrice: $.trim(originalPrice),
                        presentPrice: $.trim(presentPrice),
                        validity: $.trim($("#validity").val()),
                        sumPeriod: $.trim(sumPeriod),
                        introduction: $.trim($("#introduction").val()),
                        id: $.trim($("#id").val()),
                        packageDtsList: list,
                        attachmentList: attachmentList
                    };

                    $.ajax({
                        url: "w/goods/package",
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

        $table.on("click", "a.view", function () {
            $.get("w/goods/package/" + $(this).attr("id"), function (data) {
                var package = data.returnData.package;
                var languageType = data.returnData.languageType;
                var $templateHtml = $(customGlobal.remoteTemplate("template/web/goods/card/viewPackage.html",
                    {
                        packageList: package,
                        languageType: languageType
                    }));
                customGlobal.inputInit($templateHtml);
                $("#modalDialog").html($templateHtml).off('shown.bs.modal').on('shown.bs.modal', function () {
                    imgUpload1.init(imgOptions1);
                    imgUpload1.showAttachmentList(package.id);
                }).modal('show');
            });
        });

        $table.on("click", "a.delete", function () {
            var $this = $(this);
            customGlobal.showConfirm();
            $("#confirmBtn").on("click.deleteRow", function () {
                $.ajax({
                    url: "w/goods/package/" + $table.DataTable().row($this.parents('tr')[0]).data().id,
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

        var initFunction = function () {
            addFunction();
            $.iType();
            $("#addContactBtn").on("click", function () {
                var length = $("#contactTable tr").length;
                if (length > 5) {
                    toast.error("最多只能添加5种语言");
                    return;
                }
                var contactTd = " <tr class=\"formContact\">\n";
                var contactDutyTd ="<td class='languageId form-group'> <input type='text' class='form-control form-filter' name='languageId " + length +"'" +
                    "required data-gautoflag='gAutoTeachLanguage' data-req-url='customAutoComplete/gAutoTeachLanguage' autoCompleteRequired='true'  placeholder='授课语言'>" +
                    "</td>";
                var contactIsDefaultTd = "<td class='partPeriod  form-group'><input type='test' class='partPeriod form-control form-filter'data-i-type='int' " +
                    "positive='positive'" +
                    " name='partPeriod" + length +"' min='0' max='99999' required style='width: 100%' placeholder='课时'></td>"

                var operate = "<td>  <div class=\"col-md-8\"><a class = \"deleteContactBtn btn btn-outline btn-xs red" +
                    " \"" +
                    " id=\"deleteContactBtn\"><i class='fa fa-times'></i>删除</a></td></div></tr>";
                var tr = contactTd + contactDutyTd + contactIsDefaultTd + operate;
                $("#contactBody").append(tr);
                initDeleteContact();
                //goolge框初始化
                $.gAuto();
                //校验 初始化 data-i-type="int" min="1" positive="positive"
                $.iType();
            });
        };

        var addFunction = function () {

            $("#contactBody ").on("change", ".partPeriod", function () {
                var addList = [];
                $("#contactBody .formContact").each(function () {
                    var $this = $(this);
                    var partPeriod = $this.find("td.partPeriod").find("input").val()
                    if (partPeriod == '') {
                        partPeriod = 0;
                    }
                    var contact = {
                        partPeriod: partPeriod,
                    };
                    addList.push(contact);

                });
                var allClassTime = 0;
                for (var i in addList) {
                    allClassTime += parseFloat(addList[i].partPeriod);
                }
                $("#sumPeriod").val(allClassTime).attr("disabled", "disabled");

            })

        };

        var initDeleteContact = function () {
            $("a.deleteContactBtn").on("click", function () {
                $(this).parent().parent().parent().remove();

                var addList = [];
                $("#contactBody .formContact").each(function () {
                    var $this = $(this);
                    var partPeriod = $this.find("td.partPeriod").find("input").val()
                    if (partPeriod == '') {
                        partPeriod = 0;
                    }
                    var contact = {
                        partPeriod: partPeriod,
                    };
                    addList.push(contact);

                });
                var allClassTime = 0;
                for (var i in addList) {
                    allClassTime += parseFloat(addList[i].partPeriod);
                }
                $("#sumPeriod").val(allClassTime).attr("disabled", "disabled");
            });
        }
    };

    return {
        init: function (languageTypeData) {
            handleRecords();
            handleEvent();
            languageType = languageTypeData;
        }
    };
}();

function original() {
    $("#originalPrice").bind("input propertychange change", function (event) {
        $("#dialogForm").validate().form();
    });

}








