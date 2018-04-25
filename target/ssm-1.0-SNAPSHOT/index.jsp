<%@ taglib prefix="c" uri="http://www.springframework.org/tags" %>
<%--@elvariable id="message" type="java.lang.String"--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<head>
    <title>Talkingbox管理端</title>
    <%@include file="js/"%>
    <link href="<c:url value="/assets/pages/css/login-4.min.css"/>" rel="stylesheet" type="text/css"/>
</head>
<body class="login">
<div class="logo">
    <a href="<c:url value="/login"/>" class="view">
        <h3>Talkingbox管理端</h3>
    </a>
</div>
<body>
<div class="header"></div>
<form id="login-form"  class="login-form" action="" method="post">
    <h3 class="form-title">登录</h3>
    <div class="alert alert-danger display-hide">
        <button class="close" data-close="alert"></button>
        <span></span>
    </div>
    <div class="form-group">
        <label class="control-label visible-ie8 visible-ie9">用户名</label>
        <div class="input-icon">
            <i class="fa fa-user"></i>
            <input class="form-control placeholder-no-fix" type="text" autocomplete="off"
                   placeholder="用户名" name="username" id="username"/>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label visible-ie8 visible-ie9">密码</label>
        <div class="input-icon">
            <i class="fa fa-lock"></i>
            <input id="password" class="form-control placeholder-no-fix" type="password" autocomplete="off"
                   placeholder="密码" name="password"/>
        </div>
    </div>
    <div class="form-actions">
        <label class="checkbox"></label>
        <button type="button" id="loginBtn" class="btn blue pull-right">登录<i class="m-icon-swapright m-icon-white"></i>
        </button>
    </div>
</form>

</body>
</html>