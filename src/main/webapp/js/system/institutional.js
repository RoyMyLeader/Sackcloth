//# sourceURL=institutional.js
var imageMenuData;
var zNodes = [];
var pager;
var savepid, glob_version,
    saveid; //目标树节点id


//文档树请求数据
function getData(options) {
    var qData = {
        pageNo: options.currentPage,
        pageSize: options.pageSize
    };
    options.id ? qData.id = options.id : "";
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/organization/select",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            // console.log(res)
            var data = res.result;
            if (data) {
                zNodes = [{id: 1, pid: 0, name: "组织机构树", open: true, isParent: true}];
                for (var i = 0; i < data.length; i++) {
                    zNodes.push(data[i]);
                }
                //创建文件树
                newTree();
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

//增加员工弹出框关联用户查询
function getRelation(options) {
    var qData = {
        pageSize: options.pageSize,
        pageNo: options.currentPage,
        orgId: options.orgId
    };
    qData.search = options.search;
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/userAction/findUserPageAndOrg",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res.result) {
                // console.log(res)
                var data = res.result;
                var table = $("#tabUser"),
                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                    start = (options.currentPage - 1) * options.pageSize,
                    end = options.currentPage * options.pageSize < res.total ? options.pageSize : res.total - start;
                if (!pager || options.recreatePager) {
                    pager = CreatePagination({
                        pageSize: options.pageSize,
                        pagerId: "#user_page",
                        totalCount: res.total,
                        jumpBox: false,
                        refreshFun: getRelation,
                        data: qData
                    });
                }
                if (data.length ==0) {
                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr><tr><td colspan='9'>暂无数据</td></tr>";
                    var pagehtml = "<div class='pull-left page-margin'>共有0条记录</div>";
                }else{
                    var checkes, data_userId, data_orgId;
                    for (var i = 0; i < end; i++) {
                        var thisData = data[i];
                        // var paramold = JSON.stringify(thisData);   param='" + paramold + "'
                        var createTime = FormatDate(thisData.createDate);
                        checkes = thisData.userFlag ? 'checked' : "";
                        data_userId = thisData.userid ? thisData.userid : "";
                        data_orgId = options.orgId ? options.orgId : "";
                        str += "<tr>" +
                            "<td data-Id=" + data_userId + " data-org=" + data_orgId + " class='tdBlank'><label><input type='checkbox' " + checkes + "></label></td>" +
                            "<td>" + (start + i + 1) + "</td>" +
                            "<td>" + (thisData.username || "") + "</td>" +
                            "<td>" + (thisData.nickName || "") + "</td>" +
                            "<td>" + ( thisData.authMode || "") + "</td>" +
                            "<td>" + ( thisData.status || "") + "</td>" +
                            "<td>" + ( thisData.userType || "") + "</td>" +
                            "<td>" + ( thisData.createUser || "") + "</td>" +
                            "<td>" + ( createTime || "") + "</td></tr>";
                    }
                    str += "</tbody>";
                    var pagehtml = "<div class='pull-left page-margin' >共有" + (res.total || "0") + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + (Math.ceil(res.total / options.pageSize) || "0") + "页</div>";
                }
                table.html("").append(str);
                $("#user_page").parent().find(".page-margin").remove().end().append(pagehtml);
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

//文件树初始化
function newTree() {
    var setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: ""
            }
        },
        callback: {
            onMouseDown: function (event, treeId, treeNode) {

                //左侧文件树点击右侧请求
                e = event || window.event;
                if (treeNode == null) {
                    return;
                }
                saveid = treeNode.id;
                savepid = treeNode.pid;
                glob_version = treeNode.version;
                if (e.which == 1) {
                    if ($(e.target).prev().hasClass("ico_close") || $(e.target).prev().hasClass("ico_open") ||$(e.target).closest('a').attr('target')) {
                        $('#pidName_1').attr('pidName', treeNode.name);
                        $('#pidName').attr('pid', treeNode.pid);
                        $('#pidName').attr('data-name', treeNode.name);
                        $("#nature_org").find("input,select").removeClass("error").next("label").hide();
                        //本级机构属性查询
                        nature({
                            id: treeNode.id
                        });
                        //关联用户请求
                        getUsers({
                            currentPage: 1,
                            pageSize: 10,
                            recreatePager: true,
                            orgId: treeNode.id
                        });
                        //下级机构请求
                        subsidiaries({
                            currentPage: 1,
                            pageSize: 10,
                            recreatePager: true,
                            pid: treeNode.id
                        })
                    }
                }

            }
        }
    };
    var t = $("#tree");
    t = $.fn.zTree.init(t, setting, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("tree");
    zTree.selectNode(zTree.getNodeByParam("id",saveid?saveid:1));
    var nodes = zTree.getNodes();
    for (var i = 0; i < nodes.length; i++) { //设置节点展开
        zTree.expandNode(nodes[i], true, false, true);
    }
}


//本级机构属性查询
function nature(option) {
    var qData = {
        id: option.id
    };
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/organization/getById",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res) {
                glob_version = res.version;
                var List = $('#institution_b');
                List.find("input,select,textarea").each(function () {
                    this.value = res[$(this).attr("id")] ? res[$(this).attr("id")] : "";
                });
                var createTime = FormatDate(res.startDate),
                    endTime = FormatDate(res.endDate);
                $('#startDate').val(createTime);
                $('#endDate').val(endTime);
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

//下级机构表
function subsidiaries(options) {
    var qData = {
        pageSize: options.pageSize,
        pageNo: options.currentPage
    };
    qData.pid = options.pid || "";
    qData.name = options.name || "";
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/organization/select",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res.result) {
                var data = res.result;
                var table = $("#institution_x").find('table'),
                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                    start = (options.currentPage - 1) * options.pageSize,
                    end = options.currentPage * options.pageSize < res.total ? options.pageSize : res.total - start;
                if (!pager || options.recreatePager) {
                    pager = CreatePagination({
                        pageSize: options.pageSize,
                        pagerId: "#subsidiaries_page",
                        totalCount: res.total,
                        refreshFun: subsidiaries,
                        data: qData
                    });
                }
                if (!res.result.length) {
                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr><tr><td colspan='8'>暂无下级机构</td></tr></tbody>";
                    var pagehtml = "<div class='pull-left page-margin'>共有0条记录</div>";
                }else{
                    for (var i = 0; i < end; i++) {
                        var thisData = data[i];
                        // var paramold = JSON.stringify(thisData);   param='" + paramold + "'
                        var createTime = FormatDate(thisData.createTime);
                        str += "<tr >" +
                            "<td>" + (start + i + 1) + "</td>" +
                            "<td>" + (thisData.name || "") + "</td>" +
                            "<td>" + (thisData.orgCode || "") + "</td>" +
                            "<td>" + ( thisData.pidName || "") + "</td>" +
                            "<td>" + ( thisData.orgDegree || "") + "</td>" +
                            "<td>" + ( thisData.status || "") + "</td>" +
                            "<td>" + (  createTime || "") + "</td>" +
                            "<td>" + ( thisData.remark || "") + "</td></tr>";
                    }
                    str += "</tbody>";
                    var pagehtml = "<div class='pull-left page-margin'>共有" + res.total + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + Math.ceil(res.total / options.pageSize) + "页</div>";
                }
                table.html("").append(str);
                $("#subsidiaries_page").parent().find(".page-margin").remove().end().append(pagehtml);
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

//右键事件
function rightClick(e) {
    if (e.which == 3) {
        var opertionn = {
            name: "",
            offsetX: 2,
            offsetY: 2,
            textLimit: 10,
            beforeShow: $.noop,
            afterShow: $.smartMenu.remove()
        };
        var _tid = $(e.target).closest('li').attr('id');
        // var _pid = $(e.target).closest('li').attr('newId');  //获取事件源的id作为pid传给下级
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var _cnode = treeObj.getNodeByTId(_tid);
        var _name = _cnode.name;
        imageMenuData = [
            [{
                text: "增加下级机构",
                func: function () {
                    $("#xj_modal").find("input,select").removeClass("error").next("label").hide();
                    $("#xj_modal").modal("show");
                    $("#xj_modal").find("input,select,textarea").val('');
                    var value = $('#pidName_1').attr("pidName");
                    $('#pidName_1').val(value);
                    $("#xj_yes").off("click");
                    var arr = [];
                    var obj = {};
                    var ModalId;
                    $("#xj_yes").on("click", function () {
                        var xj_modal = $('#xj_modal');
                        xj_modal.find("input,select,textarea").each(function (index, item) {
                            ModalId = $(this).attr('id').split('_1')[0];
                            arr.push(ModalId);
                            obj[arr[index]] = $(item).val();
                        });

                        obj["pid"] = saveid;
                        //   console.log(obj)
                        //添加请求,表单验证
                        tabValiDate(obj);
                    });
                }
            }],
            [{
                text: "编辑机构员工",
                func: function () {
                    $('#organization_modal').modal('show');
                    getRelation({
                        currentPage: 1,
                        pageSize: 10,
                        recreatePager: true,
                        orgId: saveid
                    });
                    $('#btn-save').on('click', function () {
                        // if($('#tabUser').find('td').hasClass('.tdBlank')){
                        var obj = [], allList = [];
                        $('.tdBlank').each(function (index, item) {
                            allList.push({
                                "orgId": $(item).attr('data-org'),
                                "userId": $(item).attr('data-Id')
                            });
                        });
                        $('.tdBlank').find("input:checked").each(function (index, item) {
                            obj.push({
                                "orgId": $(item).closest('.tdBlank').attr('data-org'),
                                "userId": $(item).closest('.tdBlank').attr('data-Id')
                            });
                        });
                        //添加用户机构表接口
                        addUserMes({userOrgRList: obj, userOrgRListAll: allList})
                        //}
                    })
                }
            }]
            ,
            [{
                text: "删除本级机构",
                func: function () {
                    $.each(zNodes, function (index, item) {
                        if ((zNodes[index].name == _name)) {
                            if (zNodes[index].id == 1) {
                                return
                            } else {
                                delOrginal({
                                    id: zNodes[index].id
                                })
                            }
                        }
                    });
                }
            }],
            [{
                text: "刷新",
                func: function () {
                    zNodes = [
                        {id: 1, pid: 0, name: "组织机构树", open: true, isParent: true}
                    ];
                    getData({
                        currentPage: "1",
                        pageSize: "500"
                    });
                }
            }]
        ];
        $(e.target).smartMenu(imageMenuData, opertionn);
    }
}

//组织机构添加请求
function addMes(option) {
    var qData = {};
    for(var i in option){
        qData[i] = option[i] ? option[i] : "" ;
    }
    qData.orgSeq = option.orgSeq ? option.orgSeq : "";
    qData.deleted = option.deleted ? option.deleted : "";
    qData.pid = option.pid ? option.pid : "";
    qData.open = option.open ? option.open : true;
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/organization/add",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                bootbox.alert({
                    message: res.msg,
                    callback: function () {
                        $('#xj_modal').modal('hide');
                        getData({
                            currentPage: "1",
                            pageSize: "500",
                            id: saveid
                        });
                        subsidiaries({
                            currentPage: 1,
                            pageSize: 10,
                            recreatePager: true,
                            pid: saveid
                        });
                    }
                })
            } else {
                bootbox.alert("添加失败")
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

// 修改组织机构接口
function amend(option) {
    debugger
    var qData = {
        id: option.id,
        version: glob_version,
        isParent: option.isParent
    };
    for(var i in option){
        qData[i] = option[i] ? option[i] : "" ;
    }
    qData.open = option.open ? option.open : false;
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/organization/update",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            //  console.log(res)
            if (res.success) {
                bootbox.alert({
                    message: res.msg,
                    callback: function () {
                        $('#organization_modal').modal('hide');
                        getData({
                            currentPage: "1",
                            pageSize: "500",
                            id: saveid
                        });
                        nature({
                            id: saveid
                        });
                    }
                })
            } else {
                bootbox.alert("修改失败")
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

//删除组织机构
function delOrginal(option) {
    var qData = {
        id: option.id
    };
    qData = JSON.stringify(qData);
    bootbox.confirm({
        message: "确定删除此机构下所有信息？",
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
                    url: "/organization/delete",
                    type: "POST",
                    dataType: "json",
                    data: qData,
                    contentType: "application/json",
                    success: function (res) {
                        if (res.success) {
                            bootbox.alert(res.msg);
                            $('#organization_modal').modal('hide');
                            $('#institution_b').find("input,select,textarea").val("");
                            getData({
                                currentPage: "1",
                                pageSize: "500"
                            });
                            subsidiaries({
                                currentPage: 1,
                                pageSize: 10,
                                recreatePager: true,
                                pid: 1
                            });
                            getUsers({
                                currentPage: 1,
                                pageSize: 10,
                                recreatePager: true,
                                orgId: 1
                            });
                        } else {
                            bootbox.alert("删除失败")
                        }
                    },
                    error: function () {
                        console.log("Failed...");
                    }
                })
            }
        }
    })
}

