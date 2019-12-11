/**
 * Desc: 菜单生成
 */
$(function () {
    createNav();
})
function createNav() {
    var navStr = "",
        qData = {
            username: userName
        };
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/sysFunction/getMenus",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                if (res.msg.hasOwnProperty("sysTitle")) {
                    // $("#header").css("background", "#000 url('" + res.msg.sysTitle.func_Url + "') no-repeat 20px 15px");
                }
                var first = '<li class="nav-header">' + $("#side-menu").children().eq(0).html() + '</li>'; //拿到第一个li里边的内容
                $("#side-menu").html(""); //清空所有的内容
                var res = res.msg.sysModel;
                if (res.length) {
                    $.each(res, function (i) {
                        first += '<li><a href="'+res[i].funcUrl+'" class="navclass">'
                                   +'<i class="'+res[i].classfield+'"></i>'
                                   +  '<span class="nav-label">'+res[i].name+'</span>';
                        if (res[i].sysFuncList && res[i].sysFuncList.length) {
                            first += '<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse" aria-expanded="false">';
                            $.each(res[i].sysFuncList, function (j) {
                                first += '<li><a class="J_menuItem" href="'+res[i].sysFuncList[j].funcUrl+'">'+res[i].sysFuncList[j].name+'</a></li>';
                            })
                            first += "</ul></li>"
                        } else {
                            first += '</a></li>';
                        }
                    })
                    $("#side-menu").append(first);
                    $(".J_menuItem").each(function (index) {
                        if (!$(this).attr('data-index')) {
                            $(this).attr('data-index', index);
                        }
                    });

                }
            }

            // MetsiMenu
            $('#side-menu').metisMenu();
        }
    });
}

// .then(function(){
//     $(".navclass").on("click",function(){
//         $(this).next().slideToggle(1000,function () {
//             $(this).next().removeClass("in");
//         });
//         if($(this).next().attr("aria-expanded") == "true"){
//             $(this).next().attr("aria-expanded",false);
//             // $(this).next().removeClass("in");
//             $(this).next().slideUp(1000,function () {
//                 $(this).next().removeClass("in");
//             });
//         }else{
//             $(this).next().attr("aria-expanded",true);
//             // $(this).next().addClass("in");
//             $(this).next().slideDown(1000,function () {
//                 $(this).next().addClass("in")
//             });
//         }
//     });
// });
/**
 * Desc: 加载页面
 */
function loadPage() {
    var head = $("head"),
        main = $(".main-nav"),
        mainBox = $(".main-content, .main-nav, #file_modal .panel-body"),
        content = $(".content"),
        heading = main.find(".panel-heading"),
        list = main.find(".list-group-item"),
        transArr = ["line-scale-pulse-out-rapid", "pacman"];
    heading.on("click", function () {
        heading.removeClass("active");
        list.removeClass("click");
        $(this).addClass("active");
    });
    list.on("click", function () {
        $(this).siblings().removeClass("click").end().addClass("click");
        list.removeClass("activeCol");
        $(this).addClass("activeCol");
    });
    main.find(".pageItem").on("click", function () {

        content.load("views/" + $(this).attr("page"), function () {
            $(".loader-inner").removeAttr("class").addClass("loader-inner").addClass(transArr[Math.round(Math.random())]);
            head.find(".add").remove();
            var scripts = content.find("script"),
                styles = content.find("link"),
                thisDate = new Date(),
                thisFullYear = thisDate.getFullYear(),
                thisMonth = parseInt(thisDate.getMonth()) + 1,
                thisDay = thisDate.getDate(),
                thisHour = thisDate.getHours(),
                thisMinute = thisDate.getMinutes(),
                thisSecond = thisDate.getSeconds();
            $.each(styles, function (i) {
                styles.eq(i).addClass("add");
                head.append(styles.eq(i).clone());
            });
            $.each(scripts, function (i) {
                scripts.eq(i).addClass("add");
                head.append(scripts.eq(i).clone());
            });
            styles.remove();
            scripts.remove();
            //日期控件
            $('.choose-date').datepicker({
                language: 'zh-CN',
                autoclose: true,
                format: "yyyy-mm-dd",
                todayHighlight: true
            }).on("changeDate", function () {
                $(this).focus();
                $(this).blur();
            });

            $('.choose-datehouse').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
                pickerPosition: "bottom-right",
                todayHighlight: true,
                todayBtn: true,
                language: 'zh'
            }).on('changeDate', function () {
                $(this).datetimepicker('hide');
            });

            $(".modal").on('shown.bs.modal', function () {
                //解决modal弹出后，layer内输入框无法聚焦的问题
                $(document).off('focusin.modal');
            });
            //表格内容超长处理
            $(document).on("mouseenter", ".table:visible", function () {
                if ($(this).attr("deal")) {
                    return
                }
                $(this).attr("deal", true);
                $.each($(this).find("th,td"), function () {
                    $(".main-container").append("<span class='temporary none'>" + $(this).text() + "</span>");
                    var temporary = $(".temporary");
                    if (temporary.width() > $(this).width() - 16) {
                        $(this).attr({
                            "data-toggle": "tooltip",
                            "data-placement": "top",
                            "title": $(this).text()
                        }).tooltip({
                            container: "body"
                        });
                    }
                    temporary.remove();
                });
            });
            /***
             * 文件上传
             */
            $('.file_uplode').on('click', function (e) {
                e.preventDefault();
                doUpload($(this).attr("sel"));
            });
            $(".defaultName").attr({disabled: true, value: nickName});
            $('.defaultTime').attr({
                disabled: true,
                value: thisFullYear + "-" + getNum(thisMonth) + "-" + getNum(thisDay)
            });
            $(".defaultTimeMin").attr({
                value: thisFullYear + "-" + getNum(thisMonth) + "-" + getNum(thisDay) + " " + getNum(thisHour) + ":" + getNum(thisMinute) + ":" + getNum(thisSecond)
            })
            /***
             * 修改密码
             */
            $("#amendPassword").on('click', function () {
                $("#updataPassword").modal("show");
                $("#new_infoPass")[0].reset();
                $("#new_infoPass").find("input").removeClass("error").next("label").hide();
            });
            $("#role_save").on("click", function () {
                uservalidate();
            })
            /***
             * 个人信息
             */
            createOptions([{
                selector: "#User__authMode",
                key: "mmrz"
            }, {
                selector: "#User__gender",
                key: "sex",
                empty: true
            }, {
                selector: "#User__cardType",
                key: "zjlx"
            }]);
            $("#userinfo").on("click", function () {
                userinfo();
                $("#infoProject").modal("show");
                $("#loginTit").tab("show");
            })
            /***
             * 退出
             */
            $("#userexit").on("click", function () {
                userexit();
            })
        });
    });
    main.find(".pageItem").eq(0).trigger("click");
    mainBox.mCustomScrollbar({
        theme: "minimal-dark"
    });
}

