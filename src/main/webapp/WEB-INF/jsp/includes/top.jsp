<%@ page import="com.lovcreate.eyas.util.HttpUtil" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="page-header navbar navbar-fixed-top">
    <div class="page-header-inner">
        <div class="page-logo" style="width: 200px">
            <a href="<c:url value="/w/statistics/statisticsHome?menuId=0201"/>" style="font-size: 15px;color: #c6cfda;line-height: 50px;text-decoration: none;">Talkingbox管理端</a>
            <div class="menu-toggler sidebar-toggler"><span></span></div>
        </div>
        <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"><span></span></a>
        <div class="top-menu">
            <ul class="nav navbar-nav pull-right">
                <li class="dropdown dropdown-user">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                        <span class="username username-hide-on-mobile"><spring:message code="login.welcome"/>: <%=HttpUtil.getCurrentUser().getNickname()%></span> <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="javascript:;" id="updatePass"><i class="icon-lock"></i><spring:message code="user.changePassword"/></a></li>
                        <li><a href="<c:url value="/logout"/>"><i class="icon-key"></i><spring:message code="login.logOff"/></a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="modal fade" id="updatePasswordModal" tabindex="-1" data-keyboard="false" aria-hidden="true" data-backdrop="static"></div>
<div class="clearfix"></div>
