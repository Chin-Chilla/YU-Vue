/**
 * Created by GuoTao on 2016/7/27.
 * //判断资源目录树上是否有未保存的节点信息
 CatalogPage.pageLeave();
 */
CatalogPage={
    treeNodes:[],
    data:[],
    treeId:1,


    //  flag0:0,//作为判断节点是否为黑底白字的标志
    load:function () {
        //判断资源目录树上是否有未保存的节点信息
        CatalogPage.pageLeave();
        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .catalog").addClass("active");
        var data={};
        $("#text1").empty();
        $("#pagination").empty();
        getStringData('/ReSourceDir/viewShow',data,function (msg) {
            $(".content-wrapper").html(msg);
            // HWCatalogPage.initTreeForHW();
            $.ajax({
                url:'/ReSourceDir/initialReSourceDirTree',
                dataType:"JSON",
                async : false,
                type:"GET",
                success:function(dataStr){
                    // console.log("dataStr:"+dataStr);
                    //成功时初始化这棵树
                    try{
                        //setting.edit.enable = true;
                        $.fn.zTree.init($("#serviceTree"), setting, dataStr);
                        // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
                        // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
                        //setCheck();
                        // $("#copy").bind("change", setCheck);
                        // $("#move").bind("change", setCheck);
                        // $("#prev").bind("change", setCheck);
                        // $("#inner").bind("change", setCheck);
                        // $("#next").bind("change", setCheck);
                        CatalogPage.treeNodes = dataStr;
                    }catch(cer){
                        console.log(cer);
                    }
                },
                error:function(msg){
                    alert("初始化目录树错误！");
                }
            });   //这里是ajax的结尾
        });

    }
    ,pageLeave:function(){
        var data = {};
        // getDataByGet('/ReSourceDir/pageLeave',data,function(msg){
        //     if(msg.state == "error"){
        //         var ask = confirm("资源目录树有改动数据尚未保存，是否保存？");
        //         if(ask == true){
        //             saveChange();
        //         }
        //         else{
        //             getDataByGet('/ReSourceDir/clearTempFile',data,function(msg){
        //
        //             });
        //         }
        //     }
        // });



        if(editState == 1){
            var ask = confirm("资源目录树有改动数据尚未保存，是否保存？");
            if(ask ==true){
                saveChange();
            }
            // else{
            //     //解锁
            //     getDataByGet('/ReSourceDir/deblocking',data,function(msg){
            //        
            //     });
            //     //重置编辑状态标志位
            //     editState = 0;
            // }
            //解锁
            getDataByGet('/ReSourceDir/deblocking',data,function(msg){

            });
            //重置编辑状态标志位
            editState = 0;
        }
            // else{
            //     if(used == 1){
            //         getDataByGet('/ReSourceDir/deblocking',data,function(msg){
            //
            //         });
            //     }
        // }
        else if(editState == 2){
            //解锁
            getDataByGet('/ReSourceDir/deblocking',data,function(msg){

            });
        }
        // else{
        //     //解锁
        //     getDataByGet('/ReSourceDir/deblocking',data,function(msg){
        //
        //     });
        // }
    }

}
//重新载入页面，这里是treeShow
function loadPageServiceTree(){
    // $(".sidebar-menu li").removeClass("active");
    // $(".sidebar-menu .catalog").addClass("active");
    var strData={
        treeId:CatalogPage.treeId
    };
    var dataString = JSON.stringify(strData);
    var data = {"dataJson":dataString};
    // getStringData('/ReSourceDir/viewShow',data,function (msg) {
    //     $(".content-wrapper").html(msg);
    $.ajax({
        url:'/ReSourceDir/reFreshReSourceDirTree',
        data:data,
        dataType:"JSON",
        async : false,
        type:"GET",
        success:function(dataStr){
            //成功时初始化这棵树
            try{
                if(CatalogPage.treeId==1){
                    $.fn.zTree.init($("#serviceTree"), setting, dataStr);
                }

                // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
                // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
            }catch(cer){
                console.log(cer);
            }
        },
        error:function(msg){
            alert("初始化目录树错误！");
        }
    });   //这里是ajax的结尾
}

