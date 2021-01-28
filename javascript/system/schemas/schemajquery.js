//向上传文件的编号框中传入默认id
$(document).ready(function(){
    var id=$("input[name='text1']").val();
    var dataStr="{\"schemaid\":\""+id+"\","+
                "}";
    SchemaManage.getID();
});
//传入文件名
$("input[name='xsdfile']").change(function(){
    var file=$("input[name='xsdfile']").val();
    var filename1=file.replace(/.*(\/|\\)/, "");
    var filename=filename1.replace(/.xsd/g, "");//获取文件名
    var fileExt=(/[.]/.exec(filename1)) ? /[^.]+$/.exec(filename1.toLowerCase()) : '';   //获取文件后缀
    if (fileExt!="xsd"){
        $("#help-block1").html("请上传有效schema文件").css({color:"red"});
    }
   else {
         $("input[name='text2']").val(filename);
         SchemaManage.getFile(filename, fileExt);
         $("input[name='text2']").val(filename);
   }
});
//验证ID是否为空或是否可用
$("input[name='text1']").blur(function(){
    var id=$("input[name='text1']").val();
    console.log(id);
    if(id==""){
        $("#help-block").html("id不能为空").css({color:"red"});
    }
    else {
          SchemaManage.checkID(id);//判断id是否可用
    }
});
var flag1=0,flag2=0,flag3=0;//标记信息是否修改
$("input[id='typeahead_example_modal_2']").change(function(){
    flag1=1;
});
$("input[id='typeahead_example_modal_3']").change(function(){
    flag2=1;
});

//编辑信息
function alt() {
    if(flag1==1||flag2==1||flag3==1){//信息已修改
        var table=document.getElementById("example1");
        var ischeck=document.getElementsByName("isChecked");
         for(i=0;i<ischeck.length;i++) {
             if (ischeck[i].checked == true) {
                 var node = ischeck[i].parentNode.nextSibling;
                 var id = node.innerHTML;
             }
         }
        var dataStr="{\"schemaid\":\""+id+"\","+
            "\"flag\":\""+flag3+"\","+
            "}";
        var data={"dataJson":dataStr,};
        var options1={
        type: 'POST',
        url: '/SchemaManager/alterSchema',
        data:data,
        dataType:"JSON",
        resetForm: true,// 提交后重置表单
        async: true,
        //提交前处理
        beforeSubmit: function () {
            var help3 = $("#help-block3").html();
            if (help3 == "请上传有效schema文件") {
                alert("请传入有效的schema文件");
                return false;
            }
            return true;
        },
        success: function () {
            alert("修改成功");
            $(function () {
                $('#editModal').modal('hide');
                $('#editModal').on('hidden.bs.modal', function () {
                    SchemaManage.load();
                })
            });
        }
        // var table=document.getElementById("example1");
        // var ischeck=document.getElementsByName("isChecked");
        // if(flag1==1||flag2==1||flag3==1){//信息已修改
        //     for(i=0;i<ischeck.length;i++){
        //         if(ischeck[i].checked==true){
        //             var node= ischeck[i].parentNode.nextSibling;
        //             var row=node.parentNode.rowIndex;
        //             var x=table.rows[row].cells;
        //             var id=node.innerHTML;
        //             var xsdname=x[5].innerHTML;
        //             var help3=$("#help-block3").html();
        //             var chname=document.getElementById("typeahead_example_modal_2").value;
        //             var note=document.getElementById("typeahead_example_modal_3").value;
        //             if(help3=="请上传有效schema文件"){
        //                 alert("请传入有效的schema文件");
        //             }
        //             else {
        //                 altQuery(id, chname, note);
        //                 alert("修改成功");
        //                 $(function () {
        //                     $('#editModal').modal('hide');
        //                     $('#editModal').on('hidden.bs.modal', function () {
        //                         SchemaManage.load();
        //                     })
        //                 });
        //             }
        //         }
        //     }
        // }
        // else{
        //     alert("您还未任何信息进行修改");
        // }

    }
    $('#fileUp').ajaxSubmit(options1);
    return false;//阻止表单自动提交事件
    }
    else{
        alert("您还未任何信息进行修改");
    }
}

function  altQuery(id,chname,note){
    var dataStr="{\"schemaid\":\""+id+"\","+
                "\"chname\":\""+chname+"\","+
                "\"note\":\""+note+"\","+
                "}";
    var data={"dataJson":dataStr,};
    $.ajax({
        url:'/SchemaManager/alter',
        data:data,
        dataType:"JSON",
        async:false,
        type:"GET",
        success:function(){
            alert("修改成功");
        }
    });
}
//更改文件传入文件名
$("input[name='xsdfile1']").change(function(){
    var file=$("input[name='xsdfile1']").val();
    var filename1=file.replace(/.*(\/|\\)/, "");
    var filename=filename1.replace(/.xsd/g, "");//获取文件名
    var fileExt=(/[.]/.exec(filename1)) ? /[^.]+$/.exec(filename1.toLowerCase()) : '';   //获取文件后缀
    if (fileExt!="xsd"){
        $("#help-block3").html("请上传有效schema文件").css({color:"red"});
        flag3=1;
    }
    else {
        $("#help-block3").html("可以上传").css({color:"black"});
        flag3=1;
        // $("input[name='text2']").val(filename);
        // SchemaManage.getFile(filename, fileExt);
        // $("input[name='text2']").val(filename);
    }
});

