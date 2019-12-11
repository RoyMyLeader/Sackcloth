//# sourceURL=menu.js
var imageMenuData,
    savepid = "",
    upversion = "",
    uppid = "",
    zNodes = [];

function getData() {
    var qData = {
    };
    qData.id ="";
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
/***
 *
 * 树tree
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
        callback: {
            onMouseDown: function (event, treeId, treeNode) {
                e = event || window.event;
                $("#menu_formMode,#menu_form").find("input").removeClass("error").next("label").hide();
                if (treeNode === null) {
                    return;
                }
                if (treeNode.pid === "") {
                    $("#menu_btnSave").attr("disabled", true);
                } else {
                    $("#menu_btnSave").attr("disabled", false);
                }
                savepid = treeNode.id;
                uppid = treeNode.pid;
                upversion = treeNode.version;
                if (e.which == 1) {
                    if ($(e.target).prev().hasClass("ico_close") || $(e.target).prev().hasClass("ico_open") ||$(e.target).prev().hasClass("ico_docu")) {
                        menuDetails({
                            id: treeNode.id,
                            pid:treeNode.pid
                        });
                    }
                }
            }
        }
    };
    var tree = $("#ztree");
    tree = $.fn.zTree.init(tree, setting, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("ztree");
    zTree.selectNode(zTree.getNodeByParam("id", 1));
    var nodes = zTree.getSelectedNodes();
    if (nodes.length > 0) {
        zTree.expandNode(nodes[0], true, false, true);
    }
}

/***
 *
 * 右键事件
 */
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

        var _innerText = e.target.innerText,
            _tid = $(e.target).closest('li').attr('id'),
            treeObj = $.fn.zTree.getZTreeObj("ztree"),
            _cnode = treeObj.getNodeByTId(_tid),
            _siteId = _cnode.siteId,
            _id = _cnode.id;
        imageMenuData = [
            [{
                text: "新建",
                func: function () {
                    $("#new_modal").modal("show");
                    $("#menu_formMode")[0].reset();
                    $('#menu_pid').val(_innerText);
                    $("#menu_formMode").find("input").removeClass("error").next("label").hide();
                    $("#menu_siteId").attr("disabled", false);
                }
            }],
            [{
                text: "刷新",
                func: function () {
                    newTree();
                }
            }]
        ];
        if(_id != '1'){ //如果不是菜单管理
            imageMenuData.splice(0,1,[{
                text: "新建",
                func: function () {
                    $("#new_modal").modal("show");
                    $("#menu_formMode")[0].reset();
                    $('#menu_pid').val(_innerText);
                    $("#menu_formMode").find("input").removeClass("error").next("label").hide();
                    $("#menu_siteId").attr("disabled", true);
                    $("#menu_siteId").val(_siteId);
                }
            }])
            imageMenuData.push([{
                text: "删除",
                func: function () {
                    $.each(zNodes, function (index, item) {
                        if (zNodes[index].id == _id) {
                            menudel({
                                id: zNodes[index].id,
                                version: zNodes[index].version
                            })
                        }
                    });
                }
            }]);
        }

        $(e.target).smartMenu(imageMenuData, opertionn);

    }
}

$("#leftTable").on("mousedown", function (e) {
    e = e || window.event;
    if ($(e.target).prev().hasClass("ico_close") || $(e.target).prev().hasClass("ico_open")) {
        rightClick(e)
    }

});
function menuvaliDate() {
    $("#menu_formMode").validate({
        rules: {
            menu_func_Code: {
                required: true
            },
            menu_func_Seq: {
                required: true,
                number: true
            },
            menu_name: {
                required: true
            },
            menu_func_Url: {
                required: true
            }
        },
        messages: {
            menu_func_Code: {
                required: "请输入资源代码"
            },
            menu_func_Seq: {
                required: "请输入资源序号"
            },
            menu_name: {
                required: "请输入资源名称"
            },
            menu_func_Url: {
                required: "请输入资源路径"
            }
        }
    });
    if (!$("#menu_formMode").valid()) {
        return false;
    }
    // if ($("#menu_func_Type").val() == 0) {
    //     var urlVal = $("#menu_func_Url").val();
    //     if (urlVal.lastIndexOf(".") === -1) {
    //         $("#menu_func_Url").val("路径必须为jpg、png、jpeg、gif格式");
    //         return;
    //     }
    //     var subVal = urlVal.substring(urlVal.lastIndexOf(".") + 1)
    //     if (subVal === "jpg" || subVal === "png" || subVal === "jpeg" || subVal === "gif") {
    //         newSave("#menu_formMode", "add", "", savepid);
    //     } else {
    //         $("#menu_func_Url").val("路径必须为jpg、png、jpeg、gif格式");
    //         return;
    //     }
    //
    // } else {
        newSave("#menu_formMode", "add", "", savepid);
    // }

}

