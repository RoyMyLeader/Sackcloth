<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <title>确权登记系统 - 登录</title>
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/layui/css/layui.css" rel="stylesheet">
    <link href="/css/font-awesome.css" rel="stylesheet">
    <link href="/css/animate.css" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet">
    <link href="/css/login.css" rel="stylesheet">
    <!-- 全局js -->
    <script src="/js/jquery.min.js"></script>
</head>

<body class="signin">
<div class="signinpanel">
    <div class="row">
        <div class="col-sm-7">
            <div class="signin-info">
                <div class="logopanel m-b">
                    <h1>[ 确权登记 ]</h1>
                </div>
                <div class="m-b"></div>
                <h4>欢迎使用 <strong>确权登记管理系统</strong></h4>
                <ul class="m-b">
                    <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 银行级安全</li>
                    <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 多平台覆盖</li>
                    <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 专家专业团队</li>
                    <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 坚实品牌基础</li>
                </ul>
            </div>
        </div>
        <div class="col-sm-5" id="loginChange">

                <h4 class="no-margins">登录：</h4>
                <p class="m-t-md">登录到确权登记管理系统</p>
                <input type="text" class="form-control uname" placeholder="用户名" name="username" id="username"/>
                <input type="password" class="form-control pword m-b" placeholder="密码" name="password" id="password"/>
                <input type="checkbox" style="color:red" id="ishave" name="ishave" value="remember" ${cookie['remember'].value}/>&nbsp;记住账号
                <b class="text-warning pull-right" style="margin-right: 20px" id="warnMsg"></b>
                <button class="btn btn-success btn-block"  onclick="checkUser();">登录</button>

        </div>
    </div>
    <div class="signup-footer">
        <div class="pull-left">
            &copy; 2017-2099 确权登记管理系统 All Rights Reserved.
        </div>
    </div>
</div>
</body>
<script>
    $("#loginChange").find("input").change(function(){
        $("#warnMsg").html("");
    });
    function checkUser() {
        var result = $("#username").val();
        var password = $("#password").val();
        if (result === "") {
            bootbox.alert("用户名不能为空");
            return false;
        }
        if (password === "") {
            bootbox.alert("密码不能为空");
            return false;
        }
        var qData = {
            username: result,
            password: password
        };
        $.ajax({
            type: "POST",
            url: "/loginVerify",
            data: qData,
            success: function (data) {
                if (data.success) {
                    window.location.href = "/homeIndex";
                } else {
                    $("#warnMsg").html(data.msg);
                    return;
                }
            }
        });
    }
</script>

</html>