//点击获取并显示选中节点信息
function zTreeOnClickServiceTree(event, treeId, treeNode) {
    var node_id;
    var pnode_id;
    var node_name;
    var tree_id;
    var frt_ed_code;
    var note;
    var arci;
    var list_order;
    var node_path;
    node_id = treeNode.node_id;

    if(treeNode.pnode_id==null){
        pnode_id = 0;
    }else{
        pnode_id = treeNode.pnode_id
    }
    if(document.getElementById("saveChange").style.display == "") {


        if (treeNode.isBlack == "false") {
            //hideNodes();
            document.getElementById("hideNodesBtn").style.display = "";
            document.getElementById("diaplayNodesBtn").style.display = "none";
            document.getElementById("showOrHideBtn").style.display = "none";
        }
        else {
            // displayNode();
            //document.getElementById("btn1").innerHTML="显示节点"
            document.getElementById("hideNodesBtn").style.display = "none";
            document.getElementById("diaplayNodesBtn").style.display = "";
            document.getElementById("showOrHideBtn").style.display = "none";
        }
    }
    node_name = treeNode.node_name;
    tree_id = treeNode.tree_id;
    arci = treeNode.node_code;
    console.log(arci);
    list_order = treeNode.list_order;
    frt_ed_code = treeNode.frt_ed_code;
    note = treeNode.note;
    node_path = treeNode.node_path;
    //下面对DOM控件进行赋值
    $("#text1").val(node_id);
    $("#text2").val(tree_id);
    $("#text3").val(node_name);
    $("#text4").val(arci);
    $("#showhidepId").val(pnode_id);
    $("#text5").val(frt_ed_code);
    $("#text6").val(list_order);
    $("#text7").val(note);
    $("#text8").val(node_path);
}
//addLeaf为点击添加节点按钮进行判断
function addLeafServiceTree(){
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    var nodes = treeObj.getSelectedNodes();
    //先判断是否有点击选中事件，没有则弹出警告
    if(nodes==""){
        alert("您没有选中上级分类节点！");
    }else{
        //将默认顺序置为1
        $("#showorder").val(1);
        $("#myModal").modal('show');
        //$("#loading1").remove();
    }
}
//下面是对树节点的添加
function addLeafServiceTree(){
    //先获取新增节点信息
    var node_id;
    var pnode_id;
    var tree_id = "1";
    var node_name = $("#text9").val();
    var arci = $("#textArci").val();
    var list_order = $("#showorder").val();
    var frt_ed_code = $("#text11").val();
    var note = $("#text12").val();
    //判断是否为空
    if((node_name && arci && list_order)==""){
        alert("信息不完整!");
    }else{
        //拿到树对象，赋值给node_id,pnode_id,其中node_id需自动生成,需要得到所有节点个数
        var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
        //转换成Array数组
        var allnodes = treeObj.transformToArray(treeObj.getNodes());
        node_id = allnodes.length+1;
        var nodes = treeObj.getSelectedNodes();
        pnode_id=nodes[0].node_id;
        //这里判断一下该节点下面有没有子节点，若没有子节点则默认showorder=1
        //有的话则先统计子节点个数，showorder需要在(1<showorder<原子节点个数+1)获取控件中的值
        var flag = nodes[0].isParent;
        if(!flag){
            //为子节点
            if(list_order!="1"){
                alert("添加的为唯一结点，显示顺序必须为1！");
            }else{
                //显示加载中。。。
                $("#increbutton").before("<span style='margin:0px 250px 0px 0px;font-size:15px;font-weight:bold;'>" +
                    "处理中...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='assets/images/loading.gif'/></span>");
                //进行节点的添加
                //准备数据
                var strdata ="{\"node_id\":\""+node_id+"\","+
                    "\"pnode_id\":\""+pnode_id+"\","+
                    "\"node_name\":\""+node_name+"\","+
                    "\"tree_id\":\""+tree_id+"\","+
                    "\"arci\":\""+arci+"\","+
                    "\"frt_ed_code\":\""+frt_ed_code+"\","+
                    "\"note\":\""+note+"\","+
                    "\"list_order\":\""+list_order+"\","+
                    "\"node_path\":\""+""+"\","+
                    "}";
                var data={"dataJson":strdata,};
                //下面进行ajax提交
                $.ajax({
                    url:'/ReSourceDir/addLeaf',
                    data:data,
                    dataType:"text",
                    async:false,
                    type: "GET",
                    success: function (message) {
                        console.log(message);
                        if("SUCCESS" == message){
                            alert("添加成功！");
                        } else{
                            alert("添加失败！");
                        }
                        //隐藏模态框
                        $("#myModal").modal('hide');
                        //重新载入页面
                        loadPageServiceTree();
                    },
                    error: function (message) {
                        alert("添加失败！");
                    }
                });
            }
        }else{
            //显示加载中。。。
            $("#increbutton").before("<span style='margin:0px 250px 0px 0px;font-size:15px;font-weight:bold;'>" +
                "处理中...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='assets/images/loading.gif'/></span>");
            //为父节点判断输入的数是否符合标准
            var list_order = $("#showorder").val();
            //这是获取选中节点数，儿子节点需要减一，但这里我们不需要
            var selectnodesNum = (treeObj.transformToArray(nodes)).length;
            //判断输入的showorder是否符合规范
            if(list_order >= 1 && list_order < (selectnodesNum+1)){
                //准备数据
                var strdata ="{\"node_id\":\""+node_id+"\","+
                    "\"pnode_id\":\""+pnode_id+"\","+
                    "\"node_name\":\""+node_name+"\","+
                    "\"tree_id\":\""+tree_id+"\","+
                    "\"arci\":\""+arci+"\","+
                    "\"frt_ed_code\":\""+frt_ed_code+"\","+
                    "\"note\":\""+note+"\","+
                    "\"list_order\":\""+list_order+"\","+
                    "\"node_path\":\""+""+"\","+
                    "}";
                var data={"dataJson":strdata,};
                //下面进行ajax提交
                $.ajax({
                    url:'/ReSourceDir/addLeaf',
                    data:data,
                    dataType:"text",
                    async:false,
                    type: "GET",
                    success: function (message) {
                        console.log(message);
                        if("SUCCESS" == message){
                            alert("添加成功！");
                        } else{
                            alert("添加失败！");
                        }
                        //隐藏模态框
                        $("#myModal").modal('hide');
                        //重新载入页面
                        loadPageServiceTree();
                    },
                    error: function (message) {
                        alert("添加失败！");
                    }
                });
            }else{
                alert("输入的显示顺序超出范围！");
            }
        }
    }
}
//对树的修改
//alterLeaf负责准备数据
function alterLeafServiceTree(){
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    var nodes = treeObj.getSelectedNodes();
    //判断选中的是否为子节点，如果是则允许修改pId，name,arci,frontCode,content
    //若为父节点则允许修改后四项
    if(nodes.length > 0){
        var flag = nodes[0].isParent;
    }
    if(flag){
        //准备数据
        var node_id;
        var pnode_id;
        var node_name;
        var tree_id;
        var frt_ed_code;
        var arci;
        var list_order;
        var note;
        node_id = nodes[0].node_id;
        pnode_id = nodes[0].pnode_id;
        node_name = nodes[0].node_name;
        tree_id = nodes[0].tree_id;
        arci = nodes[0].arci;
        list_order = $("#text6").val();
        frt_ed_code = nodes[0].frt_ed_code;
        note = nodes[0].note;
        //将这些数据填充到DOM对象中
        $("#text13").val(node_id);
        //将pnodeid填入隐藏域
        $("#hideoldshoworder").val(list_order);
        $("#hidepId").val(pnode_id);
        $("#text14").val(node_name);
        $("#hidetreeid").val(tree_id);
        $("#text15").val(arci);
        $("#text16").val(frt_ed_code);
        $("#text17").val(note);
        $("#showorder1").val(list_order);
        $("#alterFu").modal('show');
    }else{
        //准备数据
        var node_id;
        var pnode_id;
        var node_name;
        var tree_id;
        var frt_ed_code;
        var arci;
        var list_order;
        var note;
        node_id = nodes[0].node_id;
        pnode_id = nodes[0].pnode_id;
        node_name = nodes[0].node_name;
        tree_id = nodes[0].tree_id;
        arci = nodes[0].arci;
        list_order = nodes[0].list_order;
        frt_ed_code = nodes[0].frt_ed_code;
        note = nodes[0].note;
        //将这些数据填充到DOM对象中
        $("#text18").val(node_id);
        //将pnodeid填入隐藏域
        $("#hideoldshoworder1").val(list_order);
        $("#text19").val(pnode_id);
        $("#text20").val(node_name);
        $("#Sonhidetreeid").val(tree_id);
        $("#text21").val(arci);
        $("#text22").val(frt_ed_code);
        $("#text23").val(note);
        $("#showorder2").val(list_order);
        $("#alterSon").modal('show');
    }
}
//SubAlterLeafFu()进行树父结点信息修改
function SubAlterLeafFuServiceTree(){
    //先获取结点信息
    var node_id = $("#text13").val();
    var pnode_id = $("#hidepId").val();
    var node_name = $("#text14").val();
    var tree_id = $("#hidetreeid").val();
    var arci = $("#text15").val();
    var frt_ed_code = $("#text16").val();
    var note = $("#text17").val();
    var oldshoworder = $("#hideoldshoworder").val();
    //拿到树对象，赋值给nodeid,pnodeid,其中nodeid需自动生成,需要得到所有节点个数
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    //转换成Array数组
    var allnodes = treeObj.transformToArray(treeObj.getNodes());
    var nodes = treeObj.getSelectedNodes();
    //得到选中节点的父节点，为之后统计父节点下包括选中节点的节点数
    var funode = nodes[0].getParentNode();
    //获取选中节点父节点的funodeid，之后要遍历获取pnodeid=funodeid的节点数
    var funodeid = funode.node_id;
    //遍历
    var j = 0;
    for(var i=0;i<allnodes.length;i++){
        if(allnodes[i].pnode_id==funodeid)
            j++;
    }
    var list_order = $("#showorder1").val();
    //这是获取选中节点数，儿子节点需要减一，但这里我们不需要
    var selectnodesNum = j;
    //判断输入的showorder是否符合规范
    if((list_order >= 1) && (list_order < (selectnodesNum+1))){
        //显示加载中。。。
        $("#SubAlterFuButton").before("<span style='margin:0px 250px 0px 0px;font-size:15px;font-weight:bold;'>" +
            "处理中...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='assets/images/loading.gif'/></span>");
        //准备数据
        var strdata ="{\"node_id\":\""+node_id+"\","+
            "\"pnode_id\":\""+pnode_id+"\","+
            "\"node_name\":\""+node_name+"\","+
            "\"tree_id\":\""+tree_id+"\","+
            "\"arci\":\""+arci+"\","+
            "\"list_order\":\""+list_order+"\","+
            "\"frt_ed_code\":\""+frt_ed_code+"\","+
            "\"note\":\""+note+"\","+
            "\"oldshoworder\":\""+oldshoworder+"\","+
            "\"node_path\":\""+""+"\","+
            "}";
        var data={"dataJson":strdata,};
        $.ajax({
            url:'/ReSourceDir/alterLeaf',
            data:data,
            dataType:"text",
            async:false,
            type: "GET",
            success: function (message) {
                console.log(message);
                if("SUCCESS" == message){
                    alert("修改成功！");
                } else{
                    alert("修改失败！");
                }
                //隐藏模态框
                $("#alterFu").modal('hide');
                //重新载入页面
                loadPageServiceTree();
            },
            error: function (message) {
                alert("修改失败！");
            }
        });
    }else{
        alert("输入的显示顺序有误！");
    }
    //}
}

