//# sourceURL=roleManage.js
var pager,
    roleId = "",
    roleVersion = '',
    rolesqId = "",
    zNodes = [],
    saveid;
    zNodes0 = [];


function getData(options) {
    var qData = {
        pageSize: options.pageSize,
        pageNo: options.currentPage,
    };
    options.searchLike ? qData.roleName = options.searchLike : "";
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/sysRole/select",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (data) {
            var table = $("#roleTab"),
                str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                start = (options.currentPage - 1) * options.pageSize,
                end = options.currentPage * options.pageSize < data.totalCount ? options.pageSize : data.totalCount - start;
            if (!pager || options.recreatePager) {
                pager = CreatePagination({
                    pageSize: options.pageSize,
                    pagerId: "#role_page",
                    totalCount: data.totalCount,
                    refreshFun: getData,
                    data: qData
                });
            }
            ;
            if (!data.totalCount) {
                str += "</tbody>";
                table.html("").append(str);
                $("#role_page").parent().find(".page-margin").remove();
                return false;
            }
            ;
            for (var i = 0; i < end; i++) {
                var thisData = data.data[i];
                var thisParam = JSON.stringify(thisData);
                str += "<tr>" +
                    "<td ><label><input type='checkbox' data-id='" + thisData.id + "' data-param='"+thisParam+"'></label></td>" +
                    "<td >" + (start + i + 1) + "</td>" +
                    "<td >" + (thisData.roleCode || "") + "</td>" +
                    "<td >" + (thisData.roleName || "") + "</td>" +
                    "<td>" + getDic("dbzd", thisData.siteId) + "</td>" +
                    "<td>" + ( thisData.createuser || "") + "</td></tr>";
            }
            ;
            str += "</tbody>";
            table.html("").append(str);
            $(".page-margin").html("");
            var pagehtml = "<div class='pull-left page-margin'>共有" + data.totalCount + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + Math.ceil(data.totalCount / options.pageSize) + "页</div>";
            $("#role_page").parent().find(".page-margin").remove().end().append(pagehtml);
            /***
             * 全选
             */
            $('.checkAll').on('click', function () {
                $('#roleTab').find('input').prop("checked", $(this).is(":checked"));
            });
        },
        error: function (data) {
            console.log(data.status);
        }
    })
}


function getDataTree(options) {
    $("#roleztree").html("");
    var qData = {
        siteId:options
    };
    rolesqId?qData.roleId = rolesqId:qData.roleId ="";
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/sysFunction/selectFuncByArgs",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (data) {
            if(data.success){
                var data = data.msg;
                zNodes = [];
                for (var i = 0; i < data.length; i++) {
                    zNodes.push(data[i]);
                }
                newTree();
            }
        }
    })
}
/**
 * tree树
 */
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
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: {"Y": "s", "N": "s"}
        },
        callback: {
            onCheck: function (event, treeId, treeNode) {
                e = event || window.event;
                saveid = treeNode.id;
            }
        }
    };
    var tree = $("#roleztree");
    tree = $.fn.zTree.init(tree, setting, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("roleztree");
    zTree.selectNode(zTree.getNodeByParam("id", saveid?saveid:1));
    var nodes = zTree.getSelectedNodes();
    if (nodes.length > 0) {
        zTree.expandNode(nodes[0], true, false, true);
    }
}

function getRsesourceTree(options) {
    var qData = {
        pageNo: options.currentPage,
        pageSize: options.pageSize,
        sjlx: options.sjlx,
        roleId: options.roleId
    }
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/sysResContent/select",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (data) {
            var data = data.result;
            zNodes0 = [];
            for (var i = 0; i < data.length; i++) {
                zNodes0.push(data[i]);
            }
            resourceNewTree(options.sjlx);
        }
    })
}

//生成tree
function resourceNewTree(i) {
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
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: {"Y": "s", "N": "s"}
        },
        callback: {
            onMouseDown: function (event, treeId, treeNode) {
                e = event || window.event;
                if (treeNode === null) {
                    return;
                }

            }
        }
    };
    //初始化
    zTreeObj = $.fn.zTree.init($("#ztree_" + (i - 1)), setting, zNodes0);
    var zTree = $.fn.zTree.getZTreeObj("ztree_" + (i - 1));
    zTree.selectNode(zTree.getNodeByParam("id", i));
    var nodes = zTree.getSelectedNodes();
    if (nodes.length > 0) {
        zTree.expandNode(nodes[0], true, false, true);
    }
}

