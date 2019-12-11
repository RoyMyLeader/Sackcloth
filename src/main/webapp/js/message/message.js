var pager,
    selectName = [],
    selectCode = [],
    selectUse = [];
var tzlxObj = {
    "rules": "1",
    "brief": "2",
    "notice": "3",
    "infor": "4",
    "all": ""
};
/**
 * Desc: 获取联系人
 * @param options
 */
function getLxrList() {
    $.ajax({
        url: "/dictxzdw/getXZDW",
        type: "POST",
        contentType: "application/json",
        success: function (data) {
            console.log(data)
        }
    })
}
/*
 * 24小时对比
 * */
function timeRatio(obj) {
    debugger;
    var newTime = new Date().getTime(),
        radioTime = new Date(obj).getTime();
    if (newTime - radioTime > 86400000) {
        return false
    } else {
        return true
    }
}
/*
 * 撤销发布
 * */
function revokeFun(obj) {
    var id = JSON.parse($(obj).closest("tr").attr("data-param")).id;
    var qData = {
        id: id
    };
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/gztz/cancelPublish",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            if (data.success) {
                bootbox.alert("撤销成功", function () {
                    $("#con_two_1").find(".btn-primary:visible").trigger("click");
                })
            }
        },
        error: function () {

        }
    })
}
/**
 * Desc: 获取通知数据
 * @param options
 */
