# inputType

此插件可以通过在input上增加一些属性，限制input的输入只能是数字或者时间。demo：[demo/demo.html](demo/demo.html)

## 1.初始化

html:
    
    <input type="text" id="username" data-i-type="int等"/>
    
必要css:无

必要js:

    <script src="bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
    <script src="dist/inputType.min.js" type="text/javascript"></script>
    <script src="../../../scripts/util.js" type="text/javascript"></script>
    <script>
        $(function(){
            $("#username").iType();
        })
    </script>

如果需要使用日期、时间、日期间隔控件，需要引入相关控件
必须：

    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
日期： 

    <link href="bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css" rel="stylesheet" type="text/css"/>
    <script src="bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
时间：

    <link href="bower_components/smalot-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
    <script src="bower_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
日期间隔

    <link href="bower_components/bootstrap-daterangepicker/daterangepicker.min.css" rel="stylesheet" type="text/css"/>
    <script src="bower_components/bootstrap-daterangepicker/daterangepicker.js"></script>
    <script src="bower_components/moment/min/moment.min.js" type="text/javascript"></script>
国际化默认英语，若需要中文，则在引入完上面所有js后引入inputType语言js及其他控件的语言js即可。daterangepicker的国际化取决于moment.js

    <script src="dist/i18n/message.zh_CN.min.js" type="text/javascript"></script>
    <script src="bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js" type="text/javascript"></script>
    <script src="bower_components/smalot-bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
    <script src="bower_components/moment/locale/zh-cn.js"></script>

## 2. 批量初始化
若页面有很多input，可以用如下代码对所有带有data-i-type属性的dom进行批量初始化。项目中可以将此代码放在全局js中，对所有页面进行初始化。但后添加到页面的input需要重新初始化。

    <script>
        $(function(){
            $.iType();
        })
    </script>

## 3. html属性参数
### 3.1 data-i-type="int" 限制输入整型
* max：若有此属性则限制input能输入的最大值为该属性值 
* min：若有此属性则限制input能输入的最小值为该属性值
* changeRange：按键盘上下键时加减的幅度，默认为1 
* positive：若此属性等于"positive"则限制输入为非负
* defaultVal：若有此属性，当input中填写0或""并失去焦点时，input值会变成该属性值

示例：
    
    <input type="text" class="form-control" id="intInput" data-i-type="int" max="1000" min="0" changeRange="2" positive="positive" defaultVal="50"/>

### 3.2 data-i-type="float" 限制输入浮点型
toFix是否自动补全0到precision设定的小数位数，noZero：不为0

* max,min,changeRange,positive,defaultVal同data-i-type="int"
* precision：若有此属性则限制input能输入的最大小数位数为该属性值 
* toFix：若此属性等于"toFix"则限制input自动补全0到precision设定的小数位数。此属性依赖precision属性
* noZero：若此属性等于"noZero"则限制input不能输入0

示例：
    
    <input type="text" class="form-control" id="floatInput" data-i-type="float" max="100" min="1" changeRange="2" positive="positive" defaultVal="50"
                       precision="2" toFix="toFix" noZero="noZero"/>

### 3.3 data-i-type="year" 限制输入年份，格式：yyyy
属性参数详见bootstrap-datepicker
示例：

    <input type="text" class="form-control" data-i-type="year" data-date-language="zh-CN"/>

### 3.4 data-i-type="yearMonth" 限制输入年份月份，格式：yyyy-mm
属性参数详见bootstrap-datepicker
示例：

    <input type="text" class="form-control" data-i-type="yearMonth" data-date-language="zh-CN"/>

### 3.5 data-i-type="date" 限制输入日期，格式：yyyy-mm-dd
属性参数详见bootstrap-datepicker
示例：

    <input type="text" class="form-control" data-i-type="date" data-date-language="zh-CN"/>

### 3.6 data-i-type="dateCustom" 不做限定，完全取决于属性参数
属性参数详见bootstrap-datepicker
示例：

    <input type="text" class="form-control" data-i-type="dateCustom" data-date-format="MMM dd,yyyy" data-date-language="zh-CN"/>

### 3.7 data-i-type="dateMinute" 限制输入时间，格式：yyyy-mm-dd HH:mm
属性参数详见bootstrap-datetimepicker
示例：

    <input type="text" class="form-control" data-i-type="dateMinute" data-date-language="zh-CN"/>

### 3.8 data-i-type="dateSecond" 限制输入时间，格式：yyyy-mm-dd HH:mm:ss
属性参数详见bootstrap-datetimepicker
示例：

    <input type="text" class="form-control" data-i-type="dateSecond" data-date-language="zh-CN"/>

### 3.9 data-i-type="datetimeCustom" 不做限定，完全取决于属性参数
属性参数详见bootstrap-datetimepicker
示例：

    <input type="text" class="form-control" data-i-type="datetimeCustom" data-date-language="zh-CN"/>

### 3.10 data-i-type="dateRange" 限制输入日期区间，格式：yyyy-mm-dd
属性参数详见bootstrap-daterangepicker
因为daterangepicker选完的日期放在了一个input中，所以取时间段的时候需要使用data("from")和data("to")方法，所以如果需要初始化input的话需要初始化这两个属性

* data-from 开始时间。
* data-to 结束时间

示例：

    <input type="text" id="queryDate" class="form-control" data-i-type="dateRange" data-from="" data-to=""/>
    <!--js调用时获取开始时间和结束时间-->
    var beginDate = $("#queryDate").data("from")
    var endDate = $("#queryDate").data("to")
