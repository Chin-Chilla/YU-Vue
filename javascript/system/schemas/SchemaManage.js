/**
 * Created by Qyf on 2016/7/23.
 */
var flag1=0,flag2=0,flag3=0;//标记信息是否修改
$("input[id='typeahead_example_modal_2']").change(function(){
    flag1=1;
});
$("input[id='typeahead_example_modal_3']").change(function(){
    flag2=1;
});
//更改文件传入文件名(模态窗口：编辑 的选择文件按钮)
$("input[name='xsdfile1']").change(function(){//文件上传按钮
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
//上传文件传入文件名(模态窗口：增加  的选择文件按钮)
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
        SchemaManage.getFile(filename, fileExt); //判断文件是否存在
        $("input[name='text2']").val(filename);
    }
});
//验证ID是否为空或是否可用
$("input[name='text1']").blur(function(){
    var id=$("input[name='text1']").val();
    // console.log(id);
    if(id==""){
        $("#help-block").html("id不能为空").css({color:"red"});
    }
    else {
        SchemaManage.checkID(id);//判断id是否可用
    }
});
SchemaManage={
    data:[]
    ,testdata:[]
     //Schema管理首页框架重载（点击子菜单栏或返回按钮）
    ,load:function () {
        //判断资源目录树上是否有未保存的节点信息
        CatalogPage.pageLeave();
        $(".sidebar-menu li").removeClass("active"); //给未点击的子菜单移除active方法
        $(".sidebar-menu .schema").addClass("active");//给点击的子菜单加入active方法
        var data={};$("#pagination").empty();

        getStringData('/SchemaManager/schemaManage',data,function (msg) {
            $(".content-wrapper").html(msg);
        });
        SchemaManage.getProperty();
    }
    //获得Schema管理首页内容
    ,getProperty:function(){
                     var data={};
                     $.ajax({
                     		url:'/SchemaManager/getProperty',           //该路径在route中定义
                     		data:data,
                     		dataType:"JSON",
                     		async : true,
                     		type:"GET",
                     		success:function(msg){
                                SchemaManage.data=msg;
                                // console.log(SchemaManage.data);
                                $("#pagination").Paging({
                                    pagesize: 10,
                                    count: SchemaManage.data.length,
                                    toolbar: true,//工具条
                                    callback: function (page, size, count) {
                                        //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                                        SchemaManage.showpage(page,size,count);
                                    }
                                });
                                SchemaManage.showpage(1,10,SchemaManage.data.length);
                                 // for(var o in msg){
                     			 //    var date=new Date(msg[o].ul_time.time);
                                 //    var time1=date.Format("yyyy年MM月dd日 HH时mm分ss秒");
                                 //    $("#tbody").append("<tr><td><input type='checkbox' name='isChecked'/></td><td>"+msg[o].md_type+"</td><td>"+msg[o].ch_name+"</td><td>"+msg[o].uploader+"</td><td>"+time1+"</td><td>"+msg[o].sch_name+"</td><td>"+msg[o].note+"</td></tr>");
                                 // }
                     		}
                     		,error:function (msg) {
                                console.log("失败!");
                            }
                     });
         }
//从数据库和目录删除两种文件
   ,delQuery:function(id,name){
        var id,name;
        var dataStr="{\"schemaid\":\""+id+"\","+
                     "\"schemaname\":\""+name+"\","+
                      "}";
        var data={"dataJson":dataStr,};
        $.ajax({
            url:'/SchemaManager/delete',
            data:data,
            dataType:"JSON",
            async:false,
            type:"GET",
            success:function(msg){
                if(msg.state=="ok") {
                    alert("删除成功");
                }else if(msg.state=="false"){
                    alert("schema文件正在使用，无法删除");
                }
                else {
                    alert("删除失败");
                }
            },
            error:function (msg) {
                console.log(msg);
            }
        });
    }
    //删除
    ,del:function(){
        var id,name;
        var table=document.getElementById("example1");
        var ischeck=document.getElementsByName("isChecked");
        var flag=false;
        // console.log(ischeck);
        for(i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                flag=true;break;
            }
        }
        if(flag==true){
            if(confirm("您确定要删除吗？")==true){
                for(i=0;i<ischeck.length;i++){
                     if(ischeck[i].checked==true){
                          var node= ischeck[i].parentNode.nextSibling;
                          id=node.innerHTML;
                          name=node.nextSibling.innerHTML;
                          SchemaManage.delQuery(id,name);
                          table.deleteRow(i+1);
                          i=i-1;
                     }
                }
                //alert("删除成功");
                SchemaManage.load();
            }
            else{
                  SchemaManage.load();
            }
        }
        else{
             alert("请选择");
             SchemaManage.load();
        }
    }
    //判断文件是否存在
    , getFile:function(filename,fileExt){
        var dataStr="{\"filename\":\""+filename+"\","+
                    "\"fileExt\":\""+fileExt+"\","+
                    "}";
        var data={"dataJson":dataStr,};
        $.ajax({
            url:'/SchemaManager/validatefile',           //该路径在route中定义
            data:data,
            dataType:"JSON",
            async : true,
            type:"GET",                     //必须是get类型，POST类型不行
            success:function(msg){
                $("#help-block1").html("可以上传").css({color:"black"});
                $("input[name='text2']").val(msg.filename);
            },
            error:function(msg){
                $("#help-block1").html("文件已存在").css({color:"red"});
            }
        })
    }
    //判断id是否可用
    ,checkID:function(id){
        var dataStr="{\"schemaid\":\""+id+"\","+
                    "}";
        var data={"dataJson":dataStr,};
        $.ajax({
             url:'/SchemaManager/validateid',
             data:data,
             dataType:"JSON",
             async : true,
             type:"GET",
             success:function(msg){    //成功时执行函数
                 $("#help-block").html("id可以使用").css({color:"black"});
                 console.log(1);
             },
             error:function(msg){
                 console.log(2);

                 $("#help-block").html("id已存在").css({color:"red"});
             }
        })
    }
    //从后台获取默认最大id
    ,getID:function(){
        var id;
        var dataStr="{\"schemaid\":\""+id+"\","+
                    "}";
        var data={"dataJson":dataStr,};
        $.ajax({
            url:'/SchemaManager/defaultid',
            data:data,
            dataType:"JSON",
            async : true,
            type:"POST",
            success:function(msg){    //成功时执行函数
                // console.log(msg.schemaid);
                $("input[name='text1']").val(msg.schemaid);
            },
        })
        SchemaManage.getuploader();
    }
    //获得登陆名
    ,getuploader:function(){
        var data={};
        getStringData('/uploadername',data,function(msg){
            $("input[name='textloader']").val(msg);
        })
    //     $.ajax({
    //     url:'/routes/uploadername',
    //     data:data,
    //     dataType:"JSON",
    //     async : true,
    //     type:"GET",
    //     success:function(msg){    //成功时执行函数
    //         console.log("___msg.loginName:"+loginNames);
    //         $("input[name='textloader']").val(msg.loginNames);
    //     },
    // })
}
    //显示编辑信息
    ,show:function(){
        var table=document.getElementById("example1");
        console.log(table);
        var ischeck=document.getElementsByName("isChecked");
        var flag=false;//标记是否选中记录
        var n=0;//表示选中记录的数量
        for(i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                var node= ischeck[i].parentNode.nextSibling;
                // console.log("node："+ischeck[0].parentNode.nextSibling);
                flag=true;break;
            }
        }
        for(i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                var node= ischeck[i].parentNode.nextSibling;
                var row=node.parentNode.rowIndex;
                n++;
            }
        }
        if(flag==false){
             alert("请选择");
        }
        if(n!=1&&flag==true){
             alert("只能选择一个");
             var icheck=document.getElementById("checkboxes");
             if(icheck.checked==true){
                     icheck.checked=false;
             }
             $("input[name='isChecked']").each( function() {
                 if($(this).prop('checked')){
                     $(this).prop('checked',false);
                 }
             });
        }
        if(flag==true&&n==1){
            $("#editModal").modal('show');
            var row=node.parentNode.rowIndex;
            var x=table.rows[row].cells;
            console.log("xxxxxxxxx:"+x);
            var chname=x[5].innerHTML;
            // console.log(chname);
            var chnames=x[2].innerHTML;
            var uploader=x[3].innerHTML;
            var note=x[6].innerHTML;
            var id=node.innerHTML;
            $("input[name='typeahead_example_modal_1']").val(id);
            $("input[name='typeahead_example_modal_2']").val(chnames);
            $("input[name='typeahead_example_modal_4']").val(uploader);
            $("input[name='typeahead_example_modal_3']").val(note);
        }
    }
    //关闭编辑模态框
   ,close:function(){
        $('#editModal').modal('hide');
        //恢复复选框状态
       $("input[name='isChecked']").each( function() {
           if($(this).prop('checked')){
               $(this).prop('checked',false);
           }
       });
    }
    //下载文件
     ,down:function(){
         var table=document.getElementById("example1");
         var ischeck=document.getElementsByName("isChecked");
         var flag=false;
         for(i=0;i<ischeck.length;i++){
             if(ischeck[i].checked==true){
                 flag=true;break;
             }
         }
         if(flag==true){
             for(i=0;i<ischeck.length;i++){
                 if(ischeck[i].checked==true){
                     var node= ischeck[i].parentNode.nextSibling;
                     var id=node.innerHTML;
                     alert(typeof id);
                     var data = {};
                     var url="/SchemaManager/download/"+id+"";
                     $.ajax({
                         url: url,
                         data: data,
                         async: false,
                         type: "GET",
                         success: function (msg) {
                             window.open(url,'_blank');
                         },
                         error: function (msg) {
                             alert("文件不存在");
                         }
                     })
                 }
             }
             $("input[name='isChecked']").each(function() {
                 if($(this).prop('checked')){
                     $(this).prop('checked',false);
                 }
             });
         }
         else{
              alert("请选择");
              SchemaManage.load();
         }
     }
     //表格全选
     ,selectall:function(){
         var icheck=document.getElementById("checkboxes");
         if(icheck.checked==true){
             $("input[name='isChecked']").each( function() {
                 if(!($(this).prop('checked'))){
                     $(this).prop('checked',true );
                 }
             });
         }
         if(icheck.checked==false){
             $("input[name='isChecked']").each( function() {
                 if($(this).prop('checked')){
                     $(this).prop('checked',false);
                 }
             });
         }
     }
   //增加模态窗口 上传xsd文件 使用ajaxsubmit提交含有文件的表单时
   ,add:function() {
        var options = {
             type:'POST',
             url:'/SchemaManager/addSchema',
             resetForm: true,// 提交后重置表单
             async:true,
             //提交前处理
             beforeSubmit:function(){
                 var id=$("input[name='text1']").val();
                 var name=$("input[name='xsdfile']").val(); //exampleInputFile文件上传框
                 var help=$("#help-block").html();
                 var help1=$("#help-block1").html();
                   if (id=="" || name=="") {
                     alert("ID和文件不能为空");
                     return false;
                 }
                 if (help=="id已存在" ||  help1=="请上传有效schema文件" ||help1=="文件已存在"){
                     alert("请输入正确编号和schema文件");
                     return false;
                 }
                 return true;
             },
             //处理完成
             success:function(msg){
             //status是页面提交状态，success表示成功。
                 var result = msg.replace("<pre>", "");
                 result = result.replace("</pre>", "");
                 console.log(result);
                 if(result=="ok"){
                     alert("提交成功");
                 }
                 else{
                     alert("提交失败");
                 }
                 $(function () {
                     $('#subModal').modal('hide');
                     $('#subModal').on('hidden.bs.modal', function () {
                         SchemaManage.load();
                     })
                 });
             },
            error:function (msg) {
                console.log(msg);
            }
           }
         $('#fileUp').ajaxSubmit(options);//增加模态窗口表单提交
         return false;//阻止表单自动提交事件,  必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
     }
     //关闭增加模态框
    ,closeAdd:function(){
         $('#subModal').modal('hide');
         $('#subModal').on('hidden.bs.modal', function () {
             SchemaManage.load();
         });
     }

     //Schema管理界面table内容
    ,showpage:function (nowpage,size,total) {
        $("#tbody").empty();
        var start=(nowpage-1)*size;
        var end=start+size-1;
        for(var i=start;i<=end;i++){
            var date=new Date(SchemaManage.data[i].ul_time.time);//遍历每一条数据的时间
            //console.log(SchemaManage.data);
            var time1=date.Format("yyyy年MM月dd日 HH时mm分ss秒");//规范时间的显示格式
            $("#tbody").append("<tr><td><input type='checkbox' name='isChecked'/></td><td style=\"display:none\">"
                +SchemaManage.data[i].md_type+"</td><td>"
                +SchemaManage.data[i].ch_name+"</td><td>"
                +SchemaManage.data[i].uploader+"</td><td>"
                +time1+"</td><td>"
                +SchemaManage.data[i].sch_name+"</td>" +
                "<td>" +( SchemaManage.data[i].note==null? "":SchemaManage.data[i].note)+"</td></tr>");
            $("#tbody").on("click", "tr", function () {
                var input = $(this).find("input");
                //alert($(input).prop("checked"));
                if (!$(input).prop("checked")) {
                    $(input).prop("checked",true);
                }else{
                    $(input).prop("checked",false);
                }
            });
            //多选框 防止事件冒泡
            $("#tbody").on("click", "input", function (event) {
                event.stopImmediatePropagation();
            });
        }
    }
    //编辑信息
   ,alt:function () {
        if(flag1==1||flag2==1||flag3==1){//信息已修改
            var table=document.getElementById("example1");
            var options1={
                type: 'POST',
                url: '/SchemaManager/alterSchema',
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
                success: function (msg) {
                    if(msg=="ok"){
                        alert("修改成功");
                    }else{
                        alert("修改失败!")
                    }
                    $(function () {
                        $('#editModal').modal('hide');
                        $('#editModal').on('hidden.bs.modal', function () {
                            SchemaManage.load();
                        })
                    });
                },
                error:function (msg) {
                    console.log(msg);
                }
            }
            $('#editform').ajaxSubmit(options1);
            return false;//阻止表单自动提交事件
        }
        else{
            alert("您还未任何信息进行修改");
        }

    }

}
