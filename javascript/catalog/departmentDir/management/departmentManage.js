/***
 * @author: 陈柱帆
 * @Description: “部门分类目录树管理”菜单栏
 * @date: 2021/3/9
 ***/
var that;
//editState是对树进行了操作的标识，0代表未编辑，1表示进行过了编辑,2表示进入了编辑界面却没有进行操作
var editState = 0;
var aJson = {};
function zTreeOnclick(event, treeId, treeNode){
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
    var code = sessionStorage.getItem("authCode")||'unauth';
    var role = sessionStorage.getItem("role")
    if(nodeCode.substring(0,code.length)==code&&(role.indexOf("ss")!=-1||role.indexOf("ctv")!=-1)){
        $("#usersConfig").removeClass("hidden")
    }else{
        $("#usersConfig").addClass("hidden")
    }
};
var setting = {
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
        onClick:zTreeOnclick
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
    if(node.checkState=="0"){
        switch (node.flag) {
            case "insert":
                return {
                    'color':'red',
                    'background-color':'rgba(0,0,0,0.3)'
                }
            case "delete":
                return {
                    'text-decoration':'line-through',
                    'background-color':'rgba(0,0,0,0.3)'
                }
            case "update":
                return {
                    'color':'blue',
                    'background-color':'rgba(0,0,0,0.3)'
                }
        }
    }else if(node.checkState=="2"){
        return {
            'color':'red',
            'background-color':'rgba(0,0,0,0.3)'
        }
    }else if(node.flag=='softdelete'){
        return {
            'text-decoration':'line-through'
        }
    }else return {};
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
        $("#root_node").addClass("hidden");
        $("#root_option").removeClass("hidden");
        $("#dpt_option").removeClass("hidden");
        $("#node_name").removeClass("hidden")
        $("#note").removeClass("hidden")
        $("#add_type").val("0");
        //初始化
        that.clearModel();
        $("#myModal").modal('show');
        var type;
        if(treeNode.nodeCode.indexOf("_")==-1) {
            $("#root_node").removeClass("hidden");
            $("#node_name").css("margin-top","0px")
        }else{
            $("#node_name").css("margin-top","30px")
        }
        if(treeNode.level==4){
            $("#root_option").addClass("hidden");
        }
        if(treeNode.level>4){
            $("#root_option").addClass("hidden");
            $("#dpt_option").addClass("hidden");
        }
        //提交按钮绑定点击事件
        var btn = document.getElementById("increbutton");
        btn.onclick = function(){
            //nodeCode有“_”时说明不是单位节点，不会在add_type中选择，该下拉框值为0.
            if(treeNode.nodeCode.indexOf("_")==-1) {
                type = $("#add_type").val();
            }else{
                type =4;
            }
            var pnodeId = treeNode.nodeId;
            var pnodeCode = treeNode.nodeCode;
            var nodeName = $("#text9").val();
            var note = $("#text12").val();
            var level = treeNode.level;

            if(type == "3"){
                //增加固定节点
                var data = {
                    pNodeId:pnodeId,
                    pNodeCode:pnodeCode
                }
                that.clearModel();
                $("#myModal").modal('hide');
                getDataByPost(
                    '/resource_manage/insertFixed',
                    data,
                    res=>{
                        editState = 1;
                        toastr.success("增加固定节点成功！");
                        that.treeNodes.addNodes(treeNode,res.data);
                    },
                    err=>{
                        toastr.error("增加固定节点出错！");
                    }
                )
            }else{
                //增加单个节点（单位名称/部门本级/资源分类）
                //判断填写信息是否完整
                /**
                 * 以下三种情况下为信息填写不完整：
                 * 1.nodeNmae为空时：
                 *        （1）add_type == 0 && type ==4;(添加资源分类节点却没有填写节点名称)
                 *        （2）type != 1;(不是部门本级)；
                 * 2.没有选择节点类型，此时无论是否填写了节点名称都会报错：
                 *        （3）add_type == 0 && type !=4
                 */
                if( ((nodeName == "")&&( type!=1 || ($("#add_type").val()=="0"&&type=="4") ))  ||  ($("#add_type").val()=="0"&&type!="4")    ){
                    toastr.error("信息不完整！")
                }else{
                    //信息完整，调用后台方法
                    var data = {
                        pNodeId:pnodeId,
                        pNodeCode:pnodeCode,
                        note:note,
                        type:type,
                        level:level,
                        nodeName:nodeName
                    }
                    getDataByPost(
                        '/resource_manage/insertSingle',
                        data,
                        res=>{
                            editState = 1;
                            $("#myModal").modal('hide');
                            that.treeNodes.addNodes(treeNode,res.data);
                            toastr.success("增加节点成功！")
                        },
                        err=>{
                            $("#myModal").modal('hide');
                            toastr.error("增加节点出错！")
                        }
                    )
                }
            }
        };
        // getDataByGet('/index_manager/getResTreeById?nodeId=1000', aJson, res => {
        //     that.treeNodes.addNodes(treeNode,res);
        // })
        // that.treeNodes.addNodes(treeNode,res);
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};
function beforeRemove(treeId,treeNode){
    var res = confirm("确定删除该节点吗？")
    if(!res){
        return false;
    }
    var nodeId = treeNode.nodeId;
    var data = {
        nodeId:nodeId,
    }
    //查询该节点下是否有数据,有数据不可删除节点,此处getDataByPost1为同步方法（async：false），否则在进入该方法前就会将节点删除。
    getDataByPost1(
        '/department_manager/hasDataAndChild',
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
        toastr.warning("该节点下有数据不能删除！");
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
function zTreeEditOnclick(event, treeId, treeNode){
    $("#text4").val(treeNode.nodeCode);
    $("#text3").val(treeNode.nodeName);
    $("#text7").val(treeNode.note);
    console.log(treeNode);
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
    $("#passBtn").addClass("hidden")
    $("#refuseBtn").addClass("hidden")
    $("#usersConfig").addClass("hidden");
};
function zTreeOnRemove(event, treeId, treeNode){
    var nodeId = treeNode.nodeId;
    var data = {
        nodeId:nodeId
    }
    getDataByPost(
        '/resource_manage/delete',
        data,
        res=>{
            editState = 1;
            toastr.success("删除节点成功！")
        },
        err=>{
            toastr.error("删除节点失败！");
        }
    )
};
function zTreeOnRename(event, treeId, treeNode, isCancel){
    var nodeId = treeNode.nodeId;
    var nodeName = treeNode.nodeName;
    var data = {
        nodeId:nodeId,
        nodeName:nodeName
    }
    getDataByPost(
        '/resource_manage/rename',
        data,
        res=>{
            editState = 1;
            toastr.success("重命名成功！");
        },
        err=>{
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
    callback:{
        onClick:zTreeEditOnclick,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: zTreeOnRemove,
        onRename:zTreeOnRename,
        //禁止拖拽
        beforeDrag(){return false},
        beforeDrop(){return false},
    }
};
var dep = new Vue({
    el: "#dep",
    data: {
        treeNodes: [],
        data: [],
        userList:[],
        totalCount:0
    },
    mounted() {
        that = this;
        that.pageLeave();
        MainPage.inDep = true;
        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .HWCatalog").addClass("active");
        $("#text1").empty();
        $("#pagination").empty();
        //初始化对象目录树
        getDataByGet('/department_manager/getDepartTree', aJson, res => {
            that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res.data);
        })
    },
    methods: {
        //判断目录树上是否有未保存的节点信息
        pageLeave() {
            if (editState == 1) {
                var ask = confirm("资源目录树有改动数据尚未保存，是否保存？");
                if (ask == true) {
                    that.saveChange();
                }
                //重置编辑状态标志位
                editState = 0;
            }
        },

        //节点编辑，使树进入一个可编辑的状态
        editChange() {
            getDataByGet('/resource_manage/lockOrNot', aJson, res => {
                if (res.data == "1") {
                    //可以编辑
                    getDataByGet('/department_manager/getDepartTree', aJson, res => {
                        that.treeNodes = $.fn.zTree.init($("#serviceTree"), settingEdit, res.data);
                    })
                    $("#passBtn").addClass("hidden")
                    $("#refuseBtn").addClass("hidden")
                    $("#usersConfig").addClass("hidden");
                    document.getElementById("saveChange").style.display = "";
                    document.getElementById("editChange").style.display = "none";
                    // document.getElementById("diaplayNodesBtn").style.display = "none";
                    // document.getElementById("hideNodesBtn").style.display = "none";
                    // document.getElementById("showOrHideBtn").style.display = "";
                    editState = 2;
                }
            }, err => {
                toastr.error("解锁失败！");
            })
        },

        //保存编辑，使树进入锁定状态
        saveChange(){
            if(editState == 1){
                getDataByGet(
                    '/department_manager/saveChange',
                    aJson,
                    res=>{
                        toastr.success("保存编辑成功！");
                        getDataByGet('/department_manager/getDepartTree', aJson, res => {
                            that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res.data);
                        })
                    },
                    err=>{
                        toastr.error("保存编辑出错！");
                    }
                )
            }else{
                toastr.warning("当前未做任何编辑");
                getDataByGet('/index_manager/getResTreeById?nodeId=1000', aJson, res => {
                    that.treeNodes = $.fn.zTree.init($("#serviceTree"), setting, res);
                })
            }
            $("#passBtn").addClass("hidden")
            $("#refuseBtn").addClass("hidden")
            $("#usersConfig").addClass("hidden");
            editState = 0;
            document.getElementById("saveChange").style.display="none";
            document.getElementById("editChange").style.display="";
            // document.getElementById("showOrHideBtn").style.display="none";
            // document.getElementById("diaplayNodesBtn").style.display="none";
            // document.getElementById("hideNodesBtn").style.display="none";
        },

        blurInputServiceTree() {
            var node_name = $("#text9").val();
            var tip = "<span style='margin-right:25px;'><img width='20px' src='/YU/statics/imgs/error_icon.png'/></span>";
            var primary = "<span style='margin-right:25px;'><img width='20px' src='/YU/statics/imgs/correct_icon.png'/></span>";
            if(node_name == ""){
                document.getElementById("label_1").innerHTML = tip;
            }else{
                document.getElementById("label_1").innerHTML = primary;
            }
        },

        //初始化模态框
        clearModel(){
            var radio = document.getElementsByName("nodeType");
            for(var i=0;i<radio.length;i++){
                if(radio[i].checked){
                    radio[i].checked = false;
                    break;
                }
            }
            var text1 = document.getElementById("text9");
            var text2 = document.getElementById("textArci");
            var text3 = document.getElementById("showorder");
            var text4 = document.getElementById("text11");
            var text5 = document.getElementById("text12");
            text1.disabled = false;
            text2.disabled = false;
            text3.disabled = false;
            text4.disabled = false;
            text5.disabled = false;
            $("#text9").val("");
            $("#textArci").val("");
            $("#showorder").val(1);
            $("#text12").val("");
            var tip = "<label class=\"form-group\" id=\"label_1\" style=\"margin:0px 0px 0px 15px\" class=\"col-sm-4 control-label\">*(必填)</label>";
            document.getElementById("label_1").innerHTML = tip;
            document.getElementById("label_2").innerHTML = tip;
            document.getElementById("label_3").innerHTML = tip;
        }

    },

})