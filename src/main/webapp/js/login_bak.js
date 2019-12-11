var flag1 = 1;
var flag2 = 1;


function checkusername() {
    if ($("#username").val() == "") {
        $(".username_error").css("display", "");
        $(".username_error").css("height", "20px");
        document.getElementById("usererror_tip").innerHTML = "用户名不能为空";
        document.getElementById("usererror_tip").color = "red";
        flag1 = 0;
    } else {
        flag1 = 1;
    }
}

function checkpassword() {
    if ($("#password").val() == "") {
        $(".password_error").css("display", "");
        $(".password_error").css("height", "20px");
        document.getElementById("psderror_tip").innerHTML = "密码不能为空";
        document.getElementById("psderror_tip").color = "red";
        flag2 = 0;
    } else {
        flag2 = 1;
    }
}

function cleantip(c) {
    $("." + c).css("display", "none");
}

function checklogin() {

    if (flag1 + flag2 == 2) {
        $.ajax({
            type: "get",
            url: "/LoginHandler",
            dataType: "text",
            data: {
                "username": $("#username").val(),
                "password": $("#password").val()
            },
            success: function (Result) {
                if (Result == "true") {
                    $("#loginform").submit();
                } else {
                    $(".login_error").css("display", "");
                    $(".login_error").css("height", "20px");
                    document.getElementById("loginerror_tip").innerHTML = "用户名或密码错误";
                    document.getElementById("loginerror_tip").color = "white";
                    return false;
                }
            }
        });
    } else {
        return false;
    }
    return false;
}


//页面加载时运行的方法,检测是否存在cookie,如果只存在用户名,就填充用户名那一栏,如果还存在密码,则直接登录成功
function searchcookie() {



    $("p").animate(
        {opacity: 1}, 3000
    )
}



