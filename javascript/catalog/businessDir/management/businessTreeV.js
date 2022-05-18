var that;
var resourceTree = new Vue({
    el: '#resTree',
    data:{
        flag: 'resource',
        dbTable: 'RC_RESDIR_NEW',
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
        openMode: ''

    },
    mounted(){
        that = this;
        that.loadZtree();
    },
    methods:{

        //根据所在ul的id，获取level（所在层级）
        getLevelByUlId(currentNode){
            let ulId = $(currentNode.currentTarget).parents(".todo-list").attr("id");
            return ulId.slice(-1);

        },

        //根据所在li的id，获取node_code
        getNodeCodeByLiId(currentNode){
            return $(currentNode.currentTarget).parents(".ele").attr("id");
        },
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
            $.each($(".res_div"),function (index,element){
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
            $.each($(".res_div"),function (index,element){
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

        unfoldFirst(nodeId,nodeLevel){
            $("#block0").css('display','block');
            let count = 0;
            for(let key in that.deptNodes){
                if(Number(nodeLevel) <= count){
                    that.deptNodes[key] = [];
                }
                count++;
            }


        },
        foldFirst(nodeId){
            $.each($(".res_div"),function (index,element){
                $(element).css('display', 'none');
            });
        },
        unfoldDeptColor(nodeId){
            $.each($(".open"),function(index,element){
                $(this).parents('a').css("background","#E0E0E0");
            });

            $("#"+nodeId).parents('a').css("background","white");
        },
        foldDeptColor(nodeId){
            $("#"+nodeId).parents('a').css("background","#E0E0E0");


        },
        getChildeNodes(pCode,childrenLevel){
            let data = {
                dbTable: that.dbTable,
                pnode_code: pCode
            }
            getDataByPost("/departmentTree/loadDepartmentChildren", data , function (res) {
                console.log(res.data);
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
        loadZtree(){
            var setting = {
                view: {
                    showLine: false,
                    showIcon: false,
                    selectedMulti: false,
                    dblClickExpand: false,
                    addDiyDom: addDiyDom
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "node_code",
                        pIdKey: "pnode_code",
                        rootPId: "999999999"
                    },
                    key:{
                        name: "node_name"
                    },
                },
                callback: {
                    onClick:function onClick(event,treeId,treeNode){
                        let pnode_code = treeNode.node_code;
                    },
                    beforeAsync:function beforeAsync(treeId,treeNode){
                        console.log(treeId);
                        console.log(treeNode);
                        return true;
                    }
                }
            };

            function addDiyDom(treeId, treeNode) {
                var spaceWidth = 5;
                var switchObj = $("#" + treeNode.tId + "_switch"),
                    icoObj = $("#" + treeNode.tId + "_ico");
                spanObj = $("#" + treeNode.tId + "_span");
                switchObj.remove();
                icoObj.before(switchObj);
                if (treeNode.level > 1) {
                    var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                    switchObj.before(spaceStr);

                }

                if(treeNode.level > 0){
                    var unfoldStr = "<button type='button' class='btn btn-box-tool close' id= '" + treeNode.node_code  + "' data-widget='collapse' style='float: right'>" +
                        "<i class=\"fa fa-arrow-circle-o-right\"></i>" +
                        "</button>"
                    spanObj.after(unfoldStr);
                }
                let btnUnfold = $("#" + treeNode.node_code);
                if(btnUnfold){
                    btnUnfold.bind("click",function () {

                        if($(this).hasClass('close')){
                            that.getChildeNodes(treeNode.node_code,0);
                            that.unfoldDeptColor(treeNode.node_code);
                            that.unfoldFirst(treeNode.node_code,0);
                            $.each($(".open"),function(index,element){
                                $(element).removeClass('open');
                                $(element).addClass('close');
                            })

                            $(this).removeClass('close');
                            $(this).addClass('open');

                        }else if($(this).hasClass('open')){
                            that.foldDeptColor(treeNode.node_code);
                            that.foldFirst(treeNode.node_code);
                            $(this).removeClass('open');
                            $(this).addClass('close');
                        }

                    })
                }

            }
            getDataByPost("/departmentTree/getAllNodes", {}, function (res) {
                console.log("res.data" , res.data)
                $.fn.zTree.init( $("#treeDemo"), setting, res.data);
            })

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
                    let indexFlag=0;
                    //代表是向后拖拽-1
                    if(dragNewIndex>dragOldIndex){
                        indexFlag=-1;
                        //更新节点顺序
                        that.updateListOrder(dragNewIndex,dragOldIndex,dragCode,pnode_code,indexFlag)
                    }
                    //向前拖拽
                    else if (dragNewIndex<dragOldIndex){
                        indexFlag=1;
                        //更新节点顺序
                        that.updateListOrder(dragNewIndex,dragOldIndex,dragCode,pnode_code,indexFlag)
                    }
                },
            }
            var sortable=Sortable.create(el,ops);
        },
        updateListOrder(new_order,old_order,node_code,pnode_code,indexFlag){
            getDataByPost('/departmentTree/updateListOrder', {
                    new_order:new_order,
                    old_order:old_order,
                    node_code:node_code,
                    pnode_code:pnode_code,
                    indexFlag:indexFlag,
                    dbTable:that.dbTable
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
                dbTable: that.dbTable,
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
                dbTable: that.dbTable,
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

        }

    }



})