//编辑用户机构表
function addUserMes(option) {
    var qData = {
        userOrgRList: option.userOrgRList,
        userOrgRListAll: option.userOrgRListAll
    };
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/userAndOrg/add",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            //   console.log(res)
            if (res.success) {
                bootbox.alert({
                    message: res.msg,
                    callback: function () {
                        $('#organization_modal').modal('hide');
                        getData({
                            currentPage: "1",
                            pageSize: "500",
                            id: saveid
                        });
                        getUsers({
                            currentPage: 1,
                            pageSize: 10,
                            recreatePager: true,
                            orgId: saveid
                        });

                    }
                })
            } else {
                bootbox.alert("编辑失败")
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

//查询机构下的关联用户
function getUsers(options) {
    var qData = {
        pageSize: options.pageSize,
        pageNo: options.currentPage,
        orgId: options.orgId
    };
    qData.search = options.search;
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/userAndOrg/getUsersByOrgId",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            var table = $("#institution_user").find('table');
            var str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>";
            if (res.success) {
                var data = res.msg.result;
                if (data.length) {
                    var start = (options.currentPage - 1) * options.pageSize,
                        end = options.currentPage * options.pageSize < res.msg.total ? options.pageSize : res.msg.total - start;
                    if (!pager || options.recreatePager) {
                        pager = CreatePagination({
                            pageSize: options.pageSize,
                            pagerId: "#org_page",
                            totalCount: res.msg.total,
                            refreshFun: getUsers,
                            data: qData
                        });
                    }
                    for (var i = 0; i < end; i++) {
                        var thisData = data[i];
                        // var paramold = JSON.stringify(thisData);   param='" + paramold + "'
                        str += "<tr >" +
                            "<td>" + (start + i + 1) + "</td>" +
                            "<td>" + (thisData.username || "") + "</td>" +
                            "<td>" + (thisData.nickName || "") + "</td>" +
                            "<td>" + ( thisData.authMode || "") + "</td>" +
                            "<td>" + ( thisData.status || "") + "</td>" +
                            "<td>" + ( thisData.mobiLeno || "") + "</td>" +
                            "<td>" + ( thisData.createUser || "") + "</td></tr>";
                    }
                    str += "</tbody>";
                } else {
                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr><tr><td colspan='7'>该组织机构下没有用户</td></tr></tbody>";
                }
            }
            else {
                str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr><tr><td colspan='6'>" + res.msg + "</td></tr></tbody>";
            }
            table.html("").append(str);
            var pagehtml = "<div class='pull-left page-margin'>共有" + (res.msg.total || "0" ) + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + (Math.ceil(res.msg.total / options.pageSize) || "0") + "页</div>";
            $("#org_page").parent().find('.page-margin').remove().end().append(pagehtml);
        },
        error: function () {
            console.log("Failed...");
        }
    });
}

