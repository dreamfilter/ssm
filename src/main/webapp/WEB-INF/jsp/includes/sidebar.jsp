<%@ page import="org.apache.shiro.SecurityUtils" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="page-sidebar-wrapper" id="sidebarWrapper">
    <div class="page-sidebar navbar-collapse collapse">
        <!-- BEGIN SIDEBAR MENU -->
        <ul class="page-sidebar-menu page-header-fixed " data-keep-expanded="true" data-auto-scroll="true" data-slide-speed="200" style="padding-top: 20px"></ul>
        <!-- END SIDEBAR MENU -->
    </div>
</div>
<input type="hidden" id="menuParentId" value="${menu.parentId}"/>
<input type="hidden" id="menuId" value="${menu.menuId}"/>
<%
    SecurityUtils.getSubject().getSession().setAttribute("requestNo",(Integer) session.getAttribute("requestNo")+1);
%>
<script>
    var requestNo = <%=SecurityUtils.getSubject().getSession().getAttribute("requestNo")%>
</script>