function getNum(n) {
    return n < 10 ? "0" + n : '' + n
}

//文件上传
function doUpload(sel) {
    var formData = new FormData($(sel)[0]);
    $.ajax({
        url: interUrl + '/upload/ajax/upload_file',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            if (res.success) {
                if ($(sel).hasClass("requiredImg")) {
                    var formatImg = res.data.substring(res.data.lastIndexOf(".") + 1)
                    if (formatImg === "jpg" || formatImg === "png" || formatImg === "jpeg" || formatImg === "gif" && res.data != "文件未上传") {
                        bootbox.alert("上传成功");
                        $(sel).attr('data-slt', res.data);
                    } else {
                        bootbox.alert("只能上传jpg、png、jpeg、gif格式");
                        return false;
                    }
                } else {
                    bootbox.alert("上传成功");
                    $(sel).attr('data-url', res.data);
                }
            } else {
                bootbox.alert(res.data);
                return;
            }
        },
        error: function (res) {
            var data = JSON.parse(res)
            console.log(data);
        }
    });
}

function uservalidate() {
    $("#new_infoPass").validate({
        rules: {
            passwd0: {
                required: true
            },
            passwd1: {
                required: true,
                same: true,
                regexPassword: true
            },
            passwd2: {
                required: true,
                equalTo: "#passwd1",
                regexPassword: true
            }
        },
        messages: {
            passwd0: {
                required: "请输入原密码"
            },
            passwd1: {
                required: "请输入新密码"
            },
            passwd2: {
                required: "请重新输入新密码",
                equalTo: "两次输入密码不一致"
            }
        }
    });
    if (!$("#new_infoPass").valid()) {
        return false;
    }
    amendPassword();
}

function amendPassword() {
    var qData = {};
    qData.userid = userId;
    qData.username = userName;
    qData.passwd = $("#passwd0").val();
    qData = JSON.stringify(qData);
    $.ajax({
        type: "POST",
        url: "/userAction/findPwd",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                passwordSc();
            } else {
                bootbox.alert(res.msg);
                return;
            }
        }
    })
}
function passwordSc() {
    var qData = {};
    qData.userid = userId;
    qData.username = userName;
    qData.mima = $("#passwd1").val();
    qData = JSON.stringify(qData);
    $.ajax({
        type: "POST",
        data: qData,
        url: "/userAction/doUpdatePwd",
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                bootbox.alert(res.msg);
                $("#updataPassword").modal("hide");
            } else {
                bootbox.alert(res.msg);
                return;
            }
        }
    })
}

function userinfo() {
    var qData = {};
    qData.userid = userId;
    qData = JSON.stringify(qData);
    $.ajax({
        type: "POST",
        url: "/userAction/findById",
        data: qData,
        contentType: "application/json",
        success: function (data) {
            userdetails(data.msg);
            $('#infoProject').modal('show');
        }
    });
}

function userdetails(details) {
    for (var i in details) {
        $("#User__" + i).val(i === "outDate" || i === "unlockTime" || i === "invalDate" || i === "createDate" || i === "lastLogin" || i === "startDate" || i === "endDate" || i === "birthDate" || i === "inDate" ? dateline(details[i]) : details[i]);
    }
    $(".formsel").attr('data-slt', details.photo);
    $("#User__passwd").val("");
}
function userexit() {
    $.ajax({
        type: "GET",
        url: "/userAction/logout",
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                window.location.href = "./login.jsp"
            } else {
                return;
            }
        }
    });
}

function dateline(now) {
    var thisDate = new Date(now),
        thisFullYear = thisDate.getFullYear(),
        thisMonth = parseInt(thisDate.getMonth()) + 1,
        thisDay = thisDate.getDate(),
        thisHour = thisDate.getHours(),
        thisMinute = thisDate.getMinutes(),
        thisSecond = thisDate.getSeconds();
    return thisFullYear + "-" + getNum(thisMonth) + "-" + getNum(thisDay) + " " + getNum(thisHour) + ":" + getNum(thisMinute) + ":" + getNum(thisSecond);
}
