var that;
var aJson = {};
/**
 * synInfo : 待传输给后台的数据结构
 *      - mdfileidList   选择部分结果时，记录的元数据 mdfileid;
 *      - sourceNode     源系统目录的选择节点
 *      - syncTo         目标系统的名称
 *      - ifSync         是否筛选同步状态
 */
var synInfo = {};
var setting, setting2;
var targetLocations;
var app = new Vue({
    //绑定html页面的id
    el: "#vue",
    //成员变量
    data: {
        nodeId: '',
        nodeCode: ''
    },
    //初始化方法
    mounted() {
        that = this;
        that.load();
        setting = {
            async: {
                enable: true,
                type: "GET",
                dataType: 'json',
                url: BASE_URL + "/index_manager/getObjById",
                autoParam: ["nodeId"]
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "nodeId",
                    pIdKey: "pnodeId",
                    rootPId: "0"
                },
                key: {
                    name: "nodeName"
                }
            },
            callback: {
                onClick: that.zTreeSolr
            }
        };
        setting2 = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "nodeId",
                    pIdKey: "pnodeId",
                    rootPId: "0"
                },
                key: {
                    name: "nodeName"
                }
            },
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {"Y": "ps", "N": "s"}
            }
        };
    },
    //成员方法
    methods: {
        load() {
            $(".sidebar-menu .treeview-menu li").removeClass("active");
            $(".sidebar-menu .menuObjSync").addClass("active");
            $("#count").empty();
            $("#pagination").empty();
            //初始化目录树
            getDataByGet(
                '/index_manager/getObjById?nodeId=1000',
                aJson,
                res => {
                    $.fn.zTree.init($("#serviceTree"), setting, res);
                }
            )
            $('#tbody').on('click', 'tr', function () {
                $("input:checked").prop("checked", false);
                $(this).find("input[name='optionsRadios']").prop("checked", true);
            });
            getDataByGet(
                '/index_sync/getSyncTo',
                {},function(res){
                    let str="<option value=''>全部</option>>"
                    targetLocations = res.data;
                    for (var i =0; i < targetLocations.length; i++){
                        var option = document.createElement("option");
                        option.text = targetLocations[i].comment;
                        option.value = targetLocations[i].location;
                        $('#syncTo').append(option);
                    }
                }
            );
        },

        zTreeSolr(event, treeId, treeNode) {
            nodeId = treeNode.nodeId;
            nodeCode = treeNode.nodeCode;
            that.showTable();
        },

        showTable() {
            $('#select2-ifSync-container').attr("title", "所有资源");
            $("#select2-ifSync-container").empty();
            var str = "所有资源";
            $("#select2-ifSync-container").prepend(str);
            $("#ifSync").find("option[value = '2']").prop("selected", "selected");
            getDataByPost(
                //查询结果数量修改处
                '/index_sync/querySolrNumByObj_NodeId',
                {nodeId: nodeId},
                res => {
                    $("#count").text("结果数量:  " + res.data);
                    $("#pagination").empty();
                    $("#pagination").Paging({
                        pagesize: 100, count: res.data, toolbar: true, callback: function (page, size, count) {
                            that.changePage(page, size);
                        }
                    });
                    that.changePage(1, 100);
                },
                err => {
                    toastr.error("查询数据失败！");
                }
            )
        },

        changePage(nowPage, size) {
            var ifSync = $("#ifSync").val();
            var data = {
                page: nowPage,
                size: size,
                nodeId: nodeId
            }
            getDataByPost(
                '/index_sync/querySolrDataByObj_NodeId',
                data,
                res => {
                    $("#modaltbody1").empty();
                    $("#sample_1").append("<tbody id='modaltbody1'>");
                    var msg = res.data;
                    for (var o in msg) {
                        $("#modaltbody1").append(" <tr>" +
                            "<td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td>" +
                            "<td>" + msg[o].id + "</td><td>" + msg[o].idtitle + "</td>" +
                            "<td title='" + msg[o].idabs + "' style='width:250px'>" +
                                "<div title='" + msg[o].idabs + "' style='width:250px;height:30px;text-overflow:ellipsis;" +
                                    "white-space:nowrap;overflow:hidden;'>" + msg[o].idabs + "</div></td>" +
                            "<td title='" + msg[o].usr_abs + "' style='width:250px'>" +
                                "<div title='" + msg[o].usr_abs + "' style='width:250px;height:30px;text-overflow:ellipsis;" +
                                    "white-space:nowrap;overflow:hidden;'>" + msg[o].usr_abs + "</div></td>" +
                            "</tr>");
                        var icheck1 = document.getElementById("allpage");
                        if (icheck1.checked == true) {
                            $("input[name='cellChecker']").each(function () {
                                if (!($(this).prop('checked'))) {
                                    $(this).prop('checked', true);
                                }
                            });
                        }
                    }
                    $("#sample_1").append("</tbody>");
                },
                err => {

                }
            )
        },

        selectTable() {
            console.log("--------")
            var pageChecker = document.getElementById("thispage");
            var tableChecker = document.getElementById("tableChecker");
            var allChecker = document.getElementById("allpage");

            if (tableChecker.checked == true) {
                pageChecker.checked = true;
                allChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', true);
                })
            } else {
                pageChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', false);
                })
            }
        },

        selectThisPage() {
            var pageChecker = document.getElementById("thispage");
            var tableChecker = document.getElementById("tableChecker");
            var allChecker = document.getElementById("allpage");

            if (pageChecker.checked == true) {
                tableChecker.checked = true;
                allChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', true);
                })
            } else {
                tableChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', false);
                })
            }
        },

        selectAllPage() {
            var pageChecker = document.getElementById("thispage");
            var tableChecker = document.getElementById("tableChecker");
            var allChecker = document.getElementById("allpage");

            if (allChecker.checked == true) {
                pageChecker.checked = false;
                tableChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', true);
                })
            } else {
                pageChecker.checked = false;
                tableChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', false);
                })
            }
        },
    //该地方是否同步
        ifSync() {
            var syncTo = $("#syncTo").val();
            var ifSync = $("#ifSync").val();
            var data = {
                nodeName: syncTo,
                ifSync: ifSync,
                nodeId: nodeId,
                nodeType: "obj_node"
            }
            if (ifSync == 1 || ifSync == 0) {
                if (ifSync == 1) {
                    $("#delete").removeAttr("disabled");
                } else {
                    $("#delete").attr("disabled", "disabled");
                }
                getDataByPost(
                    '/index_sync/querySolrNumifSync',
                    data,
                    res => {
                        $("#count").text("结果数量:  " + res.data);
                        $("#pagination").empty();
                        $("#pagination").Paging({
                            pagesize: 100, count: res.data, toolbar: true, callback: function (page, size, count) {
                                that.changePage1(page, size);
                            }
                        });
                        that.changePage1(1, 100);
                    },
                    err => {
                        toastr.error("查询数据失败!")
                    }
                )
            } else {
                $("#delete").attr("disabled", "disabled");
                that.showTable();
            }
        },

        changePage1(nowPage, size) {
            var ifSync = $("#ifSync").val();
            var data = {
                nowPage: nowPage,
                size: size,
                nodeId: nodeId,
                ifSync: ifSync,
                nodeType: "obj_node"
            }
            getDataByPost(
                '/index_sync/querySolrDataifSync',
                data,
                res => {
                    $("#modaltbody1").empty();
                    $("#sample_1").append("<tbody id='modaltbody1'>");
                    var msg = res.data;
                    for (var o in msg) {
                        $("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td><td>" + msg[o].id + "</td><td>" + msg[o].idtitle + "</td><td title='" + msg[o].idabs + "' style='width:250px'><div title='" + msg[o].idabs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].idabs + "</div></td><td title='" + msg[o].usr_abs + "' style='width:250px'><div title='" + msg[o].usr_abs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].usr_abs + "</div></td></tr>");
                        var icheck1 = document.getElementById("allpage");
                        if (icheck1.checked == true) {
                            $("input[name='cellChecker']").each(function () {
                                if (!($(this).prop('checked'))) {
                                    $(this).prop('checked', true);
                                }
                            });
                        }
                    }
                    $("#sample_1").append("</tbody>");
                },
                err => {
                    toastr.error("查询数据失败")
                }
            )
        },

        //点击同步按钮后弹窗
        showModel() {
            var icheck1 = document.getElementById("allpage");
            if (icheck1.checked != true) {
                //  选择部分结果
                var ischeck = document.getElementsByName("cellChecker");
                var flag = false;
                for (i = 0; i < ischeck.length; i++) {
                    if (ischeck[i].checked == true) {
                        flag = true;
                        break;
                    }
                }
                if (flag == true) {
                    var selectedMdFileIdList = new Array();
                    for (i = 0; i < ischeck.length; i++) {
                        if (ischeck[i].checked == true) {
                            var mdfileid = ischeck[i].parentNode.nextSibling.innerHTML;
                            selectedMdFileIdList.push(mdfileid);
                        }
                    }
                    synInfo.mdfileidList = selectedMdFileIdList;
                    $("#targetCatalogTree").modal("show");
                    that.treeShow();
                } else {
                    toastr.warning("请选择需要同步的内容");
                }
            } else {
                //todo
                $("#targetCatalogTree").modal("show");
                that.treeShow();
            }
        },

        treeShow() {
            var targetName = $("#syncTo").val();
            var data = {
                nodeName: targetName,
                nodeType: "obj_node"
            };
            getDataByGet(
                '/index_sync/showRevokeTree',
                data,
                res => {
                    if (res != null)
                        $.fn.zTree.init($("#serviceTree2"), setting2, res);
                    else
                        toastr.error("获取目标系统的对象目录失败！");
                }
            )
        },

        //同步函数
        syncFunc() {
            var treeObj = $.fn.zTree.getZTreeObj("serviceTree2");
            //目标树被点击的节点
            var nodes = treeObj.getCheckedNodes(true);
            var selectedNodeIds = new Array();
            var selectedNodeCode = new Array();
            for (var i = 0; i < nodes.length; i++) {
                selectedNodeIds.push(nodes[i].nodeId);
                //将叶节点的node_code加入数组
                if (nodes[i].children == null) {
                    selectedNodeCode.push(nodes[i].nodeCode);
                }
            }
            if (selectedNodeIds.length == 0) {
                toastr.warning("请选择目的节点");
                return;
            }
            if (selectedNodeCode.length > 1) {
                toastr.warning("只可同步至目标系统的单一对象分类下");
                return;
            }
            synInfo.nodes = selectedNodeIds;            //目标节点队列，路径上所有节点的ID
            synInfo.nodeForCode = selectedNodeCode[0];  //目标节点代码，叶节点的Code
            synInfo.sourceNode = nodeId;                //源节点ID，用于界定同步的元数据对象
            synInfo.sourceNodeCode = nodeCode;          //源节点Code，用于界定同步的元数据对象
            synInfo.syncTo = $("#syncTo").val();        //目标系统的名称，并于Locations配置文件中寻找目标solr地址
            synInfo.ifSync = $("#ifSync").val();        //0：未同步；1：已同步；2：所有资源
            synInfo.nodeType = "obj_node";

            //区别处理部分数据或全部结果
            if (document.getElementById("allpage").checked == true) {
                // 处理全部结果
                synInfo.mdfileidList = new Array(); //通过标记一个空的队列，来表示同步所有候选元数据
            } else {
                synInfo.mdfileidList = new Array();
                var check = $("input[name='cellChecker']:checked");//选中的复选框
                check.each(function () {
                    var row = $(this).parent("td").parent("tr");
                    var mdfileID = row.find("td").eq(1).text();
                    synInfo.mdfileidList.push(mdfileID);
                });
            }
            that.sync();
        },

        sync() {
            $("#loading").css('display', 'block');
            var solrQuerystr = document.getElementById("solrQueryStr").value;
            synInfo.solrQueryStr = solrQuerystr;
            var data = {
                synInfo: synInfo
            };
            getDataByPost(
                '/index_sync/syncData',
                data,
                res => {
                    if (res.code == 200) {
                        toastr.success("同步成功！");
                    } else if (res.data == "Permission denied") {
                        toastr.warning("不允许在该节点下进行同步（本地与目标主管部门不一致）！");
                    } else if (res.data == "data nonexistence") {
                        toastr.warning("未找到同步的数据");
                    } else if (res.data == "node nonexistence") {
                        toastr.warning("未选中要同步的节点");
                    } else if (res.data == "source nonexistence") {
                        toastr.warning("未找到本系统源地址");
                    }
                    $("#loading").css('display', 'none');
                },
                err => {
                    toastr.error("同步失败！");
                }
            )
        }
    }
})