//SubAlterLeafSon()进行树子结点信息修改
function SubAlterLeafSonServiceTree(){
    //先获取结点信息
    var node_id = $("#text18").val();
    var pnode_id = $("#text19").val();
    var node_name = $("#text20").val();
    var tree_id = $("#Sonhidetreeid").val();
    var arci = $("#text21").val();
    //这里的showorder也是先用zTree的，显示准确
    var list_order = $("#showorder2").val();
    var frt_ed_code = $("#text22").val();
    var note = $("#text23").val();
    var oldshoworder = $("#hideoldshoworder1").val();
    //这里需要进行showorder的判断
    //拿到树对象，赋值给nodeid,pnodeid,其中nodeid需自动生成,需要得到所有节点个数
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    var nodes = treeObj.getSelectedNodes();
    //得到选中节点的父节点，为之后统计父节点下包括选中节点的节点数
    var funode = nodes[0].getParentNode();
    //转换成Array数组
    var allnodes = treeObj.transformToArray(funode);
    //showorder数在(1,allnodes.length)
    if(list_order >= 1 && list_order < (allnodes.length)){
        //显示加载中。。。
        $("#SubAlterSonButton").before("<span style='margin:0px 250px 0px 0px;font-size:15px;font-weight:bold;'>" +
            "处理中...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='assets/images/loading.gif'/></span>");
        //准备数据
        var strdata ="{\"node_id\":\""+node_id+"\","+
            "\"pnode_id\":\""+pnode_id+"\","+
            "\"node_name\":\""+node_name+"\","+
            "\"tree_id\":\""+tree_id+"\","+
            "\"arci\":\""+arci+"\","+
            "\"list_order\":\""+list_order+"\","+
            "\"frt_ed_code\":\""+frt_ed_code+"\","+
            "\"note\":\""+note+"\","+
            "\"oldshoworder\":\""+oldshoworder+"\","+
            "\"node_path\":\""+""+"\","+
            "}";
        var data={"dataJson":strdata,};
        $.ajax({
            url:'/ReSourceDir/alterLeaf',
            data:data,
            dataType:"text",
            async:false,
            type: "GET",
            success: function (message) {
                console.log(message);
                if("SUCCESS" == message){
                    alert("修改成功！");
                } else{
                    alert("修改失败！");
                }
                //隐藏模态框
                $("#alterSon").modal('hide');
                //重新载入页面
                loadPageServiceTree();
            },
            error: function (message) {
                alert("修改失败！");
            }
        });
    }else{
        alert("输入的显示顺序有误！");
    }
}
//删除分类的判断
function delLeafServiceTree(){
    //先判断结点是不是子节点，因为是同步修改所以只需考虑子节点，才给予删除
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    var nodes = treeObj.getSelectedNodes();
    var flag = nodes[0].isParent;
    if(!flag){
        //若为子节点则可以删除
        //$("#loadingModal").modal('show');
        $("#delModal").modal('show');
    }else{
        alert("为父分类，需要先删除其子分类!");
    }

}
//提交删除分类
function SubDelLeafServiceTree(){
    //先获取选中节点ID,这里我们利用显示信息的数据
    var node_id = $("#text1").val();
    var pnode_id = $("#showhidepId").val();
    var tree_id = $("#text2").val();
    var node_name = $("#text3").val();
    var arci = $("#text4").val();
    var frt_ed_code = $("#text5").val();
    var list_order = $("#text6").val();
    var note = $("#text7").val();
    //显示加载。。。
    $("#SubDelButton").before("<span style='margin:0px 250px 0px 0px;font-size:15px;font-weight:bold;'>" +
        "处理中...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='assets/images/loading.gif'/></span>");
    //准备数据
    var strdata ="{\"node_id\":\""+node_id+"\","+
        "\"pnode_id\":\""+pnode_id+"\","+
        "\"node_name\":\""+node_name+"\","+
        "\"tree_id\":\""+tree_id+"\","+
        "\"arci\":\""+arci+"\","+
        "\"note\":\""+note+"\","+
        "\"frt_ed_code\":\""+frt_ed_code+"\","+
        "\"list_order\":\""+list_order+"\","+
        "\"node_path\":\""+""+"\","+
        "}";
    var data={"dataJson":strdata,};
    //下面进行ajax提交
    $.ajax({
        url:'/ReSourceDir/delLeaf',
        data:data,
        dataType:"text",
        async:false,
        type: "GET",
        success: function (message) {
            console.log(message);
            if("SUCCESS" == message){
                alert("删除成功！");
            } else{
                alert("删除失败！");
            }
            //隐藏模态框
            $("#delModal").modal('hide');
            //重新载入页面
            loadPageServiceTree();
        },
        error: function (message) {
            alert("删除失败！");
        }
    });

}
//以下写对用户输入的校验,这里是增加时的校验
function blurInputServiceTree() {
    var node_name = $("#text9").val();
    var tip = "<span style='margin-right:25px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:25px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    if(node_name == ""){
        document.getElementById("label_1").innerHTML = tip;

    }else{
        document.getElementById("label_1").innerHTML = primary;
    }
}
function blurInput1ServiceTree(){
    var arci = $("#textArci").val();
    var tip = "<span style='margin-right:25px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:25px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    if(arci == ""){
        document.getElementById("label_2").innerHTML = tip;
    }else{
        document.getElementById("label_2").innerHTML = primary;
    }
}
function blurInput2ServiceTree(){
    var primary = "<span style='margin-right:24px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    var list_order = $("#showorder").val();
    //拿到树对象，赋值给nodeid,pnodeid,其中nodeid需自动生成,需要得到所有节点个数
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    //转换成Array数组
    var allnodes = treeObj.transformToArray(treeObj.getNodes());
    var nodes = treeObj.getSelectedNodes();
    //得到选中节点的父节点，为之后统计父节点下包括选中节点的节点数
    //获取选中节点nodeid，赋值给funodeid,这里注意与修改节点区别，修改是本节点，需要找其父节点，这里不需要，就是选中节点
    console.log("nodes**********"+nodes);
    var funodeid = nodes[0].node_id;
    //遍历
    var j = 0;
    for(var i=0;i<allnodes.length;i++){
        if(allnodes[i].pnode_id==funodeid)
            j++;
    }
    //这是获取选中节点数，儿子节点需要减一，但这里我们不需要
    var selectnodesNum = j;
    var maxnodesNum = j+1;
    var tip = "<span style='margin-right:-103px;'><img width='20px' src='assets/images/error_icon.png'/> 顺序错误！,最大为:"+maxnodesNum+"</span>";
    //有的话则先统计子节点个数，showorder需要在(1<showorder<maxnodesNum)获取控件中的值
    //判断输入的showorder是否符合规范
    if(list_order >= 1 && list_order <= maxnodesNum){
        document.getElementById("label_3").innerHTML = primary;
        return true;
    }else{
        document.getElementById("label_3").innerHTML = tip;
        return false;
    }
}
//这里是修改父节点的是的校验
function blurInput3ServiceTree(){
    var node_name = $("#text14").val();
    var tip = "<span style='margin-right:0px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    if(node_name == ""){
        document.getElementById("label_4").innerHTML = tip;
    }else{
        document.getElementById("label_4").innerHTML = primary;
    }
}
function blurInput4ServiceTree(){
    var arci = $("#text15").val();
    var tip = "<span style='margin-right:0px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    if(arci == ""){
        document.getElementById("label_5").innerHTML = tip;
    }else{
        document.getElementById("label_5").innerHTML = primary;
    }
}
function blurInput5ServiceTree(){
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    var list_order = $("#showorder1").val();
    //拿到树对象，赋值给nodeid,pnodeid,其中nodeid需自动生成,需要得到所有节点个数
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    //转换成Array数组
    var allnodes = treeObj.transformToArray(treeObj.getNodes());
    var nodes = treeObj.getSelectedNodes();
    //得到选中节点的父节点，为之后统计父节点下包括选中节点的节点数
    var funode = nodes.getParentNode();
    //获取选中节点父节点的funodeid，之后要遍历获取pnodeid=funodeid的节点数
    var funodeid = funode.node_id;
    //遍历
    var j = 0;
    for(var i=0;i<allnodes.length;i++){
        if(allnodes[i].pnode_id==funodeid)
            j++;
    }
    //这是获取选中节点数，儿子节点需要减一，但这里我们不需要
    var selectnodesNum = j;
    var maxnodesNum = j+1;
    var tip = "<span style='margin-right:-130px;'><img width='20px' src='assets/images/error_icon.png'/> 顺序错误！,最大为:"+selectnodesNum+"</span>";
    //有的话则先统计子节点个数，showorder需要在(1<showorder<maxnodesNum)获取控件中的值
    //判断输入的showorder是否符合规范
    if(list_order >= 1 && list_order < maxnodesNum){
        document.getElementById("label_6").innerHTML = primary;
        return true;
    }else{
        document.getElementById("label_6").innerHTML = tip;
        return false;
    }
}
//修改子节点的校验
function blurInput6ServiceTree(){
    var pnode_id = $("#text19").val();
    var tip = "<span style='margin-right:-113px;'><img width='20px' src='assets/images/error_icon.png'/>结点编号为数字！</span>";
    var tip1 = "<span style='margin-right:0px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    var reg = /^[0-9]*[1-9][0-9]*$/ ;
    if(pnodeid != ""){
        if(reg.test(pnode_id)){
            document.getElementById("label_8").innerHTML = primary;
        }else{
            document.getElementById("label_8").innerHTML = tip;
        }
    }else{
        document.getElementById("label_8").innerHTML = tip1;
    }

}
function blurInput7ServiceTree(){
    var node_name = $("#text20").val();
    var tip = "<span style='margin-right:0px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    if(node_name == ""){
        document.getElementById("label_9").innerHTML = tip;
    }else{
        document.getElementById("label_9").innerHTML = primary;
    }
}
function blurInput8ServiceTree(){
    var arci = $("#text21").val();
    var tip = "<span style='margin-right:0px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    if(arci == ""){
        document.getElementById("label_10").innerHTML = tip;
    }else{
        document.getElementById("label_10").innerHTML = primary;
    }
}
function blurInput9ServiceTree(){
    var list_order = $("#showorder2").val();
    var primary = "<span style='margin-right:0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    var allnodes = treeObj.transformToArray(treeObj.getNodes());
    var nodes = treeObj.getSelectedNodes();
    var funode = nodes[0].getParentNode();
    var funodeid = funode.node_id;
    //遍历
    var j = 0;
    for(var i=0;i<allnodes.length;i++){
        if(allnodes[i].pnode_id==funodeid)
            j++;
    }
    var maxnodesNum = j+1;
    var tip = "<span style='margin-right:-127px;'><img width='20px' src='assets/images/error_icon.png'/> 顺序错误，最大为:"+j+"</span>";
    if(list_order >= 1 && list_order < maxnodesNum){
        document.getElementById("label_11").innerHTML = primary;
    }else{
        document.getElementById("label_11").innerHTML = tip;
    }
}
//清除输入,这里是增加节点的模态框清理
function cleanInputServiceTree(){
    $("#text9").val("");
    $("#textArci").val("");
    $("#showorder").val("");
    $("#text12").val("");
    var tip = "<span style='margin-right:25px;'><img width='20px' src='assets/images/error_icon.png'/></span>";
    document.getElementById("label_1").innerHTML = tip;
    document.getElementById("label_2").innerHTML = tip;
    document.getElementById("label_3").innerHTML = tip;
}
//清除输入，这里是修改父节点的模态框清理
function cleanInput1ServiceTree(){
    var primary = "<span style='margin:0px 0px 0px 0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    document.getElementById("label_4").innerHTML = primary;
    document.getElementById("label_5").innerHTML = primary;
    document.getElementById("label_6").innerHTML = primary;
}
//清除输入，这里是修改子节点的模态框清理
function cleanInput2ServiceTree(){
    var primary = "<span style='margin:0px 0px 0px 0px;'><img width='20px' src='assets/images/correct_icon.png'/></span>";
    document.getElementById("label_7").innerHTML = primary;
    document.getElementById("label_8").innerHTML = primary;
    document.getElementById("label_9").innerHTML = primary;
    document.getElementById("label_10").innerHTML = primary;
    document.getElementById("label_11").innerHTML = primary;
}

