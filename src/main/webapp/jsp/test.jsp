<%--
  Created by IntelliJ IDEA.
  User: 17535
  Date: 2017/10/14
  Time: 17:26
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<html>
<head>
    <title>测试下拉</title>
    <link href="/layui/css/layui.css" rel="stylesheet">

    <!--引入layui -->
    <link href="/layui/css/layui.css" rel="stylesheet">
</head>
<body>
<div class="layui-form">
    <div class="layui-form-item">
        <!--住址 -->
        <label class="layui-form-label">住址:</label>
        <div id="citybox" class="layui-inline">
            <div class="layui-input-inline">
                <select name="province" id="province" lay-filter="province">
                    <option value="">--请选择--</option>
                </select>
            </div>
            <div class="layui-input-inline">
                <select name="city" id="city" lay-filter="city">
                    <option value="">--请选择--</option>
                </select></div>
            <div class="layui-input-inline">
                <select name="area" id="area" lay-filter="area">
                    <option value="">--请选择--</option>
                </select>
            </div>
        </div>
    </div>
</div>

<!--引入jquery -->
<script src="/js/jquery-3.1.1.min.js" charset="UTF-8"></script>
<!--引入layui.js -->
<script src="/layui/layui.js" charset="UTF-8"></script>
<!--引入省市县三级联动js -->
<script src="/js/city.js" charset="UTF-8"></script>
</body>
</html>