function getNoteData(options) {
    debugger;
    $(".detailId,.listId").val("");
    $(".tzNum").text("（共0封)");
    var qData = {
        pageNo: options.currentPage,
        pageSize: options.pageSize
    };
    options.by1 ? qData.by1 = options.by1 : "";
    options.by2 ? qData.by2 = options.by2 : "";
    options.by3 ? qData.by3 = options.by3 : "";
    options.by7 ? qData.by7 = options.by7 : "";
    options.sjdw ? qData.sjdw = options.sjdw : "";
    options.fbzt ? qData.fbzt = options.fbzt : "";
    options.tzlx ? qData.tzlx = options.tzlx : "";
    options.title ? qData.title = options.title : "";
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/gztz/select",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            var str = "",
                thisTable = $("#note_table"),
                thHtml = thisTable.find("tr:first").prop("outerHTML"),
                start = (options.currentPage - 1) * options.pageSize,
                end = options.currentPage * options.pageSize < data.totalCount ? options.pageSize : data.totalCount - start;
            if (!pager || options.recreatePager) {
                pager = CreatePagination({
                    pageSize: options.pageSize,
                    pagerId: "#notePager",
                    totalCount: data.totalCount,
                    jumpBox: false,
                    data: qData,
                    refreshFun: getNoteData
                });
            }
            var today = new Date().getDate(), toYear = new Date().getFullYear(), toMonth = new Date().getMonth() + 1;
            var toDayArr = [], yesterDayArr = [], moreArr = [];
            if (data.totalCount) {
                $(".tzNum").text("（共" + data.totalCount + "封)");
                for (var i = 0; i < end; i++) {
                    if (data.data[i].tzrq.split("-")[2] == today && data.data[i].tzrq.split("-")[1] == toMonth && data.data[i].tzrq.split("-")[0] == toYear) {
                        //今天
                        toDayArr.push(data.data[i])
                    } else if (data.data[i].tzrq.split("-")[2] == (today - 1) && data.data[i].tzrq.split("-")[1] == toMonth && data.data[i].tzrq.split("-")[0] == toYear) {
                        //昨天
                        yesterDayArr.push(data.data[i])
                    } else {
                        //更早
                        moreArr.push(data.data[i])
                    }
                }
                if (options.by2 == "1") {
                    if (toDayArr.length) {
                        str += "<tr><td colspan='4' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>今天 <span style='font-weight: normal'>(" + toDayArr.length + "封)</span></td></tr>";
                        for (var t = 0; t < toDayArr.length; t++) {
                            str += "<tr data-param ='" + JSON.stringify(toDayArr[t]) + "'>" +
                                // "<td><input class='td-mid' type='checkbox' value=''>" + (start + i + 1) + "</td>" +
                                "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor detail'>" + toDayArr[t].title + "</span></td>" +
                                "<td>" + ({
                                    "1": "规章制度",
                                    "2": "简报",
                                    "3": "通知",
                                    "4": "信息动态"
                                }[toDayArr[t].tzlx] || "") + "</td>" +
                                "<td>" + toDayArr[t].sjdw + "</td>" +
                                "<td><span class='td-text'>" + (toDayArr[t].tzrq || "") + "</span><span class='icon-star star" + toDayArr[t].bjdj + " inline'></span><button class='btn btn-xs btn-danger"+(timeRatio(toDayArr[t].tzrq) ? "" : "none")+"' onclick='revokeFun(this)'>" + (timeRatio(toDayArr[t].tzrq) ? "撤回" : "") + "</button></td></tr>";
                        }
                    }
                    if (yesterDayArr.length) {
                        str += "<tr><td colspan='4' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>昨天 <span style='font-weight: normal'>(" + yesterDayArr.length + "封)</span></td></tr>";
                        for (var y = 0; y < yesterDayArr.length; y++) {
                            str += "<tr data-param ='" + JSON.stringify(yesterDayArr[y]) + "'>" +
                                // "<td><input class='td-mid' type='checkbox' value=''>" + (start + i + 1) + "</td>" +
                                "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor detail'>" + yesterDayArr[y].title + "</span></td>" +
                                "<td>" + ({
                                    "1": "规章制度",
                                    "2": "简报",
                                    "3": "通知",
                                    "4": "信息动态"
                                }[yesterDayArr[y].tzlx] || "") + "</td>" +
                                "<td>" + yesterDayArr[y].sjdw + "</td>" +
                                "<td><span class='td-text'>" + (yesterDayArr[y].tzrq || "") + "</span><span class='icon-star star" + yesterDayArr[y].bjdj + " inline'></span><button class='btn btn-xs btn-danger "+(timeRatio(yesterDayArr[y].tzrq) ? "" : "none")+"' onclick='revokeFun(this)'>" + (timeRatio(yesterDayArr[y].tzrq) ? "撤回" : "") + "</button></td></tr>";
                        }
                    }
                    if (moreArr.length) {
                        str += "<tr><td colspan='4' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>更早 <span style='font-weight: normal'>(" + moreArr.length + "封)</span></td></tr>";
                        for (var m = 0; m < moreArr.length; m++) {
                            str += "<tr data-param ='" + JSON.stringify(moreArr[m]) + "'>" +
                                // "<td><input class='td-mid' type='checkbox' value=''>" + (start + i + 1) + "</td>" +
                                "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor detail'>" + moreArr[m].title + "</span></td>" +
                                "<td>" + ({
                                    "1": "规章制度",
                                    "2": "简报",
                                    "3": "通知",
                                    "4": "信息动态"
                                }[moreArr[m].tzlx] || "") + "</td>" +
                                "<td>" + moreArr[m].sjdw + "</td>" +
                                "<td><span class='td-text'>" + (moreArr[m].tzrq || "") + "</span><span class='icon-star star" + moreArr[m].bjdj + " inline'></span><button class='btn btn-xs btn-danger "+(timeRatio(moreArr[m].tzrq) ? "" : "none")+"' onclick='revokeFun(this)'>" + (timeRatio(moreArr[m].tzrq) ? "撤回" : "") + "</button></td></tr>";
                        }
                    }
                } else {
                    if (toDayArr.length) {
                        str += "<tr><td colspan='4' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>今天 <span style='font-weight: normal'>(" + toDayArr.length + "封)</span></td></tr>";
                        for (var t = 0; t < toDayArr.length; t++) {
                            str += "<tr data-param ='" + JSON.stringify(toDayArr[t]) + "'>" +
                                // "<td><input class='td-mid' type='checkbox' value=''>" + (start + i + 1) + "</td>" +
                                "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor detail'>" + toDayArr[t].title + "</span></td>" +
                                "<td>" + ({
                                    "1": "规章制度",
                                    "2": "简报",
                                    "3": "通知",
                                    "4": "信息动态"
                                }[toDayArr[t].tzlx] || "") + "</td>" +
                                "<td>" + toDayArr[t].sjdw + "</td>" +
                                "<td><span class='td-text'>" + (toDayArr[t].tzrq || "") + "</span><span class='icon-star star" + toDayArr[t].bjdj + " inline'></span></td></tr>";
                        }
                    }
                    if (yesterDayArr.length) {
                        str += "<tr><td colspan='4' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>昨天 <span style='font-weight: normal'>(" + yesterDayArr.length + "封)</span></td></tr>";
                        for (var y = 0; y < yesterDayArr.length; y++) {
                            str += "<tr data-param ='" + JSON.stringify(yesterDayArr[y]) + "'>" +
                                // "<td><input class='td-mid' type='checkbox' value=''>" + (start + i + 1) + "</td>" +
                                "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor detail'>" + yesterDayArr[y].title + "</span></td>" +
                                "<td>" + ({
                                    "1": "规章制度",
                                    "2": "简报",
                                    "3": "通知",
                                    "4": "信息动态"
                                }[yesterDayArr[y].tzlx] || "") + "</td>" +
                                "<td>" + yesterDayArr[y].sjdw + "</td>" +
                                "<td><span class='td-text'>" + (yesterDayArr[y].tzrq || "") + "</span><span class='icon-star star" + yesterDayArr[y].bjdj + " inline'></span></td></tr>";
                        }
                    }
                    if (moreArr.length) {
                        str += "<tr><td colspan='4' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>更早 <span style='font-weight: normal'>(" + moreArr.length + "封)</span></td></tr>";
                        for (var m = 0; m < moreArr.length; m++) {
                            str += "<tr data-param ='" + JSON.stringify(moreArr[m]) + "'>" +
                                // "<td><input class='td-mid' type='checkbox' value=''>" + (start + i + 1) + "</td>" +
                                "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor detail'>" + moreArr[m].title + "</span></td>" +
                                "<td>" + ({
                                    "1": "规章制度",
                                    "2": "简报",
                                    "3": "通知",
                                    "4": "信息动态"
                                }[moreArr[m].tzlx] || "") + "</td>" +
                                "<td>" + moreArr[m].sjdw + "</td>" +
                                "<td><span class='td-text'>" + (moreArr[m].tzrq || "") + "</span><span class='icon-star star" + moreArr[m].bjdj + " inline'></span></td></tr>";
                        }
                    }
                }


            }
            thisTable.html("").append(thHtml + str);
            //查看详情
            thisTable.find(".detail").on("click", function () {
                var param = JSON.parse($(this).closest("tr").attr("data-param"));
                if (options.by2 == "2") {
                    //草稿箱点击详情
                    $("#publish_form")[0].reset();
                    $(".note-detail,.note-list").hide();
                    $(".send-note").show();
                    // $("#publish_form").append('<input type="text" class="none gztzCgId" name="id" value="'+param.id+'">')
                    $(".publish-id").val(param.id);
                    for (var attr in param) {
                        $("input[name=" + attr + "],select[name=" + attr + "],textarea[name=" + attr + "]").val(param[attr]);
                    }
                    $(".simditor-body").html(param.tznr);
                    getContactData();
                } else {
                    $("#publish_form")[0].reset();
                    $(".send-note,.note-list").hide();
                    $(".note-detail").show();
                    $(".detailChange").text("");
                    $(".detailTitle:visible").text(param.title);
                    $(".detailJbr:visible").text(param.by1);
                    $(".detailJbsj:visible").text(param.tzrq);
                    $(".detailSjr:visible").text(param.sjdw);
                    $(".detailId").val(param.id);
                    $("#detailTextarea").val(param.tznr.substring(3,param.tznr.length-4));
                    if (param.uploadpath) {
                        $(".detailFj,.detailDown").show();
                        $(".detailXz").attr("href",param.uploadpath)
                    } else {
                        $(".detailFj,.detailDown").hide();
                    }
                }

                // fillTable($(this).closest("tr").data("param"), ".publish-");

            });
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 获取邮箱数据
 * @param options
 */
function getMailData(options) {
    $(".detailId,.listId").val("");
    var qData = {
            pageNo: options.currentPage,
            pageSize: options.pageSize,
            xxlb: options.xxlb
        },
        thisTable, pagerId;
    if (options.xxlb) {
        //发件箱
        if (options.xxlb === "1") {
            qData.fjr = username;
            qData.fszt = "1";
            qData.by3 = "1";
            qData.xxlb = "1";
            thisTable = $("#send_table3");
            pagerId = "#sendPager3";
        }
        //草稿箱
        else if (options.xxlb === "2") {
            qData.fjr = username;
            qData.fszt = "0";
            qData.xxlb = "2";
            qData.dqzt = "0";
            qData.by3 = "1";
            thisTable = $("#send_table4");
            pagerId = "#sendPager4";
        }
        //回收站
        else {
            // qData.fjr = username;
            qData.xxlb = "3";
            qData.by4 = username;
            thisTable = $("#send_table5");
            pagerId = "#sendPager5";
        }
    }
    //收件箱
    else {
        qData.sjr = username;
        qData.fszt = "1";
        qData.by3 = "0";
        qData.xxlb = "4";
        thisTable = $("#send_table2");
        pagerId = "#receivePager";
    }
    qData = JSON.stringify(qData);
    var toDayArr = [], yesterDayArr = [], moreArr = [];
    $.ajax({
        url: "/message/select",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            var str = "",
                thHtml = thisTable.find("tr:first").prop("outerHTML"),
                start = (options.currentPage - 1) * options.pageSize,
                end = options.currentPage * options.pageSize < data.totalCount ? options.pageSize : data.totalCount - start;
            if (!pager || options.recreatePager) {
                pager = CreatePagination({
                    pageSize: options.pageSize,
                    pagerId: pagerId,
                    totalCount: data.totalCount,
                    jumpBox: false,
                    data: qData,
                    refreshFun: getMailData
                });
            }
            $(".totalNum").text("0");
            var today = new Date().getDate(), toYear = new Date().getFullYear(), toMonth = new Date().getMonth() + 1;
            if (data.totalCount) {
                $(".totalNum").text(data.totalCount);
                for (var i = 0; i < end; i++) {
                    if (data.data[i].fssj.split("-")[2] == today && data.data[i].fssj.split("-")[1] == toMonth && data.data[i].fssj.split("-")[0] == toYear) {
                        //今天
                        toDayArr.push(data.data[i])
                    } else if (data.data[i].fssj.split("-")[2] == (today - 1) && data.data[i].fssj.split("-")[1] == toMonth && data.data[i].fssj.split("-")[0] == toYear) {
                        //昨天
                        yesterDayArr.push(data.data[i])
                    } else {
                        //更早
                        moreArr.push(data.data[i])
                    }
                }
                if (toDayArr.length) {
                    str += "<tr><td colspan='5' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>今天 <span style='font-weight: normal'>(" + toDayArr.length + "封)</span></td></tr>";
                    for (var t = 0; t < toDayArr.length; t++) {
                        str += "<tr data-param ='" + JSON.stringify(toDayArr[t]) + "'>" +
                            // "<td>" + (start + i + 1) + "</td>" +
                            "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor'>" + toDayArr[t]["fjr"] + "</span></td>" +
                            "<td><span class='td-mid cursor detail'>" + (toDayArr[t].by6 == 0 ? "[转]" : "") + toDayArr[t].zt + "</span></td>" +
                            "<td>" + toDayArr[t].fssj + "</td></tr>";
                    }
                }
                if (yesterDayArr.length) {
                    str += "<tr><td colspan='5' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>昨天 <span style='font-weight: normal'>(" + yesterDayArr.length + "封)</span></td></tr>";
                    for (var y = 0; y < yesterDayArr.length; y++) {
                        str += "<tr data-param ='" + JSON.stringify(yesterDayArr[y]) + "'>" +
                            // "<td>" + (start + i + 1) + "</td>" +
                            "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor'>" + (yesterDayArr[y]["fjr"]) + "</span></td>" +
                            "<td><span class='td-mid cursor detail'>" + (yesterDayArr[y].by6 == 0 ? "[转]" : "") + yesterDayArr[y].zt + "</span></td>" +
                            "<td>" + yesterDayArr[y].fssj + "</td></tr>";
                    }
                }
                if (moreArr.length) {
                    str += "<tr><td colspan='5' style='color: #1e5494;border-bottom: 2px solid #666;font-weight: 600'>更早 <span style='font-weight: normal'>(" + moreArr.length + "封)</span></td></tr>";
                    for (var m = 0; m < moreArr.length; m++) {
                        str += "<tr data-param ='" + JSON.stringify(moreArr[m]) + "'>" +
                            // "<td>" + (start + i + 1) + "</td>" +
                            "<td><input class='td-mid' type='checkbox' value=''><span class='td-mid cursor'>" + (moreArr[m]["fjr"]) + "</span></td>" +
                            "<td><span class='td-mid cursor detail'>" + (moreArr[m].by6 == 0 ? "[转]" : "") + moreArr[m].zt + "</span></td>" +
                            "<td>" + moreArr[m].fssj + "</td></tr>";
                    }
                }
            }
            thisTable.html("").append(thHtml + str);
            //查看详情
            thisTable.find(".detail").on("click", function () {
                var param = JSON.parse($(this).closest("tr").attr("data-param"));
                if (options.xxlb == "2") {
                    //草稿箱点击详情
                    $("div[id^='list']").hide();
                    $("#list_1").show();
                    $("#btn_mailInBag").hide();
                    for (var attr in param) {
                        $("#list_1").find("#mail_" + attr).val(param[attr])
                    }
                    $("#mail_sjr_hide").val(param.sjr);
                    $("#list_1").find("form").append('<input type="text" name="id" style="display: none">');
                    $("#list_1").find("input[name=id]").val(param.id);
                    getContactData();
                } else {
                    $("div[id^='list']").hide();
                    $("#list_detail").show();
                    $(".listChange").text("");
                    $(".listTitle:visible").text(param.zt);
                    $(".listFjr:visible").text(param.fjr);
                    $(".listJbsj:visible").text(param.fssj);
                    $(".listSjr:visible").text(param.sjr);
                    $("#listTextarea:visible").val(param.zw);
                    $(".listId").val(param.id);
                    if (param.uploadpath) {
                        $(".listFj,.listDown").show();
                        $(".listXz").attr("href", param.uploadpath)
                    } else {
                        $(".listFj,.listDown").hide();
                    }
                }
            });
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
//联系人列表展开
function userShow(obj) {
    debugger;
    if($(obj).hasClass("glyphicon-chevron-right")){
        $(obj).removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
        $(obj).closest("li").find("div").slideDown("fast")
    }else{
        $(obj).removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");
        $(obj).closest("li").find("div").slideUp("fast")
    }
}
//联系人全选/反选
function userCheck(obj) {
    if($(obj).is(":checked")){
        $(obj).closest("li").find("span").removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
        $(obj).closest("li").find("div").slideDown("fast");
        $(obj).closest("label").siblings("div").find("input").prop("checked",true);
    }else{
        $(obj).closest("label").siblings("div").find("input").prop("checked",false);
    }
}
/**
 * Desc: 获取最近联系人数据
 */
function getContactData() {
    debugger;
    $.ajax({
        url: "/sysUser/getAllUsersInCurr",
        type: "GET",
        success: function (data) {
            var str = "";
            if(data.success){
                data = data.msg;

                str+="<li style='padding-top: 2px'>";
                    // "<label><input type='checkbox' onclick='userCheck(this)'>" + attr + "</label><span class='glyphicon glyphicon-chevron-right pull-right' onclick='userShow(this)' style='margin: 3px 5px 0 0'></span>" ;
                for(var i in data){
                    str+="<div style='padding-left: 20px;'>" +
                        "<p>" +
                        "<label style='font-weight: normal'><input type='checkbox' class='user-item' param="+(JSON.stringify(data[i]))+">" + data[i].nickName + "</label>" +
                        "</p>" +
                        "</div>"
                }
                str+= "</li>"

            }


            // $.each(data, function (i) {
            //     str += "<li class='checkbox contact-item' data-param='" + JSON.stringify(data[i]) + "'><label><input type='checkbox'>" + data[i].nickname + "</label></li>";
            // });
            $(".contacts-list").html("").append(str);
            $(".contacts-list").find("input").on("click", function (e) {
                // e.preventDefault();
                selectName = [];
                selectCode = [];
                selectUse = [];
                $(".user-item").each(function () {
                    if ($(this).is(":checked")) {
                        selectName.push(JSON.parse($(this).attr("param")).nickName);
                        selectUse.push(JSON.parse($(this).attr("param")).userName);
                    }
                });
                if($("#mail_sjr").is(":visible")){
                    $("#mail_sjr").val(selectName.join(","));
                    $("#mail_sjr_hide").val(selectUse.join(","));
                }else{
                    $("#gztz_sjr").val(selectName.join(","));
                    $("#gztz_sjr_hide").val(selectUse.join(","));
                }

                $("#uploadDir").val("message"); //用于后台存储文件的位置，以message建文件夹，写死
            });
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 保存
 */
function noteSave(obj) {
    debugger;
    if (obj == "save") {
        bootbox.alert("已发布的内容在24小时内可以撤回，取消发布", function () {
            var arr = [],
                qData = new FormData($("#publish_form")[0]);
            if ($(".isAll").val() === "all") {
                qData.append("sjdw", "all");
            }
            else {
                $.each($(".proBox").find(":checked"), function () {
                    arr.push($(this).attr("id"))
                });
                qData.append("sjdw", arr.join(","));
            }
            $.ajax({
                url: "/gztz/" + url,
                type: "POST",
                contentType: false,
                processData: false,
                cache: false,
                dataType: "json",
                data: qData,
                success: function (data) {
                    if (data.success) {
                        bootbox.alert({
                            message: data.msg,
                            callback: function () {
                                $("#btn_gztz").trigger("click");
                                if (xzdw == "100000") {
                                    getNoteData({
                                        currentPage: 1,
                                        pageSize: 8,
                                        recreatePager: true,
                                        by1: username,
                                        by2: "1",
                                        by3: "1",
                                        fbzt: "1"
                                    });
                                } else {
                                    getNoteData({
                                        currentPage: 1,
                                        pageSize: 8,
                                        recreatePager: true,
                                        by1: username,
                                        by2: "4",
                                        by3: "1",
                                        fbzt: "1"
                                    });
                                }
                                $(".note-list").show();
                                $(".send-note").hide();
                            }
                        });
                    }
                },
                error: function () {
                    console.log("Failed...");
                }
            });
        });
        var url = "send";
        // $("#publish_form").find(".gztzCgId").remove();
    } else {
        var url = "saveInBag";
        var arr = [],
            qData = new FormData($("#publish_form")[0]);
        if ($(".isAll").val() === "all") {
            qData.append("sjdw", "all");
        }
        else {
            $.each($(".proBox").find(":checked"), function () {
                arr.push($(this).attr("id"))
            });
            qData.append("sjdw", arr.join(","));
        }
        $.ajax({
            url: "/gztz/" + url,
            type: "POST",
            contentType: false,
            processData: false,
            cache: false,
            dataType: "json",
            data: qData,
            success: function (data) {
                if (data.success) {
                    bootbox.alert({
                        message: data.msg,
                        callback: function () {
                            $("#btn_gztz").trigger("click");
                            if (xzdw == "100000") {
                                getNoteData({
                                    currentPage: 1,
                                    pageSize: 8,
                                    recreatePager: true,
                                    by1: username,
                                    by2: "1",
                                    by3: "1",
                                    fbzt: "1"
                                });
                            } else {
                                getNoteData({
                                    currentPage: 1,
                                    pageSize: 8,
                                    recreatePager: true,
                                    by1: username,
                                    by2: "4",
                                    by3: "1",
                                    fbzt: "1"
                                });
                            }
                            $(".note-list").show();
                            $(".send-note").hide();
                        }
                    });
                }
            },
            error: function () {
                console.log("Failed...");
            }
        });
    }

}
/*
 * 详情彻底删除事件
 * */
function detailDeleteCd(obj) {
    debugger;
    if (obj == "list") {
        var qData = {
            ids: []
        };
        var url = "gzxx";
        if ($(".listId").val()) {
            qData.ids.push($(".listId").val())
        }
    } else if (obj == "detail") {
        var qData = {
            gztzIds: []
        };
        var url = "gztz";
        if ($(".detailId").val()) {
            qData.gztzIds.push($(".detailId").val())
        }
    }
    // if (!qData.ids.length) {
    //     bootbox.alert("删除失败");
    //     return
    // }
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/" + url + "/delete",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            bootbox.alert({
                message: data.msg,
                callback: function () {
                    if ($("#con_two_2").find(".btn-primary:visible").length) {
                        $("#con_two_2").find(".btn-primary:visible").trigger("click");
                    } else if ($("#con_two_1").find(".btn-primary:visible").length) {
                        $("#con_two_1").find(".btn-primary:visible").trigger("click");
                    }

                    // if(obj == "list"){
                    //     $(".detailId,.listId").val("");
                    //     var options = {
                    //         currentPage: 1,
                    //         pageSize: 8,
                    //         recreatePager: true
                    //     };
                    //     if ($(".btn-primary:visible").attr("id") === "1") {
                    //         getContactData();
                    //     }
                    //     else if ($(".btn-primary:visible").attr("id") === "2") {
                    //         getMailData(options);
                    //     }
                    //     else if($(".btn-primary:visible").attr("id") === "3"){
                    //         options.xxlb = "1";
                    //         getMailData(options);
                    //     }
                    //     else if ($(".btn-primary:visible").attr("id") === "4") {
                    //         options.xxlb = "2";
                    //         getMailData(options);
                    //     }
                    //     else if ($(".btn-primary:visible").attr("id") === "5") {
                    //         options.xxlb = "3";
                    //         getMailData(options);
                    //     }
                    // }else if(obj == "detail"){
                    //     $(".detailId,.listId").val("");
                    //     getNoteData({
                    //         currentPage: 1,
                    //         pageSize: 8,
                    //         recreatePager: true
                    //     });
                    // }

                }
            });
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 删除、置顶、发布操作
 */
function noteOperate(type) {
    debugger;
    var qData = {
            gztzIds: []
        },
        url = {
            "delete": "delete",
            "top": "isTop",
            "publish": "publish"
        }[type];
    $.each($("#note_table").find(":checked"), function (i) {
        qData.gztzIds.push($(this).closest("tr").data("param").id)
    });
    if (!qData.gztzIds.length) {
        bootbox.alert("请选择通知");
        return
    }
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/gztz/" + url,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            bootbox.alert({
                message: data.msg,
                callback: function () {
                    getNoteData({
                        currentPage: 1,
                        pageSize: 8,
                        recreatePager: true
                    });
                }
            });
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 邮件删除
 * @param
 */
function deleteYj() {
    if (!$("table input[type=checkbox]:visible").is(":checked")) {
        bootbox.alert("请先选择邮件");
        return
    }
    if ($(".btn-primary:visible").text() == "已删除") {
        //彻底删除
        var cdDelete = [];
        $("table input[type=checkbox]:visible").each(function () {
            if ($(this).is(":checked")) {
                var thisParam = JSON.parse($(this).closest("tr").attr("data-param"));
                cdDelete.push(thisParam.id)
            }
        });
        var qData = {
            ids: cdDelete
        };
        qData = JSON.stringify(qData);
        $.ajax({
            url: "/message/delete",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: qData,
            async: false,
            success: function (data) {
                if (data.success) {
                    bootbox.alert({
                        message: "删除成功",
                        callback: function () {
                            var options = {
                                currentPage: 1,
                                pageSize: 8,
                                recreatePager: true,
                                xxlb: "3"
                            };
                            getMailData(options);
                        }
                    });
                }

            },
            error: function () {
                console.log("Failed...");
            }
        });
    } else {
        //逻辑删除 （删除到回收站）
        var idsArr = [];
        $("table input[type=checkbox]:visible").each(function () {
            if ($(this).is(":checked")) {
                var thisParam = JSON.parse($(this).closest("tr").attr("data-param"));
                idsArr.push({by4: username, by5: "1", id: thisParam.id, xxlb: "3"})
            }
        });
        var qData = {
            userMessageList: idsArr
        };
        qData = JSON.stringify(qData);
        $.ajax({
            url: "/message/update",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: qData,
            async: false,
            success: function (data) {
                if (data.success) {
                    bootbox.alert({
                        message: "删除成功",
                        callback: function () {
                            var options = {
                                currentPage: 1,
                                pageSize: 8,
                                recreatePager: true
                            };
                            if ($(".btn-primary:visible").attr("id") === "1") {
                                getContactData();
                            }
                            else if ($(".btn-primary:visible").attr("id") === "2") {
                                getMailData(options);
                            }
                            else if ($(".btn-primary:visible").attr("id") === "3") {
                                options.xxlb = "1";
                                getMailData(options);
                            }
                            else if ($(".btn-primary:visible").attr("id") === "4") {
                                options.xxlb = "2";
                                getMailData(options);
                            }
                            else if ($(".btn-primary:visible").attr("id") === "5") {
                                options.xxlb = "3";
                                getMailData(options);
                            }
                        }
                    });
                }

            },
            error: function () {
                console.log("Failed...");
            }
        });
    }


}
/**
 * Desc: 点击详情后删除（非彻底删除）
 * @param
 */
function detailDelete(obj) {
    debugger;
    var idsArr = [];
    if (obj == "list") {
        var url = "/message/update", deleteDom = ".listId";
        if ($(deleteDom).val()) {

            idsArr.push({by4: username, by5: "1", id: $(deleteDom).val(), xxlb: "3"})
        }
        var qData = {
            gzxxList: idsArr
        };
    } else {
        var url = "/gztz/deleteToGarbage", deleteDom = ".detailId";
        if ($(deleteDom).val()) {

            idsArr.push({by7: username, by5: "1", id: $(deleteDom).val(), by2: "3", by6: "1"})
        }
        var qData = {
            xxptGztzList: idsArr
        };
    }
    //逻辑删除 （删除到回收站）
    qData = JSON.stringify(qData);
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        async: false,
        success: function (data) {
            if (data.success) {
                bootbox.alert({
                    message: "删除成功",
                    callback: function () {
                        if ($("#con_two_2").find(".btn-primary:visible").length) {
                            $("#con_two_2").find(".btn-primary:visible").trigger("click");
                        } else if ($("#con_two_1").find(".btn-primary:visible").length) {
                            $("#con_two_1").find(".btn-primary:visible").trigger("click");
                        }
                        // if(obj == "list"){
                        //     $(".detailId,.listId").val("");
                        //     var options = {
                        //         currentPage: 1,
                        //         pageSize: 8,
                        //         recreatePager: true
                        //     };
                        //     if ($(".btn-primary:visible").attr("id") === "1") {
                        //         getContactData();
                        //     }
                        //     else if ($(".btn-primary:visible").attr("id") === "2") {
                        //         getMailData(options);
                        //     }
                        //     else if($(".btn-primary:visible").attr("id") === "3"){
                        //         options.xxlb = "1";
                        //         getMailData(options);
                        //     }
                        //     else if ($(".btn-primary:visible").attr("id") === "4") {
                        //         options.xxlb = "2";
                        //         getMailData(options);
                        //     }
                        //     else if ($(".btn-primary:visible").attr("id") === "5") {
                        //         options.xxlb = "3";
                        //         getMailData(options);
                        //     }
                        // }else if(obj == "detail"){
                        //     $(".detailId,.listId").val("");
                        //     getNoteData({
                        //         currentPage: 1,
                        //         pageSize: 8,
                        //         recreatePager: true
                        //     });
                        // }
                    }
                });
            }

        },
        error: function () {
            console.log("Failed...");
        }
    });


}
/**
 * Desc: 邮件转发
 * @param
 */
function zfYj() {
    debugger;
    if (!$("table input[type=checkbox]:visible").is(":checked")) {
        bootbox.alert("请先选择邮件");
        return
    }
    $("#zfList").modal('show');
    $.ajax({
        url: "/getUser/getAllUsersInCurr",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            var str = "";
            for(var attr in data){
                str+="<li style='padding-top: 2px'>" +
                    "<label><input type='checkbox' onclick='userCheck(this)'>" + attr + "</label><span class='glyphicon glyphicon-chevron-right pull-right' onclick='userShow(this)' style='margin: 3px 5px 0 0'></span>" ;
                for(var i in data[attr]){
                    str+="<div style='display: none;padding-left: 20px;'>" +
                        "<p>" +
                        "<label style='font-weight: normal'><input type='checkbox' class='user-item' param="+(JSON.stringify(data[attr][i]))+">" + data[attr][i].nickName + "</label>" +
                        "</p>" +
                        "</div>"
                }
                str+= "</li>"
            }
            // $.each(data, function (i) {
            //     str += "<li class='checkbox contact-item' data-param='" + JSON.stringify(data[i]) + "'><label><input type='checkbox'>" + data[i].nickname + "</label></li>";
            // });
            $(".contacts-list").html("").append(str);
            $("#lxrSure").off("click");
            $("#lxrSure").on("click", function () {
                zfSJ("gzxx");
            })
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 修改标记等级
 * @param bjdj
 */
function updateBjdj(bjdj) {
    debugger;
    var qData = {
        gztzIds: [],
        bjdj: bjdj
    };
    $.each($("#note_table").find(":checked"), function (i) {
        qData.gztzIds.push($(this).closest("tr").data("param").id)
    });
    if (!qData.gztzIds.length) {
        bootbox.alert("请选择要修改标记的通知");
        return
    }
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/gztz/updateBjdj",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            bootbox.alert({
                message: data.msg,
                callback: function () {
                    $("#btn_gztz").trigger("click");
                }
            });
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 发送邮件
 */
function mailSend(text) {
    debugger;
    if (text == "发送") {
        var url = "send";
    } else {
        var url = "saveInBag";
    }
    var qData = new FormData($("#mail_form")[0]);
    $.ajax({
        url: "/message/" + url,
        type: "POST",
        contentType: false,
        processData: false,
        cache: false,
        dataType: "json",
        data: qData,
        success: function (data) {
            if (data.success) {
                bootbox.alert({
                    message: data.msg,
                    callback: function () {
                        $(".btn-mail").eq(1).trigger("click");
                    }
                });
            }else{
                bootbox.alert(data.msg);
            }
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/**
 * Desc: 表填充
 * @param data
 * @param el
 */
function fillTable(data, el) {
    for (var i in data) {
        $(el + i).val(data[i]);
    }
}
/*
 * 转发事件
 * */
function zfSJ(obj) {
    debugger;
    var sjr = "", idsArr = [];
    $("ul[class=contacts-list]").find("input").each(function () {
        if ($(this).is(":checked")) {
            sjr += JSON.parse($(this).closest("li").attr("data-param")).username + ",";
        }
    });
    sjr = sjr.substring(0, sjr.length - 1);
    $("table input[type=checkbox]:visible").each(function () {
        if ($(this).is(":checked")) {
            idsArr.push(JSON.parse($(this).closest("tr").attr("data-param")).id);
        }
    });

    if (obj == "gzxx") {
        var qData = {
            ids: idsArr,
            sjr: sjr
        };
        qData = JSON.stringify(qData);
        $.ajax({
            url: "/message/changeSjr",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: qData,
            success: function (data) {
                if (data.success) {
                    bootbox.alert("转发成功", function () {
                        $(".detailId,.listId").val("");
                        var options = {
                            currentPage: 1,
                            pageSize: 8,
                            recreatePager: true
                        };
                        if ($(".btn-primary:visible").attr("id") === "1") {
                            getContactData();
                        }
                        else if ($(".btn-primary:visible").attr("id") === "2") {
                            getMailData(options);
                        }
                        else if ($(".btn-primary:visible").attr("id") === "3") {
                            options.xxlb = "1";
                            getMailData(options);
                        }
                        else if ($(".btn-primary:visible").attr("id") === "4") {
                            options.xxlb = "2";
                            getMailData(options);
                        }
                        else if ($(".btn-primary:visible").attr("id") === "5") {
                            options.xxlb = "3";
                            getMailData(options);
                        }
                    });
                }
            },
            error: function () {
                console.log("Failed...");
            }
        });
    } else {
        var qData = {
            ids: idsArr,
            sjdw: sjr
        };
        qData = JSON.stringify(qData);
        $.ajax({
            url: "/gztz/changSend",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: qData,
            success: function (data) {
                if (data.success) {
                    bootbox.alert("转发成功", function () {
                        $("#con_two_1").find(".btn-primary:visible").trigger("click");
                    });
                }
            },
            error: function () {
                console.log("Failed...");
            }
        });
    }

}
/*
 * 工作通知转发
 * */
function gztzZf() {
    debugger;
    if (!$("table input[type=checkbox]:visible").is(":checked")) {
        bootbox.alert("请先选择工作通知");
        return
    }
    $("#zfList").modal('show');
    $.ajax({
        url: "/getUser/getAllUsersInCurr",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            var str = "";
            for(var attr in data){
                str+="<li style='padding-top: 2px'>" +
                    "<label><input type='checkbox' onclick='userCheck(this)'>" + attr + "</label><span class='glyphicon glyphicon-chevron-right pull-right' onclick='userShow(this)' style='margin: 3px 5px 0 0'></span>" ;
                for(var i in data[attr]){
                    str+="<div style='display: none;padding-left: 20px;'>" +
                        "<p>" +
                        "<label style='font-weight: normal'><input type='checkbox' class='user-item' param="+(JSON.stringify(data[attr][i]))+">" + data[attr][i].nickName + "</label>" +
                        "</p>" +
                        "</div>"
                }
                str+= "</li>"
            }
            // $.each(data, function (i) {
            //     str += "<li class='checkbox contact-item' data-param='" + JSON.stringify(data[i]) + "'><label><input type='checkbox'>" + data[i].nickname + "</label></li>";
            // });
            $(".contacts-list").html("").append(str);
            $("#lxrSure").off("click");
            $("#lxrSure").on("click", function () {
                zfSJ("gztz")
            })
        },
        error: function () {
            console.log("Failed...");
        }
    });
}
/*
 * 工作通知逻辑删除
 * */
function gztzDelete() {
    debugger;
    if (!$("table input[type=checkbox]:visible").is(":checked")) {
        bootbox.alert("请先选择工作通知");
        return
    }
    var ljscDelete = [];
    $("#note_table:visible").find("input[type=checkbox]").not(":eq(0)").each(function () {
        if ($(this).is(":checked")) {
            var thisParam = JSON.parse($(this).closest("tr").attr("data-param"));
            ljscDelete.push({by7: username, id: thisParam.id, by2: "3", by6: "1"})
        }
    });
    var qData = {
        xxptGztzList: ljscDelete
    };
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/gztz/deleteToGarbage",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            if (data.success) {
                bootbox.alert("删除成功", function () {
                    $("#con_two_1").find(".btn-primary:visible").trigger("click");
                })
            }
        },
        error: function () {
            console.log("删除失败")
        }
    })
}
/*
 * 工作通知彻底删除
 * */
function gztzDeleteCd() {
    debugger;
    if (!$("table input[type=checkbox]:visible").is(":checked")) {
        bootbox.alert("请先选择工作通知");
        return
    }
    var gztzIds = [];
    $("#note_table:visible").find("input[type=checkbox]").not(":eq(0)").each(function () {
        if ($(this).is(":checked")) {
            var thisParam = JSON.parse($(this).closest("tr").attr("data-param"));
            gztzIds.push(thisParam.id)
        }
    });
    var qData = {
        gztzIds: gztzIds
    };
    qData = JSON.stringify(qData);
    $.ajax({
        url: "/gztz/delete",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: qData,
        success: function (data) {
            if (data.success) {
                bootbox.alert("删除成功", function () {
                    $("#con_two_1").find(".btn-primary:visible").trigger("click");
                })
            }
        },
        error: function () {
            console.log("删除失败")
        }
    })
}
$(function () {
    // $("#gztzDelete").on("click", function () {
    //     debugger;
    //     if ($(".btn-primary:visible").attr("id") != "btn_delete") {
    //         gztzDelete();
    //     } else {
    //         gztzDeleteCd();
    //     }
    //
    // });
    // $("#gztzZf").on("click", function () {
    //     debugger;
    //     if (xzdw == "100000") {
    //         gztzZf()
    //     }
    // });
    // var scrollCon = $(".jobslidnr"),
    //     province = PROVINCE,
    //     proStr = "",
    //     flag = location.search;
    // scrollCon.mCustomScrollbar({
    //     theme: "dark"
    // });
    // scrollCon.find(".mCustomScrollBox").height(scrollCon.height());
    // if (xzdw == "100000") {
    //     getNoteData({
    //         currentPage: 1,
    //         pageSize: 8,
    //         recreatePager: true,
    //         by1: username,
    //         by2: "1",
    //         by3: "1",
    //         fbzt: "1"
    //     });
    // } else {
    //     $(".btn-top,#publish_save").attr("disabled", true);
    //     getNoteData({
    //         currentPage: 1,
    //         pageSize: 8,
    //         recreatePager: true,
    //         sjdw: username,
    //         by2: "4",
    //         by3: "0",
    //         fbzt: "1"
    //     });
    // }
    var options = {
        currentPage: 1,
        pageSize: 8,
        recreatePager: true
    };
    getMailData(options);

    $(".detail").on("click", function () {
        debugger;
        $("#publish_form")[0].reset();
        $(".send-note,.note-list").hide();
        $(".note-detail").show();
        // fillTable($(this).closest("tr").data("param"), ".publish-");

    });
    $(".defaultName").attr({value: nickname, readonly: true});
    $("body").on("click", ".allCheck", function () {
        debugger;
        $(this).closest(".table").find("input[type='checkbox']:not(this)").prop("checked", $(this).is(":checked"));
    });
    $(".allCheck-pro").on("click", function () {
        debugger;
        $(".proBox").find("input").prop("checked", $(this).is(":checked"));
    });
    $(".btn-mail").on("click", function () {
        debugger;
        var options = {
                currentPage: 1,
                pageSize: 8,
                recreatePager: true
            },
            id = $(this).attr("id");
        $("#mail_form")[0].reset();
        $(".btn-mail").removeClass("btn-primary").addClass("btn-default");
        $(this).toggleClass("btn-default btn-primary");
        $("div[id^='list_']").hide();
        $("#list_" + id).show();
        if (id === "1") {
            getContactData();
            $("#btn_mailInBag").show();
            $("#list_1").find("input[name=id]").remove();
        }
        else if (id === "2") {
            getMailData(options);
        }
        else if (id === "3") {
            options.xxlb = "1";
            getMailData(options);
        }
        else if (id === "4") {
            options.xxlb = "2";
            getMailData(options);
        }
        else if (id === "5") {
            options.xxlb = "3";
            getMailData(options);
        }
    });
    $(".btn-top").on("click", function () {
        debugger;
        $(".btn-top").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
        if ($(this).attr("id") == "new") {
            $("#publish_form")[0].reset();
            $(".send-note").show();
            $(".note-list").hide();
            $("#province").hide();
            $(".note-detail").hide();
            getContactData();
        }
        else if ($(this).attr("id") == "btn_cg") {
            $(".note-detail").hide();
            $(".note-list").show();
            $(".send-note").hide();
            getNoteData({
                currentPage: 1,
                pageSize: 8,
                recreatePager: true,
                by1: username,
                by2: "2",
                by3: "1",
                fbzt: "0"
            });

        } else if ($(this).attr("id") == "btn_gztz") {
            if (xzdw != "100000") {
                getNoteData({
                    currentPage: 1,
                    pageSize: 8,
                    recreatePager: true,
                    sjdw: username,
                    by2: "4",
                    by3: "1",
                    fbzt: "1"
                });
            } else {
                $(".note-detail").hide();
                $(".note-list").show();
                $(".send-note").hide();
                getNoteData({
                    currentPage: 1,
                    pageSize: 8,
                    recreatePager: true,
                    by1: username,
                    by2: "1",
                    by3: "1",
                    fbzt: "1"
                });
            }

        } else if ($(this).attr("id") == "btn_delete") {
            $(".note-detail").hide();
            $(".note-list").show();
            $(".send-note").hide();
            getNoteData({
                currentPage: 1,
                pageSize: 8,
                recreatePager: true,
                by7: username,
                by2: "3"
            });
        }
    });
    //返回
    $(".btn-back").on("click", function () {
        debugger;
        $(".send-note,.note-list").toggle();
    });
    /**
     * Desc: 修改标记等级
     */
    $("#bjdj").find("a").on("click", function () {
        debugger;
        updateBjdj($(this).attr("bjdj"));
    });
    /**
     * Desc: 删除、置顶、发布
     */
    $("#btn_top,#btn_publish").on("click", function () {
        debugger;
        noteOperate($(this).attr("id").substring(4));
    });
    $("#listDeleteCd").on("click", function () {
        debugger;
        detailDeleteCd("list");
    });
    $("#detailDeleteCd").on("click", function () {
        debugger;
        detailDeleteCd("detail");
    });
    $("#listDelete").on("click", function () {
        debugger;
        detailDelete("list");
    });
    $("#detailDelete").on("click", function () {
        debugger;
        detailDelete("detail");
    });
    /**
     * Desc: 保存
     */
    $("#publish_save").on("click", function () {
        debugger;
        noteSave("save");
    });
    /*
     * 工作通知搜索框
     * */
    $(".searchBtn").on("click", function () {
        debugger;
        if ($("#con_two_1").find(".btn-primary:visible").attr("id") == "btn_gztz") {
            if (xzdw == "100000") {
                getNoteData({
                    currentPage: 1,
                    pageSize: 8,
                    recreatePager: true,
                    title: $(".searchInput").val().trim(),
                    by1: username,
                    by2: "1",
                    by3: "1",
                    fbzt: "1"
                });
            } else {
                getNoteData({
                    currentPage: 1,
                    pageSize: 8,
                    recreatePager: true,
                    title: $(".searchInput").val().trim(),
                    sjdw: username,
                    by2: "4", by3: "0", fbzt: "1"
                });
            }
        } else if ($("#con_two_1").find(".btn-primary:visible").attr("id") == "btn_cg") {
            getNoteData({
                currentPage: 1,
                pageSize: 8,
                recreatePager: true,
                title: $(".searchInput").val().trim(),
                by1: username,
                by2: "2",
                by3: "1",
                fbzt: "0"
            });
        }else if ($("#con_two_1").find(".btn-primary:visible").attr("id") == "btn_delete") {
            getNoteData({
                currentPage: 1,
                pageSize: 8,
                recreatePager: true,
                title: $(".searchInput").val().trim(),
                by7: username,
                by2: "3"
            });
        }

    });
    /*
     * 存草稿
     * */
    $("#publish_saveInBag").on("click", function () {
        debugger;
        noteSave("saveInBag");
    });
    /**
     * Desc: 发送对象，全国各省
     */
    // $.each(province, function (index) {
    //     proStr += "<div class='checkbox pro-item'><label><input type='checkbox' id='" + province[index].code + "'>" + province[index].name + "</label></div>";
    // });
    // $(".proBox").append(proStr);
    /**
     * Desc: 发送对象切换
     */
    // $(".isAll").on("change", function () {
    //     if ($(this).val() == "all") {
    //         $(this).closest(".form-group").next().slideUp("fast");
    //     }
    //     else {
    //         $(this).closest(".form-group").next().slideDown("fast");
    //     }
    // });
    /**
     * Desc: 筛选
     */
    $(".note-sel").next().find("li").on("click", function () {
        debugger;
        var list = $(".note-list");
        list.find("tr").not(":eq(0)").remove();
        // list.find("tr[class='" + $(this).attr("id") + "']").show();
        getNoteData({
            currentPage: 1,
            pageSize: 8,
            recreatePager: true,
            tzlx: tzlxObj[$(this).attr("id")]
        })
    });
    /**
     * Desc: 发送邮件
     */
    $("#btn_mailSend,#btn_mailInBag").on("click", function () {
        debugger;
        mailSend($(this).text());
    });
    $("#btn_mailClose").on("click", function () {
        debugger;
        $(".btn-mail").eq(1).trigger("click");
    });
    /**
     * Desc: 上传附件
     */
    $("#mail_fj").on("click", function () {
        debugger;
        $("#mail_file").trigger("click");
    });
    if (flag) {
        $("#two2").trigger("click");
    }
});