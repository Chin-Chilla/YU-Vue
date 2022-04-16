//# sourceURL=departmentTreeV.js
var that;
var dptTree = new Vue({
    el: '#dptTree',
    data: {
        deptNodes: {
            level0: [],
            level1: [],
            level2: [],
            level3: [],
            level4: []
        },
        checkedArr: [],
        parentNodeCodes: {
            pCode0: '999999999',
            pCode1: '',
            pCode2: '',
            pCode3: ''
        },
        addCode: 0,
        array:{
            demo1:[
                {id:0,name:'haha'},
                {id:1,name:'xixi'}
            ],
            demo2:[]
        },



        checkedArr:[],
        pnode_code:[],
        ifChangeNodeName_flag:0
    },
    mounted() {
        that = this;
        var pCode = "999999999";
        getDataByPost("/departmentTree/loadDepartmentChildren?pnode_code="+pCode, {}, function (res) {
            var temp = [];
            for (var i = 0; i < res.data.length; i++) {
                temp = res.data[i];
                that.deptNodes.level0.push(temp);
            }

        })
        var pnode_code="999999999";
        that.dragNodelist(0,pnode_code);

    },
    methods: {
        changeNodeColor(currentNode,flag){
            if(flag=='fold'){
                $(currentNode).parents('.ele').css('background','#f4f4f4')
            }
            if(flag=='unfold'){
                $(currentNode).parents('.ele').css('background','white');
            }
        },
        changeNodeIcon(currentNode,flag){
            //折叠
            if(flag=='fold'){
                $(currentNode).find('i').removeClass('fa-angle-left');
                $(currentNode).find('i').addClass('fa-angle-right');
            }
            //打开
            else if (flag=='unfold'){
                $(currentNode).find('i').removeClass('fa-angle-right');
                $(currentNode).find('i').addClass('fa-angle-left');
            }
        },
        foldSubNode(currentNode){
            var flag='fold';
            //currentNode指的是当前点击的节点
            var dptId = $(currentNode.currentTarget).attr("id").split("_")
            //dtpId将curentNode的Id划分为 button 0 020000000,按钮名，属于的级别和node_code
            var currentButtonID=dptId[1];
            //循环每一个ele,把除了他自己的所有兄弟节点以及所有子节点都改变符号
            $.each($(".ele"),function(index,element){
                if($(currentNode.currentTarget).parents('.ele').attr("id") != element.id &&
                    parseInt(($(element).parents('.todo-list').attr("id")).toString().slice(-1)) >= parseInt(currentButtonID)){
                    $(element).css('background','#f4f4f4');
                    //排查一下有没有同级节点或者子节点存在没关闭的情况，给这个关了
                    if($(element).find('i').hasClass('fa-angle-left')){
                        that.changeNodeIcon(element,flag);
                    }
                }
            });
            //改变当前节点的颜色
            that.changeNodeColor(currentNode.currentTarget,flag)
            //改变本节点的左右符号
            that.changeNodeIcon(currentNode.currentTarget,'fold');
            //这里是对是否显示子节点的处理
            $.each($(".dpt_div"),function (index,element){
                if(Number(element.id.substr(-1)) > Number(currentButtonID)){
                    $(element).css('display', 'none');
                }
            });

            //循环次数count
            let count = 0;
            for(let key in that.deptNodes){
                    if(Number(currentButtonID) < count){
                        that.deptNodes[key] = [];
                    }
                    count++;
            }

        },
        //打开节点
        unfoldSubNode(currentNode){
            var dptId = $(currentNode.currentTarget).attr("id").split("_")
            var currentButtonID=dptId[1];
            that.foldSubNode(currentNode);
            var flag='unfold';
            that.changeNodeColor(currentNode.currentTarget,flag);
            that.changeNodeIcon(currentNode.currentTarget,flag);
            $.each($(".dpt_div"),function (index,element){
                if(Number(element.id.substr(-1))===Number(currentButtonID)+1){
                    $(element).css('display', 'block');
                }
            });
        },
        loadChildNode(currentNode){
            var btnID = $(currentNode.currentTarget).attr("id");
            var tempCode = btnID.split("_");
            var pCode = tempCode[2];
            var ulContainer = parseInt(tempCode[1])+1;

        },
        //判断此时树的状态（展开/隐藏）
        judegeTreeState(currentNode){
            if($(currentNode.currentTarget).children('i').hasClass('fa-angle-right')){
                that.unfoldSubNode(currentNode);
                that.getChildeNodes(currentNode);
            }else{
                that.foldSubNode(currentNode);
            }

        },
        //通过父节点code查找所有子节点
        getChildeNodes(currentNode){
            //通过点击按钮的id获取节点code，作为pCode
            var btnID = $(currentNode.currentTarget).attr("id");
            var btnIDArr = btnID.split("_");
            var pCode = btnIDArr[btnIDArr.length-1];
            console.log("pcode======= " + pCode);

            //获取ul的id编号
            var ulContainer = parseInt(btnIDArr[1])+1;

            getDataByPost("/departmentTree/loadDepartmentChildren?pnode_code="+pCode, {}, function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    let childObj = res.data[i];
                    let count = 0;
                    for(let key in that.deptNodes){
                        if(count == ulContainer){
                            that.deptNodes[key].push(childObj);
                            break;
                        }
                        count++;
                    }
                }
            })

            //保存各级父节点Code
            let keys = Object.keys(that.parentNodeCodes);
            let nowKey = keys[ulContainer-1];
            that.parentNodeCodes[nowKey] = pCode;
            console.log("ulContainer " + ulContainer);
            console.log("parentNodeCodes ",that.parentNodeCodes);

            that.dragNodelist(parseInt(ulContainer));
        },
        //批量删除
        delBatch(currentNode){
            that.checkedArr = [];
            var delBtnId = currentNode.currentTarget.id.split("_");
            var delBtnNum = delBtnId[2];
            var boxNum = $(":checkbox:checked");
            if(boxNum.length == 0){
                toastr.warning("请选择至少一个节点!")
                return false;
            }else{
                var res = confirm("确定删除该节点吗？")
                if (!res) {
                    return false;
                }
                $(":checkbox:checked").each(function () {
                    var boxId = $(this).attr("id").slice(-1);
                    if(boxId == delBtnNum){
                        var temp = $(this).parents("li").attr("id").split("_");
                        var nodeCode = temp[1];
                        that.checkedArr.push(nodeCode);
                    }
                })
                getDataByGet('/departmentTree/delDepartmentNodes?checkedArr='+ that.checkedArr, {},function (res) {

                    $(":checkbox:checked").each(function () {
                        var boxId = $(this).attr("id").slice(-1);
                        if(boxId == delBtnNum){
                            $(this).parents("li").remove();
                        }
                    })
                    toastr.success("删除成功！");


                })
            }


        },
        //单节点删除
        delNode(currentNode){

            let delNode = currentNode.currentTarget;
            let btnID = $(currentNode.currentTarget).attr("id");
            let tempCode = btnID.split("_");
            let nodeCode = tempCode[tempCode.length-1];
            let res = confirm("确定删除该节点吗？")
            if (!res) {
                return false;
            }
            getDataByGet('/departmentTree/delDepartmentNode?nodeCode=' + nodeCode, {} ,function (res) {
                $(delNode).parents("li").remove();
                toastr.success("删除成功！");
            })
        },
        //点击”+“按钮，显示模态框
        showAddModal(currentDpt){
            let addId = currentDpt.currentTarget.id;
            let tempCode = addId.split("_");
            that.addCode = tempCode[1];
            that.clearModel();
            $("#addModal").modal("show");
        },
        //清空添加节点的模态框
        clearModel(){
            $("#addNodeName").disable = false;
            $("#addNodeCode").disable = false;

            $("#addNodeName").val("");
            $("#addNodeCode").val("");

        },
        //添加新节点/本级节点
        increaseNode(){
            let node_name = $("#addNodeName").val();
            let pnode_code = '999999999';

            if(that.addCode != 0){
                console.log("jinijinin")
                let keys = Object.keys(that.parentNodeCodes);
                let nowKey = keys[Number(that.addCode)-1];
                // //获取待添加节点的父节点
                pnode_code = that.parentNodeCodes[nowKey];
            }
            var data = {
                pnode_code: pnode_code,
                node_name: node_name,
                level: that.addCode,
                node_code: ''
            }
            // console.log("data is " , data);
            getDataByPost('/departmentTree/insertDeptNode',data,function (res) {
                console.log("res.data +" ,res.data);
               if(res.code == 200){
                   if(res.data.status == "allow"){
                       let keys = Object.keys(that.deptNodes);
                       data.node_code = res.data.node_code;
                       that.deptNodes[keys[that.addCode]].splice(Number(res.data.list_order)-1,0,data);
                       toastr.success("插入成功！");
                   }else if(res.data.status == "refuse"){
                       toastr.error("插入失败！");
                   }else {
                       let isOk = confirm("其他部门存在同名节点，是否继续添加？");
                       if( !isOk ){
                           return false;
                       }
                       console.log("data is ",data)
                       getDataByPost('/departmentTree/insertRepetitiveDeptNode',data,function (res) {
                           if(res.code == 200){
                               let keys = Object.keys(that.deptNodes);
                               data.node_code = res.data.node_code;
                               that.deptNodes[keys[that.addCode]].splice(Number(res.data.list_order)-1,0,data);
                               toastr.success("插入成功！");
                           }else{
                               toastr.error("插入失败,请联系管理员！");
                           }

                       })

                   }
                }else{
                    toastr.error("添加失败，请联系管理员！");
                }
            })
            $("#addModal").modal('hide');

        },
        //单列拖拽节点，更改节点顺序
        dragNodelist(containerId,pnode_code){
            var el= $('.ui-sortable').get(containerId);
            var ops={
                group:"drag_example",
                sort:true,
                delay:0,
                animation:150,
                chosenClass: "sortable-chosen",
                dragClass: "sortable-drag",
                dataIdAttr: "data_order",
                //设置拖拽的数据是每个Li的id
                setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
                    dataTransfer.setData('Text', dragEl.textContent); // ' dataTransfer '对象的HTML5 DragEvent
                },
                onEnd: function(evt) {
                    //向后拖拽new>old，一切index小于拖拽后new_Index的减一，拖拽的li根据id更换index
                    //向前拖拽new<old，一切Index大于拖拽后new_Index的加一，拖拽的li根据Id更换Index
                    let dragNewIndex=evt.newIndex+1;
                    let dragOldIndex=evt.oldIndex+1;
                    let arr=evt.item.id.split("_");
                    let dragCode=arr[1];
                    let flag=0;
                    //代表是向后拖拽-1
                    console.log(pnode_code);
                    if(dragNewIndex>dragOldIndex){
                        flag=-1;
                        //在oldIndex和newIndex之间的数据顺序-1或者+1
                        getDataByPost('/departmentTree/updateOrderBylist_order?flag='+ flag+'&pnode_code='+pnode_code+'&new_order='+dragNewIndex+'&old_order='+dragOldIndex, {},res1=>{
                            //oldindex更换顺序
                            getDataByPost('/departmentTree/updateOrderbynode_code?node_code='+ dragCode+'&pnode_code='+pnode_code+'&new_order='+dragNewIndex, {},
                                res2=>{
                                toastr.success("更改节点顺序成功");},
                                err=>{
                                toastr.error("更改节点顺序出错");}
                            )},
                           err=>{
                            toastr.error("更改节点顺序出错");
                           })
                    }
                    else if (dragNewIndex<dragOldIndex){
                        flag=1;
                        //在oldIndex和newIndex之间的数据顺序+1
                        getDataByPost('/departmentTree/updateOrderBylist_order?flag='+ flag+'&pnode_code='+pnode_code+'&new_order='+parseInt(dragNewIndex-1)+'&old_order='+parseInt(dragOldIndex-1), {},res1=> {
                                //oldindex更换顺序
                                getDataByPost('/departmentTree/updateOrderbynode_code?node_code='+ dragCode+'&pnode_code='+pnode_code+'&new_order='+dragNewIndex, {},
                                    res2=>{
                                        toastr.success("更改节点顺序成功");},
                                    err=>{
                                    toastr.error("更改节点顺序出错");}
                                )},
                            err=>{
                                toastr.error("更改节点顺序出错");
                            })
                    }
                },
            }
            var sortable=Sortable.create(el,ops);
        },
        //修改节点名称并且更新到数据库
        //1.出现一个弹窗，里面含有节点名称，和查询出来的节点code,节点code是灰色的
        //2.将修改好的名字和标准库比对，不允许出现和标准库相同的名称，如果出现了就提示换个名字
        //3.用正则判断输入的是中文字符
        //4.更新进数据库
        //5.如果更新失败，提示更新失败

        //改变节点名称
        changeNodeName(currentNode){
            //当前eleID举例：990000000，可以按_分成前后两部分，前面是Id,后面是code
            let nodeCode=$(currentNode.currentTarget).parents(".ele").attr("id");
            let nodeName = $(currentNode.currentTarget).parents(".ele").find("label").text().trim();
            //根据名字查询该节点是否存在在标准库中，不存在就可以修改名字
            getDataByPost('/departmentTree/findNodeInSTbyNodeName?node_name='+nodeName.toString(),{},
                res=>{
                    console.log(res.data);
                    if(res.data==false)
                    {
                        //这里尽量不去查数据库,通过获取到的当前元素的名称和id确定模态框中的值
                        $('#updateNodeNameModal').modal('show');
                        //给模态框的节点名称和节点代码赋值
                        //NodeName NodeCode
                        $("#NodeName").val(nodeName);
                        $("#NodeCode").val(nodeCode);
                        //根据nodecode查询数据库
                    }
                    else {
                        toastr.error("不允许更改标准库中数据的名称");
                    }
                },
                err=>{
                    toastr.error(res.msg);
                })

        },
        //判断是否更新文本框
        ifChangeNodeName($event){
            that.ifChangeNodeName_flag=1;
        },
        //更新到数据库并关闭模态框
        updateNodeNamebyNodeCode(){
            //点击更新的时候获得了当前文本框中的值，一并传给后端
            //判断，如果节点名称有更新，执行update语句
            if(that.ifChangeNodeName_flag==1){
                let nodeName=$("#NodeName").val();
                let nodeCode=$("#NodeCode").val();
                //去标准库中查不能更改成标准库的名称
                getDataByPost('/departmentTree/updateNameBynode_code?node_code='+nodeCode+'&node_name='+nodeName.toString(), {},
                        res=>{
                            if(res.code==200)
                            {
                                toastr.success("节点名更新成功");
                            }
                            else{
                                toastr.errot(res.msg)
                            }
                        },
                        err=>{
                        toastr.error("查询更新节点出错");
                })
                that.ifChangeNodeName_flag=0
            }


            $('#updateNodeNameModal').modal('hide');
        }
    }
})


