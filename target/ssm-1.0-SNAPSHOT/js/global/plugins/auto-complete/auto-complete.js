(function($) {
    $.fn.extend({
        gAuto: function (options) {
            var opt = $.extend(true, {}, $.fn.gAuto.defaults, options);
            //当前选中项的行号，从1开始
            var index = 0;
            //最大数据项的行号
            var maxRowNum = 0;
            //当前自动完成的text域
            var $autoText;
            //关闭的标志位。当鼠标在提示框的div上经过时，blur事件不关闭提示框
            var closeFlag = true;
            //上一个高亮的div
            var $oriObj;
            //即将高亮的div
            var $desObj;
            var $autoTipDiv = _initAutoTipDiv();
            var $itemDiv;
            //input的google框位置
            var positionTop;

            var $showTipImg = $("#autoTipImg");
            $(this).off(".auto-complete").on("keydown.auto-complete keyup.auto-complete blur.auto-complete", function (e) {
                $autoText = $(this);
                //如果该input为readonly则不处理
                if ($autoText.prop("readonly"))return;
                $autoText.attr("autocomplete","off");
                _initShowTipDivStyle();
                //按键的keycode
                var _key = e.which;
                //触发的事件类型
                var eType = e.type;
                //keyDown事件且提示div显示的时候
                if (eType == "keydown" && $autoTipDiv[0].style.display != "none") {
                    _keyDownEventHandler(_key,e);
                }
                if (eType == "keyup") {
                    //若按下了ctrl或shift则返回
                    if (e.ctrlKey)return;
                    _keyUpEventHandler(_key);
                }
                //blur事件时，若鼠标在提示div外时关闭。
                if (eType == "blur" && closeFlag) {
                    $autoText.val() == "" && _setHiddenValue("");
                    $autoTipDiv.hide();
                }
            });


            /**
             * 鼠标滚轮监听
             * google框不随滚轮移动
             */
            if(opt.staticWithScroll){
                var beforeScroll = $(document).scrollTop();//滚动前top
                $(window).scroll(function(){
                    var afterScroll = $(document).scrollTop();//滚动后top
                    var res = afterScroll - beforeScroll;
                    if(res>0){//向下时,beforeScroll 通过$(document).scrollTop()拿到下次滚动值=上次滚动后的值
                        $autoTipDiv.css("top",positionTop+res);
                    }else{//向上时,beforeScroll 拿到的是下次滚动值 != 上次滚动hou的值,上次滚动后的值是在里面函数中,外边拿不到,所以要赋值
                        $autoTipDiv.css("top",positionTop-res);
                        beforeScroll = afterScroll;//闭包
                    }
                });
            }


            /**
             * ajax请求主函数
             * @param isShowAll 是否显示所有提示的标志位
             * @param ajaxUrl 请求url
             * @private
             */
            function _autoCompleteAjax(isShowAll) {
                var reqUrl = $autoText.data("reqUrl");//当前google框的请求地址，若有则为自定义google框
                //记录当前google框的keyword
                var thisValue = $autoText.val().trim();
                $.ajax({
                    type: "POST",
                    url: reqUrl == undefined ? opt.basePath + opt.url : reqUrl,
                    dataType: "json",
                    data: {
                        keyword: thisValue,
                        //当前google框的类型标志位
                        flag: $autoText.data("gautoflag"),
                        isShowAll: isShowAll
                    },
                    error: function () {
                        $showTipImg.html("<i class='fa fa-exclamation-triangle'></i><span> "+$.gAuto.i18n.dataReturnError+"</span>");
                    },
                    success: function (resultArray) {
                        if (resultArray != "") {
                            // 返回结果的个数
                            maxRowNum = resultArray.length;
                            if (maxRowNum > 10) {
                                $autoTipDiv.css({height: $autoTipDiv.height(), overflowY: "scroll"})
                            }
                            // 返回显示的内容
                            $showTipImg[0].innerHTML=_getResultStr(resultArray,thisValue,isShowAll);
                            $itemDiv = $autoTipDiv.find("div.item-div");
                            $autoTipDiv.show();
                            $autoText.focus();
                            _initResultEvent();
                            //默认选中第一个
                            index = 0;
                            $oriObj = $itemDiv.eq(0);
                            _focusOP(undefined, $oriObj)
                        } else {
                            $showTipImg.html("<i class='fa fa-exclamation-triangle'></i><span> "+$.gAuto.i18n.dataNotFound+"</span>");
                            maxRowNum = 0;
                        }
                    }
                })
            }
            /**
             * 初始化tipDiv的样式及位置
             */
            function _initShowTipDivStyle() {
                $autoTipDiv.removeClass().addClass("div-auto")
                    .css({left: $autoText.offset().left, top: $autoText.offset().top + $autoText.outerHeight(),
                        height: "240px", overflowY: "auto", paddingLeft: 0});
                var gClass = $autoText.data("autoClass");
                if (gClass) {
                    $autoTipDiv.addClass(gClass);
                }
                var showTextCssLeft = "0";
                var showTextCssRight = "0";
                if ($autoText.css("paddingLeft") != undefined) {
                    showTextCssLeft = $autoText.css("paddingLeft").replace("px", "");
                }
                if ($autoText.css("paddingRight") != undefined) {
                    showTextCssRight = $autoText.css("paddingRight").replace("px", "");
                }
                var $thisRealWidth = parseFloat($autoText.width()) + parseFloat(showTextCssLeft) + parseFloat(showTextCssRight);
                $autoTipDiv.width() < $thisRealWidth && $autoTipDiv.width($thisRealWidth);

                //获取第一次使用google框的input的google框位置
                positionTop = $autoText.offset().top + $autoText.outerHeight();
            }
            /**
             * keyUp事件的处理函数
             * @param _key 按键的keyCode
             */
            function _keyUpEventHandler(_key) {
                //如果当前input不为空
                if ($autoText.val() != "") {
                    //如果不是按下的上下左右、回车、ctrl则显示提示
                    if (_key != $.gAuto.keyCode.RIGHT && _key != $.gAuto.keyCode.DOWN
                        && _key != $.gAuto.keyCode.LEFT && _key != $.gAuto.keyCode.UP
                        && _key != $.gAuto.keyCode.ENTER && _key != $.gAuto.keyCode.CONTROL
                        && _key != $.gAuto.keyCode.TAB) {
                        _setHiddenValue("");
                        $autoTipDiv[0].style.display == "none" && $autoTipDiv.show();
                        $showTipImg.html("<span class='auo-text-loading'>"+ $.gAuto.i18n.loading+"…</span>");
                        _autoCompleteAjax(false);
                    }
                } else {
                    $autoTipDiv.hide();
                    _setHiddenValue("")
                }
            }

            /**
             * keyDown事件的处理函数
             * @param _key 按键的keyCode
             * @param e event
             */
            function _keyDownEventHandler(_key,e) {
                //若按下→，↓则调整选中的项目使其高亮
                if (_key == $.gAuto.keyCode.RIGHT || _key == $.gAuto.keyCode.DOWN) {
                    //若index+1超过了maxId则将index置为1
                    index = index + 1 >= maxRowNum ? 0 : index + 1;
                    $desObj = $itemDiv.eq(index);
                    _focusOP($oriObj, $desObj);
                    //若显示全部带有滚动条时处理滚动条
                    $autoTipDiv.scrollTop((index - 11) * 20);
                }
                //若按下←，↑则调整选中的项目使其高亮
                if (_key == $.gAuto.keyCode.LEFT || _key == $.gAuto.keyCode.UP) {// 37left,38up
                    //若index-1小于1，则将index置为maxId
                    index = index < 1 ? maxRowNum - 1 : index - 1;
                    $desObj = $itemDiv.eq(index);
                    _focusOP($oriObj, $desObj);
                    //若显示全部带有滚动条时处理滚动条
                    $autoTipDiv.scrollTop((index - 11) * 20);
                }
                // 回车或tab的处理
                if (_key == $.gAuto.keyCode.ENTER || _key == $.gAuto.keyCode.TAB) {
                    e.preventDefault();
                    $desObj = $oriObj;
                    maxRowNum != 0 && _focusOP(undefined, $oriObj, true);
                    $autoTipDiv.hide();
                }
                $oriObj = $desObj;
            }

            /**
             * 对显示全部绑定事件，对结果集绑定高亮事件
             */
            function _initResultEvent(){
                //显示全部按钮点击事件
                $("#isShowAll").off(".auto-complete")
                    .on("mousedown.auto-complete", function () {
                        $showTipImg.html("<span class='auo-text-loading'>"+$.gAuto.i18n.loading+"…</span>");
                        _autoCompleteAjax(true);
                    });
                //提示结果集的事件
                $itemDiv.hover(
                    function () {
                        $oriObj = $(this);
                        _focusOP($itemDiv.eq(index), $oriObj);
                        index = $itemDiv.index(this);
                    },
                    function () {
                        _focusOP($(this));
                    })
                    .off(".auto-complete")
                    .on("mousedown.auto-complete", function () {
                        _focusOP(undefined, $(this), true);
                        $autoTipDiv.hide();
                    });
            }

            /**
             * 将ajax返回值拼接成所需的串
             * @param resultArray ajax返回的数组
             * @param keyword 查询关键字
             * @param isShowAll 是否显示全部
             * @returns {string} 拼接完的串
             */
            function _getResultStr(resultArray,keyword,isShowAll){
                var divStr = "";
                for (var i = 0; i < resultArray.length; i++) {
                    // 将名称中与关键字匹配的部分，变成红色
                    keyword=keyword
                        .replace(/\\/g,'\\\\')
                        .replace(/\[/g,'\\[').replace(/\]/g,'\\]')
                        .replace(/\(/g,'\\(').replace(/\)/g,'\\)')
                        .replace(/\</g,'\\<').replace(/\>/g,'\\>')
                        .replace(/\{/g,'\\{').replace(/\}/g,'\\}')
                        .replace(/\|/g,'\\|').replace(/\?/g,'\\?');
                    var formatStr = resultArray[i].name.replace(new RegExp(keyword+'', "i"), "<b><span style='color:red'>$&</span></b>");
                    divStr = divStr+"<div class='item-div' data-str-id='" + resultArray[i].id + "'>" + formatStr + "</div>";
                }
                //若当前google第一次打开只显示10条时加入显示全部按钮
                if (!isShowAll && opt.hasShowAllBtn) {
                    divStr = divStr+"<div class='show-all-div'><a id='isShowAll' class='auto-text-btn'>"+$.gAuto.i18n.showAll+"</a></div>";
                }
                return divStr;
            }
            /**
             * 使选中的结果高亮
             * @param $oriDiv 需要去掉高亮的obj
             * @param $focusObj 需要高亮的obj
             * @param addFlag 是否回填
             */
            function _focusOP($oriDiv, $focusObj, addFlag) {
                $oriDiv && $oriDiv.css({"background": "#FFFFFF"});
                if ($focusObj !== undefined) {
                    $focusObj.css({background: "#FBEC88"});
                    if (addFlag) {
                        $autoText.val($focusObj.text());
                        _setHiddenValue($focusObj.data("strId"));
                        if (opt.selectedCallback) {
                            opt.selectedCallback($autoText)
                        }
                    }
                }
            }
            /**
             * 为hidden的input赋值
             * @param hiddenValue 隐藏域的值
             */
            function _setHiddenValue(hiddenValue) {
                $autoText.setGAutoHiddenValue(hiddenValue);
            }
            /**
             * 初始化自动提示的div
             * @returns $autoTipDiv
             * @private
             */
            function _initAutoTipDiv() {
                //向当页中的body添加提示的div
                if($("#autoTipDiv").size() == 0){
                    $("body").append("<div id='autoTipDiv' class='auto-tip-div'>" +
                        "<iframe style='position:absolute; z-index:-1;width:110px;' frameborder='0' src='about:blank'></iframe>" +
                        "<div id='autoTipImg'></div></div>");
                }
                return $("#autoTipDiv")
                    .hover(
                        function () {
                            closeFlag = false
                        },
                        function () {
                            closeFlag = true;
                        })
                    .off(".auto-complete")
                    .on("scroll.auto-complete", function () {
                        $autoText && $autoText.focus()
                    });
            }
            return this;
        },
        getGAutoHiddenValue:function(){
            return this.data("hiddenValue");
        },
        setGAutoHiddenValue:function(hiddenValue){
            return this.data("hiddenValue",hiddenValue);
        }
    });

    $.fn.gAuto.defaults = {
        hasShowAllBtn:true,
        staticWithScroll: false,
        selectedCallback: null,
        basePath: "",
        url: "autoComplete"
    };

    $.gAuto = function () {
        $("input[data-gautoflag]").gAuto();
    };

    $.gAuto.i18n ={
        loading:"Loading",
        showAll:"Show All",
        dataReturnError:"The returned data is error!",
        dataNotFound:"Data is not found!"
    };

    $.gAuto.keyCode = {
        ALT: 18,
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        COMMAND: 91,
        // COMMAND
        COMMAND_LEFT: 91,
        COMMAND_RIGHT: 93,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        // COMMAND_RIGHT
        MENU: 93,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        F7: 118,
        F12: 123,
        S: 83,
        // COMMAND
        WINDOWS: 91
    }

})(jQuery);
