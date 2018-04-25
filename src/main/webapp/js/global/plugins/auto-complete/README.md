# auto-complete

此插件是需要后台代码配合的自动完成插件，可以进行拼音匹配。demo：[demo/demo.html](demo/demo.html)

## 1.初始化

html:
        
    <input type="text" id="username" data-gautoflag="gAutoUsername" />
        
css:
    
    <link href="dist/auto-complete.min.css" rel="stylesheet" type="text/css"/>
        
js:

    <script src="bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
    <script src="dist/auto-complete.min.js" type="text/javascript"></script>
    <script>
        $(function(){
            $("#username").gAuto();
        })
    </script>
国际化默认英语，若需要中文，则在auto-complete.js后引入语言js即可：

    <script src="dist/i18n/message.zh_CN.min.js" type="text/javascript"></script>



## 2. 批量初始化
若页面有很多input，可以用如下代码对所有带有data-gautoflag属性的input进行批量初始化。项目中可以将此代码放在全局js中，对所有页面进行初始化。但后添加到页面的input需要重新初始化。

    <script>
        $(function(){
            $.gAuto();
        })
    </script>

## 3. 参数与事件
### 3.1 js参数：
* hasShowAllBtn: 是否显示"显示全部"按钮，默认true。
* staticWithScroll: 是否随着body滚动而滚动，默认false。
* selectedCallback: 选中时触发该事件，默认null,参数：当前input的jquery对象
* basePath: 请求地址的基础路径，默认""。
* url: 请求地址，默认"autoComplete"。如果需要向其他地址发起请求，则需更改此url。

示例：

    $(function(){
        $("#username").gAuto({
            hasShowAllBtn:true,
            staticWithScroll:true,
            selectedCallback:function($input){
                alert("selected")
            },
            url:"customAutoComplete"
        });
    })
### 3.2 html5参数
* req-url:自定义url，可以将每个input设定单独的请求地址，实现动态查询,详见demo
* auto-class:自定义class，可以为每个input设定单独的提示框样式。
* hidden-value: 选中项的值。该插件类似于select控件，每个选项会有value和text两部分，在修改页初始化时，需要设定此属性以初始化该input

示例：
    
    <input type="text" data-gautoflag="" id="username3" data-req-url="customAutoComplete/getTeamList?param=1" data-auto-class="wide-tip" data-hidden-value="1"/>

## 4. 方法
* getGAutoHiddenValue：获取选中项的value的值
* setGAutoHiddenValue：设定选中项的value的值

示例：

    $("#username").getGAutoHiddenValue();
