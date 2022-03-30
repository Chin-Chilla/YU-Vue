//# sourceURL=departmentTree.js
var that;
var dptTree = new Vue({
    el: '#dptTree',
    data: {
        msgJson0: [],
        msgJson1: [],
        msgJson2: [],
        checkedArr:[]
    },
    mounted() {
        that = this;
        that.draggable(0);


        getDataByPost('/departmentTree/loadDepartmentTree?pnode_code=00000000', {}, function (res) {
            var temp = [];
            for (var i = 0; i < res.data.length; i++) {
                temp = res.data[i];
                that.msgJson0.push(temp);
            }

        })


    },
    methods: {
        closeSubNode(currentNode){
            var dptId = $(currentNode.currentTarget).attr("id").split("_")
            var currentButtonID=dptId[1];
            console.log("dptID " + dptId);
            console.log("111current " + currentButtonID);
            console.log("node "+ currentNode.currentTarget.id);
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
                console.log("currentButtonID " + currentButtonID);
                if(Number(element.id.substr(-1))>Number(currentButtonID)){
                    $(element).css('display', 'none');

                }

            });
            if(Number(currentButtonID)==0){
                that.msgJson1=[];
                that.msgJson2=[];
            }else if(Number(currentButtonID)==1){
                that.msgJson2=[];
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
        loadChildNode(currentNode){
            var btnID = $(currentNode.currentTarget).attr("id");
            var tempCode = btnID.split("_");
            var pCode = tempCode[2];
            var ulContainer = parseInt(tempCode[1])+1;

            getDataByPost("/departmentTree/loadDepartmentTree?pnode_code="+pCode, {}, function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    temp = res.data[i];
                    if (ulContainer == 1) {
                        dptTree.msgJson1.push(temp);
                    }else if(ulContainer ==2 ){
                        dptTree.msgJson2.push(temp);
                    }
                }

            })
            that.draggable(parseInt(ulContainer));
            if($(currentNode.currentTarget).children('i').hasClass('fa-angle-left')){
                that.openSubNode(currentNode);

            }else{
                that.closeSubNode(currentNode);
            }
        },
        delBatches(currentNode){
            var delBtnId = currentNode.currentTarget.id.split("_");
            var delBtnNum = delBtnId[2];
            var boxNum = $(":checkbox:checked");
            if(boxNum.length == 0){
                toastr.warning("请选择至少一个节点!")

                return
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
                    getDataByPost('/departmentTree/delDepartmentNode?checkedArr='+ that.checkedArr, {},function (res) {
                        alert("删除成功！");


                    })

                })
            }


        },
        draggable(containerId){
    // $('').sortable();
    var old_index="";
    var new_index="";
    var el= $('.ui-sortable').get(containerId);
            console.log("containerId "  + containerId);
            console.log("------ " + el.id);
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
            console.log(itemEl.getAttribute("id"));// dragged HTMLElement
            target.to;    // target list
            target.from;  // previous list
        },
        onUpdate: function(evt) {
            new_index=sortable.toArray();
            console.log("old_index:"+JSON.stringify(old_index));
            console.log("new_index:"+JSON.stringify(new_index));
            let old_index_str=JSON.stringify(old_index);
            let new_index_str=JSON.stringify(new_index);
            let length=JSON.stringify(new_index).length
            for(let i=0;i<length;i++){
                if(old_index_str[i]!=new_index_str[i])
                {
                    console.log(old_index_str[i]+"顺序变为"+new_index_str[i]);
                }
            }
        },
    }
    var sortable=Sortable.create(el,ops);

}

    }
})


