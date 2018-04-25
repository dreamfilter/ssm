
<%--@elvariable id="menu" type="com.lovcreate.eyas.core.menu.model.Menu"--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description"/>
<meta content="" name="author"/>
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="<c:url value="/js/bower_lib/fontawesome/css/font-awesome.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/simple-line-icons/css/simple-line-icons.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/bootstrap/dist/css/bootstrap.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/toastr/toastr.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/smalot-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/js/bower_lib/bootstrap-daterangepicker/daterangepicker.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/assets/global/plugins/datatables/datatables.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css"/>" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN THEME STYLES -->
<link href="<c:url value="/assets/global/css/components.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/assets/global/css/plugins.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/assets/layouts/layout/css/layout.min.css"/>" rel="stylesheet" type="text/css"/>
<link href="<c:url value="/assets/layouts/layout/css/themes/darkblue.min.css"/>" rel="stylesheet" type="text/css" id="style_color"/>
<link href="<c:url value="/css/global/global.css"/>" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->
<link href="<c:url value="/js/global/plugins/auto-complete/dist/auto-complete.min.css"/>" rel="stylesheet" type="text/css"/>

<link rel="shortcut icon" href="<c:url value="/img/icon.ico"/>"/>
<base href="<%=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()%><c:url value="/"/>"/>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
