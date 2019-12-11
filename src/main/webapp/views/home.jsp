<%--
  Created by IntelliJ IDEA.
  User: Lucifer
  Date: 2017/10/19
  Time: 20:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
    <link rel="shortcut icon" href="favicon.ico">
    <link href="${pageContext.request.contextPath}/css/bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/font-awesome.css?v=4.4.0" rel="stylesheet">

    <link href="${pageContext.request.contextPath}/css/animate.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.css?v=4.1.0" rel="stylesheet">
</head>
<body class="gray-bg">
<div class="middle-box text-center animated fadeInDown">
    <h2 class="font-bold">欢迎你,${sessionScope.user_session.username}</h2>
    <div class="text-left fadeInDown" style="width: 700px">
        <hr style="color: black;">
        <p>
        <h3>我曾七次鄙视我的灵魂</h3></p><p>
        <h3>第一次，当它本可进取时，却故作谦卑；</h3></p>
        <p>
        <h3> 第二次，当它在空虚时，用爱欲来填充；</h3></p>
        <p>
        <h3> 第三次，在困难和容易之间，它选择了容易；</h3></p>
        <p>
        <h3> 第四次，它犯了错，却借由别人也会犯错来宽慰自己；</h3></p>
        <p>
        <h3> 第五次，它自由软弱，却把它认为是生命的坚韧；</h3></p>
        <p>
        <h3> 第六次，当它鄙夷一张丑恶的嘴脸时，却不知那正是自己面具中的一副；</h3></p>
        <p>
        <h3> 第七次，它侧身于生活的污泥中，虽不甘心，却又畏首畏尾。</h3></p>
    </div>

</div>
<!-- 全局js -->
<script src="${ctx}/js/jquery.min.js?v=2.1.4"></script>
<script src="${ctx}/js/bootstrap.min.js?v=3.3.6"></script>
</body>
</html>