/**
 * Created By JX
 */
//editState是对树进行了操作的标识，0代表未编辑，1表示进行过了编辑,2表示进入了编辑界面却没有进行操作
var editState = 0;
//used表示树是否有人在使用，0代表没有人使用，1代表有人正在使用
var used = 0;
function saveChange(){

    var arci= document.getElementById("text4").value;
    var tree_id= document.getElementById("text2").value;
    var node_id= document.getElementById("text1").value;

    var strData = {
        treeId:CatalogPage.treeId,
        node_code:arci,
        tree_id:tree_id,
        node_id:node_id
    };
    var dataString = JSON.stringify(strData);
    //var data = {"dataJson": dataString};

    getDataByGet('/ReSourceDir/saveChange',dataString,function(msg){
        document.getElementById("saveChange").style.display="none";

        document.getElementById("editChange").style.display="";
        document.getElementById("showOrHideBtn").style.display="none";
        document.getElementById("diaplayNodesBtn").style.display="none";
        document.getElementById("hideNodesBtn").style.display="none";

        if(msg.state == "SUCCESS"){
            editState = 0;
            alert("保存成功");
            //重新载入页面
            loadPageServiceTree();
        }else if(msg.state == "ERROR"){
            editState = 0;
            loadPageServiceTree();
        }
        else
            alert("保存失败");
        loadPageServiceTree();
    });

}

//节点编辑，使树进入一个可编辑的状态
function editChange(){

    //document.getElementById("editChange").style.backgroundImage = "url(@routes.Assets.at(\"../../stylesheets/images/unlocked.png\"))";
    var data = {};
    getDataByGet('ReSourceDir/lockOrNot',data,function(msg){
        if(msg.state == "1"){
            used = 1;
            alert("暂时不能进行编辑，请稍后再试！");
        }
        else{
            //没有人在使用，此时点击了编辑按钮，我正在编辑，此时used=0，但实际上传过来以后在后台被置为了1
            used = 0;
            document.getElementById("saveChange").style.display="";
            document.getElementById("editChange").style.display="none";
            document.getElementById("diaplayNodesBtn").style.display="none";
            //
            document.getElementById("hideNodesBtn").style.display="none";
            document.getElementById("showOrHideBtn").style.display="";
            //judgeShowOrHide();
            //document.getElementById("showNodesBtn").style.display="";


            var strData = {
                treeId:CatalogPage.treeId
            };
            var dataString = JSON.stringify(strData);
            var data = {"dataJson": dataString};
            //显示可编辑状态的树
            $.ajax({
                url:'/ReSourceDir/initialReSourceDirTreeTemp',
                data:data,
                dataType:"JSON",
                async : true,
                type:"GET",
                success:function(dataStr){
                    //成功时初始化这棵树
                    try{
                        //setting.edit.enable = true;
                        editState = 2;
                        //console.log("点击后editState:"+editState);
                        //  console.log("treeId:"+CatalogPage.treeId);

                        if(CatalogPage.treeId==1){
                            $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
                        }
                        //setCheck();
                        // $("#copy").bind("change", setCheck);
                        // $("#move").bind("change", setCheck);
                        // $("#prev").bind("change", setCheck);
                        // $("#inner").bind("change", setCheck);
                        // $("#next").bind("change", setCheck);
                        // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
                        // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
                        //alert(dataStr);
                        //setTitle();
                    }catch(cer){
                        console.log(cer);
                    }
                },
                error:function(msg){
                    alert("初始化目录树错误！");
                }
            });   //这里是ajax的结尾
        }
    });//ajax的结尾


}