/**
 * 表单验证 修改
 */

function tabChValiDate(obj) {
    $('#nature_org').validate({
        rules: {
            name: {
                required: true
            },
            orgCode: {
                required: true
            },
            orgType: {
                required: true
            },
            orgDegree: {
                required: true
            },
            status: {
                required: true
            },
            orgManager: {
                required: true
            },
            sortNo: {
                number: true,
                maxlength: 3
            },
            linkMan: {
                required: true
            },
            linkTel: {
                isTel: true
            },
            endDate: {
                required: true,
                laterTo: "#startDate_1"
            }
        }
    });
    if (!$("#nature_org").valid()) {
        return false;
    } else {
        amend(obj)
    }
}

/**
 * 表单验证  t添加
 */

function tabValiDate(obj) {
    $('#createOrga').validate({
        rules: {
            name_1: {
                required: true
            },
            orgCode_1: {
                required: true
            },
            orgType_1: {
                required: true
            },
            orgDegree_1: {
                required: true
            },
            status_1: {
                required: true
            },
            orgManager_1: {
                required: true
            },
            sortNo_1: {
                number: true,
                maxlength: 3
            },
            linkMan_1: {
                required: true
            },
            linkTel_1: {
                isTel: true
            },
            endDate_1: {
                required: true,
                laterTo: "#startDate_1"
            }
        }
    });
    if (!$("#createOrga").valid()) {
        return false;
    } else {
        addMes(obj)
    }

}


