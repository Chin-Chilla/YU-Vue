/**
 * Created by zfChen on 2021/1/23.
 */
var that;
var aJson = {};
function zTreeOnclick(event, treeId, treeNode){
    $("#text4").val(treeNode.nodeCode);
    $("#text3").val(treeNode.nodeName);
    $("#text7").val(treeNode.note);
    $("#text8").val(treeNode.nodePath);
    if(treeNode.checkState=="1"){
        $("#checkState").val("审核通过");
    }
    $("#refuseNote").val(treeNode.refuseNote);
    console.log(treeNode)
};
var setting = {
    async: {
        enable: true,
        type: "GET",
        dataType: 'json',
        url: BASE_URL + "/index_manager/getResTreeById",
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
        onClick:zTreeOnclick,
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
    return node.font ? node.font : {};
};
//新增按钮
function addHoverDom(treeId, treeNode){
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增子节点' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function() {
        toastr.success("点击时间绑定");
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};
function zTreeEditOnclick(event, treeId, treeNode){
    $("#text4").val(treeNode.nodeCode);
    $("#text3").val(treeNode.nodeName);
    $("#text7").val(treeNode.note);
    $("#text8").val(treeNode.nodePath);
    if(treeNode.checkState=="1"){
        $("#checkState").val("审核通过");
    }
    $("#refuseNote").val(treeNode.refuseNote);
    console.log(treeNode)
};
function beforeRemove(treeId,treeNode){
    var res = confirm("确定删除该节点吗？")
    if(!res){
        return false;
    }
    var nodeId = treeNode.nodeId;
    var treeId = treeNode.treeId;
    var data = {
        nodeId:nodeId,
        treeId:treeId
    }
    //查询该节点下是否有数据,有数据不可删除节点
    getDataByPost(
        '/resource_manage/hasDataAndChild',
        data,
        res=>{
            nodeHasData = res.data[0];
            nodeHasChild = res.data[1];
        },
        err=>{
            toastr.error("请求错误！");
        }
    )
    if(!nodeHasData){
        if(nodeHasChild){
            var cue = confirm("是否要删除该节点下所有节点？");
            if(cue){
                return true;
            }
            return false;
        }else{
            return true;
        }
    }else{
        toastr.warning("有数据不能删除！");
        return false;
    }
};
function beforeRename(treeId,treeNode,newName,isCancel){
    if (newName.length == 0) {
        setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("serviceTree");
            zTree.cancelEditName();
            toastr.warning("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
};
//todo:
function zTreeOnRemove(event, treeId, treeNode){
};
function zTreeOnRename(event, treeId, treeNode, isCancel){};
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
        showRenameBtn: true,
        showRemoveBtn: true,
        editNameSelectAll: true
    },
    data: {
        simpleData:{
            enable:true,
            idKey:"nodeId",
            pIdKey:"pnodeId",
            rootPId:"0"
        },
        key: {
            name: "nodeName",
            nodepath:"nodePath",
            flag:"flag"
        }
    },
    async: {
        enable: true,
        type: "GET",
        dataType: 'json',
        url: BASE_URL + "/index_manager/getResTreeById",
        autoParam: ["nodeId"]
    },
    callback:{
        onClick:zTreeEditOnclick,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: zTreeOnRemove,
        onRename:zTreeOnRename,
        //禁止拖拽
        beforeDrag(){return false},
        beforeDrop(){return false},
        onAsyncSuccess(event, treeId, treeNode, dataStr) { }
    }
};
var app = new Vue({
    el: "#vue",
    data: {
        editState: 0,
        treeId: 1,
        treeNodes: [],
        data: []
    },
    mounted() {
        that = this;
        that.pageLeave();

        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .catalog").addClass("active");
        $("#text1").empty();
        $("#pagination").empty();
        //初始化资源目录树
        getDataByGet('/index_manager/getResTreeById?nodeId=1000', aJson, res => {
            that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res);
        })
    },
    methods: {
        //判断目录树上是否有未保存的节点信息
        //todo:
        pageLeave() {
            // var data = {};
            // if (editState == 1) {
            //     var ask = confirm("资源目录树有改动数据尚未保存，是否保存？");
            //     if (ask == true) {
            //         saveChange();
            //     }
            //     getDataByGet('/ReSourceDir/deblocking', data, function (msg) {
            //     });
            //     //重置编辑状态标志位
            //     editState = 0;
            // }
            // else if (editState == 2) {
            //     //解锁
            //     getDataByGet('/ReSourceDir/deblocking', data, function (msg) {
            //     });
            // }
        },

        //节点编辑，使树进入一个可编辑的状态
        editChange() {
            getDataByGet('/resource_manage/lockOrNot', aJson, res => {
                console.log(res.data);
                if (res.data == "1") {
                    //可以编辑
                    getDataByGet('/index_manager/getResTreeById?nodeId=1000', aJson, res => {
                        that.treeNodes = $.fn.zTree.init($("#serviceTree"), settingEdit, res);
                    })
                    document.getElementById("saveChange").style.display = "";
                    document.getElementById("editChange").style.display = "none";
                    document.getElementById("diaplayNodesBtn").style.display = "none";
                    document.getElementById("hideNodesBtn").style.display = "none";
                    document.getElementById("showOrHideBtn").style.display = "";
                    //     var strData = {
                    //         treeId: CatalogPage.treeId
                    //     };
                    //     var dataString = JSON.stringify(strData);
                    //     var data = { "dataJson": dataString };
                    //     //显示可编辑状态的树
                    //     $.ajax({
                    //         url: '/ReSourceDir/initialReSourceDirTreeTemp',
                    //         data: data,
                    //         dataType: "JSON",
                    //         async: true,
                    //         type: "GET",
                    //         success: function (dataStr) {
                    //             //成功时初始化这棵树
                    //             try {
                    //                 //setting.edit.enable = true;
                    //                 editState = 2;
                    //                 //console.log("点击后editState:"+editState);
                    //                 //  console.log("treeId:"+CatalogPage.treeId);

                    //                 if (CatalogPage.treeId == 1) {
                    //                     $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
                    //                 }
                    //                 //setCheck();
                    //                 // $("#copy").bind("change", setCheck);
                    //                 // $("#move").bind("change", setCheck);
                    //                 // $("#prev").bind("change", setCheck);
                    //                 // $("#inner").bind("change", setCheck);
                    //                 // $("#next").bind("change", setCheck);
                    //                 // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
                    //                 // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
                    //                 //toastr.warning(dataStr);
                    //                 //setTitle();
                    //             } catch (cer) {
                    //                 console.log(cer);
                    //             }
                    //         },
                    //         error: function (msg) {
                    //             toastr.error("初始化目录树错误！");
                    //         }
                    // });   //这里是ajax的结尾
                }
            }, err => {
                console.log("解锁失败！");
            })


        },

        //保存编辑，使树进入锁定状态
        saveChange(){
            getDataByGet('/index_manager/getResTreeById?nodeId=1000', aJson, res => {
                console.log("lalalala")
                that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res);
            })

            document.getElementById("saveChange").style.display="none";
            document.getElementById("editChange").style.display="";
            document.getElementById("showOrHideBtn").style.display="none";
            document.getElementById("diaplayNodesBtn").style.display="none";
            document.getElementById("hideNodesBtn").style.display="none";
        },


    }
})