var pnode_id_test;
var pnode_id0;
var node_path0;
var node_id0;
var node_level;
//按钮选择要新增的按钮的类型
var radioType;
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    console.log("sObj*****"+sObj);
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增子节点' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    //初始化变量
    pnode_id0 = 0;
    node_level = 0;
    radioType="";
    pnode_id0 = treeNode.node_id;
    //console.log("当前添加的节点id+父节点id"+pnode_id0);
    node_path0 = treeNode.node_path;
    //console.log("经过树节点时的路径："+node_path0);
    //拿到树对象，赋值给node_id,pnode_id,其中node_id需自动生成,需要得到所有节点个数
    //if(treeId==1){
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    // }else{
    //     var treeObj = $.fn.zTree.getZTreeObj("HWTree");
    // }

    //转换成Array数组
    var allnodes = treeObj.transformToArray(treeObj.getNodes());
    node_id0 = allnodes.length+1;

    pnode_id_test = pnode_id0;
    while(pnode_id_test!=1000){
        for(var i=0;i<allnodes.length;i++){
            if(allnodes[i].node_id==pnode_id_test){
                pnode_id_test = allnodes[i].pnode_id;
                node_level++;
                break;
            }
        }
    }
    //点击菜单上新增节点绑定点击事件
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        //初始化
        clearModel();
        $("#myModal").modal('show');
        //提交按钮绑定点击事件
        var btn = document.getElementById("increbutton");
        btn.onclick=function(){
            var node_id = node_id0;
            var pnode_id = pnode_id0;
            //var tree_id = treeNode.tree_id;
            var tree_id = CatalogPage.treeId;
            var node_name = $("#text9").val();
            var arci = $("#textArci").val();

            var list_order = $("#showorder").val();
            var frt_ed_code = $("#text11").val();
            var note = $("#text12").val();
            var node_path = treeNode.node_path;
            var pnode_code = treeNode.node_code;

            //else {

            if (radioType == "fixed") {
                //初始化模态框
                clearModel();
                //隐藏模态框
                $("#myModal").modal('hide');
                //准备数据
                var strData = {
                    node_id: node_id,
                    pnode_id: pnode_id,
                    node_path: node_path,
                    pnode_code:pnode_code,
                    tree_id:tree_id
                }
                var dataString = JSON.stringify(strData);
                var data = {"dataJson": dataString};
                $.ajax({
                    url: '/ReSourceDir/addFixedLeafJson',
                    data: data,
                    dataType: "JSON",
                    async: true,
                    type: "GET",
                    success: function (dataStr) {
                        //成功时载入这棵树
                        try {
                            editState = 1;
                            console.log("editState现在是"+editState);
                            //if(tree_id==1){
                            $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
                            // }else{
                            //     $.fn.zTree.init($("#HWTree"), settingEditHW, dataStr);
                            // }

                            // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
                            // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
                            //alert(dataStr);
                            //setCheck();
                            // $("#copy").bind("change", setCheck);
                            // $("#move").bind("change", setCheck);
                            // $("#prev").bind("change", setCheck);
                            // $("#inner").bind("change", setCheck);
                            // $("#next").bind("change", setCheck);
                            editState = 1;

                        } catch (cer) {
                            console.log(cer);
                        }
                    },
                    error: function (msg) {
                        alert("载入目录树错误！");
                    }
                });//ajax的结尾
            }
            /**
             * normal的新增方式
             */
            else if((radioType == "normal")){
                //判断是否为空
                if ((node_name && list_order) == "") {
                    alert("信息不完整!");
                }
                else{
                    //初始化模态框
                    clearModel();
                    //隐藏模态框
                    $("#myModal").modal('hide');
                    //准备数据
                    var strData = {
                        node_id: node_id,
                        pnode_id: pnode_id,
                        node_name: node_name,
                        tree_id: tree_id,
                        arci: arci,
                        node_code:arci,
                        list_order: list_order,
                        node_path: node_path,
                        note: note,
                        pnode_code:pnode_code
                    }
                    var dataString = JSON.stringify(strData);
                    console.log(dataString);
                    var data = {"dataJson": dataString};
                    $.ajax({
                        url: '/ReSourceDir/addLeafJson',
                        data: data,
                        dataType: "JSON",
                        async: true,
                        type: "GET",
                        success: function (dataStr) {
                            //成功时载入这棵树
                            try {
                                editState = 1;
                                //if(tree_id==1){
                                $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
                                // }else{
                                //     $.fn.zTree.init($("#HWTree"), settingEditHW, dataStr);
                                // }
                                // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
                                // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
                                //alert(dataStr);
                                //setCheck();
                                // $("#copy").bind("change", setCheck);
                                // $("#move").bind("change", setCheck);
                                // $("#prev").bind("change", setCheck);
                                // $("#inner").bind("change", setCheck);
                                // $("#next").bind("change", setCheck);

                            } catch (cer) {
                                console.log(cer);
                            }
                        },
                        error: function (msg) {
                            alert("载入目录树错误！");
                        }
                    });//ajax的结尾
                }
            }
            else{
                alert("请先选择节点类型！");
            }
            //}
        };
        return false;
    });
};
// function addHoverDom2(treeId, treeNode) {
//     var sObj = $("#" + treeNode.tId + "_span");
//     if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
//     var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
//         + "' title='新增子节点' onfocus='this.blur();'></span>";
//     sObj.after(addStr);
//     //初始化变量
//     pnode_id0 = 0;
//     node_level = 0;
//     radioType="";
//     pnode_id0 = treeNode.node_id;
//     console.log("当前添加的节点id+父节点id"+pnode_id0);
//     node_path0 = treeNode.node_path;
//     //console.log("经过树节点时的路径："+node_path0);
//     //拿到树对象，赋值给node_id,pnode_id,其中node_id需自动生成,需要得到所有节点个数
//     // if(treeId==1){
//     //     var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
//     // }else{
//         var treeObj = $.fn.zTree.getZTreeObj("HWTree");
//     //}
//
//     //转换成Array数组
//     var allnodes = treeObj.transformToArray(treeObj.getNodes());
//     node_id0 = allnodes.length+1;
//
//     pnode_id_test = pnode_id0;
//     while(pnode_id_test!=1000){
//         for(var i=0;i<allnodes.length;i++){
//             if(allnodes[i].node_id==pnode_id_test){
//                 pnode_id_test = allnodes[i].pnode_id;
//                 node_level++;
//                 break;
//             }
//         }
//     }
//     //点击菜单上新增节点绑定点击事件
//     var btn = $("#addBtn_"+treeNode.tId);
//     if (btn) btn.bind("click", function(){
//         //初始化
//         clearModel();
//         $("#myModal").modal('show');
//         //提交按钮绑定点击事件
//         var btn = document.getElementById("increbutton");
//         btn.onclick=function(){
//             var node_id = node_id0;
//             var pnode_id = pnode_id0;
//             //var tree_id = treeNode.tree_id;
//             var tree_id = CatalogPage.treeId;
//             var node_name = $("#text9").val();
//             var arci = $("#textArci").val();
//             var list_order = $("#showorder").val();
//             var frt_ed_code = $("#text11").val();
//             var note = $("#text12").val();
//             var node_path = treeNode.node_path;
//             var pnode_code = treeNode.node_code;
//
//             //else {
//
//             if (radioType == "fixed") {
//                 //初始化模态框
//                 clearModel();
//                 //隐藏模态框
//                 $("#myModal").modal('hide');
//                 //准备数据
//                 var strData = {
//                     node_id: node_id,
//                     pnode_id: pnode_id,
//                     node_path: node_path,
//                     pnode_code:pnode_code,
//                     tree_id:tree_id
//                 }
//                 var dataString = JSON.stringify(strData);
//                 var data = {"dataJson": dataString};
//                 $.ajax({
//                     url: '/ReSourceDir/addFixedLeafJson',
//                     data: data,
//                     dataType: "JSON",
//                     async: true,
//                     type: "GET",
//                     success: function (dataStr) {
//                         //成功时载入这棵树
//                         try {
//                             editState = 1;
//                             console.log("editState现在是"+editState);
//                             // if(tree_id==1){
//                             //     $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
//                             // }else{
//                                 $.fn.zTree.init($("#HWTree"), settingEditHW, dataStr);
//                             //}
//
//                             // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
//                             // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
//                             //alert(dataStr);
//                             //setCheck();
//                             // $("#copy").bind("change", setCheck);
//                             // $("#move").bind("change", setCheck);
//                             // $("#prev").bind("change", setCheck);
//                             // $("#inner").bind("change", setCheck);
//                             // $("#next").bind("change", setCheck);
//                             editState = 1;
//
//                         } catch (cer) {
//                             console.log(cer);
//                         }
//                     },
//                     error: function (msg) {
//                         alert("载入目录树错误！");
//                     }
//                 });//ajax的结尾
//             }
//             /**
//              * normal的新增方式
//              */
//             else if((radioType == "normal")){
//                 //判断是否为空
//                 if ((node_name && list_order) == "") {
//                     alert("信息不完整!");
//                 }
//                 else{
//                     //初始化模态框
//                     clearModel();
//                     //隐藏模态框
//                     $("#myModal").modal('hide');
//                     //准备数据
//                     var strData = {
//                         node_id: node_id,
//                         pnode_id: pnode_id,
//                         node_name: node_name,
//                         tree_id: tree_id,
//                         arci: arci,
//                         list_order: list_order,
//                         node_path: node_path,
//                         note: note,
//                         pnode_code:pnode_code
//                     }
//                     var dataString = JSON.stringify(strData);
//                     var data = {"dataJson": dataString};
//                     $.ajax({
//                         url: '/ReSourceDir/addLeafJson',
//                         data: data,
//                         dataType: "JSON",
//                         async: true,
//                         type: "GET",
//                         success: function (dataStr) {
//                             //成功时载入这棵树
//                             try {
//                                 editState = 1;
//                                 // if(tree_id==1){
//                                 //     $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
//                                 // }else{
//                                     $.fn.zTree.init($("#HWTree"), settingEditHW, dataStr);
//                                 //}
//                                 // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
//                                 // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
//                                 //alert(dataStr);
//                                 //setCheck();
//                                 // $("#copy").bind("change", setCheck);
//                                 // $("#move").bind("change", setCheck);
//                                 // $("#prev").bind("change", setCheck);
//                                 // $("#inner").bind("change", setCheck);
//                                 // $("#next").bind("change", setCheck);
//
//                             } catch (cer) {
//                                 console.log(cer);
//                             }
//                         },
//                         error: function (msg) {
//                             alert("载入目录树错误！");
//                         }
//                     });//ajax的结尾
//                 }
//             }
//             else{
//                 alert("请先选择节点类型！");
//             }
//             //}
//         };
//         return false;
//     });
// };
//单选框 新增时判断类型选择是否正确
function typeIsRight(level,type) {
    var level = level;
    var type = type;
    if(type == "normal"){
        if(level!=1){
            return true;
        }
    }
        // else if(type == "fixed"){
        //     if(level==1){
        //         return true;
        //     }
    // }
    else if(type=="fixed"){
        if(level==1){
            return true;
        }
    }else{
        return false;
    }
}
//单选时触发事件
function insertRadioType() {
    var radio = document.getElementsByName("nodeType");
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            radioType = radio[i].value;
        }

    }
    if (!typeIsRight(node_level, radioType)) {
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                radio[i].checked = false;
                break;
            }
        }
        alert("节点类型不正确！!");
    }
    else {
        var text1 = document.getElementById("text9");
        var text2 = document.getElementById("textArci");
        var text3 = document.getElementById("showorder");
        var text4 = document.getElementById("text11");
        var text5 = document.getElementById("text12");
        //当单选选择了固定节点时，输入框不能输入
        if (radioType == "fixed") {
            text1.disabled = true;
            text2.disabled = true;
            text3.disabled = true;
            text4.disabled = true;
            text5.disabled = true;
        }
        else {
            text1.disabled = false;
            text2.disabled = false;
            text3.disabled = false;
            text4.disabled = false;
            text5.disabled = false;
        }
    }
}
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();

};

