var context;
var basePath = (function () {
    var url = window.location + "";
    var h = url.split("//");
    var x = h[1].split("/");
    context = x[1];
    return h[0] + "//" + window.location.host + "/" + x[1] + "/";
})();
var customGlobal = function () {
    var _menu = function () {
        function _initMenuDom() {
            var dtd = $.Deferred();
            var $sidebarWrapper = $(".page-sidebar-menu");
            if ($sidebarWrapper.size() == 1) {
                //requestNo为判断当前是否是第一次载入菜单用的，在sidebar.jsp中声明的。
                if (requestNo > 1) {
                    $sidebarWrapper.html(localStorage[context + "SidebarHtml"]);
                    dtd.resolve();
                } else {
                    $.ajax({
                        url: basePath + "b/core/menu/sidebarData"+"?random="+Math.random(),
                        dataType: "json",
                        type: "get"
                    }).done(function (data) {
                        var sidebarData = data.returnData;
                        sidebarData.basePath = basePath;
                        var sidebarHtml = customGlobal.remoteTemplate("template/core/common/sidebar.html", sidebarData);
                        localStorage[context + "SidebarHtml"] = sidebarHtml;
                        $sidebarWrapper.html(sidebarHtml);
                        dtd.resolve();
                    });
                }
            }
            return dtd.promise();
        }

        function _menuSearch(menuId) {
            $.post("b/core/menu/menuSearch", {menuId: menuId})
                .done(function (data) {
                    if (data.ok) {
                        location.href = data.returnData.url;
                    } else if (data.error) {
                        toast.error(data.returnMsg);
                        return false;
                    }
                })
        }

        function _initMenuStyle() {
            var $activeMenu = $("#menu_" + $("#menuId").val()).addClass("active");
            $activeMenu.parents("li.level1-menu").addClass("active open").find("a.level1-menu span.arrow").addClass("open");
            $activeMenu.parents("li.level2-menu").addClass("active open").find("a.level2-menu span.arrow").addClass("open");
            if ($("body").hasClass('page-sidebar-closed')) {
                $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
            }
        }

        function _initMenuSearch() {
            var $menuSearch = $("#menuSearch");
            $menuSearch.gAuto({
                hasShowAllBtn: false,
                staticWithScroll: true
            }).on("keydown", function (e) {
                var $this = $(this);
                var menuId = $this.getGAutoHiddenValue();
                if (e.which == 13 && menuId != undefined && menuId != "") {
                    e.preventDefault();
                    _menuSearch(menuId);
                }
            });
            $("#menuSearchBtn").on("click", function () {
                var menuId = $menuSearch.getGAutoHiddenValue();
                if (menuId != undefined && menuId != "") {
                    _menuSearch(menuId)
                }
            });
        }

        return {
            init: function () {
                $.when(_initMenuDom())
                    .done(function () {
                        _initMenuStyle();
                        _initMenuSearch();
                    });
            }
        };
    }();
    var _artTemplate = function () {
        var _templateCache = {};
        return {
            init: function () {
                template.helper('dictValueFormat', function (dictCode, dictName) {
                    return customGlobal.getDictValue(dictName, dictCode);
                });
            },
            remoteTemplate: function (url, data) {
                var render = _templateCache[url];
                if (render == undefined || render == null) {
                    $.ajax({
                        url: basePath + url,
                        dataType: "html",
                        type: "get",
                        async: false
                    }).done(function (html) {
                        render = template.compile(html);
                        _templateCache[url] = render;
                    });
                }
                data = data || {};
                data.i18n = i18n;
                return render(data);
            }
        }
    }();
    var _blockUI = function () {
        var _blockUITarget = [];
        return {
            show: function (target) {
                if (target !== undefined) {
                    _blockUITarget.push(target);
                    App.blockUI({
                        target: target,
                        boxed: true,
                        message: i18n.common.loading
                    });
                } else {
                    App.blockUI({
                        boxed: true,
                        message: i18n.common.loading
                    });
                }
            },
            hide: function (target) {
                if (target) {
                    App.unblockUI(target);
                } else {
                    App.unblockUI(_blockUITarget.pop());
                }
            },
            getBlockUITarget: function () {
                return _blockUITarget[_blockUITarget.length - 1]
            }
        }
    }();
    var _dictValuesObj = {
        getDictValue: function (dictName, dictCode) {
            if (dictName == undefined || dictName == null || dictCode == undefined || dictCode == null) {
                return "";
            }
            var dict = dictValues[dictName];
            if (dict != undefined) {
                var result = dict[dictCode];
                return result == undefined ? "" : result
            }
            return "";
        },
        getDictValuesByName: function (dictName) {
            return dictValues[dictName + "List"];
        }
    };

    /**
     *此函数为了处理firefox及chrome中，在弹出的窗口中点击ckeditor的上传图片，显示的input无法获取光标的问题
     */
    function _initCkeditor() {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
            modal_this = this;
            $(document).on('focusin.modal', function (e) {
                if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
                    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select')
                    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                    modal_this.$element.focus()
                }
            })
        };
    }

    function _initJqueryAjax() {
        $.ajaxSetup({
            cache: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.responseJSON) {
                    toast.error(XMLHttpRequest.responseJSON.returnMsg);
                } else if (XMLHttpRequest.status != 0) {
                    toast.error("state：" + XMLHttpRequest.status + ", error：" + XMLHttpRequest.statusText)
                }
                customGlobal.unblockUI();
            }
        });
    }

    function _initJqueryValidation() {
        $.validator.messages.equalTo = i18n.common.diffInput;
        $.validator.setDefaults({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: true,
            ignore: "",  // validate all fields including form hidden input
            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element) { // revert the change done by hightlight
                $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error'); // set success class to the control group
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                toast.error(i18n.common.tableWrong);
            },
            errorPlacement: function (error, element) { // render error placement for each input type
                if (element.parent(".input-group").size() > 0) {
                    error.insertAfter(element.parent(".input-group"));
                } else if (element.hasClass("select2-hidden-accessible")) {
                    error.insertAfter(element.next());
                } else if (element.attr("data-error-container")) {
                    error.appendTo(element.attr("data-error-container"));
                } else if (element.parents('.radio-list').size() > 0) {
                    error.appendTo(element.parents('.radio-list').attr("data-error-container"));
                } else if (element.parents('.checkbox-list').size() > 0) {
                    error.appendTo(element.parents('.checkbox-list').attr("data-error-container"));
                } else if (element.parents('.mt-checkbox-inline').size() > 0) {
                    error.appendTo(element.parents('.mt-checkbox-inline'));
                } else {
                    error.insertAfter(element); // for other inputs, just perform default behavior
                }
            }
        });
    }

    function _initUpdatePasswordEvent() {
        $("#updatePass").on("click", function () {
            $("#updatePasswordModal").html(customGlobal.remoteTemplate("template/core/common/updatePassword.html", {})).modal("show");
            $("#updatePassword").on("click", function () {
                if (!$("#updatePasswordDialog").validate().form()) {
                    return;
                }
                customGlobal.blockUI("#updatePasswordContent");
                $.ajax({
                    url: "b/core/user/updatePassword",
                    data: {
                        oldPassword: $("#oldPassword").val().md5(),
                        newPassword: $("#newPassword").val().md5()
                    },
                    type: "post",
                    dataType: "json"
                }).done(function (data) {
                    if (customGlobal.ajaxCallback(data)) {
                        $("#updatePasswordModal").modal("hide");
                        setTimeout(logout,2000)
                    }
                })
            });
        });
    }

    function logout() {
        window.location.href=basePath+"/logout";
    }

    function _initMaxlength(obj) {
        if (!$().maxlength)return;
        if (obj == undefined) {
            obj = $("input[maxlength],textarea[maxlength]").not("[readonly],:disabled")
        }
        obj.maxlength({
            alwaysShow: true,
            separator: i18n.maxlength.separator,
            preText: i18n.maxlength.preText,
            postText: i18n.maxlength.postText
        })
    }

    function _initSelect2() {
        $.fn.select2 && $.fn.select2.defaults.set("theme", "bootstrap");
    }

    return {
        /**
         * 显示loading
         */
        blockUI: _blockUI.show,
        /**
         * 隐藏loading
         */
        unblockUI: _blockUI.hide,
        /**
         * 获取当前loading所在的容器
         */
        getBlockUITarget: _blockUI.getBlockUITarget,

        ajaxCallback: function (data) {
            customGlobal.unblockUI();
            if (data.ok) {
                toast.success(data.returnMsg);
                return true;
            } else if (data.error) {
                toast.error(data.returnMsg);
                if (data.returnMsg === i18n.login.reLogin) {
                    setTimeout(logout,5000)
                }
                return false;
            } else if (data.warning) {
                toast.warning(data.returnMsg);
                return true;
            }
        },
        remoteTemplate: _artTemplate.remoteTemplate,
        showConfirm: function (options) {
            var defaultOptions = {
                confirmTitle: i18n.common.confirm,
                confirmContent: i18n.common.deletePrompt,
                confirmBtn: i18n.common.confirm,
                cancelBtn: i18n.common.cancel,
                confirmDialogId: "confirmDialog",
                confirmBtnId: "confirmBtn",
                confirmDialogWrapperId: "confirmDialogWrapper"
            };
            var opts = $.extend(true, {}, defaultOptions, options);
            if ($("#" + opts.confirmDialogWrapperId).size() == 0) {
                $("body").append("<div id='" + opts.confirmDialogWrapperId + "'></div>")
            }
            $("#" + opts.confirmDialogWrapperId).html(customGlobal.remoteTemplate("template/core/common/confirm.html", opts));
            $("#" + opts.confirmDialogId).modal("show")
        },
        latefirm: function (options) {
            var defaultOptions = {
                confirmTitle: i18n.common.save,
                confirmContent: i18n.common.lateEarly,
                confirmBtn: i18n.common.save,
                cancelBtn: i18n.common.cancel,
                confirmDialogId: "confirmDialog",
                confirmBtnId: "confirmBtn",
                confirmDialogWrapperId: "confirmDialogWrapper"
            };
            var opts = $.extend(true, {}, defaultOptions, options);
            if ($("#" + opts.confirmDialogWrapperId).size() == 0) {
                $("body").append("<div id='" + opts.confirmDialogWrapperId + "'></div>")
            }
            $("#" + opts.confirmDialogWrapperId).html(customGlobal.remoteTemplate("template/core/common/confirm.html", opts));
            $("#" + opts.confirmDialogId).modal("show")
        },
        refuseConfirm: function (options) {
            var defaultOptions = {
                confirmTitle: i18n.common.refuse,
                confirmContent: i18n.common.refusePrompt,
                confirmBtn: i18n.common.refuse,
                cancelBtn: i18n.common.cancel,
                confirmDialogId: "confirmDialog",
                confirmBtnId: "confirmBtn",
                confirmDialogWrapperId: "confirmDialogWrapper"
            };
            var opts = $.extend(true, {}, defaultOptions, options);
            if ($("#" + opts.confirmDialogWrapperId).size() == 0) {
                $("body").append("<div id='" + opts.confirmDialogWrapperId + "'></div>")
            }
            $("#" + opts.confirmDialogWrapperId).html(customGlobal.remoteTemplate("template/core/common/confirm.html", opts));
            $("#" + opts.confirmDialogId).modal("show")
        },
        agreeConfirm: function (options) {
            var defaultOptions = {
                confirmTitle: i18n.common.agree,
                confirmContent: i18n.common.agreePrompt,
                confirmBtn: i18n.common.agree,
                cancelBtn: i18n.common.cancel,
                confirmDialogId: "confirmDialog",
                confirmBtnId: "confirmBtn",
                confirmDialogWrapperId: "confirmDialogWrapper"
            };
            var opts = $.extend(true, {}, defaultOptions, options);
            if ($("#" + opts.confirmDialogWrapperId).size() == 0) {
                $("body").append("<div id='" + opts.confirmDialogWrapperId + "'></div>")
            }
            $("#" + opts.confirmDialogWrapperId).html(customGlobal.remoteTemplate("template/core/common/confirm.html", opts));
            $("#" + opts.confirmDialogId).modal("show")
        },
        getDictValue: _dictValuesObj.getDictValue,
        getDictValuesByName: _dictValuesObj.getDictValuesByName,
        /**
         * 将字符按subStringLength截取长度
         * @param str 要处理的字符串
         * @param subStringLength 需要截取的长度，若不传此参数默认为10
         * @returns {*}
         */
        getStringWithTitle: function (str, subStringLength) {
            if (subStringLength == undefined) {
                subStringLength = 10;
            }
            var subStr = str;
            if (str == null) {
                return "";
            }
            if (str.length > subStringLength) {
                subStr = str.substring(0, subStringLength) + '...'
            }
            return '<span title="' + str + '">' + subStr + '</span>';
        },
        /**
         * 通过html导出excel
         * @param colNum excel的列数
         * @param rowNum excel标题+表头的行数
         * @param htmlObj 包含要导出数据html的jquery对象
         * @param excelVersion excel版本包括（xls,xlsx）
         */
        exportByHtml: function (colNum, rowNum, htmlObj, excelVersion) {
            colNum = colNum == undefined ? $("#colNum").val() : colNum;
            if (colNum > 254) {
                excelVersion = "xlsx"
            }
            rowNum = rowNum == undefined ? $("#rowNum").val() : rowNum;
            rowNum = rowNum == undefined ? 2 : rowNum;
            excelVersion = excelVersion == undefined ? $("#excelVersion").val() : excelVersion;
            excelVersion = excelVersion == undefined ? "xlsx" : excelVersion;

            var form = $("<form>").attr('style', 'display:none').attr('target', '_self').attr('method', 'post')
                .attr('action', basePath + "exportExcel/exportExcelByHtml");
            var colNumObj = $('<input>').attr('type', 'hidden').attr('name', 'colNum').val(colNum);
            var rowNumObj = $('<input>').attr('type', 'hidden').attr('name', 'tableHeadRowNum').val(rowNum);
            var htmlStrObj = $('<input>').attr('type', 'hidden').attr('name', 'htmlStr').val(htmlObj.html());
            var excelVersionObj = $('<input>').attr('type', 'hidden').attr('name', 'excelVersion').val(excelVersion);
            $('body').append(form);
            form.append(colNumObj).append(rowNumObj).append(htmlStrObj).append(excelVersionObj).submit().remove();
        },
        /**
         * 通过后台导出excel
         * @param url
         * @param data
         */
        formSubExport: function (url, data) {
            var form = $("<form>").attr('style', 'display:none').attr('target', '_self').attr('method', 'post')
                .attr('action', basePath + url);
            $('body').append(form);
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var inputStr = $('<input>').attr('type', 'hidden').attr('name', data[i].name).val(data[i].value);
                    form.append(inputStr)
                }
            }
            form.submit().remove();
        },
        /**
         * 用于初始化input的itype,maxlength,gauto,select2控件
         * @param context input的父结点的jquery对象。可以是祖先结点
         */
        inputInit: function (context) {
            context.find("[data-i-type]").iType();
            _initMaxlength(context.find("input[maxlength],textarea[maxlength]").not("[readonly],:disabled"));
            context.find("input[data-gautoflag]").gAuto();
            $().select2 && context.find(".select2").select2();
        },
        /**
         * 框架初始化
         */
        init: function () {
            $.gAuto();
            _menu.init();
            $.iType();
            _initCkeditor();
            _initJqueryAjax();
            _initJqueryValidation();
            _initUpdatePasswordEvent();
            _initMaxlength();
            _initSelect2();
            _artTemplate.init();
            //以下这行代码是为了解决select在modal不能显示的问题，参见：http://stackoverflow.com/questions/22050641/month-select-in-datepicker-inside-a-bootstrap-modal-wont-work-in-firefox
            $.fn.modal.Constructor.prototype.enforceFocus = function () {
            };
        }
    }
}();
