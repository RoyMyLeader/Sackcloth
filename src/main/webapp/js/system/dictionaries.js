
var imageMenuData;
var zNodes = [];
var pager;
var pid = $("#pid");
var newModal = $('#new_modal');
var glob_treeNode,saveid,glob_version,parent;
// var flieList = [];
// var sizeObj = [];

$(function () {

    var dictionaries = (function (){
        //文档树请求数据
        function getData(options) {
            var qData = {
                pageNo: options.currentPage,
                pageSize: options.pageSize
            };
            options.id ? qData.id = options.id:"";
            options.pid ? qData.pid = options.pid:"";
            qData = JSON.stringify(qData);
            $.ajax({
                    url: "/SysDictAction/findAll",
                    type: "POST",
                    dataType: "json",
                    data: qData,
                    contentType: "application/json",
                    success: function (res) {
                        var data= res.msg.result;
                     //   console.log(res);
                        if(res.success){
                            zNodes = [];
                            for(var i=0;i<data.length;i++){
                                if(!data[i].isParent){
                                    continue;
                                }else{
                                    zNodes.push(data[i]);
                                }
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
                    onMouseDown:function(event, treeId, treeNode){
                        //左侧文件树点击右侧请求
                        var e = event || window.event;
                        var target = e.target || e.srcElement;
                        if (treeNode == null) {
                            return;
                        }
                        saveid = treeNode.id;
                        glob_treeNode = treeNode;
                        parent = treeNode.getParentNode();
                        //把id传给form表单
                        $('#p_id').val(saveid);
                        //查询自身
                        lookSelf(saveid);
                        if (e.which == 1) {
                            if ($(target).closest('a').attr('target')){
                                $("#xj_valida").find("input,select").removeClass("error").next("label").hide();
                                $("#bj_valida").find("input,select").removeClass("error").next("label").hide();
                                //关联查询
                                getRelation({
                                    currentPage: "1",
                                    pageSize: "10",
                                    recreatePager: true,
                                    id: treeNode.id
                                });
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

        //点击事件
        function clickEvent(){
            //左侧文档树鼠标事件
            $("#leftTable").on("mousedown", function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                //  ($(e.target).prev().hasClass("ico_docu"))
              //  if ($(target).closest('a').attr('target')){
                if ($(e.target).prev().hasClass("ico_close") || $(e.target).prev().hasClass("ico_open")) {
                    //右击事件
                    rightClick(e);
                }
            });
        }

        //右键事件
        function rightClick(e) {
            if (e.which == 3){
                var opertionn = {
                    name: "", //单独一个右键事件是不需要名字，页面多个时候必须有
                    offsetX: 2,  //上下文菜单左上角距离鼠标水平偏移距离
                    offsetY: 2,// 上下文菜单左上角距离鼠标垂直偏移距离
                    textLimit: 10,  //上下文菜单项限制显示的文字个数
                    beforeShow: $.noop,//菜单即将显示之前执行的回调函数
                    afterShow: $.smartMenu.remove()//菜单显示后执行的回调函数。在菜单隐藏或是显示之前，一定要执行一下$.smartMenu.remove()
                };
                imageMenuData = [
                    [{
                        text: "新建字典",
                        func: function () {
                            newModal.find('.modal-title').text("新建字典");
                            newModal.modal("show");
                            newModal.find("input,textarea").val('');
                            //判断是字典还是目录
                            if(glob_treeNode.zdlb=="字典"){
                                $('#zdlb').html('').append('<option value="字典">字典</option><option value="字典项">字典项</option>');
                            }else if(glob_treeNode.zdlb=="目录" || glob_treeNode.id =="1"){
                                $('#zdlb').html('').append('<option value="目录">目录</option><option value="字典">字典</option>');
                            }
                            pid.val(glob_treeNode.name);
                            $("#xj_yes").off("click");
                            var arr = [],ModalId, obj = {};
                            $("#xj_yes").on("click", function () {
                                newModal.find("input,select,textarea").each(function (index, item) {
                                    ModalId = $(this).attr('id');
                                    arr.push(ModalId);
                                    obj[arr[index]] = $(item).val()||"";
                                });
                                $('#zdlb').val()=="字典项"?obj["isParent"] = false:obj["isParent"] = true;
                                obj["zdlb"] = $('#zdlb').find("option:selected").text();
                               //  console.log(obj)
                                //添加字典项+验证
                                tabValiDate(obj)
                            });
                        }
                    }],
                    [{
                        text: "编辑字典",
                        func: function () {
                            var chModal = $('#change_modal');
                            chModal.modal("show");
                            $('#zdlb_c').html('').append('<option value="目录">目录</option><option value="字典">字典</option>');

                            $('#name_c').val(glob_treeNode.name);
                            $('#zdxbm_c').val(glob_treeNode.zdxbm);
                            $('#zdlb_c').val(glob_treeNode.zdlb);
                            $('#remark_c').val(glob_treeNode.remark);
                            $('#pid_c').val(parent.name);
                            $("#cxj_yes").off("click");
                            var arr = [], obj = {}, ModalId;
                            $("#cxj_yes").on("click", function () {
                                chModal.find("input,select,textarea").each(function (index, item) {
                                    ModalId = $(this).attr('id').split("_")[0];
                                    arr.push(ModalId);
                                    obj[arr[index]] = $(item).val();
                                });
                                obj["id"] = saveid;
                                obj["pid"] = glob_treeNode.pid;
                                obj["zdlb"] = $('#zdlb_c').find("option:selected").text();
                                $('#zdlb').val()=="字典项"?obj["isParent"] = false:obj["isParent"] = true;
                                obj["version"] = glob_version;
                               // console.log(obj)
                                //修改字典项+验证
                                tabChValiDate(obj)
                            });
                        }
                    }],[{
                        text:'导入字典项',
                        func:function () {
                            $('#file').trigger('click');
                            // upLoad();
                        }
                    }]
                    ,
                    [{
                        text: "删除字典",
                        func: function () {
                            $.each(zNodes, function (index, item) {

                                if(zNodes[index].id ==1){
                                    return
                                }else{
                                    if ((zNodes[index].id == glob_treeNode.id)) {
                                        delOrginal({
                                            id:glob_treeNode.id
                                        })
                                    }
                                }
                            });
                        }
                    }],
                    [{
                        text: "刷新",
                        func: function () {
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



        $('#file').on('change',function () {
            var formData = new FormData($("#uploadForm")[0]);
            $.ajax({
                url: '/excelBtsq/uploadExcel',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function () {
                    getData({
                        currentPage: "1",
                        pageSize: "10",
                        recreatePager: true
                    });
                    getRelation({
                        currentPage: "1",
                        pageSize: "10",
                        recreatePager: true,
                        id: saveid
                    });
                },
                error: function (req){
                    console.log(req.msg);
                }
            });
        });



    //本级树节点根据id查询
        function lookSelf(option) {
            var qData = {
                id: option
            };
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/SysDictAction/findByid",
                type: "POST",
                dataType: "json",
                data:qData,
                contentType: "application/json",
                success: function (res) {
                    if(res){
                      //  console.log(res);
                       glob_version = res.msg.version;
                    }
                },
                error: function () {
                    console.log("Failed...");
                }
            });
        }

        /**
         *
         * @param 添加验证
         * @returns {boolean}
         */
        function tabValiDate(obj) {
            $('#xj_valida').validate({
                rules: {
                    name: {
                        required: true
                    },
                    zdxbm: {
                        required:true
                    },
                    zdlb: {
                        required: true
                    }
                }
            });
            if (!$("#xj_valida").valid()) {
                return false;
            }else{
                addMes(obj)
            }
        }

        //添加字典项
        function addMes(option){
            var qData = {
                pid:saveid,
                name:option.name,
                zdxbm:option.zdxbm,
                zdlb:option.zdlb,
                isParent:option.isParent,
                remark:option.remark,
                pidName:glob_treeNode.name
            };
            qData.open = option.open? option.open:false;
            qData = JSON.stringify(qData);
            $.ajax({
                url: "/SysDictAction/save",
                type: "POST",
                dataType: "json",
                data:qData,
                contentType: "application/json",
                success: function (res) {
                    if(res.success){
                        //console.log(res)
                        bootbox.alert({
                            message: res.msg,
                            callback: function () {
                                newModal.modal('hide');
                                getData({
                                    currentPage: "1",
                                    pageSize: "500",
                                    pid:saveid
                                });
                                getRelation({
                                    currentPage: "1",
                                    pageSize: "10",
                                    recreatePager: true,
                                    id: saveid
                                });
                            }
                        })
                    }else{
                        bootbox.alert("添加失败")
                    }
                },
                error: function () {
                    console.log("Failed...");
                }
            });
        }

        /**
         *
         * @param  修改验证
         * @returns {boolean}
         */
        function tabChValiDate(obj) {
            $('#bj_valida').validate({
                rules: {
                    name_c: {
                        required: true
                    },
                    zdxbm_c: {
                        required:true
                    },
                    zdlb_c: {
                        required: true
                    }
                }
            });
            if (!$("#bj_valida").valid()) {
                return false;
            }else{
                amend(obj)
            }
        }

        // 修改字典项接口
        function amend(option){
            var qData = {
                id:option.id,
                pid:option.pid,
                name:option.name,
                zdxbm:option.zdxbm,
                remark:option.remark,
                zdlb:option.zdlb,
                pidName:option.pidName||"",
                version:option.version,
                isParent:option.isParent
        };
            qData.open = option.open? option.open:false;
            qData = JSON.stringify(qData);
       //     console.log(qData)
            $.ajax({
                url: "/SysDictAction/update",
                type: "POST",
                dataType: "json",
                data:qData,
                contentType: "application/json",
                success: function (res) {
                   // console.log(res)
                    if(res.success){
                        bootbox.alert({
                            message: res.msg,
                            callback: function () {
                                $('#change_modal').modal('hide');
                                getData({
                                    currentPage: "1",
                                    pageSize: "500",
                                    id:saveid
                                });
                                lookSelf(saveid);
                                getRelation({
                                    currentPage: "1",
                                    pageSize: "10",
                                    recreatePager: true,
                                    id: saveid
                                });
                            }
                        })
                    }else{
                        bootbox.alert("修改失败")
                    }
                },
                error: function () {
                    console.log("Failed...");
                }
            });
        }

        /**修改按钮
         **/
        function revamp(that){
            var chModal = $('#change_modal');
            chModal.modal("show");
            $('#name_c').val(that.name);
            $('#zdxbm_c').val(that.zdxbm);
            $('#zdlb_c').html('').append('<option value="字典项">字典项</option>');

            $('#zdlb_c').val(that.zdlb);
            $('#remark_c').val(that.remark);
            $('#pid_c').val(glob_name);
            $("#cxj_yes").off("click");
            var arr = [];
            var obj = {};
            var ModalId;
            $("#cxj_yes").on("click", function () {
                chModal.find("input,select,textarea").each(function (index, item) {
                    ModalId = $(this).attr('id').split("_")[0];
                    arr.push(ModalId);
                    obj[arr[index]] = $(item).val();
                });
                obj["id"] = that.id;
                obj["pid"] = that.pid;
                obj["zdlb"] = $('#zdlb_c').find("option:selected").text();
                obj["pidName"] = glob_name;
                obj["isParent"] = false;
                obj["version"] = that.version;
                // console.log(obj)
                //修改字典项
                tabChValiDate(obj)
            });
        }

        //删除字典项接口
        function delOrginal(option,pid){
            var qData = {
                id:option.id
            };
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
                callback: function (result) {
                    if(result){
                        $.ajax({
                            url: "/SysDictAction/delete",
                            type: "POST",
                            dataType: "json",
                            data:qData,
                            contentType: "application/json",
                            success: function (res) {
                               // console.log(res)
                                if(res.success){
                                    getData({
                                        currentPage: "1",
                                        pageSize: "500"
                                    });
                                    //关联父选项的id
                                    getRelation({
                                        currentPage: "1",
                                        pageSize: "10",
                                        recreatePager: true,
                                        id:pid
                                    });

                                }else{
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

        //关联字典项
        function getRelation(options){
            var qData = {
                id:options.id
            };
            qData.pageSize = options.pageSize?options.pageSize:10;
            qData.pageNo = options.currentPage?options.currentPage:1;

            qData = JSON.stringify(qData);
            $.ajax({
                url: "/SysDictAction/findByLink",
                type: "POST",
                dataType: "json",
                data:qData,
                contentType: "application/json",
                success: function (res) {
                    if(res.success) {
                     //  console.log(res.msg)
                        var data = res.msg.result;
                            if(data.length){
                                var table = $("#diction_table"),
                                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>",
                                    start = (options.currentPage - 1) * options.pageSize,
                                    end = options.currentPage * options.pageSize < res.msg.total ? options.pageSize : res.msg.total - start;
                                if (!pager || options.recreatePager) {
                                    pager = CreatePagination({
                                        pageSize: options.pageSize,
                                        pagerId: "#dictionaries_page",
                                        totalCount: res.msg.total,
                                        jumpBox: false,
                                        refreshFun: getRelation,
                                        data: qData
                                    });
                                }
                                for (var i = 0; i < end; i++) {
                                    var thisData = data[i];
                                    str += "<tr param="+ (JSON.stringify(thisData)) +">" +
                                        "<td>" + (start + i + 1) + "</td>" +
                                        "<td>" + (thisData.name || "") + "</td>" +
                                        "<td>" + (thisData.zdxbm || "") + "</td>" +
                                        "<td>" + (glob_treeNode.name || "字典管理")+ "</td>" +
                                        "<td>" + ( thisData.zdlb || "") + "</td>" +
                                        "<td><button class='btn btn-primary edit'>编辑</button> <button class='btn btn-info del'>删除</button></td></tr>";
                                }
                                str += "</tbody>";
                                table.html("").append(str);
                                var pagehtml = "<div class='pull-left page-margin'>共有" + (res.msg.total||"0")+ "条记录，当前第 <span style='color: #0066c7'>" + options.currentPage + "</span>/" + ((Math.ceil(res.msg.total / options.pageSize))||"0")+ "页</div>";
                                $("#dictionaries_page").parent().find(".page-margin").remove().end().append(pagehtml);
                            }else{
                                var table = $("#diction_table"),
                                    str = "<tbody><tr>" + table.find("tr:first").clone().html() + "</tr>";
                                str += "<tr><td colspan='6'>暂无字典项</td>></tr></tbody>";
                                table.html('').append(str);
                            }
                        /**
                         * 表格操作
                         * 修改
                         */
                        $("#diction_table").find('.edit').on('click',function(){
                            $("#bj_valida").find("input,select").removeClass("error").next("label").hide();
                         //   console.log($(this))
                                var mes = JSON.parse($(this).closest('tr').attr('param'));
                                revamp(mes);
                        });

                        /**
                         * 删除
                         */
                        $("#diction_table").find('.del').on('click',function(){
                            var mes = JSON.parse($(this).closest('tr').attr('param'));
                            $.each(zNodes, function (index, item) {
                                if ((zNodes[index].id == mes.id)) {
                                    delOrginal({
                                        id:mes.id //每个tr的id
                                    },mes.pid);
                                }
                            });
                        });
                    }

                },
                error: function () {
                    console.log("Failed...");
                }
            });
        }

        //初始化函数
        function init() {
            //默认请求根数据
            getData({
                currentPage: 1,
                pageSize: 500
            });
            //默认请求根节点的关联数据
            getRelation({
                currentPage: "1",
                pageSize: "10",
                recreatePager: true,
                id:1
            });
            clickEvent();
        }
        return {
            init:init
        };
    })();
    dictionaries.init();

});

