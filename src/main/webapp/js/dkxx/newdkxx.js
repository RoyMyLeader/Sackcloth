/**
 * Created by Administrator on 2018\2\24 0024.
 * /sjhj/downloadFile
 */

var pageNow = "";
$(function () {

    var pager,
        detail_modal = $('#detail_modal'),
        clicktag = 0;

    var statistical = (function () {
        /**
         * 查询数据
         */
        function getData(options) {
            pageNow = options.currentPage;
            var qData = {
               pageNo: options.currentPage
            };
            qData.pageSize = options.pageSize ? options.pageSize : 10;
            qData.proname = options.proname ? options.proname : "";
            qData.xzdwId = xzdwId;
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/dkxx/select",
                type: "POST",
                dataType: "json",
                data: qData,
                contentType: "application/json",
                success: function (res) {
                    // console.log(res)
                    if (res) {
                        var data = res.data;
                        if (pageNow != 1) {
                            if (!((res.totalCount - 1) % options.pageSize)) {
                                pageNow -= 1;
                            }
                            pageNow += "";
                        }
                        var table = $("#main_table"),
                            str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                            start = (options.currentPage - 1) * options.pageSize,
                            end = options.currentPage * options.pageSize < res.totalCount ? options.pageSize : res.totalCount - start;
                        if (!pager || options.recreatePager) {
                            pager = CreatePagination({
                                pageSize: options.pageSize,
                                pagerId: "#tjsj_page",
                                totalCount: res.totalCount,
                                startPage: Number(options.currentPage),
                                refreshFun: getData,
                                data: qData
                            });
                        }
                        if (!data.length) {
                            str += "<tr><td colspan='8'>暂无数据</td></tr>";
                            var pagehtml = "<div class='pull-left page-margin'>共有0条记录</div>";
                        } else {
                            for (var i = 0; i < end; i++) {
                                var thisData = data[i];
                                str += "<tr data-id='" + thisData.id + "' data-param='"+JSON.stringify(thisData)+"'>" +
                                    "<td>" + (start + i + 1) + "</td>" +
                                    "<td>" + (thisData.dkbm || "") + "</td>" +
                                    "<td>" + (thisData.dz || "") + "</td>" +
                                    "<td>" + (thisData.xz || "") + "</td>" +
                                    "<td>" + (thisData.nz || "") + "</td>"+
                                    "<td>" + (thisData.bz || "") + "</td>"+
                                    "<td>" + (thisData.cid || "") + "</td>"+
                                    "<td>" + (thisData.qzbm || "") + "</td>"+
                                    "<td><span class='btn btn-info btn-update' style='margin-right: 5px'>修改</span><span class='btn btn-danger btn-del'>删除</span></td>";
                            }
                            var pagehtml = "<div class='pull-left page-margin'>共有" + res.totalCount + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + Math.ceil(res.totalCount / options.pageSize) + "页</div>";
                        }
                        table.html('').append(str);
                        $("#tjsj_page").parent().find(".page-margin").remove().end().append(pagehtml);
                    }
                    /**
                     * 修改
                     */
                    $('.btn-update').on('click',function () {
                        $('#newProject').modal('show');
                        $("#login_form").find("input").removeClass("error").next("label").hide();
                        // $("#login_tit").tab("show");
                        $(".modal-tit").html("修改");
                        $("#login_form")[0].reset();
                        selectCbfAndJob();
                        var param  = $(this).closest('tr').attr('data-param');
                        param = JSON.parse(param);
                        for (var attr in param) {
                            $("#modal_login").find("#sjhj_" + attr).val(param[attr])
                        }
                        saveId=param.id;
                    });
                    /**
                     * 删除
                     */
                    $('.btn-del').on('click',function () {
                        var obj = {};
                        obj.id = $(this).closest('tr').attr('data-id');
                        deleteMes(obj);
                    });

                },
                error: function () {
                    console.log("Failed...");
                }
            });
        }
        /**
         * 点击事件
         */
        function clickEvent() {
            // $('.look').on('click',function () {
            //     $('#detail_modal').modal('show');
            // });

            $('#btn-newObj').on('click',function () {
                $('#newProject').modal('show');
                $("#login_form").find("input").removeClass("error").next("label").hide();
                // $("#login_tit").tab("show");
                $(".modal-tit").html("新建");
                $("#login_form")[0].reset();
                $("#sjhj_id").val("");
                selectCbfAndJob();
                saveId = "";
            });

            $("#btn_query").on('click',function () {
                var value = $("#xmmc_query").val();
                getData({
                    currentPage: "1",
                    pageSize: "10",
                    recreatePager: true,
                    proname:value
                });
            });

            //保存
            $("#sjhj_save").on("click", function () {
                uservaliDate();
            });
            /**
             * 最终上传
             */
            $('#lead_yes').on('click',function () {
                var str = $("input[name='method']:checked").attr('data-id');
                confirm({
                    by1:str
                });
                $('#lead_modal').modal('hide');
            })
        }
        function uservaliDate() {
            $("#login_form").validate({
                rules: {
                    dkbm: {
                        required: true
                    },
                    dz: {
                        required: true
                    },
                    xz: {
                        required: true
                    },
                    nz: {
                        required: true
                    },
                    bz: {
                        required: true
                    }
                }, messages: {
                    dkbm: {
                        required: "请输入地块编码"
                    },
                    dz: {
                        required: "请输入东至信息"
                    },
                    nz: {
                        required: "请输入南至信息"
                    },
                    xz: {
                        required: "请输入西至信息"
                    },
                    bz: {
                        required: "请输入北至信息"
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
            var saveArr = {},savaHjIds = [],savaHjxms = [],
                userInfo = $(".userInfo");
            userInfo.find("input,select").each(function () {
                if($(this).is("select")){
                    savaHjxms.push($(this).children("option:checked").html());
                    savaHjIds.push($(this).children("option:checked").val());
                }else{
                    $(this).val() ? saveArr[$(this).attr("id").substring(5)] = $(this).val() : "";
                }
            });
            // saveArr.hjrxm=savaHjxms[0];
            // saveArr.hjjzdm=savaHjxms[1];
            var cbfmc = savaHjIds[0];
            var qzbm = savaHjIds[1];
            if("999999" == cbfmc || "999999" == qzbm){
                bootbox.alert("暂无承包方名称或权证编码信息，请先补充");
                return;
            }
            saveArr.cid=cbfmc;
            saveArr.qzbm=qzbm;
            var saveAdd = saveId ? "update" : "add";
            var Qdata = JSON.stringify(saveArr);
            $.ajax({
                url: "/dkxx/" + saveAdd + "",
                type:"POST",
                data: Qdata,
                dataType:"json",
                contentType:"application/json",
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
        /**
         * 删除
         */
        function deleteMes(option) {
            var qData = {
                id: option.id
            };
            qData = JSON.stringify(qData);
            bootbox.confirm({
                message: "确定删除该记录吗？",
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
                    if(result){
                        $.ajax({
                            url: "/dkxx/delete",
                            type: "POST",
                            dataType: "json",
                            data: qData,
                            contentType: "application/json",
                            success: function (res) {
                                if (res.success) {
                                    bootbox.alert({
                                        message: res.msg,
                                        callback: function () {
                                            getData({
                                                currentPage: pageNow,
                                                pageSize: "10",
                                                recreatePager: true
                                            });
                                        }
                                    });
                                }
                            },
                            error: function (res) {
                                bootbox.alert({
                                    message: res.msg
                                });
                            }
                        });
                    }
                }
            })

        }

        /**
         * 初始化汇交人员select
         */
        function selectCbfAndJob() {
            $.ajax({
                url: "/dkxx/selectCbfAndJob",
                type: "POST",
                dataType: "json",
                success: function (res) {
                    if (res.success) {
                        var dataCbf = res.msg.cbfList;
                        var dataJob = res.msg.jobList;
                        var optionStr1 = "";
                        // data = JSON.parse(data);
                        for(var key in dataCbf){
                            optionStr1 += '<option value="'+dataCbf[key].cbfmc+'">'+dataCbf[key].cbfmc+'</option>';
                        }
                        if(optionStr1 != ""){
                            $("#sjhj_cid").html(optionStr1);
                        }
                        var optionStr2 = "";
                        for(var key in dataJob){
                            optionStr2 += '<option value="'+dataJob[key].name+'">'+dataJob[key].name+'</option>';
                        }
                        if(optionStr2 != ""){
                            $("#sjhj_qzbm").html(optionStr2);
                        }
                    }else{
                        console.log(res.msg);
                    }
                },
                error: function (res) {
                   console.log(res.msg);
                }
            });
        }


        /**
         * 初始化操作
         */
        function init() {
            getData({
                currentPage: "1",
                pageSize: "10",
                recreatePager: true
            });
            clickEvent();
        }

        return {
            init:init
        }
    })();
    statistical.init();
});