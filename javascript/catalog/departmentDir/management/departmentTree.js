//# sourceURL=departmentTree.js
/***
 * @author: 茆元慧
 * @Description: “部门对象目录管理”菜单栏
 * @date: 2021/3/21
 ***/
var arrs=new Array();
var arr1={
    //循环名
    data:['水利部','松辽水利委员会','西藏水利委员会'],
    //节点属于第几个展开的项
    code:0,
    id:['1000','1006','1054']
};
var arr2={
    //循环名
    data:['财务处','办公室','河湖建设处'],
    //节点属于第几个展开的项
    code:1,
    id:['caiwu','bangong','hehu']
};

var arr3={
    //循环名
    data:['综合科','预算管理科','收费管理科'],
    //节点属于第几个展开的项
    code:2,
    id:['zonghe','yusuan','shoufei']
};
arrs.push(arr1);
arrs.push(arr2);
arrs.push(arr3);
//-----------------------------------------
var str='';
for(var j=0;j<arrs.length;j++){
    var str=new Array(arrs.length);
    str[j]='';
    arr=arrs[j]
    for(var i=0;i<arr.data.length;i++){
        str[j]+='  <li class="ele li_'+arr.code+'" id='+arr.id[i]+'_'+arr.code+' draggable="true">\n'
            +'<div class="icheck-primary d-inline">\n'
            +'<input type="checkbox" id="checkboxPrimary1">\n'
            +'<label for="checkboxPrimary1">\n'+arr.data[i]
            +'</label>\n'
            +'<div class="tools">\n'
            +'<button id="button_'+arr.code+'" type="button" class="btn btn-tool dpt_unfold_btn" data-card-widget="collapse"><i class="fa fa-angle-left unfold"></i>\n'
            +'</button>\n'
            +'</div>'
            +'</div>\n'
            +'</li>'
    }
    document.getElementById('container'+j).innerHTML=(str[j])
}

//将除了第一列的元素都变为空
$.each($('.dpt_div'),(index,element) => {
    if(element.id.substr(-1)!=0){
        $(element).css('display', 'none')
    }
})


//点击展开
$(function(){
    $(".dpt_unfold_btn").click(
    function(){
        $(this).attr("id").substr(-1);
        if ($(this).children('i').filter(".unfold").hasClass('fa-angle-left')) {
            openSubNode(this);
        } else {
             closeSubNode(this);
        }
    }
)
    function openSubNode(currentNode){
        currentButtonID=$(currentNode).attr("id").substr(-1);
        closeSubNode(currentNode);
        $(currentNode).parents('.ele').css('background','white')
        $(currentNode).children('i').filter(".unfold").removeClass('fa-angle-left')
        $(currentNode).children('i').filter(".unfold").addClass('fa-angle-right')
        $.each($(".dpt_div"),function (index,element){

            if(Number(element.id.substr(-1))===Number(currentButtonID)+1){
                $(element).css('display', 'block')
            }
        });
    }
    function closeSubNode(currentNode){
        currentButtonID=$(currentNode).attr("id").substr(-1);
        //循环每一个ele,如果当前的ele不等于当前currentNode的父亲ele，且ele不是当前的currentNode的子节点就把颜色变了
        $.each($(".ele"),function(index,element){
            if($(currentNode).parents('.ele').attr("id")!=element.id &&Number(element.id.substr(-1)>=Number(currentButtonID))){
                $(element).css('background','#f4f4f4');
                //排查一下有没有同级节点或者子节点存在没关闭的情况，给这个关了
                if($(element).find('i').filter(".unfold").hasClass('fa-angle-right')){
                    $(element).find('i').filter(".unfold").removeClass('fa-angle-right')
                    $(element).find('i').filter(".unfold").addClass('fa-angle-left')
                }
            }

        });
        $(currentNode).parents('.ele').css('background','#f4f4f4')
        $(currentNode).children('i').filter(".unfold").removeClass('fa-angle-right')
        $(currentNode).children('i').filter(".unfold").addClass('fa-angle-left')
        //这里是对是否显示子节点的处理
        $.each($(".dpt_div"),function (index,element){
            if(Number(element.id.substr(-1))>Number(currentButtonID)){
                $(element).css('display', 'none')
            }
        });
    }


})
//拖拽功能
$.each($('.dpt_div'), (index, element) => {
    const node = element
    let draging = null
    // 使用事件委托，将li的事件委托给ul
    //第一个参数是事件的类型，第二个参数是事件触发后调用的函数
    //dragstart，在dragstart上按下鼠标开始移动时触发一次
    node.addEventListener('dragstart', event => {
        // firefox设置了setData后元素才能拖动！！！！
        //数据传输对象dataTransfer，主要是用于在源对象和目标对象之间传递数据
        event.dataTransfer.setData('te', event.target.textContent) // 不能使用text，firefox会打开新tab
        //target指的是触发事件的对象
        draging = event.target
    })
//dragover拖动时在某元素上一定，event.target是目标元素，移动1px触发一次
    node.addEventListener('dragover', event => {
        //防止浏览器默认事件
        event.preventDefault()
        const { target } = event
        // 因为dragover会发生在ul上，所以要判断是不是li，并且不能是被拖拽的元素
        if (target.nodeName === 'LI' && target !== draging) {
            // _index是实现的获取index
            if (_index(draging) < _index(target)) {
                //target.nextSibling返回目标节点后面紧跟的节点
                //insertBefore()方法在您指定的已有子节点之前插入新的子节点，第一个参数表示需要插入的节点对象，第二个参数表示在要添加新的节点前的子节点
                target.parentNode.insertBefore(draging, target.nextSibling)
            } else {
                //他的父节点是Li,本身是li里面的内容
                target.parentNode.insertBefore(draging, target)
            }
        }
    })
})

function _index(el) {
    let index = 0
    //如果当前对象为空以及对象的父节点为空
    if (!el || !el.parentNode) {
        return -1
    }
//当当前对象有值，以及当前元素等于之前元素的兄弟元素，index就加1，一直到没有前一个元素为止
    while (el && (el = el.previousElementSibling)) {
        index++
    }

    return index
}