//改变字体颜色
function getFont(treeId, node) {
    return node.font ? node.font : {};
}
/**
 * before
 */
    //弹框确认是否要重命名
var log,className = "dark";
function showLog(str) {
    if (!log) log = $("#log");
    log.append("<li class='"+className+"'>"+str+"</li>");
    if(log.children("li").length > 8) {
        log.get(0).removeChild(log.children("li")[0]);
    }
}
function getTime() {
    var now= new Date(),
        h=now.getHours(),
        m=now.getMinutes(),
        s=now.getSeconds(),
        ms=now.getMilliseconds();
    return (h+":"+m+":"+s+ " " +ms);
}
// function judgeShowOrHide(){
//     var zTree = $.fn.zTree.getZTreeObj("serviceTree"),
//         nodes = zTree.getSelectedNodes();
//     if(nodes[0].isBlack=="false"){
//         //hideNodes();
//        // document.getElementById("btn1").innerHTML="隐藏节点";
//         document.getElementById("diaplayNodesBtn").style.display="none";
//     }
//     else{
//        // displayNode();
//         //document.getElementById("btn1").innerHTML="显示节点"
//         document.getElementById("hideNodesBtn").style.display="none";
//     }

//}
//显示某一特定节点
function displayNode() {
    var zTree = $.fn.zTree.getZTreeObj("serviceTree"),
        nodes = zTree.getSelectedNodes();

    if (nodes.length == 0) {
        alert("请至少选择一个节点");
        return;
    }else if(nodes[0].isBlack=="false"){
        alert("该节点已显示");
        //document.getElementById("diaplayNodesBtn").style.display="none";
        return;
    }
    var node_id = $("#text1").val();
    var data = {
        nodeId: node_id,
        treeId:CatalogPage.treeId,
        //isParent:isParent
    };
    var dataString = JSON.stringify(data);
    getDataByGet('/ReSourceDir/displayNode',dataString,function(msg){
        if(msg.state=="error"){
            alert("数据更新出错！");
        }
        else{
            //alert("测试输出：此为显示隐藏的节点");
            $.fn.zTree.init($("#serviceTree"), settingEdit, msg);
            // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
            // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
        }
        //loadPageServiceTree();
        //重新载入树
        // var data={};
        // $("#pagination").empty();
        // getStringData('/ReSourceDir/viewShow',data,function (msg) {
        //     $(".content-wrapper").html(msg);
        //     $.ajax({
        //         url:'/ReSourceDir/initialReSourceDirTree',
        //         dataType:"JSON",
        //         async : false,
        //         type:"GET",
        //         success:function(dataStr){
        //             //成功时初始化这棵树
        //             try{
        //                 //setting.edit.enable = true;
        //                 $.fn.zTree.init($("#serviceTree"), setting, dataStr);
        //                 $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
        //                 $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
        //                 //setTitle();
        //                 //setCheck();
        //                 // $("#copy").bind("change", setCheck);
        //                 // $("#move").bind("change", setCheck);
        //                 // $("#prev").bind("change", setCheck);
        //                 // $("#inner").bind("change", setCheck);
        //                 // $("#next").bind("change", setCheck);
        //             }catch(cer){
        //                 console.log(cer);
        //             }
        //         },
        //         error:function(msg){
        //             alert("初始化目录树错误！");
        //         }
        //     });   //这里是ajax的结尾
        // })//重新载入树的结尾

    })
}
//显示所有隐藏的节点
function showNodes() {
    var zTree = $.fn.zTree.getZTreeObj("serviceTree"),
        nodes = zTree.getNodesByParam("isHidden", true);
    // nodes1 = zTree.getNodesByParam("isBlack",true);

    zTree.showNodes(nodes);
    for (var i = 0; i < nodes.length; i++) {

        var data = {

            nodeId: nodes[i].node_id,

            treeId: CatalogPage.treeId
            //nodeId: 21860,
            //treeId:CatalogPage.treeId,
            //isParent:isParent

        };

        var dataString = JSON.stringify(data);
        getDataByGet('/ReSourceDir/showNode', dataString, function (msg) {
            nodes.length--;
            if (msg.state == "error") {
                alert("数据更新出错！");
            }
            if (msg.state == "SUCCESS" && nodes.length==0) {
                alert("测试输出：此为显示隐藏的节点");
                //loadPageServiceTree();


                //重新载入树
                var data = {};
                $("#pagination").empty();
                getStringData('/ReSourceDir/viewShow', data, function (msg) {
                    $(".content-wrapper").html(msg);
                    $.ajax({
                        url: '/ReSourceDir/initialReSourceDirTree',
                        dataType: "JSON",
                        async: false,
                        type: "GET",
                        success: function (dataStr) {
                            //成功时初始化这棵树
                            try {
                                //setting.edit.enable = true;
                                $.fn.zTree.init($("#serviceTree"), setting, dataStr);
                                // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
                                // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
                                //setTitle();
                                //setCheck();
                                // $("#copy").bind("change", setCheck);
                                // $("#move").bind("change", setCheck);
                                // $("#prev").bind("change", setCheck);
                                // $("#inner").bind("change", setCheck);
                                // $("#next").bind("change", setCheck);
                            } catch (cer) {
                                console.log(cer);
                            }
                        },
                        error: function (msg) {
                            alert("初始化目录树错误！");
                        }
                    });   //这里是ajax的结尾
                })//重新载入树的结尾
            }
        })
    }//for结尾
}
//隐藏节点
function hideNodes() {
    var isParent;
    if(CatalogPage.treeId==1){
        var zTree = $.fn.zTree.getZTreeObj("serviceTree"),
            nodes = zTree.getSelectedNodes();

    }else{
        var zTree = $.fn.zTree.getZTreeObj("HWTree"),
            nodes = zTree.getSelectedNodes();
        // if (nodes.length == 0) {
        //     alert("请至少选择一个节点");
        //     return;
        // }
    }
    if (nodes.length == 0) {
        alert("请至少选择一个节点");
        return;
    }
    else if(nodes[0].isBlack=="true"){
        alert("该节点已隐藏");
        //document.getElementById("hideNodesBtn").style.display="none";
        return;
    }else{
        var cue = confirm("确定要隐藏吗？");
        if(!cue){
            return;
        }else{
            if(nodes[0].isParent){
                isParent = 1;

            }else{
                isParent=0;

            }
        }

    }


    //zTree.hideNodes(nodes);
    var node_id = $("#text1").val();
    var data = {
        nodeId: node_id,
        treeId:CatalogPage.treeId,
        isParent:isParent
    };
    var dataString = JSON.stringify(data);
    getDataByGet('/ReSourceDir/hideNode',dataString,function(msg){
        if(msg.state=="error"){
            alert("数据更新出错！");


        }
        else{
            alert("隐藏成功！");
            $.fn.zTree.init($("#serviceTree"), settingEdit, msg);
        }
    })
}
// //删除节点
// function zTreeOnRemove(event, treeId, treeNode) {
//         var node_id = treeNode.node_id;
//         var node_path = treeNode.node_path;
//         var tree_id = treeNode.tree_id;
//     //     var str ='' ;
//     //     str = getAllChildrenNodes(treeNode,str);
//     //     var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
//     //     var nodes = treeObj.getNodesByParam("name", "test", null)[0].children;//节点的子节点数据集合。
//         //json传输的是json字符串
//         //js中使用的是json数组
//         //准备数据
//         var strData = {
//             node_id: node_id,
//             node_path:node_path,
//             tree_id:tree_id
//         }
//         var dataString = JSON.stringify(strData);
//         //alert(dataString);
//         var data = {"dataJson": dataString,};
//         $.ajax({
//             url: '/ReSourceDir/delTempLeaf',
//             data: data,
//             dataType: "JSON",
//             async: false,
//             type: "GET",
//             success: function (dataStr) {
//                 //成功时载入这棵树
//                 try {
//                     console.log("ajax删除已返回");
//                     editState = 1;
//                     if(tree_id==1){
//                         $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
//                     }
//                     else{
//                         $.fn.zTree.init($("#HWTree"), settingEditHW, dataStr);
//                     }
//                     $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
//                     $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
//                     //setTitle();
//                     //alert(dataStr);
//                     //setCheck();
//                     $("#copy").bind("change", setCheck);
//                     $("#move").bind("change", setCheck);
//                     $("#prev").bind("change", setCheck);
//                     $("#inner").bind("change", setCheck);
//                     $("#next").bind("change", setCheck);
//
//                 } catch (cer) {
//                     console.log(cer);
//                 }
//             },
//             error: function (msg) {
//                 alert("载入目录树错误！");
//             }
//         });//这里是ajax的结尾
// }
//删除节点
function zTreeOnRemove(event, treeId, treeNode) {
    var node_id = treeNode.node_id;
    var node_path = treeNode.node_path;
    var tree_id = treeNode.tree_id;
    //     var str ='' ;
    //     str = getAllChildrenNodes(treeNode,str);
    //     var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    //     var nodes = treeObj.getNodesByParam("name", "test", null)[0].children;//节点的子节点数据集合。
    //json传输的是json字符串
    //js中使用的是json数组
    //准备数据
    var strData = {
        node_id: node_id,
        node_path:node_path,
        tree_id:tree_id
    }
    var dataString = JSON.stringify(strData);
    //alert(dataString);
    var data = {"dataJson": dataString,};
    $.ajax({
        url: '/ReSourceDir/delTempLeaf',
        data: data,
        dataType: "JSON",
        async: false,
        type: "GET",
        success: function (dataStr) {
            //成功时载入这棵树

            try {
                editState = 1;
                $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
                // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
                // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
                //setTitle();
                //alert(dataStr);
            } catch (cer) {
                console.log(cer);
            }
        },
        error: function (msg) {

        }
    });//这里是ajax的结尾
}