function menuvaliDateUp() {
    $("#menu_form").validate({
        rules: {
            page_funcDesc: {
                required: true,
                number: true
            },
            page_name: {
                required: true
            },
            page_funcUrl: {
                required: true
            }
        },
        messages: {
            page_funcDesc: {
                required: "请输入资源序号"
            },
            page_name: {
                required: "请输入资源名称"
            },
            page_funcUrl: {
                required: "请输入资源路径"
            }
        }
    });
    if (!$("#menu_form").valid()) {
        return false;
    }
    // if ($("#page_func_Type").val() == 0) {
        // var urlVal = $("#page_func_Url").val();
        // if (urlVal.lastIndexOf(".") === -1) {
        //     $("#page_func_Url").val("路径必须为jpg、png、jpeg、gif格式");
        //     return;
        // }
    //     var subVal = urlVal.substring(urlVal.lastIndexOf(".") + 1)
    //     if (subVal === "jpg" || subVal === "png" || subVal === "jpeg" || subVal === "gif") {
    //         newSave("#menu_form", "update", savepid, uppid, upversion);
    //     } else {
    //         $("#page_func_Url").val("路径必须为jpg、png、jpeg、gif格式");
    //         return;
    //     }
    // } else {
        newSave("#menu_form", "update", savepid, uppid);
    // }
}
function newSave(id, save, upid, uppid) {
    var newArr = {};
    $(id).find("input,select,textarea").each(function () {
        $(this).val() ? newArr[$(this).attr("id").substring(5)] = $(this).val() : "";
    });
    newArr.pid = uppid ? uppid : 1;
    newArr.id = upid ? upid : "";
    var qData = JSON.stringify(newArr);
    $.ajax({
        url: "/sysFunction/" + save + "",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (data) {
            if (data.success) {
                bootbox.alert(data.msg);
                $("#new_modal").modal("hide");
                getData({
                    currentPage: "1",
                    pageSize: "5000",
                    id: savepid
                });
            } else {
                bootbox.alert(data.msg);
                return;
            }
        },
        error: function () {
            console.log("Failed...");
        }
    })
}

function menudel(del) {
    if (del.id === "1") {
        return;
    }
    var qData = {
        id: del.id,
        version: del.version
    }
    qData = JSON.stringify(qData);
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
        callback: function (res) {
            if (res) {
                $.ajax({
                    url: "/sysFunction/deleteToLeaf",
                    type: "POST",
                    dataType: "json",
                    data: qData,
                    contentType: "application/json",
                    success: function (data) {
                        if (data.success) {
                            bootbox.alert({
                                message: data.msg,
                            });
                            getData({
                                currentPage: "1",
                                pageSize: "5000"
                            });
                        } else {
                            bootbox.alert(data.msg);
                            return;
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

function menuDetails(deltails) {
    if (deltails.id === 1) {
        $("#menu_form")[0].reset();
        return;
    }
    var qData = {
        id: deltails.id
    }
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/sysFunction/getById",
        type: "POST",
        dataType: "json",
        data: qData,
        contentType: "application/json",
        success: function (data) {
            if(data.success){
                filldeltails(data.msg,deltails.pid)
            }
        }
    })
}
function filldeltails(data,pid) {
    $("#page_siteId").attr("disabled",false);
    for (var i in data) {
        $("#page_" + i).val(data[i]);
    }
    $("#page_pid").val(data.pidName);
    if(pid != '1' && pid != '0' && pid != ''){ //当pid为1的时候是可以修改站点的，其他情况都不能修改
        $("#page_siteId").attr("disabled",true);
    }
}
$(function () {
    getData({
        currentPage: "1",
        pageSize: "5000"
    });
    createOptions([{
        selector: "#page_siteId",
        key: "dbzd"
    },{
        selector: "#menu_siteId",
        key: "dbzd"
    }]);
    $("#menu_btnSave").attr("disabled", true);
    $("#modemenu_new").on("click", function () {
        menuvaliDate();
    });
    $("#menu_btnSave").on("click", function () {
        menuvaliDateUp();
    })
})