$(function () {
    getData({
        currentPage: "1",
        pageSize: "500"
    });
    subsidiaries({
        currentPage: 1,
        pageSize: 10,
        recreatePager: true,
        pid: 1
    });
    getUsers({
        currentPage: 1,
        pageSize: 10,
        recreatePager: true,
        orgId: 1
    });
    // $("#subsidiaries-query").on("click", function () {
    //     $(".subsidiaries-modal").slideToggle();
    // });
    // $("#users-query").on("click", function () {
    //     $(".users-modal").slideToggle();
    // });
    // $("#modal-query").on("click", function () {
    //     $(".modal-box").slideToggle();
    // });

    $(".packUp").on("click", function () {
        $(".modal-box").slideUp();
        $(".subsidiaries-modal").slideUp();
        $(".users-modal").slideUp();
    });

    //左侧文档树鼠标事件
    $("#leftTable").on("mousedown", function (e) {
        e = e || window.event;
        if ($(e.target).prev().hasClass("ico_close") || $(e.target).prev().hasClass("ico_open")) {
            rightClick(e)
        }
    });

    $('#xg_btnSure').on('click', function () {
        var List = $('#institution_b');
        var ary = [];
        var object = {};
        var ModalId;
        List.find("input,select,textarea").each(function (index, item) {
            ModalId = $(this).attr('id');
            ary.push(ModalId);
            object[ary[index]] = $(item).val();
        });
        object["id"] = saveid;
        object["pid"] = $('#pidName').attr('pid');
        object["isParent"] = true;

        //  console.log(object)
        //组织机构修改+表单验证
        tabChValiDate(object)
    });

    $('#xg_btnCacle').on('click', function () {
        $("#nature_org").find("input,select").removeClass("error").next("label").hide();
    });


    //模糊查询下级机构
    $('#searchDown').on('click',function (ev) {
        var e = ev || window.event,
            text = $('#search_text').val();
        if(e.which == 1){
            subsidiaries({
                currentPage: 1,
                pageSize: 10,
                recreatePager: true,
                pid:saveid,
                name:text
            });
        }
        $('#search_text').val('');
    });

    //模糊查询关联用户
    $('#releBtn').on('click',function (ev) {
        var e = ev || window.event,
            textUser = $('#search').val();
        if(e.which == 1){
            getUsers({
                currentPage: 1,
                pageSize: 10,
                recreatePager: true,
                orgId:saveid,
                name:textUser
            });
        }
        $('#search').val('');
    });

    //模糊查询员工
    $('#staffBtn').on('click',function (ev) {
        var e = ev || window.event,
            textstaff = $('#search_staff').val();
        if(e.which == 1){
            getRelation({
                currentPage: 1,
                pageSize: 10,
                recreatePager: true,
                orgId:saveid,
                search:textstaff
            });
        }
        $('#search_staff').val('');
    })
});