//修改名称
function zTreeOnRename(event, treeId, treeNode, isCancel) {
    var node_id = treeNode.node_id;
    var node_name = treeNode.node_name;
    var node_path = treeNode.node_path;
    var tree_id = treeNode.tree_id;
    //alert(node_name);
    //准备数据
    var strData={
        node_id:node_id,
        node_name:node_name,
        node_path:node_path,
        tree_id:tree_id
    }
    var dataString = JSON.stringify(strData);
    var data = {"dataJson":dataString};
    $.ajax({
        url:'/ReSourceDir/rename',
        data:data,
        dataType:"JSON",
        async:true,
        type:"GET",
        success:function(dataStr){
            //成功时载入这棵树
            try{
                editState = 1;
                if(tree_id==1){
                    $.fn.zTree.init($("#serviceTree"), settingEdit, dataStr);
                }

                // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
                // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
                //alert(dataStr);
                //setCheck();
                // $("#copy").bind("change", setCheck);
                // $("#move").bind("change", setCheck);
                // $("#prev").bind("change", setCheck);
                // $("#inner").bind("change", setCheck);
                // $("#next").bind("change", setCheck);
            }catch(cer){
                console.log(cer);
            }
        },
        error:function(msg){
            isCancel = true;
            alert("载入目录树错误！");
        }
    });//ajax的结尾
}
var isflag=0;
function beforeRemove(treeId,treeNode){
    //判断节点下是否有数据
    //判断是否是子节点，父节点就弹框提示

    var node_id = treeNode.node_id;
    var tree_id = treeNode.tree_id;
    console.log("node_id is "+node_id);
    var strData = {
        node_id: node_id,
        tree_id:tree_id
    };
    var dataString = JSON.stringify(strData);
    var data = {"dataJson":dataString};
    $.ajax({
        url:'/ReSourceDir/hasData',
        data:data,
        dataType:"JSON",
        async:false,
        type:"GET",
        success:function(dataStr){

            if(dataStr=="0"){
                isflag=1;
            }else{
                isflag=2;
            }
        },
        error:function(msg){
            console.log("ERROR");
        }
    });//ajax的结尾
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&"+isflag);
    if(isflag==1){
        if(treeNode.children){
            //alert("父节点！");
            var cue = confirm("是否要删除该节点下所有节点？");
            if(cue){
                return true;
            }
            return false;
        }else{
            return true;
        }
    }else{
        alert("有数据不能删除!!");
        return false;
    }

}



