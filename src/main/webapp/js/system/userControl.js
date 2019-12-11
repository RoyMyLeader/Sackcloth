//# sourceURL=userControl.js
var pager,
    saveId = "",
    saveVersion = "",
    _userId = "";
$(function () {
    var userControl = (function () {
        //控件
        function contrrols() {
            /**
             * Desc: 新建
             */
            $('#newObj').on('click', function () {
                $('#newProject').modal('show');
                $("#login_form").find("input").removeClass("error").next("label").hide();
                // $("#login_tit").tab("show");
                $(".modal-tit").html("新建");
                $("#login_form")[0].reset();
                saveId = "";
                saveVersion = "";
            });
            /***
             * 修改
             */
            $("#amend").on("click", function () {
                $("#login_tit").tab("show");
                $("#login_form,#person_form2,#person_form1").find("input").removeClass("error").next("label").hide();
                useramend();
            });
            /***
             * 用户受权
             */
            $("#user_limits").on("click", function () {
                userLimits();

            });
            /***
             * 模糊查询
             */
            $("#user_search").on("click", function () {
                getData({
                    currentPage: "1",
                    pageSize: "10",
                    recreatePager: true,
                    nickName: $("#search").val()
                });
                $("#search").val("");
            })
            /***
             * 高级查询
             */
            $('#advanced-query').on('click', function () {
                $('.control-modal').slideToggle();
            });
            $("#high_query").on("click", function () {
                getData({
                    currentPage: "1",
                    pageSize: "10",
                    recreatePager: true,
                    nickName: $("#nickName").val(),
                    username: $("#username").val(),
                    authMode: $("#authMode").val()
                });
            });
            $("#high_clear").on("click", function () {
                $("#high_form")[0].reset();
            })
            $('#packUp').on('click', function () {
                $('.control-modal').slideUp();
            });
            /***
             * 添加全部授权
             */
            $("#role_Allimpower").on("click", function () {
                $(".user_boxLeft").append($(".user_boxRight li"))
            });

            /**
             * 取消全部授权
             */
            $("#role_Allcancel").on("click", function () {
                $(".user_boxRight").append($(".user_boxLeft li"))
            });
            /***
             * 用户权限保存
             */
            $("#role_Btnsave").on("click", function () {
                roleSave();
            });
            $("label").on("click",function(e){
                e.preventDefault();
            })
        }

        function getData(options) {
            var qData = {
                pageSize: options.pageSize,
                pageNo: options.currentPage
            };
            options.nickName ? qData.nickName = options.nickName : "";
            qData=JSON.stringify(qData);
            $.ajax({
                url: "/sysUser/select",
                type: "POST",
                dataType: "json",
                data: qData,
                contentType: "application/json",
                success: function (data) {
                    var table = $("#userTab"),
                        str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                        start = (options.currentPage - 1) * options.pageSize,
                        end = options.currentPage * options.pageSize < data.totalCount ? options.pageSize : data.totalCount - start;
                    if (!pager || options.recreatePager) {
                        pager = CreatePagination({
                            pageSize: options.pageSize,
                            pagerId: "#user_page",
                            totalCount: data.totalCount,
                            refreshFun: getData,
                            data: qData
                        });
                    }
                    if (!data.totalCount) {
                        str += "</tbody>";
                        table.html("").append(str);
                        $("#user_page").parent().find(".page-margin").remove();
                        return false;
                    }
                    for (var i = 0; i < end; i++) {
                        var thisData = data.data[i];
                        var thisParam = JSON.stringify(thisData);
                        str += "<tr>" +
                            "<td><label><input type='checkbox' data-id='" + thisData.id + "' data-param='"+thisParam+"'></label></td>" +
                            "<td>" + (start + i + 1) + "</td>" +
                            "<td>" + (thisData.userName || "") + "</td>" +
                            "<td>" + (thisData.nickName || "") + "</td>" +
                            "<td>" + ( thisData.userType == '1'? "内部人员":"注册用户") + "</td>" +
                            "<td>" + ( thisData.address || "") + "</td>" +
                            "<td>" + ( thisData.createtime || "") + "</td>" +
                            "<td>" + ( thisData.createuser || "") + "</td>" +
                            "<td>" + ( thisData.status == '1'?"正常":"停用") + "</td></tr>";
                    }
                    str += "</tbody>";
                    table.html("").append(str);
                    var pagehtml = "<div class='pull-left page-margin'>共有" + data.totalCount + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + Math.ceil(data.totalCount / options.pageSize) + "页</div>";
                    $("#user_page").parent().find(".page-margin").remove().end().append(pagehtml);

                    /***
                     * 全选
                     */
                    $(".checkAll").on("click", function () {
                        $('#userTab').find('input').prop("checked", $(this).is(":checked"));
                    });
                },
                error: function () {
                    console.log("Failed...");
                }
            });
        }

        function useramend() {
            debugger
            var amendArr = [],
                qData = {},
                isChecke = $("#userTab").find("input:not(:first):checked");
            $(isChecke).each(function () {
                amendArr.push($(this).attr("data-param"))
            });
            if (!amendArr.length) {
                bootbox.alert("请选择要修改的项目");
                return;
            } else if (amendArr.length > 1) {
                bootbox.alert("只能选择一个");
                return;
            }
            var parseUser = JSON.parse(amendArr[0]);
            userdetails(parseUser);
            saveId = parseUser.id;
            $(".modal-tit").html("修改");
            $('#newProject').modal('show');
            // qData.id = amendArr.join(",");
            // qData = JSON.stringify(qData);
            // $.ajax({
            //     type: "POST",
            //     url: "/sysUser/getById",
            //     data: qData,
            //     contentType: "application/json",
            //     success: function (data) {
            //         userdetails(data.msg);
            //         saveId = data.msg.userid;
            //         saveVersion = data.msg.version;
            //         $('#newProject').modal('show');
            //     }
            // });

        }

        function userdetails(details) {
            for (var i in details) {
                $("#user_" + i).val(details[i]);
            }
            $(".formsel").attr('data-slt', details.photo);
            $("#user_password").val("");
        }

        function uservaliDate() {
            $("#login_form").validate({
                rules: {
                    nickName: {
                        required: true
                    },
                    userName: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                }, messages: {
                    nickName: {
                        required: "请输入真实姓名"
                    },
                    userName: {
                        required: "请输入登录名"
                    },
                    password: {
                        required: "请输入密码"
                    }
                }
            });
            if (!$("#login_form").valid()) {
                $("#login_tit").tab("show");
                return false;
            }
            userSave();
        }

        function userSave() {
            var saveArr = {},
                userInfo = $(".userInfo");
            userInfo.find("input,select").each(function () {
                $(this).val() ? saveArr[$(this).attr("id").substring(5)] = $(this).val() : "";
            });
            var saveAdd = saveId ? "update" : "addUser";
            saveId ? saveArr.id = saveId : saveArr.id = "";
            var Qdata = JSON.stringify(saveArr);
            $.ajax({
                url: "/sysUser/" + saveAdd + "",
                data: Qdata,
                success: function (data) {
                    if (data.success) {
                        bootbox.alert({
                            message: data.msg,
                            callback: function () {
                                $('#newProject').modal('hide');
                                getData({
                                    pageSize: "10",
                                    currentPage: "1",
                                    recreatePager: true
                                })
                            }
                        })
                    } else {
                        bootbox.alert(data.msg);
                        return;
                    }
                },
                error: function (data) {
                    console.log(data.status);
                }
            });
        };
        function del() {
            $("#delete").on("click", function () {
                var arr = [],
                    qData = {},
                    isChecke = $("#userTab").find("input:not(:first):checked");
                $(isChecke).each(function () {
                    arr.push($(this).attr("data-id"))
                });
                qData.id = arr.join(",");
                qData = JSON.stringify(qData);
                if (arr.length == 0) {
                    bootbox.alert("请先勾选一个用户");
                    return;
                } else {
                    bootbox.confirm({
                        message: "确定删除该用户？",
                        buttons: {
                            confirm: {
                                label: '确定',
                                className: 'btn-success'
                            },
                            cancel: {
                                label: '取消',
                                className: 'btn-danger'
                            }
                        },
                        callback: function (result) {
                            if (result) {
                                $.ajax({
                                    type: "POST",
                                    url: "/sysUser/delete",
                                    data: qData,
                                    contentType: "application/json",
                                    success: function (data) {
                                        if (data.success) {
                                            bootbox.alert({
                                                message: "删除成功",
                                                callback: function () {
                                                    getData({
                                                        currentPage: 1,
                                                        pageSize: 10,
                                                        recreatePager: true
                                                    });
                                                }
                                            });
                                        } else {
                                            bootbox.alert(data.msg);
                                            return;
                                        }

                                    }
                                });
                            }
                        }
                    })
                }
            });
        };
        function userLimits() {
            var arr = [],
                qData = {},
                isChecke = $("#userTab").find("input:not(:first):checked");
            $(isChecke).each(function () {
                arr.push($(this).attr("data-id"));
            });
            if (!arr.length) {
                bootbox.alert("请勾选一个用户");
                return;
            } else if (arr.length > 1) {
                bootbox.alert("只能选择一下");
                return;
            } else {
                _userId = arr[0];
                $("#jurisdiction").modal("show");
                qData.userId = _userId;
                qData = JSON.stringify(qData);
                $.ajax({
                    type: "POST",
                    url: "/sysRole/selectRoleByArgs",
                    contentType: "application/json",
                    data: qData,
                    success: function (data) {
                        if(!data.success){
                            return;
                        }
                        var userboxR = $(".user_boxRight"),
                            userboxL = $(".user_boxLeft"),
                            data = data.msg,
                            arrLeft = [],
                            arrRight = [],
                            strLeft = "",
                            strRight = "";
                        if (!data.length) {
                            userbox.html("");
                            return;
                        }
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].roleFlag) {
                                arrLeft.push(data[i])
                            } else {
                                arrRight.push(data[i])
                            }
                        }
                        for (var i = 0; i < arrLeft.length; i++) {
                            strLeft += "<li data-id='" + arrLeft[i].id + "'><span class='glyphicon glyphicon glyphicon-user'></span>&nbsp;<span>" + arrLeft[i].roleName + "</span></li>"
                        }
                        userboxL.html("").append(strLeft);
                        for (var i = 0; i < arrRight.length; i++) {
                            strRight += "<li data-id='" + arrRight[i].id + "'><span class='glyphicon glyphicon glyphicon-user'></span>&nbsp;<span>" + arrRight[i].roleName + "</span></li>"
                        }
                        userboxR.html("").append(strRight);
                        userboxR.on("click", "li", function () {
                            $(this).appendTo(userboxL);
                        });
                        userboxL.on("click", "li", function () {
                            $(this).appendTo(userboxR);
                        });
                    }

                })

            }
        }

        function roleSave() {
            var arr = [],
                qData = {},
                isChecke = $(".user_boxLeft").find("li");
            $(isChecke).each(function () {
                arr.push($(this).attr("data-id"))
            });
            qData.userId = _userId;
            qData.listSysUserRoleR = arr;
            qData = JSON.stringify(qData);
            $.ajax({
                type: "POST",
                url: "/sysUserRole/addAll",
                data: qData,
                contentType: "application/json",
                success: function (data) {
                    if (data.success) {
                        bootbox.alert(data.msg);
                        $("#jurisdiction").modal("hide");
                    } else {
                        bootbox.alert(data.msg);
                        return;
                    }
                }
            })
        }

        /**
         * init初始化的函数
         */
        function init() {
            //控件
            contrrols();
            //删除
            del();
            //保存
            $("#user_save").on("click", function () {
                uservaliDate();
            });
            getData({
                pageSize: "10",
                currentPage: "1",
                recreatePager: true
            });
            // createOptions([{
            //     selector: "#user_authMode",
            //     key: "mmrz"
            // }, {
            //     selector: "#user_gender",
            //     key: "sex",
            //     empty: true
            // }, {
            //     selector: "#user_cardType",
            //     key: "zjlx"
            // }]);
        }

        return {
            init: init
        }
    })();
    /**
     * 调用初始化方法
     */
    userControl.init();


});