function roleamend() {
    var roleArr = [],
        qData = {},
        isChecke = $("#roleTab").find("input:not(:first):checked");
    $(isChecke).each(function () {
        roleArr.push($(this).attr("data-param"))
    })
    if (!roleArr.length) {
        bootbox.alert("请选择要修改的项目");
        return;
    } else if (roleArr.length > 1) {
        bootbox.alert("只能选择一个");
        return;
    }
    var parseRole = JSON.parse(roleArr[0]);
    $("#new_info")[0].reset();
    roledetails(parseRole);
    $('#newProject').modal('show');

}
function roleValidate() {
    $("#new_info").validate({
        rules: {
            roleCode: {
                required: true
            },
            roleName: {
                required: true
            }
        },
        messages: {
            rolecode: {
                required: "请输入角色代码"
            },
            rolename: {
                required: "请输入角色名称"
            }
        }
    });
    if (!$("#new_info").valid()) {
        return false;
    }
    roleSave()
}
function roleSave() {
    var saveArr = {},
        save = $("#new_info");
    save.find("input,select ,textarea").each(function () {
        $(this).val() ? saveArr[$(this).attr("id").substring(5)] = $(this).val() : "";
    });
    var roleSave = roleId ? "update" : "add";
    roleId ? saveArr.id = roleId : saveArr.id = "";
    var Qdata = JSON.stringify(saveArr);
    $.ajax({
        url: "/sysRole/" + roleSave + "",
        type: "POST",
        data: Qdata,
        dataType:"json",
        contentType:"application/json",
        success: function (data) {
            if (data.success) {
                bootbox.alert({
                    message: "保存成功",
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
                bootbox.alert({
                    message: data.msg
                })
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
};

function roledetails(details) {
    for (var i in details) {
        $("#role_" + i).val(details[i]);
    }
    roleId = details.id;
};
function roleDel() {
    var roleTab = $("#roleTab"),
        roleArr = [],
        qData = {},
        isChecke = $(roleTab).find("input:not(:first):checked");
    $(isChecke).each(function () {
        roleArr.push($(this).attr("data-id"));
    });
    qData.id = roleArr.join(",");
    qData = JSON.stringify(qData);
    if (!roleArr.length) {
        bootbox.alert("请选择项目")
        return;
    } else {
        bootbox.confirm({
            message: "确定删除？",
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
                        url: "/sysRole/delete",
                        data: qData,
                        dataType:"json",
                        contentType: "application/json",
                        success: function (data) {
                            if (data.success) {
                                bootbox.alert({
                                    message: data.msg,
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
                    })
                }
            }
        })
    }
};

function treeSave() {
    var obj,
        qData = {
            roleId: rolesqId,
            sysRoleFuncRList: []
        },
        treeObj = $.fn.zTree.getZTreeObj("roleztree"),
        nodes = treeObj.getCheckedNodes(true);
    $.each(nodes, function (i) {
        obj = {};
        obj.funcId = nodes[i].id;
        obj.roleId = rolesqId;
        qData.sysRoleFuncRList.push(obj);
    });
    qData = JSON.stringify(qData);
    $.ajax({
        type: "POST",
        url: "/sysRoleFunc/addAll",
        data: qData,
        dataType:"json",
        contentType: "application/json",
        success: function (data) {
            if (data.success) {
                bootbox.alert(data.msg);
                $("#role-management").modal("hide");
            }
        }
    })

}

function treeSeverSave() {
    var qData = {},
        severArr = [], treeObj1, treeObj2, treeObj3, treeObj4, nodes1, nodes2, nodes3, nodes4;
    treeObj1 = $.fn.zTree.getZTreeObj("ztree_0");
    treeObj1 === null ? nodes1 = [] : nodes1 = treeObj1.getCheckedNodes(true);
    treeObj2 = $.fn.zTree.getZTreeObj("ztree_1");
    treeObj2 === null ? nodes2 = [] : nodes2 = treeObj2.getCheckedNodes(true);
    treeObj3 = $.fn.zTree.getZTreeObj("ztree_2");
    treeObj3 === null ? nodes3 = [] : nodes3 = treeObj3.getCheckedNodes(true);
    treeObj4 = $.fn.zTree.getZTreeObj("ztree_3");
    treeObj4 === null ? nodes4 = [] : nodes4 = treeObj4.getCheckedNodes(true);
    qData.roleId = rolesqId;
    $.each(nodes1, function (i) {
        severArr.push(nodes1[i].id);
    });
    $.each(nodes2, function (i) {
        severArr.push(nodes2[i].id)
    });
    $.each(nodes3, function (i) {
        severArr.push(nodes3[i].id)
    });
    $.each(nodes4, function (i) {
        severArr.push(nodes4[i].id)
    })
    qData.conId = severArr.join(",");
    qData = JSON.stringify(qData);
    $.ajax({
        type: "POST",
        url: "/SysRoleContentAction/save",
        data: qData,
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                bootbox.alert(res.msg);
                $("#role-management").modal("hide");
            } else {
                bootbox.alert(res.msg);
                return;
            }
        }
    })
}

$(function () {
    var source_heading = $("#ser-resource").find(".source_heading");
    getData({
        pageSize: "10",
        currentPage: "1",
        recreatePager: true
    });
    createOptions([{
        selector: "#role_siteId",
        key: "dbzd"
    }]);
    /***
     * 高级查询
     */
    $('#advanced-query').on('click', function () {
        $('.control-modal').slideToggle();
    });
    $('#packUp').on('click', function () {
        $('.control-modal').slideUp();
    });
    /***
     * 模糊查询
     */
    $("#role_search").on("click", function () {
        getData({
            pageSize: "10",
            currentPage: "1",
            recreatePager: true,
            searchLike: $("#search").val()
        });
        $("#search").val("");
    })

    /***
     * 新建
     */
    $('#newObj').on('click', function () {
        $("#new_info")[0].reset();
        $('#newProject').modal('show');
        $("#new_info").find("input").removeClass("error").next("label").hide();
        roleId = "";
        roleVersion = "";
    });
    /***
     *保存
     */
    $("#role_saveRole").on("click", function () {
        roleValidate();
    });
    /***
     * 修改
     */
    $("#modification").on("click", function () {
        $("#new_info").find("input").removeClass("error").next("label").hide();
        roleamend();
    });
    /***
     * 删除
     */
    $("#role_delete").on("click", function () {
        roleDel()
    })
    /***
     * 角色授权
     */

    $("#role").on("click", function () {
        var roleArr = [],
            isChecke = $("#roleTab").find("input:not(:first):checked");
        $.each(isChecke, function () {
            roleArr.push($(this).attr("data-param"));
        })
        if (!roleArr.length) {
            bootbox.alert("请选择项目")
            return;
        } else if (roleArr.length > 1) {
            bootbox.alert("只能选择一个")
            return;
        } else {
            var roleObj = JSON.parse(roleArr);
            rolesqId = roleObj.id;
            $("#role-management").modal("show");
            $("#tit_Role").tab("show");
            $("#ser-resource").find(".panel-collapse:not(:first)").removeClass("in");
            $("#tree_save").show();
            $("#server_save").hide();
            getDataTree(roleObj.siteId);
        }
        source_heading.eq(0).trigger("click");
    })
    /***
     * 授权保存
     */
    $("#tree_save").on("click", function () {
        treeSave()
    })
    // $(".role_content").mCustomScrollbar({
    //     theme: "minimal-dark"
    // });
    /***
     * 服务资源
     */
    $("#server_save").on("click", function () {
        treeSeverSave();
    })
    $("#tit_Sever").on("click", function () {
        $("#server_save").css("display", "inline-block");
        $("#tree_save").hide();
    });
    $("#tit_Role").on("click", function () {
        $("#server_save").hide();
        $("#tree_save").show();
    });
    source_heading.on("click", function (e) {
        e.preventDefault();
        var _this = $("#ser-resource").find(".source_heading").index($(this));
        getRsesourceTree({
            currentPage: "1",
            pageSize: "500",
            sjlx: _this + 1,
            roleId: rolesqId
        });
    });

});
