//# sourceURL=departmentTreeV.js
var that;
var dptTree = new Vue({
    el: '#dptTree',
    data: {
        flag: 'dept',
        deptNodes: {
            level0: [],
            level1: [],
            level2: [],
            level3: [],
            level4: []
        },
        isShowLocalNode:true,
        delBatchNodes: [],
        parentNodeCodes: {
            pCode0: '999999999',
            pCode1: '',
            pCode2: '',
            pCode3: ''
        },
        addCode: 0,
        delBatchNodes:[],
        pnode_code:'999999999',
        ifChangeNodeName_flag:0,
        openMode: '',
        checkedArr:[],
        ifChangeNodeName_flag:0,
    },
    mounted() {
        that = this;
        let data = {
            flag: that.flag,
            pnode_code: that.pnode_code

        }
        getDataByPost("/departmentTree/loadDepartmentChildren", data, function (res) {
            var temp = [];
            for (var i = 0; i < res.data.length; i++) {
                temp = res.data[i];
                that.deptNodes.level0.push(temp);
            }

        })
        that.dragNodelist(0,that.pnode_code);



    },
    methods: {
        //改变节点颜色，表示是否被选中
        changeNodeColor(currentNode,flag){
            if(flag=='fold'){
                if(that.openMode == 'onClick'){
                    $(currentNode).parents('.ele').css('background','#f4f4f4');
                }
                if(that.opneMode == 'dlbClick'){
                    $(currentNode).css('background','#f4f4f4');
                }
            }
            if(flag=='unfold'){
                if(that.openMode == 'onClick'){
                    $(currentNode).parents('.ele').css('background','white');
                }
                if(that.openMode == 'dblClick'){
                    $(currentNode).css('background','white');
                }


            }
        },
        //改变节点左右打开的图标
        changeNodeIcon(currentNode,flag){
            //折叠
            if(flag=='fold'){
                $(currentNode).find('.unfold').removeClass('fa-angle-left');
                $(currentNode).find('.unfold').addClass('fa-angle-right');
            }
            //打开
            else if (flag=='unfold'){
                $(currentNode).find('.unfold').removeClass('fa-angle-right');
                $(currentNode).find('.unfold').addClass('fa-angle-left');
            }
        },
        foldSubNode(currentNode){
            var flag='fold';
            /*//currentNode指的是当前点击的节点
            var dptId = $(currentNode.currentTarget).attr("id").split("_")
            //dtpId将curentNode的Id划分为 button 0 020000000,按钮名，属于的级别和node_code
            var currentButtonID=dptId[1];*/
            let nodeLevel = that.getLevelByUlId(currentNode);
            //循环每一个ele,把除了他自己的所有兄弟节点以及所有子节点都改变符号
            $.each($(".ele"),function(index,element){
                if( that.getNodeCodeByLiId(currentNode) != element.id &&
                    parseInt(($(element).parents('.todo-list').attr("id")).toString().slice(-1)) >= parseInt(nodeLevel)){
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
                if(Number(element.id.substr(-1)) > Number(nodeLevel)){
                    $(element).css('display', 'none');
                }
            });

            //循环次数count
            let count = 0;
            for(let key in that.deptNodes){
                    if(Number(nodeLevel) < count){
                        that.deptNodes[key] = [];
                    }
                    count++;
            }

        },
        //打开节点
        unfoldSubNode(currentNode){
            //当前节点所在层级
            let nodeLevel = that.getLevelByUlId(currentNode);
            that.foldSubNode(currentNode);
            var flag='unfold';
            that.changeNodeColor(currentNode.currentTarget,flag);
            that.changeNodeIcon(currentNode.currentTarget,flag);
            $.each($(".dpt_div"),function (index,element){
                if(Number(element.id.substr(-1))===Number(nodeLevel)+1){
                    $(element).css('display', 'block');
                }
            });
        },
        //通过双击加载子节点
        loadChildNodesDblclick(currentNode){
            let pCode = $(currentNode.currentTarget).attr("id");
            let childrenLevel = parseInt(that.getLevelByUlId(currentNode))+1;
            that.openMode = 'dblClick';
            that.judegeTreeState(currentNode,pCode,childrenLevel);
        },

        //通过点击">"按钮加载子节点
        loadChildNodesOnclick(currentNode){
            //通过点击按钮的id获取节点code，作为pCode
            let pCode = that.getNodeCodeByLiId(currentNode);
            //通过点击按钮的id获取节点code，作为pCode
            let childrenLevel = parseInt(that.getLevelByUlId(currentNode))+1;
            that.openMode = 'onClick';
            that.judegeTreeState(currentNode,pCode,childrenLevel);
        },

        //判断此时树的状态（展开/隐藏）
        judegeTreeState(currentNode,pCode,childrenLevel){
            if($(currentNode.currentTarget).find("i").filter(".unfold").hasClass('fa-angle-right')){
                that.unfoldSubNode(currentNode);
                that.getChildeNodes(pCode,childrenLevel);
            }else{
                that.foldSubNode(currentNode);
            }

        },
        //通过父节点code查找所有子节点
        getChildeNodes(pCode,childrenLevel){
            let data={
                flag: that.flag,
                pnode_code: pCode

            }
            getDataByPost("/departmentTree/loadDepartmentChildren", data , function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    let childObj = res.data[i];
                    let keys = Object.keys(that.deptNodes);
                    that.deptNodes[keys[childrenLevel]].push(childObj);
                }
            })
            //保存各级父节点Code
            let keys = Object.keys(that.parentNodeCodes);
            let nowKey = keys[childrenLevel-1];
            that.parentNodeCodes[nowKey] = pCode;
            that.dragNodelist(parseInt(childrenLevel),pCode);
        },

        //批量删除
        delBatch(currentNode){
            that.openMode == 'onClick';
            that.delBatchNodes = [];
            var delBtnId = currentNode.currentTarget.id.split("_");
            //所在层级
            var deptLevel = delBtnId[2];

            if(deptLevel != 0){
                let keys = Object.keys(that.parentNodeCodes);
                let nowKey = keys[Number(deptLevel)-1];
                //获取待删除节点的父节点
                that.pnode_code = that.parentNodeCodes[nowKey];
            }

            var boxNum = $(":checkbox:checked");
            $(":checkbox:checked").each(function () {
                var boxId = $(this).attr("id").slice(-1);
                if(boxId == deptLevel){
                    var nodeCode = $(this).parents("li").attr("id");
                    that.delBatchNodes.push(nodeCode);
                }
            })
            let data = {
                flag: that.flag,
                delBatchNodes:that.delBatchNodes,
                deptLevel:deptLevel,
                pnode_code:that.pnode_code
            }

            if(boxNum.length == 0){
                toastr.warning("请选择至少一个节点!")
                return false;
            }else{
                swal({
                    title: "您确定要删除选中节点吗",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#dd6b55",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                }, confirm=> {
                    getDataByPost('/departmentTree/delDepartmentNodes',data,res=>{

                        $(":checkbox:checked").each(function () {
                            //复选框id的最后一位，代表所在层级
                            var boxId = $(this).attr("id").slice(-1);
                            if(boxId == deptLevel){
                                //移除已删除节点的li标签
                                $(this).parents(".ele").remove();
                                let keys = Object.keys(that.deptNodes);
                                //将已删除节点的子部门置空
                                for(let i = parseInt(deptLevel)+1; i < 5; i++){
                                    that.deptNodes[keys[i]] = [];
                                }
                            }
                        })
                        toastr.success("删除成功！");
                    });
                });

            }
        },

        //单节点删除
        delNode(currentNode){
            let deptLevel = that.getLevelByUlId(currentNode);
            let nodeCode = that.getNodeCodeByLiId(currentNode);
            let delNode = currentNode.currentTarget;
            if(deptLevel != 0){
                let keys = Object.keys(that.parentNodeCodes);
                let nowKey = keys[Number(deptLevel)-1];
                //获取待删除节点的父节点
                that.pnode_code = that.parentNodeCodes[nowKey];
            }
            let data = {
                flag: that.flag,
                node_code:nodeCode,
                deptLevel:deptLevel,
                pnode_code:that.pnode_code
            }

            swal({
                title: "您确定要删除选中节点吗",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dd6b55",
                confirmButtonText: "确定",
                closeOnConfirm: true
            }, confirm=> {
                getDataByPost('/departmentTree/delDepartmentNode?',data,res=>{
                    $(delNode).parents(".ele").remove();
                    let keys = Object.keys(that.deptNodes);
                    for(let i = parseInt(deptLevel)+1; i < 5; i++){
                        that.deptNodes[keys[i]] = [];
                    }
                    toastr.success("删除成功！");
                });
            });

        },

        //显示模态框
        showAddModal(currentDpt){
            that.clearModel();
            if(parseInt(that.addCode) == 0){
                that.isShowLocalNode=false;
            }
            else{
                that.isShowLocalNode=true;
            }
            $("#addModal").modal("show");
        },
        //清空添加节点的模态框
        clearModel(){
            $("#add99").attr("checked",false);
            $("#addNodeName").attr("readonly",false);
            $("#addNodeName").disable = false;
            $("#addNodeCode").disable = false;

            $("#addNodeName").val("");
            $("#addNodeCode").val("");

        },

        //添加同级节点
        addEquativeNode(currentNode){
            //通过“+”按钮的id获取所在层级
            //例如第一层级“+”的id为 add_0,截取最后一位即为所在层级0
            let addId = currentNode.currentTarget.id;
            let levelArr = addId.split("_");
            that.addCode = levelArr[1];

            if(that.addCode != 0){
                let keys = Object.keys(that.parentNodeCodes);
                let nowKey = keys[Number(that.addCode)-1];
                //获取待添加节点的父节点
                that.pnode_code = that.parentNodeCodes[nowKey];
            }
            that.showAddModal();


        },

        //添加子节点
        addChildNode(currentNode) {
            //获取li标签的id，即
            that.pnode_code = that.getNodeCodeByLiId(currentNode);
            that.addCode = Number(that.getLevelByUlId(currentNode))+1;
            that.showAddModal();
            that.openMode = 'onClick';
            that.unfoldSubNode(currentNode);
            that.getChildeNodes(that.pnode_code,that.addCode);
        },

        //添加本级节点
        addLocalNode(){
            if($("#add99").prop("checked")){
                $("#addNodeName").val("本级");
                $("#addNodeName").attr("readonly",true);

            }else {
               that.clearModel();
            }
        },
        //将新增节点写入数据库
        increaseNode(){
            let node_name = $("#addNodeName").val();
            if(node_name.match(/^[ ]*$/)){
                toastr.error("请输入待添加节点名");
            }else if(parseInt(that.addCode)==0 && node_name == "本级" ){
                toastr.error("一级部门无法添加本级节点");
            }
            else {
                var data = {
                    pnode_code: that.pnode_code,
                    node_name: node_name,
                    level: that.addCode,
                    node_code: ''
                }
                getDataByPost('/departmentTree/insertDeptNode',data,function (res) {
                    if(res.code == 200){
                        if(res.data.status == "allow"){
                            let keys = Object.keys(that.deptNodes);
                            data.node_code = res.data.node_code;
                            that.deptNodes[keys[that.addCode]].splice(Number(res.data.list_order)-1,0,data);
                            toastr.success("插入成功！");
                        }else if(res.data.status == "refuse"){
                            toastr.error("有重复节点，插入失败！");
                        }else {
                            let isOk = confirm("其他部门存在同名节点，是否继续添加？");
                            if( !isOk ){
                                return false;
                            }
                            getDataByPost('/departmentTree/insertRepetitiveDeptNode',data,function (res) {
                                if(res.code == 200){
                                    let keys = Object.keys(that.deptNodes);
                                    $("#addNodeCode").val(res.data.node_code);
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
                console.log("data " ,data);
                $("#addModal").modal('hide');
            }
        },

        //根据所在ul的id，获取level（所在层级）
        getLevelByUlId(currentNode){
            let ulId = $(currentNode.currentTarget).parents(".todo-list").attr("id");
            return ulId.slice(-1);

        },

        //根据所在li的id，获取node_code
        getNodeCodeByLiId(currentNode){
            return $(currentNode.currentTarget).parents(".ele").attr("id");
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
                    let dragCode=evt.item.id;
                    console.log
                    let flag=0;
                    //代表是向后拖拽-1
                    if(dragNewIndex>dragOldIndex){
                        flag=-1;
                        //更新节点顺序
                        that.updateListOrder(dragNewIndex,dragOldIndex,dragCode,pnode_code,flag)
                    }
                    //向前拖拽
                    else if (dragNewIndex<dragOldIndex){
                        flag=1;
                        //更新节点顺序
                        that.updateListOrder(dragNewIndex,dragOldIndex,dragCode,pnode_code,flag)
                    }
                },
            }
            var sortable=Sortable.create(el,ops);
        },
        updateListOrder(new_order,old_order,node_code,pnode_code,flag){
            getDataByPost('/departmentTree/updateListOrder', {
                    new_order:new_order,
                    old_order:old_order,
                    node_code:node_code,
                    pnode_code:pnode_code,
                    flag:flag
                },
                res=>{
                    if(res.code==200)
                    {
                        toastr.success("更改节点顺序成功");
                    }
                    else{
                        toastr.success("更改节点顺序失败");
                    }
                }
            )

        },
        //功能：修改节点名称并且更新到数据库
        /*
        1.点击修改节点按钮
        2.出现一个弹窗，里面含有节点名称，和查询出来的节点code,节点code是灰色的不可修改的
        3.将修改好的名字和标准库比对，不允许出现和标准库相同的名称，如果出现了就提示标准库已经存在
        4.更新进后台数据库
        */

        //改变节点名称
        changeNodeName(currentNode){
            let nodeCode=$(currentNode.currentTarget).parents(".ele").attr("id");
            let nodeName = $(currentNode.currentTarget).parents(".ele").find("label").text().trim();
            //这里尽量不去查数据库,通过获取到的当前元素的名称和id确定模态框中的值
            $('#updateNodeNameModal').modal('show');
            //给模态框的节点名称和节点代码赋值
            //NodeName NodeCode
            $("#NodeName").val(nodeName);
            $("#NodeCode").val(nodeCode);
        },
        //判断是否更新文本框
        ifChangeNodeName($event){
            that.ifChangeNodeName_flag=1;
        },
        //更新到数据库并关闭模态框
        updateNodeNamebyNodeCode(){
            //判断，如果节点名称有更新，执行update语句
            if(that.ifChangeNodeName_flag==1){
                let nodeName=$("#NodeName").val();
                let nodeCode=$("#NodeCode").val();
                //如果节点存在在数据库中，提醒与模式库中的名字不同，是否还要修改？
                getDataByPost('/departmentTree/findNodeInSTbyNodeName?node_name='+nodeName.toString(),{},
                    res=>{
                        console.log(res.data);
                        if(res.data==false)
                        {
                            //向后端发送请求更新数据库
                            that.updateNodeNameInDb(nodeName,nodeCode);

                        }
                        else {
                            swal({
                                title: "该名称存在于标准库中，是否要修改为这个名字？",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确认修改",
                                closeOnConfirm: true
                            },confirm=>{
                                that.updateNodeNameInDb(nodeName,nodeCode)
                                }
                            )
                        }
                    })
            }
            $('#updateNodeNameModal').modal('hide');
        },
        //向后端发送请求更新数据库
        updateNodeNameInDb(nodeName,nodeCode){
            //去标准库中查不能更改成标准库的名称
            getDataByPost('/departmentTree/updateNameBynode_code?node_code='+nodeCode+'&node_name='+nodeName.toString(), {},
                res=>{
                    if(res.code==200)
                    {
                        toastr.success("节点名更新成功");
                    }
                    else{
                        toastr.error("节点名更新失败")
                    }
                })
            that.ifChangeNodeName_flag=0
        },

        //贯标设计
        //获取当前的所有一级(或者其他级)部门
        //拿到标准库里面当前级别的部门
        //两者进行比较
        //将当前没有的节点更新进数据库。
        //前端更新数据
        standardCompliment(){
            let pnode_code='999999999';
            getDataByPost('/departmentTree/standardCompliment?pnode_code='+pnode_code, {}, res=>{
                if(res.code==200&&res.data.length>0)
                {
                    swal({
                        title: "是否要补充所有一级节点",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    },confirm=>{
                        let nodes=res.data;
                        for(let i=0;i<res.data.length;i++){
                            let keys = Object.keys(that.deptNodes);
                            that.deptNodes[keys[that.addCode]].splice(Number(nodes[i].list_order)-1,0,nodes[i]);}
                        toastr.success("补充所有一级节点成功");
                    })
                }
                else if(res.code==200&&res.data.length==0){
                    toastr.error("没有待补充的一级节点");
                }
                else{
                    toastr.error("补充所有一级节点失败")
                }
            })
        }

    }
    })




