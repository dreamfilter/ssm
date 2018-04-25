<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<head>
    <title>404</title>
    <%@include file="../includes/head.jsp"%>
    <link href="<c:url value="/assets/pages/css/error.css"/>" rel="stylesheet" type="text/css"/>
</head>
<body class="<%@include file="../includes/bodyClass.jsp" %>">
<div class="page-header navbar navbar-fixed-top">
    <div class="page-header-inner">
        <div class="page-logo">
            <a href="<c:url value="/"/>"><img src="<c:url value="/img/logo-big4.png"/>" alt="logo" class="logo-default" style="height:33px"/></a>
        </div>
    </div>
</div>
<div class="clearfix"></div>

<div class="page-container">
    <div class="page-content-wrapper">
        <div class="page-content">
            <h3 class="page-title">
                404 Not Found
            </h3>
            <div class="page-bar">
                <ul class="page-breadcrumb">
                    <li>
                        <i class="fa fa-home"></i>
                        <a href="<c:url value="/"/>">主页</a>
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li>
                        <span>404</span>
                    </li>
                </ul>
            </div>
            <div class="row">
                <div class="col-md-12 page-404">
                    <div class=" number">
                        404
                    </div>
                    <div class=" details">
                        <h3>Oops! 该页无法找到！</h3>
                        <p>
                            请联系管理员,<br/>
                            或更改访问地址重试。<br/>
                            <a href="<c:url value="/"/>">返回主页</a>
                            <br/>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%@include file="../includes/footer.jsp"%>
<%@include file="../includes/bottomscript.jsp"%>
</body>
</html>
