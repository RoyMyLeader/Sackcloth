/**
 * Created by Administrator on 2018\2\24 0024.
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
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/lytjTjsj/select",
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
                                str += "<tr data-id='" + thisData.id + "'>" +
                                    "<td>" + (start + i + 1) + "</td>" +
                                    "<td>" + (thisData.nf || "") + "</td>" +
                                    "<td>" + (thisData.dq || "") + "</td>" +
                                    "<td>" + (thisData.zb || "") + "</td>" +
                                    "<td>" + (thisData.sz || "") + "</td>"+
                                    "<td>" + (thisData.ly || "") + "</td>"+
                                    "<td>" + (thisData.cjsj || "") + "</td>"+
                                    "<td><span class='btn btn-danger btn-del'>删除</span></td>";
                            }
                            var pagehtml = "<div class='pull-left page-margin'>共有" + res.totalCount + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + Math.ceil(res.totalCount / options.pageSize) + "页</div>";
                        }
                        table.html('').append(str);
                        $("#tjsj_page").parent().find(".page-margin").remove().end().append(pagehtml);
                    }

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

            $('#btn-lead').on('click',function () {
                getTemData({
                    currentPage:1,
                    pageSize:5,
                    recreatePager:true
                });
                $('#lead_modal').modal('show');
            });
            //导入临时excel
            $('#btn-file').on('click',function () {
                if (clicktag == 0) {
                    clicktag = 1;
                    $(this).text("查询中...");
                    leadExcel(); //导入
                }else{
                    return false
                }
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

        /**
         * 删除
         */
        function deleteMes(option) {
            var qData = {
                id: option.id
            };
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/lytjTjsj/delete",
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

        /**
         * 导入到临时表
         */
        function leadExcel() {
            var formData = new FormData($("#uploadForm")[0]);
            $.ajax({
                url: "/lytjTjsj/uploadExcel",
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.success) {
                        getTemData({
                            currentPage:1,
                            pageSize:5,
                            recreatePager:true
                        });
                    }else{
                        bootbox.alert({
                            message: res.msg
                        });
                        $('#btn-file').text('上传');
                        clicktag = 0;
                    }
                },
                error: function (res) {
                    bootbox.alert({
                        message: res.msg
                    });
                }
            });
        }

        /**
         * 临时表的查询
         */
        function getTemData(options) {
            var qData = {};
            qData.pageSize = options.pageSize ? options.pageSize : 5;
            qData.pageNo = options.currentPage ? options.currentPage : 1;
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/lytjTjsjTemp/select",
                type: "POST",
                dataType: "json",
                data: qData,
                contentType: "application/json",
                success: function (res) {
                        if (res) {
                            $('#btn-file').text('上传');
                            clicktag = 0;
                            var data = res.data;
                            var table = $("#temp_table"),
                                str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                                start = (options.currentPage - 1) * options.pageSize,
                                end = options.currentPage * options.pageSize < res.totalCount ? options.pageSize : res.totalCount - start;
                            if (!pager || options.recreatePager) {
                                pager = CreatePagination({
                                    pageSize: options.pageSize,
                                    pagerId: "#temp_page",
                                    totalCount: res.totalCount,
                                    jumpBox: false,
                                    refreshFun: getTemData,
                                    data: qData
                                });
                            }
                            if (!data.length) {
                                str += "<tr><td colspan='7'>请先选择文件上传，预览数据！</td></tr>";
                                var pagehtml = "<div class='pull-left page-margin'>共有0条记录</div>";
                            } else {
                                for (var i = 0; i < end; i++) {
                                    var thisData = data[i];
                                    str += "<tr data-id='" + thisData.id + "'>" +
                                        "<td>" + (start + i + 1) + "</td>" +
                                        "<td>" + (thisData.nf || "") + "</td>" +
                                        "<td>" + (thisData.dq || "") + "</td>" +
                                        "<td>" + (thisData.zb || "") + "</td>" +
                                        "<td>" + (thisData.sz || "") + "</td>"+
                                        "<td>" + (thisData.ly || "") + "</td>"+
                                        "<td>" + (thisData.cjsj || "") + "</td>"
                                }
                                var pagehtml = "<div class='pull-left page-margin'>共有" + res.totalCount + "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + Math.ceil(res.totalCount / options.pageSize) + "页</div>";
                            }
                            table.html('').append(str);
                            $("#temp_page").parent().find(".page-margin").remove().end().append(pagehtml);
                        }

                },
                error: function (res) {
                    bootbox.alert({
                        message: res
                    });
                }
            });
        }

        /**
         *统计数据确认上传接口
         */
        function confirm(options) {
            var qData = {
                by1:options.by1
            };
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/lytjTjsj/confirmToSolr",
                type: "POST",
                dataType: "json",
                data: qData,
                contentType: "application/json",
                success: function (res) {
                    bootbox.alert({
                        message: res.msg
                    });
                    //先清空上一次的
                    var str = "<tbody>" +$('#temp_table').find('tr:first').html() +"</tbody>";
                    $('#temp_table').html(str);
                    $('#temp_page,.page-margin').html('');
                    $('input[name=file]').val('');
                    getData({
                        currentPage: "1",
                        pageSize: "10",
                        recreatePager: true
                    });
                },
                error: function (res) {
                    bootbox.alert({
                        message: res.msg
                    });
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