/***
 * @author: 陈柱帆
 * @Description: “基础对象目录管理”菜单栏
 * @date: 2021/1/24
 ***/
var that;
//editState是对树进行了操作的标识，0代表未编辑，1表示进行过了编辑,2表示进入了编辑界面却没有进行操作
var editState = 0;
var aJson = {};
function zTreeOnclick(event, treeId, treeNode) {
    $("#text4").val(treeNode.nodeCode);
    $("#text3").val(treeNode.nodeName);
    $("#text7").val(treeNode.note);
    var check_state
    switch (treeNode.checkState) {
        case "0":
            check_state = "待审核";
            break;
        case "1":
            check_state = "审核通过";
            break;
        case "2":
            check_state = "审核拒绝";
            break;
    }
    $("#checkState").val(check_state);
    $("#refuseNote").val(treeNode.refuseNote);
    $("#usersConfig").addClass("hidden");
    var nodeCode = treeNode.nodeCode;
    var code = sessionStorage.getItem("authCode") || 'unauth';
    var role = sessionStorage.getItem("role")
    if (nodeCode.substring(0, code.length) == code && (role.indexOf("ss") != -1 || role.indexOf("ctv") != -1)) {
        $("#usersConfig").removeClass("hidden")
    } else {
        $("#usersConfig").addClass("hidden")
    }
};
var setting = {
    async: {
        enable: true,
        type: "GET",
        dataType: 'json',
        url: BASE_URL + "/index_manager/getObjIncludeUncheckById",
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
        //点击树上的结点获取具体信息
        onClick: zTreeOnclick,
        onAsyncSuccess(event, treeId, treeNode, dataStr) { }
    }
}
//settingEdit中使用到的对象
var pnode_id_test;
var pnode_id0;
var node_path0;
var node_id0;
var node_level;
var nodeHasData;//标记某节点下是否有数据(true有数据，false无数据)
var nodeHasChild;//标记某节点下是否有子节点(true有数据，false无数据)
//按钮选择要新增的按钮的类型
var radioType;
//改变字体颜色
function getFont(treeId, node) {
    if (node.checkState == "0") {
        switch (node.flag) {
            case "insert":
                return {
                    'color': 'red',
                    'background-color': 'rgba(0,0,0,0.3)'
                }
            case "delete":
                return {
                    'text-decoration': 'line-through',
                    'background-color': 'rgba(0,0,0,0.3)'
                }
            case "update":
                return {
                    'color': 'blue',
                    'background-color': 'rgba(0,0,0,0.3)'
                }
        }
    } else if (node.checkState == "2") {
        return {
            'color': 'red',
            'background-color': 'rgba(0,0,0,0.3)'
        }
    } else if (node.flag == 'softdelete') {
        return {
            'text-decoration': 'line-through'
        }
    } else return {};
};
//新增按钮
function addHoverDom(treeId, treeNode) {
    if (treeNode.level < 2) {
        return;
    }
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增子节点' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        //初始化
        that.clearModel();
        $("#myModal").modal('show');
        var type;
        //提交按钮绑定点击事件
        var btn = document.getElementById("increbutton");
        btn.onclick = function () {
            var type = $("#add_type").val();
            var pnodeId = treeNode.nodeId;
            var pnodeCode = treeNode.nodeCode;
            var nodeName = $("#text9").val();
            var nodeCode = $("#code_input").val();

            if (type == "1") {
                //增加固定节点
                var data = {
                    pNodeId: pnodeId,
                    pNodeCode: pnodeCode
                }
                that.clearModel();
                $("#myModal").modal('hide');
                getDataByPost(
                    '/object_manage/insertFixed',
                    data,
                    res => {
                        editState = 1;
                        toastr.success("增加固定节点成功！");
                        that.treeNodes.addNodes(treeNode, res.data);
                    },
                    err => {
                        toastr.error("增加固定节点出错！");
                    }
                )
            } else {
                //增加单个节点（单位名称/部门本级/资源分类）
                if ((nodeName == "") || (nodeCode == "")) {
                    toastr.error("信息不完整！")
                } else {
                    //信息完整，调用后台方法
                    var data = {
                        pNodeId: pnodeId,
                        pNodeCode: pnodeCode,
                        nodeName: nodeName,
                        nodeCode: nodeCode
                    }
                    getDataByPost(
                        '/object_manage/insertSingle',
                        data,
                        res => {
                            editState = 1;
                            $("#myModal").modal('hide');
                            that.treeNodes.addNodes(treeNode, res.data);
                            toastr.success("增加节点成功！")
                        },
                        err => {
                            $("#myModal").modal('hide');
                            toastr.error("增加节点出错！")
                        }
                    )
                }
            }
        };
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};
function beforeRemove(treeId, treeNode) {
    var res = confirm("确定删除该节点吗？")
    if (!res) {
        return false;
    }
    var nodeId = treeNode.nodeId;
    var data = {
        nodeId: nodeId,
    }
    //查询该节点下是否有数据,有数据不可删除节点,此处getDataByPost1为同步方法（async：false），否则在进入该方法前就会将节点删除。
    getDataByPost1(
        '/object_manage/hasDataAndChild',
        data,
        res => {
            nodeHasData = res.data[0];
            nodeHasChild = res.data[1];
        },
        err => {
            toastr.error("请求错误！");
        }
    )
    if (!nodeHasData) {
        if (nodeHasChild) {
            var cue = confirm("是否要删除该节点下所有节点？");
            if (cue) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    } else {
        toastr.warning("该节点下有数据不能删除！");
        return false;
    }
};
function beforeRename(treeId, treeNode, newName, isCancel) {
    if (newName.length == 0) {
        setTimeout(function () {
            var zTree = $.fn.zTree.getZTreeObj("serviceTree");
            zTree.cancelEditName();
            toastr.warning("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
};
//何时显示重命名和删除按钮
function showRenameOrRemoveBtn(treeId, treeNode) {
    //权限判断
    var code = sessionStorage.getItem("authCode") || 'unauth';
    var role = sessionStorage.getItem("role")
    if (treeNode.level < 3) {
        return;
    }
    if (role.indexOf("ss") != -1) {
        return true;
    }
    if (role.indexOf("ss") != -1 || role.indexOf("ctm") != -1) {
        if (treeNode.nodeCode.substring(0, code.length) == code) {
            if (treeNode.nodeName == "本级") {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
};
function zTreeEditOnclick(event, treeId, treeNode) {
    $("#text4").val(treeNode.nodeCode);
    $("#text3").val(treeNode.nodeName);
    $("#text7").val(treeNode.note);
    var check_state
    switch (treeNode.checkState) {
        case "0":
            check_state = "待审核";
            break;
        case "1":
            check_state = "审核通过";
            break;
        case "2":
            check_state = "审核拒绝";
            break;
    }
    $("#checkState").val(check_state);
    $("#refuseNote").val(treeNode.refuseNote);
    // var code = sessionStorage.getItem("authCode") || 'unauth';
    // var role = sessionStorage.getItem("role")
    // var nodeCode = treeNode.nodeCode;
    // $("#passBtn").addClass("hidden")
    // $("#refuseBtn").addClass("hidden")
    // $("#usersConfig").addClass("hidden");
    // if (role.indexOf("ss") != -1 || role.indexOf("ctv") != -1) {
    //     if (nodeCode.substring(0, code.length) == code) {
    //         $("#passBtn").removeClass("hidden")
    //         $("#refuseBtn").removeClass("hidden")
    //     }
    // }
    // if (nodeCode.substring(0, code.length) == code && (role.indexOf("ss") != -1 || role.indexOf("ctv") != -1)) {
    //     $("#usersConfig").removeClass("hidden")
    // } else {
    //     $("#usersConfig").addClass("hidden")
    // }
};
function zTreeOnRemove(event, treeId, treeNode) {
    var nodeId = treeNode.nodeId;
    var data = {
        nodeId: nodeId
    }
    getDataByPost(
        '/object_manage/delete',
        data,
        res => {
            editState = 1;
            toastr.success("删除节点成功！")
        },
        err => {
            toastr.error("删除节点失败！");
        }
    )
};
function zTreeOnRename(event, treeId, treeNode, isCancel) {
    var nodeId = treeNode.nodeId;
    var nodeName = treeNode.nodeName;
    var data = {
        nodeId: nodeId,
        nodeName: nodeName
    }
    getDataByPost(
        '/object_manage/rename',
        data,
        res => {
            editState = 1;
            toastr.success("重命名成功！");
        },
        err => {
            isCancel = true;
            toastr.error("载入目录树错误！");
        }
    )
};
var settingEdit = {
    view: {
        fontCss: getFont,
        nameIsHTML: true,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    edit: {
        enable: true,
        showRenameBtn: showRenameOrRemoveBtn,
        showRemoveBtn: showRenameOrRemoveBtn,
        editNameSelectAll: true
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "nodeId",
            pIdKey: "pnodeId",
            rootPId: "0"
        },
        key: {
            name: "nodeName",
            nodepath: "nodePath",
            flag: "flag"
        }
    },
    async: {
        enable: true,
        type: "GET",
        dataType: 'json',
        url: BASE_URL + "/index_manager/getObjIncludeUncheckById",
        autoParam: ["nodeId"]
    },
    callback: {
        onClick: zTreeEditOnclick,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: zTreeOnRemove,
        onRename: zTreeOnRename,
        //禁止拖拽
        beforeDrag() { return false },
        beforeDrop() { return false },
        onAsyncSuccess(event, treeId, treeNode, dataStr) { }
    }
};
var obj = new Vue({
    el: "#obj",
    data: {
        treeNodes: [],
        data: [],
        userList: [],
        totalCount: 0
    },
    mounted() {
        that = this;
        that.pageLeave();
        MainPage.inObj = true;
        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .object").addClass("active");
        $("#text1").empty();
        $("#pagination").empty();
        //初始化对象目录树
        getDataByGet('/index_manager/getObjIncludeUncheckById?nodeId=1000', aJson, res => {
            that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res);
        })
    },
    methods: {
        //判断目录树上是否有未保存的节点信息
        pageLeave() {
            if (editState == 1) {
                var ask = confirm("资源目录树有改动数据尚未保存，是否保存？");
                if (ask == true) {
                    that.saveChange();
                } else {
                    getDataByGet('/object_manage/clearTemp', aJson);
                }
                //重置编辑状态标志位
                editState = 0;
            }
        },

        //节点编辑，使树进入一个可编辑的状态
        editChange() {
            getDataByGet('/object_manage/lockOrNot', aJson, res => {
                if (res.data == "1") {
                    //可以编辑
                    getDataByGet('/index_manager/getObjIncludeUncheckById?nodeId=1000', aJson, res => {
                        that.treeNodes = $.fn.zTree.init($("#serviceTree"), settingEdit, res);
                    })
                    $("#passBtn").addClass("hidden")
                    $("#refuseBtn").addClass("hidden")
                    $("#usersConfig").addClass("hidden");
                    document.getElementById("saveChange").style.display = "";
                    document.getElementById("editChange").style.display = "none";
                    editState = 2;
                }
            }, err => {
                toastr.error("解锁失败！");
            })
        },

        //保存编辑，使树进入锁定状态
        saveChange() {
            if (editState == 1) {
                getDataByGet(
                    '/object_manage/saveChange',
                    aJson,
                    res => {
                        toastr.success("保存编辑成功！");
                        getDataByGet('/index_manager/getObjIncludeUncheckById?nodeId=1000', aJson, res => {
                            that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res);
                        })
                    },
                    err => {
                        toastr.error("保存编辑出错！");
                    }
                )
            } else {
                toastr.warning("当前未做任何编辑");
                getDataByGet('/index_manager/getObjIncludeUncheckById?nodeId=1000', aJson, res => {
                    that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res);
                })
            }
            $("#passBtn").addClass("hidden")
            $("#refuseBtn").addClass("hidden")
            $("#usersConfig").addClass("hidden");
            editState = 0;
            document.getElementById("saveChange").style.display = "none";
            document.getElementById("editChange").style.display = "";
            // document.getElementById("showOrHideBtn").style.display="none";
            // document.getElementById("diaplayNodesBtn").style.display="none";
            // document.getElementById("hideNodesBtn").style.display="none";
        },

        addTypeChange() {
            var e = $("#add_type").find("option:selected").val();
            if (e != 2) {
                $("#node_name").addClass("hidden")
                $("#node_code").addClass("hidden")
            } else {
                $("#node_name").removeClass("hidden")
                $("#node_code").removeClass("hidden")
            }
        },

        blurInputServiceTree() {
            var node_name = $("#text9").val();
            var tip = "<span style='margin-right:25px;'><img width='20px' src='/YU/statics/imgs/error_icon.png'/></span>";
            var primary = "<span style='margin-right:25px;'><img width='20px' src='/YU/statics/imgs/correct_icon.png'/></span>";
            if (node_name == "") {
                document.getElementById("label_1").innerHTML = tip;

            } else {
                document.getElementById("label_1").innerHTML = primary;
            }
        },

        //初始化模态框
        clearModel() {
            var radio = document.getElementsByName("nodeType");
            for (var i = 0; i < radio.length; i++) {
                if (radio[i].checked) {
                    radio[i].checked = false;
                    break;
                }
            }
            var text1 = document.getElementById("text9");
            var text3 = document.getElementById("showorder");
            var text4 = document.getElementById("text11");
            var text5 = document.getElementById("text12");
            $("#text9").val("");
            $("#textArci").val("");
            $("#showorder").val(1);
            $("#text12").val("");
            var tip = "<label class=\"form-group\" id=\"label_1\" style=\"margin:0px 0px 0px 15px\" class=\"col-sm-4 control-label\">*(必填)</label>";
            document.getElementById("label_1").innerHTML = tip;
            document.getElementById("label_2").innerHTML = tip;
        }
    }

})