<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<head>
    <%@include file="../../includes/head.jsp" %>
    <title>${menu.menuName}</title>
</head>
<body class="<%@include file="../../includes/bodyClass.jsp" %>">
<%@include file="../../includes/top.jsp" %>
<div class="page-container">
    <%@include file="../../includes/sidebar.jsp" %>
    <div class="page-content-wrapper">
        <div class="page-content">
            <div class="row">
                <div class="col-md-12">
                    <div class="portlet light portlet-fit portlet-datatable bordered">
                        <div class="portlet-title">
                            <div class="caption font-green-sharp">
                                <i class="${menu.icon} font-green-sharp"></i>
                                <span class="caption-subject bold ">${menu.menuName}</span>
                            </div>
                            <div class="actions">
                                <a href="javascript:" class="btn green" id="addTest"><i
                                        class="fa fa-plus"></i><span class="hidden-480"> <spring:message code="common.new"/></span></a>
                            </div>
                        </div>
                        <div class="portlet-body">
                            <div class="table-container">
                                <table class="table table-striped table-bordered table-hover" id="dataTable">
                                    <thead>
                                    <tr role="row" class="heading">
                                        <th><spring:message code="Test.question"/></th>
                                        <th><spring:message code="Test.answer"/></th>
                                        <th><spring:message code="Test.status"/></th>
                                        <th><spring:message code="Test.createTime"/></th>
                                        <th><spring:message code="common.actions"/></th>
                                    </tr>
                                    <tr role="row" class="filter">
                                        <td>
                                            <input type="text" class="form-control form-filter"
                                                   name="questionQuery" id="questionQuery" placeholder="<spring:message code="Test.question"/>">
                                        </td>
                                        <td>
                                            <input type="text" class="form-control form-filter"
                                                   name="answerQuery" id="answerQuery" placeholder="<spring:message code="Test.answer"/>">
                                        </td>
                                        <td>
                                            <input type="text" class="form-control form-filter"
                                                   name="statusQuery" id="statusQuery" placeholder="<spring:message code="Test.status"/>">
                                        </td>
                                        <td>
                                            <div class="input-group date-range input-medium" data-i-type="dateRange">
                                                <input type="text" class="form-control" readonly data-from="" data-to=""
                                                       name="createTimeQuery" id="createTimeQuery" placeholder="<spring:message code="Test.createTime"/>">
                                                <span class="input-group-btn">
                                                    <button class="btn default date-range-toggle" type="button">
                                                        <i class="fa fa-calendar"></i>
                                                    </button>
                                                </span>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="margin-bottom-5">
                                                <a class="btn green btn-outline filter-submit margin-bottom">
                                                    <i class="fa fa-search"></i> <spring:message code="common.query"/></a>
                                            </div>
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade modal-scroll in" id="modalDialog" tabindex="-1" data-keyboard="false" aria-hidden="true"
     data-backdrop="static">
</div>
<div class="modal fade modal-scroll in" id="modalDialog2" tabindex="-1" data-keyboard="false" aria-hidden="true"
     data-backdrop="static">
</div>
<%@include file="../../includes/footer.jsp" %>
<%@include file="../../includes/bottomscript.jsp" %>
<script src="<c:url value="/js/b/Test/Test.js"/>"></script>
<script id="actionBtn" type="text/html">
    <a class="edit btn btn-outline btn-xs purple" id="{{full.id}}"><i class="fa fa-edit"></i> {{i18n.common.edit}}</a>
    <a class="delete btn btn-outline btn-xs red"><i class="fa fa-times"></i> {{i18n.common.delete}}</a>
    <a class="view btn btn-outline btn-xs blue-sharp" id="{{full.id}}"><i class="fa fa-eye"></i> {{i18n.common.view}}</a>
</script>
<script type="text/javascript">
    $(function () {
        TestObj.init();
    });
</script>
</body>
</html>