function beforeRename(treeId,treeNode,newName,isCancel){
    if (newName.length == 0) {
        setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("serviceTree");
            zTree.cancelEditName();
            alert("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}

//拖拽功能
function beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}
function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
}
// function setCheck() {
//     var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
//         isCopy = $("#copy").attr("checked"),
//         isMove = $("#move").attr("checked"),
//         prev = $("#prev").attr("checked"),
//         inner = $("#inner").attr("checked"),
//         next = $("#next").attr("checked");
//     zTree.setting.edit.drag.isCopy = isCopy;
//     zTree.setting.edit.drag.isMove = isMove;
//     showCode(1, ['setting.edit.drag.isCopy = ' + isCopy, 'setting.edit.drag.isMove = ' + isMove]);
//
//     zTree.setting.edit.drag.prev = prev;
//     zTree.setting.edit.drag.inner = inner;
//     zTree.setting.edit.drag.next = next;
//     showCode(2, ['setting.edit.drag.prev = ' + prev, 'setting.edit.drag.inner = ' + inner, 'setting.edit.drag.next = ' + next]);
// }
function showCode(id, str) {
    var code = $("#code" + id);
    code.empty();
    for (var i=0, l=str.length; i<l; i++) {
        code.append("<li>"+str[i]+"</li>");
    }
}
//初始化模态框
function clearModel(){
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

// //显示隐藏节点
// function showHide(){
//     var zTree = $.fn.zTree.getZTreeObj("serviceTree"),
//         nodes = zTree.getSelectedNodes();
//     if (nodes.length == 0) {
//         alert("请至少选择一个节点");
//         return;
//     }
//     //zTree.showNode(nodes);
//     var node_id = $("#text1").val();
//     var data = {
//         nodeId: node_id
//     };
//     var dataString = JSON.stringify(data);
//     getDataByGet('/ReSourceDir/showNode',dataString,function(msg){
//         if(msg.state==error){
//             alert("数据更新出错！");
//         }
//         else{
//             alert("测试输出：此为隐藏的节点");
//         }
//     })
//
//
//     //重新载入树
//     var data={};
//     $("#pagination").empty();
//     getStringData('/ReSourceDir/viewShow',data,function (msg) {
//         $(".content-wrapper").html(msg);
//         $.ajax({
//             url:'/ReSourceDir/initialReSourceDirTree',
//             dataType:"JSON",
//             async : false,
//             type:"GET",
//             success:function(dataStr){
//                 //成功时初始化这棵树
//                 try{
//                     //setting.edit.enable = true;
//                     $.fn.zTree.init($("#serviceTree"), setting, dataStr);
//                     $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
//                     $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
//                     //setTitle();
//                     //setCheck();
//                     // $("#copy").bind("change", setCheck);
//                     // $("#move").bind("change", setCheck);
//                     // $("#prev").bind("change", setCheck);
//                     // $("#inner").bind("change", setCheck);
//                     // $("#next").bind("change", setCheck);
//                 }catch(cer){
//                     console.log(cer);
//                 }
//             },
//             error:function(msg){
//                 alert("初始化目录树错误！");
//             }
//         });   //这里是ajax的结尾
//     })//重新载入树的结尾
//
// }

/**
 * 为了生成node_code，pnode_code写的自动生成代码，不用了
 */
function testbtn0(){
    var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
    var nodes = treeObj.getSelectedNodes();
    //先判断是否有点击选中事件，没有则弹出警告
    if(nodes==""){
        alert("您没有选中上级分类节点！");
    }else{
        console.log("选中了节点");
        // var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
        // var nodes = treeObj.getSelectedNodes();
        var node_id=nodes[0].node_id;
        //var node_id = $("#text1").val;
        var node_name = $("#text3").val();
        console.log("node_name="+node_name);
        var strData = {
            node_id: node_id,
            node_name:node_name
        }
        var dataString = JSON.stringify(strData);
        var data = {"dataJson": dataString};
        $.ajax({
            url: '/ReSourceDir/testbtn',
            data: data,
            dataType: "JSON",
            async: false,
            type: "GET",
            success: function (dataStr) {
                if(dataStr.state == "success"){
                    alert("成功啦！");
                }
            },
            error: function (msg) {
                alert("出错啦！");
            }
        });//ajax的结尾
    }
    /**
     * var node_id = treeNode.node_id;
     //json传输的是json字符串
     //js中使用的是json数组
     //准备数据
     var strData = {
                node_id:node_id
            }
     var dataString = JSON.stringify(strData);
     //alert(dataString);
     var data={"dataJson":dataString,};
     */
}
// function treenodeClick(event, treeId, treeNode, clickFlag) {
//     //此处treeNode 为当前节点
//     var str ='' ;
//     str = getAllChildrenNodes(treeNode,str);
//     alert(str); //所有叶子节点ID
// }

// function getAllChildrenNodes(treeNode,result){
//     if (treeNode.isParent) {
//         var childrenNodes = treeNode.children;
//         if (childrenNodes) {
//             for (var i = 0; i < childrenNodes.length; i++) {
//                 result += ',' + childrenNodes[i].id;
//                 result = getAllChildrenNodes(childrenNodes[i], result);
//             }
//         }
//     }
//     return result;
// }


//离开页面前提醒用户是否要保存
// $(document).ready(function(){
//     $(window).unload(function(){
//         alert("再见！");
//     });
// });
// window.onbeforeunload=function(e){
//     var e = window.event||e;
//     e.returnValue=("确定离开当前页面吗？");
// } 

// window.onbeforeunload=function(){
//     if(editState==1){
//         return "亲~页面修改的内容没保存";
//     }
// });
// HWCatalogPage={
//     initTreeForHW:function(){
//         var data = {};
//         getDataByGet('/ReSourceDir/checkDataExist',data,function(msg){
//             if(msg.state=="none"){
//                 //json文件里面为空，则按钮显示
//                 document.getElementById("selfTree").style.display="block";
//             }
//             else{
//                 //json文件里面不为空，则按钮隐藏
//                 if($("#selfTree")){
//                 document.getElementById("selfTree").style.display="none";
//                 }
//                 $.fn.zTree.init($("#HWTree"), setting, msg);
//                 // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
//                 // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
//             }
//         });
//     }
//     ,
//     addRoot:function () {
//         HWCatalogPage.clearTreeModel();
//         $("#treeModal").modal('show');
//         var btn = document.getElementById("increTreeButton");
//         btn.onclick = function(){
//             var text_1 = $("#text_tree_name").val();
//             var text_2 =$("#text_tree_note").val();
//             if(text_1==""){
//                 alert("信息不完整!");
//             }else{
//                 //隐藏模态框
//                 $("#treeModal").modal('hide');
//                 var strData = {
//                     node_name:text_1,
//                     note:text_2
//                 };
//                 var dataString = JSON.stringify(strData);
//                 var data = {"dataJson": dataString};
//                 // getDataByGet('/ReSourceDir/addRoot',data,function(msg){
//                 //     // document.getElementById("selfTree").style.display="none";
//                 //     // //HWCatalogPage.treeFlag = 1;
//                 //     // $.fn.zTree.init($("#HWTree"), setting, msg);
//                 //     // $("#hideNodesBtn").bind("click", {type:"rename"}, hideNodes);
//                 //     // $("#showNodesBtn").bind("click", {type:"icon"}, showNodes);
//                 // });
//                 $.ajax({
//                     url: '/ReSourceDir/addRoot',
//                     data: data,
//                     dataType: "JSON",
//                     async: false,
//                     type: "GET",
//                     success: function (dataStr) {
//                         //成功时载入这棵树
//                         try {
//                             document.getElementById("selfTree").style.display="none";
//                             $.fn.zTree.init($("#HWTree"), setting, dataStr);
//                             // $("#hideNodesBtn").bind("click", {type: "rename"}, hideNodes);
//                             // $("#showNodesBtn").bind("click", {type: "icon"}, showNodes);
//                             //alert(dataStr);
//                            // setCheck();
//                            //  $("#copy").bind("change", setCheck);
//                            //  $("#move").bind("change", setCheck);
//                            //  $("#prev").bind("change", setCheck);
//                            //  $("#inner").bind("change", setCheck);
//                            //  $("#next").bind("change", setCheck);
//                         } catch (cer) {
//                             console.log(cer);
//                         }
//                     },
//                     error: function (msg) {
//                         alert("载入目录树错误！");
//                     }
//                 });//ajax的结尾
//             }
//         };
//     }
//     ,
//     //初始化模态框
//     clearTreeModel:function() {
//         var text1 = document.getElementById("text_tree_name");
//         var text2 = document.getElementById("text_tree_note");
//         text1.disabled = false;
//         text2.disabled = false;
//         $("#text_tree_name").val("");
//         $("#text_tree_note").val("");
//         var tip = "<label class=\"form-group\" id=\"labelTree_1\" style=\"margin:0px 0px 0px 15px\" class=\"col-sm-4 control-label\">*(必填)</label>";
//         document.getElementById("labelTree_1").innerHTML = tip;
//     }
// }