<%@ page import="org.springframework.web.servlet.i18n.SessionLocaleResolver" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src='<c:url value="/js/bower_lib/respond/respond.min.js"/>'></script>
<script src='<c:url value="/js/global/plugins/excanvas.min.js"/>'></script>
<![endif]-->
<script src="<c:url value="/js/bower_lib/jquery/dist/jquery.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/jquery-migrate/jquery-migrate.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/artTemplate/dist/template.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/bootstrap/dist/js/bootstrap.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/jquery-slimscroll/jquery.slimscroll.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/blockui/jquery.blockUI.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/js-cookie/src/js.cookie.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/bootstrap-switch/dist/js/bootstrap-switch.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/toastr/toastr.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/jquery-validation/dist/jquery.validate.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"/>"></script>
<script src="<c:url value="/js/bower_lib/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"/>"></script>
<script src="<c:url value="/js/global/plugins/jquery-validation/validate-methods.js"/>"></script>
<script src="<c:url value="/js/bower_lib/moment/min/moment.min.js"/>"></script>
<script src="<c:url value="/js/bower_lib/bootstrap-daterangepicker/daterangepicker.min.js"/>"></script>
<script src="<c:url value="/assets/global/plugins/datatables/datatables.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/bootstrap-maxlength/bootstrap-maxlength.min.js"/>"></script>
<script src="<c:url value="/js/global/plugins/auto-complete/dist/auto-complete.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/global/plugins/inputType/dist/inputType.min.js"/>"></script>
<script src="<c:url value="/js/global/scripts/util.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/global/scripts/validate.js"/>" type="text/javascript"></script>
<%--<%--%>
    <%--if("zh_CN".equals(session.getAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME).toString())){--%>
<%--%>--%>
<script src="<c:url value="/js/bower_lib/bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/smalot-bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/bower_lib/jquery-validation/src/localization/messages_zh.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/global/plugins/auto-complete/dist/i18n/message.zh_CN.min.js"/>"></script>
<script src="<c:url value="/js/global/plugins/jquery-validation/i18n/message.zh_CN.js"/>"></script>
<script src="<c:url value="/js/bower_lib/moment/locale/zh-cn.js"/>"></script>
<script src="<c:url value="/js/global/plugins/inputType/dist/i18n/message.zh_CN.min.js"/>"></script>
<%--<%}%>--%>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="<c:url value="/assets/global/scripts/app.js"/>" type="text/javascript"></script>
<script src="<c:url value="/assets/layouts/layout/scripts/layout.js"/>" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script src="<c:url value="/js/global/scripts/global.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/global/scripts/toast.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/global/scripts/datatable.js"/>" type="text/javascript"></script>
<script src="<c:url value="/js/global/scripts/changeselect.js"/>"></script>
<%--<script src="js/ViewMessages_<%=session.getAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME)%>.js" type="text/javascript"></script>--%>
<%--<script src="js/dictValues_<%=session.getAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME)%>.js" type="text/javascript"></script>--%>
<script src="js/ViewMessages_zh_CN.js" type="text/javascript"></script>
<script src="js/dictValues_zh_CN.js" type="text/javascript"></script>
<script>
    <%--i18n.locale = '<%=session.getAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME).toString()%>';--%>
    i18n.locale = 'zh_CN';
    i18n.localeMiddleLine = i18n.locale.replace("_","-");
    $(function(){
        customGlobal.init();
    });
</script>
