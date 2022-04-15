//# sourceURL=departmentTree.js
var that;
var dptTree = new Vue({
    el: '#dptTree',
    data: {
        msgJson0: [],
        msgJson1: [],
        msgJson2: [],

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
        }



    },
    mounted() {
        that = this;
        that.draggable(0);
        var pCode = "999999999";
        getDataByPost("/departmentTree/loadDepartmentChildren?pnode_code="+pCode, {}, function (res) {
            var temp = [];
            for (var i = 0; i < res.data.length; i++) {
                temp = res.data[i];
                that.deptNodes.level0.push(temp);
            }

        })


    },
    methods: {

        closeSubNode(currentNode){
            var dptId = $(currentNode.currentTarget).attr("id").split("_")
            var currentButtonID=dptId[1];
            //循环每一个ele,如果当前的ele不等于当前currentNode的父亲ele，且ele不是当前的currentNode的子节点就把颜色变了
            $.each($(".ele"),function(index,element){
                if($(currentNode.currentTarget).parents('.ele').attr("id")!=element.id &&Number(element.id.substr(-1)>=Number(currentButtonID))){
                    $(element).css('background','#f4f4f4');
                    //排查一下有没有同级节点或者子节点存在没关闭的情况，给这个关了
                    if($(element).find('i').filter(".unfold").hasClass('fa-angle-right')){
                        $(element).find('i').filter(".unfold").removeClass('fa-angle-right');
                        $(element).find('i').filter(".unfold").addClass('fa-angle-left');
                    }
                }

            });
            $(currentNode.currentTarget).parents('.ele').css('background','#f4f4f4')
            $(currentNode.currentTarget).children('i').filter(".unfold").removeClass('fa-angle-right')
            $(currentNode.currentTarget).children('i').filter(".unfold").addClass('fa-angle-left')
            //这里是对是否显示子节点的处理
            $.each($(".dpt_div"),function (index,element){
                /*console.log("currentButtonID " + currentButtonID);*/
                if(Number(element.id.substr(-1))>Number(currentButtonID)){
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
        openSubNode(currentNode){
            var dptId = $(currentNode.currentTarget).attr("id").split("_")
            var currentButtonID=dptId[1];
            that.closeSubNode(currentNode);
            $(currentNode.currentTarget).parents('.ele').css('background','white')
            $(currentNode.currentTarget).children('i').filter(".unfold").removeClass('fa-angle-left')
            $(currentNode.currentTarget).children('i').filter(".unfold").addClass('fa-angle-right')
            $.each($(".dpt_div"),function (index,element){

                if(Number(element.id.substr(-1))===Number(currentButtonID)+1){
                    $(element).css('display', 'block');
                }
            });

        },
        //判断此时树的状态（展开/隐藏）
        judegeTreeState(currentNode){
            if($(currentNode.currentTarget).children('i').hasClass('fa-angle-left')){
                that.openSubNode(currentNode);
                that.getChildeNodes(currentNode);
            }else{
                that.closeSubNode(currentNode);
            }

        },
        //通过父节点id查找所有子节点
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

            that.draggable(parseInt(ulContainer));
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
        draggable(containerId){
    // $('').sortable();
    var old_index="";
    var new_index="";
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
        onStart:function(evt){
            old_index=sortable.toArray();
        },
        onEnd:function (target) {
            var itemEl = target.item;
            /*console.log(itemEl.getAttribute("id"));*/// dragged HTMLElement
            target.to;    // target list
            target.from;  // previous list
        },
        onUpdate: function(evt) {
            new_index=sortable.toArray();
            /*console.log("old_index:"+JSON.stringify(old_index));
            console.log("new_index:"+JSON.stringify(new_index));*/
            let old_index_str=JSON.stringify(old_index);
            let new_index_str=JSON.stringify(new_index);
            let length=JSON.stringify(new_index).length
            /*for(let i=0;i<length;i++){
                if(old_index_str[i]!=new_index_str[i])
                {
                    console.log(old_index_str[i]+"顺序变为"+new_index_str[i]);
                }
            }*/
        },
    }
    var sortable=Sortable.create(el,ops);

}

    }
})


