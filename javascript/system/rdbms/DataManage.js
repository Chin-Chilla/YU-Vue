var tempnode=null;
var databaseId=null;
var tempEditId=null;
var tempDBId=null;
var queryid=null;
var departmentId=null;
DataManage={
    load:function () {
        //判断资源目录树上是否有未保存的节点信息
        // CatalogPage.pageLeave();
        DataManage.loadTable();
         $(".sidebar-menu li").removeClass("active");
         $(".sidebar-menu .data").addClass("active");
         var data={};
         getStringData('/DataSourceManager/dataorigin',data,function (msg) {
             $(".content-wrapper").html(msg);
         })
         var aJson = {};
        /* getDataByGet("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
             ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree"), setting, dataStr);
         });*/
         // getDataByGet("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
         //      ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree1"), setting, dataStr);
         //      DataManage.edit();//  绑定click事件
         //      DataManage.loadTable();
         //      DataManage.create_connect();
         //       //DataManage.edit();//  绑定click事件
         //      DataManage.save_edit();
         //      // DataManage.tableNumandrecordNum();
         //      Permission.ShieldButton();
         //
         //  });
         }
	  ,dic_loadTable:function() {
        var dataStr={};
        var data={"dataJson":dataStr,};
        $.ajax({
            url:'/DataSourceManager/dic_loadTable',
            data:data,
            dataType:"JSON",
            async:false,
            type:"GET",
            success:function(msg)
            {
                $("#pagination3").empty();
                $("#pagination3").Paging({pagesize:3,count:msg[0].size,toolbar:true,callback:function(page,size,count){
                    DataManage.changeDICPage(page,size);
                }});
                DataManage.changeDICPage(1,3);
            }
        });
    }
     ,loadTable:function(){
        $("#pagination")
          var data={"page":1,"size":10};
          $.ajax({
                url:'/DataSourceManager/loadTable',
                data:data,
                dataType:"JSON",
                async : false,
                type:"GET",
                success:function(msg) {
                    $("#pagination").empty();
                    $("#pagination").Paging({pagesize:10,count:msg[0].size,toolbar:true,callback:function(page,size,count){
                        DataManage.changePage(page,size);
                    }});
                    DataManage.changePage(1,10);
                }
            });
          }
		  
		         ,changeDICPage:function(nowPage,size)
    {

         var dataStr="{\"page\":\""+nowPage+"\","+"\"size\":\""+size+"\"}";
         var data={"dataJson":dataStr,};
        //alert("12333");
        $.ajax({
            url:'/DataSourceManager/showDICTable',
            data:data,
            dataType:"JSON",
            async:false,
            type:"GET",
            success:function(msg)
            {
                //alert("aaaaaaaaaaaaaaaaa");
                $("#bz_body").empty();
                //alert("1111111");
                //var ischeck=document.getElementsByName("isChecked");
                for(var o in msg)
                {
                    /*for(var i=0;i<ischeck.length;i++)
                    {
                        if(ischeck[i].checked==true)
                        {
                           /!* var node=ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                            var id=node.innerHTML.replace(/\s+/g,"");
                            ID.push(id);*!/
                           ischeck[i].checked=false;

                        }

                    }*/
                   // $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].id+"</td><td> "+msg[o].dbcnname+"</td><td>"+msg[o].sid+"</td><td>"+""+"</td><td>"+msg[o].dbdesc+"</td><td>"+msg[o].tablenum+"</td><td>"+msg[o].recordnum+"</td><td>"+updatetime+"</td><td></td></tr>");
                    $("#bz_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes'  name='isChecked' value=" + msg[o].BZ_ID + "/></span></div></td><td>"+msg[o].BZ_ID+"</td><td> "+msg[o].NAME+"</td><td>"+msg[o].VERSION+"</td></tr>");

                    //$("")
                }

            },
            error:function()
    {
        alert("dic_loadTable error");
    }
        });
    }

    ,changePage:function (nowPage,size) {
         var dataStr = "{\"page\":\""+nowPage+"\","+"\"size\":\""+size+"\"}";
         var data = { "dataJson":dataStr, };
         //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
          $.ajax({
           url:'/DataSourceManager/showTable',                                                                                    //该路径在route中定义
           data:data,
           dataType:"JSON",
           async : true,
           type:"GET",                                                                                            //必须是get类型，POST类型不行
           success:function(msg)                                                                                 //传回字符串
           {
              $("#property_body").empty();
              for (var o in msg) {
                    var date=new Date(msg[o].updatestamp);
                    if(msg[o].realname=="null") msg[o].realname="";
                    if(msg[o].deptment=="null") msg[o].deptment="";
                    if(msg[o].dbdesc=="null") msg[o].dbdesc="";
                    if(msg[o].recordnum=="null") msg[o].recordnum="0";
                    var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                    $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked2'/></span></div></td><td>"+msg[o].id+"</td><td> "+msg[o].dbcnname+"</td><td>"+msg[o].sid+"</td><td>"+""+"</td><td>"+msg[o].dbdesc+"</td><td>"+msg[o].tablenum+"</td><td>"+msg[o].recordnum+"</td><td>"+updatetime+"</td><td></td></tr>");


             }
           },
           error:function(){
                               alert("loadTable error！");
                         }
       });
   }
   
       ,add:function(){

    var options = {
        type:'POST',
        //data:dataStr,
        //data:dataStr,
        //dataType:"JSON",

        url:'/DataSourceManager/add',
        resetForm: true,// 提交后重置表单
        async:true,
        //提交前处理

        beforeSubmit:function(){
            //var id=$("input[name='text1']").val();
            var name=$("input[name='xsdfile_1']").val();

           // var name_1=name.split(".");
            //alert(name_1[0]);
            //document.getElementByName("text2_1").value=name_1[0];
            //var help=$("#help-block_1").html();
            var help1=$("#help-block1_1").html();
            if (/*id=="" ||*/ name=="") {
                alert("文件不能为空");
                return false;
            }
            if (/*help=="id已存在" ||*/  help1=="请上传有效文件" ||help1=="文件已存在"){
                //alert("请输入正确编号和文件");
                return false;
            }







            var name1=$("input[name='xsdfile_2']").val();

            // var name_1=name.split(".");
            //alert(name_1[0]);
            //document.getElementByName("text2_1").value=name_1[0];
            //var help=$("#help-block_1").html();
            var help2=$("#help-block1_2").html();
            if (/*id=="" ||*/ name=="") {
                alert("文件不能为空");
                return false;
            }
            if (/*help=="id已存在" ||*/  help2=="请上传有效文件" ||help2=="文件已存在"){
                //alert("请输入正确编号和文件");
                return false;
            }



            return true;
        },
        //处理完成
        success:function(html, status){
            //status是页面提交状态，success表示成功。
            var result = html.replace("<pre>", "");
            result = result.replace("</pre>", "");
            if(result!="error"){
                //alert($("input[name='text2_1']").val());
                alert("提交成功");
                $('#Modal11').modal('hide');
                document.getElementsByName("text2_1").value=result;
                $('#Modal11').on('hidden.bs.modal', function () {
                    //SchemaManage.load();

                    DataManage.dic_loadTable();

                    $("#table_body").empty();
                    $("#pagination").empty();
                    $("#field_body").empty();
                    $("#pagination1").empty();
                   //DataManage.TABLE();
                   // DataManage.FIELD();
                   //DataManage.table_loadTable();
                   // alert("22222222222222222");

                    //DataManage.d
                })
            }
            if(result=="error"){
                alert("提交失败");
                $('#Modal11').modal('hide');
            }
        }
    };
    $('#fileUp_1').ajaxSubmit(options);
    return false;//阻止表单自动提交事件
}

         ,viewBZ:function()
    {
        var ischeck=document.getElementsByName("isChecked");
        var ID=[];
        for(var i=0;i<ischeck.length;i++)
        {
            if(ischeck[i].checked==true)
            {
                var node=ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                var id=node.innerHTML.replace(/\s+/g,"");
                ID.push(id);
            }
        }
        if(ID.length<1)
        {
            alert("您还没有选择要查看的标准！");
        }
        else if(ID.length>1)
        {
            alert("一次只能选择一个要查看的标准！");
        }
        else {
            DataManage.getValue_(id);
            DataManage.getValue1_(id);
           // DataManage.queryTable1(id);
            DataManage.queryid=id;

        }
    }
	 ,getValue1_:function(id)
    {
        var dataStr="{\"ID\":\""+id+"\","+"}";
        var data={"dataJson":dataStr,};
        //var data={};
        $.ajax({
            url:'DataSourceManager/getValue1_',
            data:data,
            async:true,
            dataType:"JSON",
            type:"GET",
            success:function(msg)
            {


                /*$("#field_body").append("<tr><td>"+
                 msg[o].CHINESE_FIELD+"</td><td>"+msg[o].BIAOSHI+"</td><td>"+msg[o].TYPE+"</td><td>"+msg[o].UNIT+"</td><td>"+msg[o].FOREIGN_FIELD+"</td></tr>");
                 */

                $("#pagination1").empty();
                $("#pagination9").empty();
                $("#pagination1").Paging({pagesize:5,count:msg[0].size,toolbar:true,callback:function(page,size,count)
                {
                    DataManage.fff(page,size,id);
                }});
                DataManage.fff(1,5,id);




            }
        })

    }
	
	,ttt:function (nowPage,size,id) {
        var dataStr = "{\"page\":\"" + nowPage + "\"," + "\"size\":\"" + size +  "\"," + "\"id\":\"" + id+ "\"}";
        var data = {"dataJson": dataStr,};
        //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
        $.ajax({
            url: '/DataSourceManager/ttt',                                                                                    //该路径在route中定义
            data: data,
            dataType: "JSON",
            async: true,
            type: "GET",                                                                                            //必须是get类型，POST类型不行
            success: function (msg)                                                                                 //传回字符串
            {
                $("#table_body").empty();
                for (var o in msg) {
                    /*var date = new Date(msg[o].updatestamp);
                     if (msg[o].realname == "null") msg[o].realname = "";
                     if (msg[o].deptment == "null") msg[o].deptment = "";
                     if (msg[o].dbdesc == "null") msg[o].dbdesc = "";
                     if (msg[o].recordnum == "null") msg[o].recordnum = "0";
                     var updatetime = date.Format("yyyy-MM-dd HH:mm:ss");*/
                    // $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>" + msg[o].id + "</td><td> " + msg[o].dbcnname + "</td><td>" + msg[o].sid + "</td><td>" + "" + "</td><td>" + msg[o].dbdesc + "</td><td>" + msg[o].tablenum + "</td><td>" + msg[o].recordnum + "</td><td>" + updatetime + "</td><td></td></tr>");

                    //<td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td>

                    $("#table_body").append("<tr><div></div><td>"+
                        msg[o].TABLE_ID+"</td><td>"+msg[o].CHINESE_NAME+"</td><td>"+msg[o].FOREIGN_NAME+"</td></tr>");

                }
            },
            error: function () {
                alert("changetttTable error！");
            }
        });
    }
	
	   ,deleteBZ:function()
    {
        var ID=[];
        var ischeck=document.getElementsByName("isChecked");
        for(var i=0;i<ischeck.length;i++)
        {
            if(ischeck[i].checked==true)
            {
                var node=ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                id=node.innerHTML.replace(/\s+/g,"");
                ID.push(id);


            }
        }
        if(ID.length<=0)
        {
            alert("您还没有选择要删除的标准");

        }
        else {
            if(confirm("将删除标准以及数据库表的相关信息，确定吗？"))
            {
                //var dataStr="{\"ID\":\""+ID+"\","+
                //"}";
                var dataStr="{\"ID\":\""+ID+"\","+"}";
                var data={"dataJson":dataStr,};
                $.ajax({
                    url:'/DataSourceManager/deleteBZ',
                    data:data,
                    //dataType:"JSON",
                    async:true,
                    type:"GET",
                    traditional:true,
                    success:function(msg)
                    {
                        DataManage.dic_loadTable();
                        //DataManage.TABLE();
                        //DataManage.FIELD();
                        //DataManage.table_loadTable();
                       // DataManage.field_loadTable();
                        alert("删除标准成功");

                    }
                    ,error:function()
                    {
                        alert("删除标准失败");
                    }


                })

            }
        }
    }
	
	     ,queryTable_1:function()
    {
        var ID=[];
        var id;
        var a;
        var dataStr;
        var data;
        var ischeck=document.getElementsByName("isChecked");
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                id=node.innerHTML.replace(/\s+/g,"");
                //alert("aaaa");
                //id=ischeck[i].value;
                ID.push(id);
               // alert("aaa"+id);
            }
        }
        if(ID.length<1)
        {
            alert("请选择字段所在的标准！");
        }
        else if(ID.length>1)
        {
            alert("只能选择一个标准");
        }
        else {
            a = $("input[name='query']").val();

             dataStr = "{\"CHINESE_NAME\":\"" + a + "\"," +
                "\"id\":\"" + id + "\","+"}";
            // alert("aaa"+id);
             data = {"dataJson": dataStr,};
        }
        $.ajax({
            url:'/DataSourceManager/queryTable_1',
            data:data,
            dataType:"JSON",
            async:false,
            type:"GET",
            success:function(msg)
            {
                $("#pagination").empty();
               $("#pagination8").empty();
                $("#pagination8").Paging({pagesize:5,count:msg[0].size,toolbar:true,callback:function(page,size,count)
                {
                    DataManage.queryTable1(page,size,id);
                }});
                DataManage.queryTable1(1,5,id);

            },
            error:function()
            {
                alert("对不起，没有您要找的字段！");
            }
        });






    }
	
	    ,queryTable1:function(nowPage,size,id)
{
//alert(id);


    //var ID=[];
    //var id;
   // var ischeck=document.getElementsByName("isChecked");
   /* for(var i=0;i<ischeck.length;i++){
        if(ischeck[i].checked==true){
            var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
            id=node.innerHTML.replace(/\s+/g,"");
            ID.push(id);
        }
    }*/


    var a=$("input[name='query']").val();
    var dataStr = "{\"page\":\"" + nowPage + "\"," + "\"size\":\"" + size + "\"," + "\"CHINESE_NAME\":\"" + a+
        "\"," + "\"id\":\"" + id+"\","+"}";
    var data = {"dataJson": dataStr,};
    ///var dataStr = "{\"CHINESE_NAME\":\""+a+"\","+
        //"\"id\":\""+id+"\"}";
    //var data={"dataJson":dataStr,};
    $.ajax({
        url:'/DataSourceManager/showtttTable',
        data:data,
        dataType:"JSON",
        async:true,
        type:"GET",
        success:function(msg)
        {
            //$("#pagination").empty();

            $("#table_body").empty();
            for(var o in msg)
            {
                $("#table_body").append("<tr><div></div><td>"+
                    msg[o].TABLE_ID+"</td><td>"+msg[o].CHINESE_NAME+"</td><td>"+msg[o].FOREIGN_NAME+"</td></tr>");
            }
           // alert("查询成功，字段为："+a);

        }
        ,error:function()
        {
            alert("查询失败，查询字段为："+a);
        }
    });

}

 ,queryTable_2:function()
    {
        var a;
        var dataStr;
        var data;
        var ID=[];
        var id;
        var ischeck=document.getElementsByName("isChecked");
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                id=node.innerHTML.replace(/\s+/g,"");
                //alert(id);
                ID.push(id);
            }
        }
        if(ID.length<1)
        {
            alert("请选择字段所在的标准！");
        }
        else if(ID.length>1)
        {
            alert("只能选择一个标准");
        }
        else {
             a = $("input[name='query1']").val();
             dataStr = "{\"CHINESE_FIELD\":\"" + a + "\"," +
                "\"id\":\"" + id + "\"}";
             data = {"dataJson": dataStr,};
        }
        //var data={};
        $.ajax({
            url:'/DataSourceManager/queryTable_2',
            data:data,
            dataType:"JSON",
            async:true,
            type:"GET",
            success:function(msg)
            {
                $("#pagination1").empty();
                $("#pagination9").empty();

                $("#pagination1").Paging({pagesize:5,count:msg[0].size,toolbar:true,callback:function(page,size,count)
                {
                    DataManage.queryTable2(page,size);
                }});
                DataManage.queryTable2(1,5);

            },
            error:function()
            {
                alert("对不起，没有您要找的字段！");
            }
        });






    }
	
	 ,queryTable2:function(nowPage,size)
    {



        var ID=[];
        var id;
        var ischeck=document.getElementsByName("isChecked");
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                id=node.innerHTML.replace(/\s+/g,"");
                ID.push(id);
            }
        }


        var a=$("input[name='query1']").val();
        var dataStr = "{\"page\":\"" + nowPage + "\"," + "\"size\":\"" + size + "\"," + "\"CHINESE_FIELD\":\"" + a+
            "\"," + "\"id\":\"" + id+"\"}";
        var data = {"dataJson": dataStr,};
        ///var dataStr = "{\"CHINESE_NAME\":\""+a+"\","+
        //"\"id\":\""+id+"\"}";
        //var data={"dataJson":dataStr,};
        $.ajax({
            url:'/DataSourceManager/showfffTable',
            data:data,
            dataType:"JSON",
            async:false,
            type:"GET",
            success:function(msg)
            {
                //$("#pagination").empty();

                $("#field_body").empty();
                for(var o in msg)
                {
                    $("#field_body").append("<tr><td>"+
                        msg[o].CHINESE_FIELD+"</td><td>"+msg[o].BIAOSHI+"</td><td>"+msg[o].TYPE+"</td><td>"+msg[o].UNIT+"</td><td>"+msg[o].FOREIGN_FIELD+"</td></tr>");
                }
                // alert("查询成功，字段为："+a);

            }
            ,error:function()
            {
                alert("查询失败，查询字段为："+a);
            }
        });

    }
	
	,editBZ:function()
    {

        var ischeck=document.getElementsByName("isChecked");
        var ID=[];
       for(var i=0;i<ischeck.length;i++)
        {
            if(ischeck[i].checked==true)
            {
                var node=ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                var id=node.innerHTML.replace(/\s+/g,"");
                ID.push(id);

            }

        }
        if(ID.length>1)
        {
            alert("一次只能选择一个要编辑的标准!");
        }
        else if(ID.length<1) {
            alert("您还没有选择要编辑的标准！");

        }
        else {
            //alert("11111111111");
           //alert("--------------------------------------------id=="+id);
            DataManage.edit_bz(id);
        }


    }
	  ,edit_bz:function(id)
    {
        //document.getElementById()
        //alert("222222222");
        var dataStr="{\"BZ_ID\":\""+id+"\","+"}";
        //var dataStr="{\"ID\":\""+id+"\","+
       // "}";
        var data={"dataJson":dataStr,};
        $.ajax({
           url:'/DataSourceManager/edit_bz',
            data:data,
            dataType:"JSON",
            async:false,
            type:"GET",
            success:function(msg)
            {
               // var zTree = $.fn.zTree.getZTreeObj("addTree4");
                //alert("编辑标准成功！");

                $("#bz_id1").val(msg[0].BZ_ID);

                //alert(msg[0].BZ_ID);
                $("#name1").val(msg[0].NAME);
                //
                //alert(msg[0].NAME);
                $("#version1").val(msg[0].VERSION);
               // alert(msg[0].VERSION);
                $("#Modal2").modal('show');


            }
            ,error:function()
            {
                alert("edit_bz失败！");
            }
        });

    }
	  ,fff:function (nowPage,size,id) {
        var dataStr = "{\"page\":\"" + nowPage + "\"," + "\"size\":\"" + size +  "\"," + "\"id\":\"" + id+ "\"}";
        var data = {"dataJson": dataStr,};
        //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
        $.ajax({
            url: '/DataSourceManager/fff',                                                                                    //该路径在route中定义
            data: data,
            dataType: "JSON",
            async: true,
            type: "GET",                                                                                            //必须是get类型，POST类型不行
            success: function (msg)                                                                                 //传回字符串
            {
                $("#field_body").empty();
               // $("#field_body").empty();
                for (var o in msg) {


                    $("#field_body").append("<tr><td>"+
                        msg[o].CHINESE_FIELD+"</td><td>"+msg[o].BIAOSHI+"</td><td>"+msg[o].TYPE+"</td><td>"+msg[o].UNIT+"</td><td>"+msg[o].FOREIGN_FIELD+"</td></tr>");

                }
            },
            error: function () {
                alert("changetttTable error！");
            }
        });
    }
	
	   ,getValue_:function(id)
    {
        var dataStr="{\"ID\":\""+id+"\","+"}";
        var data={"dataJson":dataStr,};
        //var data={};
        $.ajax({
            url:'DataSourceManager/getValue_',
            data:data,
            async:false,
            dataType:"JSON",
            type:"GET",
            success:function(msg)
            {


                    /*$("#field_body").append("<tr><td>"+
                     msg[o].CHINESE_FIELD+"</td><td>"+msg[o].BIAOSHI+"</td><td>"+msg[o].TYPE+"</td><td>"+msg[o].UNIT+"</td><td>"+msg[o].FOREIGN_FIELD+"</td></tr>");
                     */

                $("#pagination").empty();
                $("#pagination8").empty();
                $("#pagination").Paging({pagesize:5,count:msg[0].size,toolbar:true,callback:function(page,size,count)
                {
                    DataManage.ttt(page,size,id);
                }});
                DataManage.ttt(1,5,id);




            }
        })
    }
    /**
     * @description 新建一个数据库连接
     * @author wangbingfa
     * @date 2020年6月4日
     */
     ,create_connect:function (){
         $('#save_changes').click(function(){
                //var a=DataManage.checkdatabase_name('database_name','database_name_info');
                var b=DataManage.checkdatabase_chinesename('database_chinesename','database_chinesename_info');
                var c=DataManage.checkdatabaseSid('databaseSid','databaseSid_info');
                //var d=DataManage.checktablespace('tablespace','tablespace_info');
                var e=DataManage.checkIP('IP','IP_info');
                var f=DataManage.checkport('port','port_info');
                var g=DataManage.checkusername('username','username_info');
                var h=DataManage.checkpassword('password','password_info');
                if(b&&c&&e&&f&&g&&h){
                    //var manager=$("#manager").val();
                    var DBtype=$("#DBtype").val();
                    //var database_name=$("#database_name").val();
                    var database_chinesename=$("#database_chinesename").val();
                    var databaseSid=$("#databaseSid").val();
                    //var tablespace=$("#tablespace").val();
                    var IP=$("#IP").val();
                    var port=$("#port").val();
                    var username=$("#username").val();
                    var password=$("#password").val();
                    var database_describe=$("#database_describe").val();
              //参数准备工作
                   var dataStr = "{\"DBtype\":\""+DBtype+"\","+
                                "\"database_chinesename\":\""+database_chinesename+"\","+
                                "\"databaseSid\":\""+databaseSid+"\","+
                                "\"IP\":\""+IP+"\","+
                                "\"port\":\""+port+"\","+
                                "\"username\":\""+username+"\","+
                                "\"password\":\""+password+"\","+
                                "\"department\":\""+departmentId+"\","+
                                "\"database_describe\":\""+database_describe+"\","+
                                  "}";
                   var data = { "dataJson":dataStr, };
                  //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
            $.ajax({
                      url:'/DataSourceManager/create_connect',           //该路径在route中定义
                      data:data,
                      //dataType:"JSON",
                      async : false,
                      type:"GET",                     //必须是get类型，POST类型不行
                      success:function(msg){
                      //$('#property_body').remove();
                      //$('#example1').append("<tbody id='property_body'></tbody>");
                      /*for(var o in msg){
                            var date=new Date(msg[o].updatestamp);
                            var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                              $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].id+"</td><td>"+msg[o].dbname+"</td><td> "+msg[o].dbcnname+"</td><td>"+msg[o].sid+"</td><td>"+msg[o].realname+"</td><td>"+msg[o].deptment+"</td><td>"+msg[o].tbspace+"</td><td>"+msg[o].dbdesc+"</td><td>"+msg[o].tablenum+"</td><td>"+msg[o].recordnum+"</td><td>"+updatetime+"</td><td></td></tr>");
                           }*/
                           alert("新建连接成功！");
                           DataManage.loadTable();
                           departmentId=null;
                      },
                      error:function(){
                            alert("新建连接失败！");
                            departmentId=null;
                      }
                  });
            $('#exampleModal').modal('hide');
            //document.getElementById("manager").value="";
            //document.getElementById("database_name").value="";
            document.getElementById("database_chinesename").value="";
            document.getElementById("databaseSid").value="";
            //document.getElementById("tablespace").value="";
            document.getElementById("IP").value="";
            document.getElementById("port").value="";
            document.getElementById("username").value="";
            document.getElementById("password").value="";
            document.getElementById("department").value="";
            document.getElementById("database_describe").value="";
            //document.getElementById("manager_info").innerHTML="";
            //document.getElementById("database_name_info").innerHTML="*(必填)";
            document.getElementById("database_chinesename_info").innerHTML="*(必填)";
            document.getElementById("databaseSid_info").innerHTML="*(必填)";
            //document.getElementById("tablespace_info").innerHTML="*(必填)";
            document.getElementById("IP_info").innerHTML="*(必填)";
            document.getElementById("port_info").innerHTML="*(必填)";
            document.getElementById("username_info").innerHTML="*(必填)";
            document.getElementById("password_info").innerHTML="*(必填)";
            document.getElementById("database_describe_info").innerHTML="*(必填)";

            }
         });

      }

     ,showSelectDpModel:function(){
         var aJson = {};
         getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
             ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree3"), setting1, dataStr);
             zTree = $.fn.zTree.getZTreeObj("addTree3");
         });
         $("#modelTree3").modal("show");
     }
     ,selectDp:function(){
        function filter(node) {
            return (  node.checked==true && node.level == 1);
        }
        var nodes = ObjectMetadataPage.zTreeObj.getCheckedNodes(true);
        var treeObj = $.fn.zTree.getZTreeObj("addTree3");
        var node = treeObj.getNodesByFilter(filter, true); // 仅查找一个节点
         if (node == null) {
             alert("您还没有选择部门！");
         } else{
             departmentId=node.node_id;
             var text=node.node_name;
             $("#department").val(text);
         }
         $("#modelTree3").modal("hide");

     }

     ,showEditDpModel:function(){

              $("#modelTree4").modal("show");
          }

     ,EditDp:function(){
             function filter(node) {
                 return (  node.checked==true && node.level == 1);
             }
             var nodes = ObjectMetadataPage.zTreeObj.getCheckedNodes(true);
             var treeObj = $.fn.zTree.getZTreeObj("addTree4");
             var node = treeObj.getNodesByFilter(filter, true); // 仅查找一个节点
              if (node == null) {
                  alert("您还没有选择部门！");
              } else{
                  departmentId=node.node_id;
                  var text=node.node_name;
                  $("#editDepartment").val(text);
              }
              $("#modelTree4").modal("hide");

          }



     ,edit:function (){
          $('#edit').click(function(){
              var aJson = {};
               getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
               ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree4"), setting1, dataStr);
               zTree = $.fn.zTree.getZTreeObj("addTree4");
             });
              var ischeck=document.getElementsByName("isChecked2");
              var ID=[];
              for(i=0;i<ischeck.length;i++){
                  if(ischeck[i].checked==true){
                      var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                      var id=node.innerHTML.replace(/\s+/g,"");
                      ID.push(id);
                  }
              }
              if(ID.length>1)
              {
                    alert("一次只能选择一个需要编辑的数据库");
              }
              else if(ID.length<=0)
              {     alert("您还没有选择要编辑的数据库");}
              else{

                    tempEditId=null;
                    tempEditId=ID[0];
                    DataManage.edit_connect(id);}
           });
      }
     ,edit_connect:function(id){
          //document.getElementById("charge_info").innerHTML="";
          //document.getElementById("databasename_info").innerHTML="*(必填)";
          document.getElementById("databasechinesename_info").innerHTML="*(必填)";
          document.getElementById("database_sid_info").innerHTML="*(必填)";
          //document.getElementById("table_space_info").innerHTML="*(必填)";
          document.getElementById("IPaddr_info").innerHTML="*(必填)";
          document.getElementById("portnum_info").innerHTML="*(必填)";
          document.getElementById("user_name_info").innerHTML="*(必填)";
          document.getElementById("pwd_info").innerHTML="*(必填)";
          document.getElementById("editDepartment_info").innerHTML="*(必填)";
          document.getElementById("dbdesc_info").innerHTML="*(必填)";
          var dataStr="{\"ID\":\""+id+"\","+
                      "}";
          var data={"dataJson":dataStr,};
          $.ajax({
              url:'/DataSourceManager/edit_connect',
              data:data,
              dataType:"JSON",
              async:false,
              type:"GET",
              success:function(msg){
                  var zTree = $.fn.zTree.getZTreeObj("addTree4");
                  var node = zTree.getNodeByParam("node_id",msg[0].department);
                  //$("#charge").val(msg[0].chargeid);
                  //alert("msg[0].dbtype: "+msg[0].dbtype);
                  $("#DBtype2").val(msg[0].dbtype);
                  //$("#databasename").val(msg[0].dbname);
                  $("#databasechinesename").val(msg[0].dbcnname);
                  $("#database_sid").val(msg[0].sid);
                  //$("#table_space").val(msg[0].tbspace);
                  $("#IPaddr").val(msg[0].ipaddr);
                  $("#portnum").val(msg[0].port);
                  $("#user_name").val(msg[0].username);
                  $("#pwd").val(msg[0].password);
                  $("#editDepartment").val(node.node_name);
                  $("#dbdesc").val(msg[0].dbdesc);
                  $('#exampleModal1').modal('show');
              }
          });
      }
      ,save_edit:function(){
        innerData = {};
        innerData["dataBase"] = {};
        innerData["db_type"] = $("#DBtype2").val();
        innerData["dataBase"]["db_c_nname"] = $("#database_chinesename").val();
        innerData["src_sid"] = $("#databaseSid").val();
        innerData["ip_addr"] = $("#IP").val();
        innerData["src_port"] = $("#port").val();
        innerData["src_user"] = $("#username").val();
        innerData["src_pwd"] = $("#password").val();
        // innerData["departId"] = $.fn.zTree.getZTreeObj("addTree4").getNodeByParam("node_name",$("#department").val()).node_id;
        innerData["dataBase"]["db_desc"] = $("#database_describe").val();
        $.ajax({
            url:'/DataSourceManager/save_edit',
            data:JSON.stringify(innerData),
            dataType:"JSON",
            async : true,
            type:"POST",
            beforeSend : function(req) {
                req.setRequestHeader('Content-Type', 'application/json');  ///加这一行解决问题
            },
            success:function(msg){
                $('#exampleModal1').modal('hide');
                $('#property_body').remove();
                $('#example1').append("<tbody id='property_body'></tbody>");
                alert("保存编辑成功!");
                DataManage.loadTable();
                tempEditId=null;
            },
            error:function(){
                alert("保存编辑失败！");
                tempEditId=null;
            }
        });

    }
    /**
     * @author  wangbingfa
     * @date  2020年6月2日
     */
    ,testConnect:function(){
         $("input[type=checkbox]:checked").each(function () {
            var db_id = $(this).parent("td").next().text();
            var responseInfo = $(this).parent("td").parent("tr").find("td").eq(8);
            var params={"databaseid":db_id};
            var data = JSON.stringify(params);
            $.ajax({
             url:'/DataSourceManager/testConnect',
             contentType : 'application/json',
             data:data,
             timeout:1000,
             dataType:"JSON",
             async:true,
             type:"POST",
             success:function(msg){
                 console.log(msg)
                 if(msg==true){
                     responseInfo.text("连接成功");
                     $("#loading").remove();
                 }
                 else{
                     responseInfo.text("连接失败");
                     $("#loading").remove();
                 }
             },
             error:function(msg){
                 responseInfo.text("连接失败");
                 $("#loading").remove();
             }
         });
         })

      }
    ,testConnectInModal:function(){
        //       $("#attribute-box").append("<div class='overlay' id='loading'><i class='fa fa-refresh fa-spin'></i></div>");
        //addloading();
//              document.getElementById('loading').style.visibility='visible';
//              var div1=document.getElementById("attribute-box");

//              div2.innerHTML=;
        DataManage.testConnect();
    }
    ,tests:function(){
        // var ischeck=document.getElementsByName("isChecked2");
        // for(i=0;i<ischeck.length;i++){
        //     if(ischeck[i].checked==true){
        //         var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
        //         tempnode= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
        //         // alert("node.innerHTML:"+node.innerHTML)
        //         var databaseid=node.innerHTML.replace(/\s+/g,"");
        //         // alert("variable databaseid is:"+databaseid)
        //         //                      tempnode.innerHTML="连接成功";
        //         //                      alert("tempnode.innerHTML:"+tempnode.innerHTML);
        //         //                     alert("tempnode.innerHTML:"+tempnode);
            var ipaddr = document.getElementById("IP").value;//从modal框取ip地址
            var port_number = document.getElementById("port").value;
            var sid = document.getElementById("databaseSid").value;
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            var dbtype=$("#DBtype option:selected").val();
            // console.log("取到的ip为："+ipaddr);
            // console.log("取到的port为："+port_number);
            // console.log("取到的sid为："+sid);
            // console.log("取到的用户名为："+username);
            // console.log("取到的密码为："+password);
            // console.log("取到的dbtype为："+dbtype);

                // var dataStr="{\"databaseid\":\""+databaseid+"\","+
                //     "}";
                var dataStr1 = {
                                ip:ipaddr,
                                port:port_number,
                                databasesid:sid,
                                user:username,
                                password:password,
                                databasetype:dbtype
                            }

                //dataStr为String类型
                var dataStr = JSON.stringify(dataStr1)
                // console.log("dataStr的类型为："+typeof(dataStr))
                var data={"dataJson":dataStr,};
                // console.log("data的类型为："+typeof(data))
                //data为object类型
                $.ajax({
                    url:'/DataSourceManager/testConnectInModal',
                    data:data,
                    timeout:1000,
                    dataType:"JSON",
                    async:false,
                    type:"GET",
                    success:function(msg){
                        msg = ('(' + msg + ')');
                        if(msg=='(true)'){
                            // tempnode.innerHTML="连接成功";
                            // $("#loading").remove();
                            alert("连接成功")
                        }
                        else{
                            // tempnode.innerHTML="连接失败";
                            // $("#loading").remove();
                            alert("连接失败")
                        }
                    },
                    error:function(msg){
                        // tempnode.innerHTML="连接失败";
                        // $("#loading").remove();
                        alert("error    连接失败")
                    }
                });

            }


    ,generate:function()
    {

        //alert("开始抽取数据，请稍等...");
        //$("#loading").css('display','block');
        var ID=[];
        // var Id=[];
        var ischeck=document.getElementsByName("isChecked2");
        for(i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                var node1= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                var node2= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                var id=node.innerHTML.replace(/\s+/g,"");
                var tableNum=node1.innerHTML.replace(/\s+/g,"");
                var recordNum=node2.innerHTML.replace(/\s+/g,"");
                ID.push(id);
            }
        }
        if(ID.length<=0)
        {
            alert("您还没有选择要操作的数据库");
        }
        else if(ID.length>1)
        {
            alert("一次只能选择一个要操作的数据库！");
        }

        else{
            alert("开始生成文件，请稍等...");
            $("#loading").css('display','block');
            var dataStr="{\"ID\":\""+ID+"\","+
                "}";
            var data={"dataJson":dataStr,};
            $.ajax({
                url:'/DataSourceManager/generateFiles',           //该路径在route中定义
                data:data,
                dataType:"JSON",
                async : true,
                type:"GET",                     //必须是get类型，POST类型不行
                traditional: true,
                success:function(msg){
                    alert("生成文件成功！");
                    $("#loading").css('display','none');
                    DataManage.loadTable();

                },
                error:function(){

                    alert("生成文件失败！");
                    $("#loading").css('display','none');
                }
            });
        }
    }

      ,extractTable:function(){
            //alert("开始抽取数据，请稍等...");
            //$("#loading").css('display','block');
            var ID=[];
           // var Id=[];
            var ischeck=document.getElementsByName("isChecked2");
            for(i=0;i<ischeck.length;i++){
                if(ischeck[i].checked==true){
                    var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    var node1= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var node2= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var id=node.innerHTML.replace(/\s+/g,"");
                    var tableNum=node1.innerHTML.replace(/\s+/g,"");
                    var recordNum=node2.innerHTML.replace(/\s+/g,"");
                   /* if(tableNum!="0" && recordNum!="0"){
                            Id.push(id);
                    }else{*/
                            ID.push(id);
                    //}
                }
            }
            if(ID.length<=0)
            {
                alert("您还没有选择要抽取的数据库");
            }
            else if(ID.length>1)
            {
                alert("一次只能选择一个要抽取的数据库！");
            }

            else{
                alert("开始抽取数据，请稍等...");
                $("#loading").css('display','block');
                var dataStr="{\"ID\":\""+ID+"\","+
                                "}";
                var data={"dataJson":dataStr,};
                $.ajax({
                      url:'/DataSourceManager/extractTable',           //该路径在route中定义
                      data:data,
                      dataType:"JSON",
                      async : true,
                      type:"GET",                     //必须是get类型，POST类型不行
                      traditional: true,
                      success:function(msg){
                            /*$('#property_body').remove();
                            $('#example1').append("<tbody id='property_body'></tbody>");
                            for(var o in msg){
                                var date=new Date(msg[o].updatestamp);
                                var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                                $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].id+"</td><td>"+msg[o].dbname+"</td><td> "+msg[o].dbcnname+"</td><td>"+msg[o].sid+"</td><td>"+msg[o].realname+"</td><td>"+msg[o].deptment+"</td><td>"+msg[o].tbspace+"</td><td>"+msg[o].dbdesc+"</td><td>"+msg[o].tablenum+"</td><td>"+msg[o].recordnum+"</td><td>"+updatetime+"</td><td></td></tr>");
                            }*/
                            alert("抽取表成功！");
                            //$("#loading").hide();
                            $("#loading").css('display','none');
                            DataManage.loadTable();

                      },
                      error:function(){

                            alert("抽取表失败！");
                            $("#loading").css('display','none');
                      }
                  });
            }
      }
      ,extractTableColumn:function(){
            var ID=[];
            var s="";
            var f="";
            var ischeck=document.getElementsByName("isChecked");
            for(i=0;i<ischeck.length;i++){
                if(ischeck[i].checked==true){
                    var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    id=node.innerHTML.replace(/\s+/g,"");
                    ID.push(id);
                }
            }
            if(ID.length<=0)
                {
                    alert("您还没有选择要抽取的表！");
                }
            else{
                //$("#tableDetail").append("<div class='overlay' id='loading'><i class='fa fa-refresh fa-spin'></i></div>")
                for(i=0;i<ischeck.length;i++){
                    if(ischeck[i].checked==true){
                        var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                        id=node.innerHTML.replace(/\s+/g,"");
                        alert("将要抽取字段的表的id:"+id)
                        var dataStr="{\"ID\":\""+id+"\","+"}";
                        var data={"dataJson":dataStr,};
                        $.ajax({
                              url:'/DataSourceManager/extractTableColumn',           //该路径在route中定义
                              data:data,
                              dataType:"JSON",
                              async : false,
                              type:"GET",                     //必须是get类型，POST类型不行
                              success:function(msg){
                                    msg = ('(' + msg + ')');
                                    if(msg=='(success)'){
                                        s=s+id+',';
                                      }
                                    else{
                                        f=f+id+',';
                                      }
                              },
                              error:function(msg){
                                    alert("error");
                              }
                        });
                    }
                }
            //$("#loading").remove();
            alert("抽取ID为："+s+"的表成功"+"    抽取ID为："+f+"的表失败");
 //          confirm("抽取ID为："+s+"的表成功"+"    抽取ID为："+f+"的表失败");

            }
      }
      ,getColumn:function(){
                          var ischeck=document.getElementsByName("isChecked");
                          var ID=[];
                          for(i=0;i<ischeck.length;i++){
                              if(ischeck[i].checked==true){
                                  var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                                  var id=node.innerHTML.replace(/\s+/g,"");
                                  ID.push(id);
                              }
                          }
                          if(ID.length>1)
                          {
                                alert("一次只能选择一个要查看的表");
                          }
                          else if(ID.length<=0)
                          {     alert("您还没有选择要查看的表");}
                          else{
                                $('#exampleModal').modal('show');
                                 DataManage.getColumnDetail(id);}

      }
     ,getColumnDetail:function(id){
           // alert("1111111111111111");
            $("#column_body").empty();
            var dataStr="{\"ID\":\""+id+"\","+
                                                        "}";
                        var data = { "dataJson":dataStr, };
                        $.ajax({
                            url:'/DataSourceManager/viewColumn',           //该路径在route中定义
                            data:data,
                            dataType:"JSON",
                            async : false,
                            type:"GET",
                            success:function(msg){
                                for(var o in msg){
                                    $("#column_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked1'/></span></div></td><td>"+msg[o].fd_id+"</td><td>"+msg[o].fd_name+"</td><td>"+msg[o].fd_c_name+"</td><td> "+msg[o].fd_type+"</td><td>"+msg[o].is_fk+"</td></tr>");
                                }
                            },
                            error:function(){
                                alert("error");
                            }

                        });
      }
      ,updateTable:function(){
            var ID=[];
            var Id=[];
            var ischeck=document.getElementsByName("isChecked");
            for(i=0;i<ischeck.length;i++){
                if(ischeck[i].checked==true){
                    var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    var node1= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var node2= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var id=node.innerHTML.replace(/\s+/g,"");
                    var tableNum=node1.innerHTML.replace(/\s+/g,"");
                    var recordNum=node2.innerHTML.replace(/\s+/g,"");
                    if(tableNum=="0" && recordNum=="0"){
                            Id.push(id);
                    }else{
                            ID.push(id);
                    }
                }
            }
            if(ID.length<=0 && Id.length<=0)
            {
                alert("您还没有选择要更新的数据库");
            }else if(Id.length>0){
                alert("ID为："+Id+"的表还未被抽取，请先抽取表！");
            }
            else{
                var dataStr="{\"ID\":\""+ID+"\","+
                                "}";
                var data={"dataJson":dataStr,};
                $.ajax({
                      url:'/DataSourceManager/extractTable',           //该路径在route中定义
                      data:data,
                      dataType:"JSON",
                      async : false,
                      type:"GET",                     //必须是get类型，POST类型不行
                      traditional: true,
                      success:function(msg){
                            alert("更新ID为："+msg[0]+"的数据库成功"+"     更新ID为："+msg[1]+"的数据库失败");
                      }
                  });
            }
      }
      ,deleteDataBase:function(){
            var ID=[];
            var ischeck=document.getElementsByName("isChecked2");
            for(i=0;i<ischeck.length;i++){
                if(ischeck[i].checked==true){
                    var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    id=node.innerHTML.replace(/\s+/g,"");
                    ID.push(id);
                }
            }
            if(ID.length<=0)
            {
                alert("您还没有选择要删除的数据库");
            }
            else{
                if(confirm("将删除数据库及数据库表的所有信息，确定吗？")){
                    $("#loading").css('display','block');
                      var dataStr="{\"ID\":\""+ID+"\","+
                                                      "}";
                      var data={"dataJson":dataStr,};
                      $.ajax({
                            url:'/DataSourceManager/deleteDataBase',           //该路径在route中定义
                            data:data,
                            //dataType:"JSON",
                            async : true,
                            type:"GET",                     //必须是get类型，POST类型不行
                            traditional: true,
                            success:function(msg){
                                 //$('#property_body').remove();
                                 //$('#example1').append("<tbody id='property_body'></tbody>");
                                 /*for(var o in msg){
                                    var date=new Date(msg[o].updatestamp);
                                    var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                                      $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].id+"</td><td>"+msg[o].dbname+"</td><td> "+msg[o].dbcnname+"</td><td>"+msg[o].sid+"</td><td>"+msg[o].realname+"</td><td>"+msg[o].deptment+"</td><td>"+msg[o].tbspace+"</td><td>"+msg[o].dbdesc+"</td><td>"+msg[o].tablenum+"</td><td>"+msg[o].recordnum+"</td><td>"+updatetime+"</td><td></td></tr>");
                                 }*/
                                 DataManage.loadTable();
                                 alert("删除数据库成功！");
                                 $("#loading").css('display','none');
                            },
                            error:function(){
                                  alert("删除数据库失败！");
                                  $("#loading").css('display','none');
                            }
                        });
                }
            }
      }

      //查看表信息按钮事件
      ,seeDataTable:function () {
            var id1=null;
            var ID=[];
            var ischeck=document.getElementsByName("isChecked2");
            for(i=0;i<ischeck.length;i++){
                if(ischeck[i].checked==true){
                    var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    id1=node.innerHTML.replace(/\s+/g,"");
                    ID.push(id1);
                }
            }
            if(ID.length<=0){alert("您还没有选择要查看的数据库！");}
            else if(ID.length>1){alert("一次只能选择一个数据库！");}
            else{
                var data={};
                getStringData('/DataSourceManager/seeDataTable',data,function (msg) {
                   $(".content-wrapper").html(msg);
                   DataManage.getDataTable(id1);

                })
                /*var aJson = {};
                 getDataByGet("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                     ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree"), setting, dataStr);
                 });
                 var aJson = {};
                  getDataByGet("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                      ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree1"), setting, dataStr);
                  });*/

            }

       }

       //获得指定数据库的所有表信息，并展示
       ,getDataTable:function(id){
            databaseId=id;
            var dataStr="{\"ID\":\""+id+"\","+
                                            "}";
            var data = { "dataJson":dataStr, };
            $.ajax({
                url:'/DataSourceManager/loadDataTable',           //该路径在route中定义
                data:data,
                dataType:"JSON",
                async : false,
                type:"GET",
                success:function(msg){
                tempDBId=id;
                    /*for(var o in msg){
                        var date=new Date(msg[o].updatestamp.time);
                        var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                        $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].id+"</td><td>"+msg[o].databaseid+"</td><td> "+msg[o].tablename+"</td><td>"+msg[o].tablecnname+"</td><td>"+msg[o].keyword+"</td><td>"+msg[o].tabledesc+"</td><td>"+msg[o].recordnum+"</td><td>"+msg[o].tablesize+"</td><td>"+updatetime+"</td></tr>");
                    }*/
                    $("#pagination").empty();
                    $("#pagination").Paging({pagesize:10,count:msg[0],toolbar:true,callback:function(page,size,count){
                        DataManage.changeTablePage(page,size);
                    }});
                    DataManage.changeTablePage(1,10);

                }

            });

       }

     ,selectNodes:function(){
         /*var zTree = $.fn.zTree.getZTreeObj("addTree");
         $.ajax({
             url:'/DataSourceManager/selectNodes',           //该路径在route中定义
             data:data,
             dataType:"JSON",
             async : false,
             type:"GET",
             success:function(msg){
               var node = zTree.getNodeByParam("node_id",1000);
                        node.checked = true;
                        zTree.updateNode(node);

             }

         });*/
         var zTree = $.fn.zTree.getZTreeObj("addTree");
         var node = zTree.getNodeByParam("node_id",1000);
         node.checked = true;
         zTree.updateNode(node);


     }

      /*,showCatalogModal: function (checkName){
             var ID=[];
             var zTree;
             var ischeck=document.getElementsByName(checkName);
             for(i=0;i<ischeck.length;i++){
                 //获得已选择的待编目的数据
                 if(ischeck[i].checked==true){
                      var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                      id=node.innerHTML.replace(/\s+/g,"");
                      ID.push(id);
                 }
             }
             if(ID.length<=0)
                 {
                     alert("您还没有选择要编目的数据");
                 }
             else if(ID.length>1){
                     alert("一次只能选择一个要编目的数据");
             }
             else{
                 if(confirm("将要编目您选择的数据，确定吗？")){
                        if(checkName=="isChecked"){
                            var aJson = {};
                             getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                                 ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree"), setting, dataStr);
                                  zTree = $.fn.zTree.getZTreeObj("addTree");
                             });

                                 // alert("selectDTNodes");
                                  var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                       "}";
                                  var data = { "dataJson":dataStr, };
                                  $.ajax({
                                   url:'/DataSourceManager/selectDTNodes',           //该路径在route中定义
                                   data:data,
                                   dataType:"JSON",
                                   async : false,
                                   type:"GET",
                                   success:function(msg){
                                      for(var o in msg){
                                          var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                          //alert(node);
                                          node.checked = true;
                                          node.checkedOld=true;
                                          zTree.updateNode(node);
                                      }
                                      $("#modelTree").modal("show");
                                      tempEditId=ID[0];
                                   },
                                   error:function(){
                                        alert("初始化编目失败！");
                                        tempEditId=null;
                                        $("#modelTree").modal("hide");
                                  }
                              });



                        }else if(checkName=="isChecked1"){
                            var aJson = {};
                             getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                                 ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree1"), setting, dataStr);
                                 zTree = $.fn.zTree.getZTreeObj("addTree1");
                             });
                                alert("selectTCNodes");
                               var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                    "}";
                               var data = { "dataJson":dataStr, };
                               $.ajax({
                                url:'/DataSourceManager/selectTCNodes',           //该路径在route中定义
                                data:data,
                                dataType:"JSON",
                                async : false,
                                type:"GET",
                                success:function(msg){
                                   for(var o in msg){
                                       var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                       node.checked = true;
                                       node.checkedOld=true;
                                       zTree.updateNode(node);
                                   }
                                   $("#modelTree1").modal("show");
                                   tempEditId=ID[0];
                                },
                                error:function(){
                                     alert("初始化编目失败！");
                                     tempEditId=null;
                                    $("#modelTree1").modal("hide");
                               }
                           });
                        }else if(checkName=="isChecked2"){
                            var aJson = {};
                             getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                                 //加载资源树
                                 ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree2"), setting, dataStr);
                                  zTree = $.fn.zTree.getZTreeObj("addTree2");
                             });

                                  //alert("selectDBNodes");
                                  var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                       "}";
                                  var data = { "dataJson":dataStr, };
                                  $.ajax({
                                   url:'/DataSourceManager/selectDBNodes',           //该路径在route中定义
                                   data:data,
                                   dataType:"JSON",
                                   async : false,
                                   type:"GET",
                                   success:function(msg){
                                      for(var o in msg){
                                          var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                          //alert(msg[o].node_id);
                                          node.checked = true;
                                          node.checkedOld=true;
                                          zTree.updateNode(node);
                                      }
                                      $("#modelTree2").modal("show");
                                      tempEditId=ID[0];
                                   },
                                   error:function(){
                                        alert("初始化编目失败！");
                                        tempEditId=null;
                                        $("#modelTree2").modal("hide");
                                  }
                              });
                        }else{
                              alert("错误！");
                        }
                 }
             }
      }*/
	      ,showCatalogModal: function (checkName){
             var ID=[];
             var zTree;
             var ischeck=document.getElementsByName(checkName);
             for(i=0;i<ischeck.length;i++){
                 //获得已选择的待编目的数据
                 if(ischeck[i].checked==true){
                      var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                      id=node.innerHTML.replace(/\s+/g,"");
                      ID.push(id);
                 }
             }
             if(ID.length<=0)
                 {
                     alert("您还没有选择要编目的数据");
                 }
            /* else if(ID.length>1){
                     alert("一次只能选择一个要编目的数据");
             }*/
             else{
                 if(confirm("将要编目您选择的数据，确定吗？")){
                        if(checkName=="isChecked"){

                            var aJson = {};
                             getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                                 ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree"), setting, dataStr);
                                  zTree = $.fn.zTree.getZTreeObj("addTree");
                             });

                                 // alert("selectDTNodes");
                                  var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                       "}";
                                  var data = { "dataJson":dataStr, };
                                  $.ajax({
                                   url:'/DataSourceManager/selectDTNodes',           //该路径在route中定义
                                   data:data,
                                   dataType:"JSON",
                                   async : false,
                                   type:"GET",
                                   success:function(msg){
                                      for(var o in msg){
                                          var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                          //alert(node);
                                          node.checked = true;
                                          node.checkedOld=true;
                                          zTree.updateNode(node);
                                      }
                                      $("#modelTree").modal("show");
                                      tempEditId=ID;
                                   },
                                   error:function(){
                                        alert("初始化编目失败！");
                                        tempEditId=null;
                                        $("#modelTree").modal("hide");
                                  }
                              });



                        }else if(checkName=="isChecked1"){
                            var aJson = {};
                             getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                                 ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree1"), setting, dataStr);
                                 zTree = $.fn.zTree.getZTreeObj("addTree1");
                             });
                               // alert("selectTCNodes");
                               var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                    "}";
                               var data = { "dataJson":dataStr, };
                               $.ajax({
                                url:'/DataSourceManager/selectTCNodes',           //该路径在route中定义
                                data:data,
                                dataType:"JSON",
                                async : false,
                                type:"GET",
                                success:function(msg){
                                   for(var o in msg){
                                       var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                       node.checked = true;
                                       node.checkedOld=true;
                                       zTree.updateNode(node);
                                   }
                                   $("#modelTree1").modal("show");
                                   tempEditId=ID[0];
                                },
                                error:function(){
                                     alert("初始化编目失败！");
                                     tempEditId=null;
                                    $("#modelTree1").modal("hide");
                               }
                           });
                        }else if(checkName=="isChecked2"){
                            var aJson = {};
                             getDataByGet1("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                                 //加载资源树
                                 ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#addTree2"), setting, dataStr);
                                  zTree = $.fn.zTree.getZTreeObj("addTree2");
                             });

                                  //alert("selectDBNodes");
                                  var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                       "}";
                                  var data = { "dataJson":dataStr, };
                                  $.ajax({
                                   url:'/DataSourceManager/selectDBNodes',           //该路径在route中定义
                                   data:data,
                                   dataType:"JSON",
                                   async : false,
                                   type:"GET",
                                   success:function(msg){
                                      for(var o in msg){
                                          var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                          //alert(msg[o].node_id);
                                          node.checked = true;
                                          node.checkedOld=true;
                                          zTree.updateNode(node);
                                      }
                                      $("#modelTree2").modal("show");
                                      tempEditId=ID[0];
                                   },
                                   error:function(){
                                        alert("初始化编目失败！");
                                        tempEditId=null;
                                        $("#modelTree2").modal("hide");
                                  }
                              });
                        }else{
                              alert("错误！");
                        }
                 }
             }
      }

       //未使用   编目元数据按钮
       ,catalogMetadata:function () {
             var nodes = ObjectMetadataPage.zTreeObj.getCheckedNodes(true);
             if (nodes.length == 0) {
                 alert("您没有选择节点！");
             } else {
                 var nodeIdList = [];
                 for (var i = 0; i < nodes.length; i++) {
                     nodeIdList.push(nodes[i].node_id);
                 }
                // alert("tempEditId:"+tempEditId+" nodeIdList"+nodeIdList);
                 //$("#loading").css('display', 'block');
             var dataStr="{\"ID\":\""+tempEditId+"\","+
                           "\"nodeIdList\":\""+nodeIdList+"\","+
                                             "}";
             var data={"dataJson":dataStr,};
             $.ajax({
                   url:'/DataSourceManager/catalogMetadata',           //该路径在route中定义
                   data:data,
                   //dataType:"JSON",
                   async : false,
                   type:"GET",                     //必须是get类型，POST类型不行
                   traditional: true,
                   success:function(msg){
                        if(msg=="success"){
                            alert("编目元数据成功！");
                            tempEditId=null;
                            $("#modelTree").modal("hide");
                        }else{
                            alert("编目元数据失败！");
                            tempEditId=null;
                            $("#modelTree").modal("hide");
                        }

                   },
                   error:function(){
                         alert("编目元数据失败！");
                         tempEditId=null;
                         $("#modelTree").modal("hide");
                   }
             });
           }
       }

     /* ,catalogDataBase:function(){
                 var deleteList=[];
                 var updateList=[];
                 var zTree = $.fn.zTree.getZTreeObj("addTree2");
                 //获得被选中的树的节点
                 var nodes = zTree.getChangeCheckedNodes();
                 for(var i=0;i<nodes.length;i++){
                     if(nodes[i].checked==false){
                         deleteList.push(nodes[i].node_id);

                     }else{
                         updateList.push(nodes[i].node_id);
                         //alert("update: "+nodes[i].node_id);
                     }
                 }


                 var dataStr="{\"ID\":\""+tempEditId+"\","+
                                            "\"deleteList\":\""+deleteList+"\","+
                                            "\"updateList\":\""+updateList+"\","+
                                                              "}";

                    //ID的key值是要编目的数据库
                  var data={"dataJson":dataStr,};
                  $.ajax({
                        url:'/DataSourceManager/catalogDataBase',           //该路径在route中定义
                        data:data,
                        //dataType:"JSON",
                        async : false,
                        type:"GET",                     //必须是get类型，POST类型不行
                        traditional: true,
                        success:function(msg){
                             if(msg=="success"){
                                 alert("编目元数据成功！");
                                 tempEditId=null;
                                 $("#modelTree2").modal("hide");
                             }else{
                                 alert("编目元数据失败！");
                                 tempEditId=null;
                                 $("#modelTree2").modal("hide");
                             }

                        },
                        error:function(){
                              alert("编目元数据失败！");
                              tempEditId=null;
                              $("#modelTree2").modal("hide");
                        }
                  });

            }*/
			
      ,catalogDataBase:function(){
                 var deleteList=[];
                 var updateList=[];
                 var zTree = $.fn.zTree.getZTreeObj("addTree2");
                 //获得被选中的树的节点
                 var nodes = zTree.getChangeCheckedNodes();
                 for(var i=0;i<nodes.length;i++){
                     if(nodes[i].checked==false){
                         deleteList.push(nodes[i].node_id);

                     }else{
                         updateList.push(nodes[i].node_id);
                         //alert("update: "+nodes[i].node_id);
                     }
                 }


                 var dataStr="{\"ID\":\""+tempEditId+"\","+
                                            "\"deleteList\":\""+deleteList+"\","+
                                            "\"updateList\":\""+updateList+"\","+
                                                              "}";

                    //ID的key值是要编目的数据库
                  var data={"dataJson":dataStr,};
                  $.ajax({
                        url:'/DataSourceManager/catalogDataBase',           //该路径在route中定义
                        data:data,
                        //dataType:"JSON",
                        async : false,
                        type:"GET",                     //必须是get类型，POST类型不行
                        traditional: true,
                        success:function(msg){
                             if(msg=="success"){
                                 alert("编目元数据成功！");
                                 tempEditId=null;
                                 $("#modelTree2").modal("hide");
                             }else{
                                 alert("编目元数据失败！");
                                 tempEditId=null;
                                 $("#modelTree2").modal("hide");
                             }

                        },
                        error:function(){
                              alert("编目元数据失败！");
                              tempEditId=null;
                              $("#modelTree2").modal("hide");
                        }
                  });

            }

     ,catalogTable:function(){

            var deleteList=[];
            var updateList=[];
            var zTree = $.fn.zTree.getZTreeObj("addTree");
            var nodes = zTree.getChangeCheckedNodes();
           // alert("bbb");
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].checked==false){
                    deleteList.push(nodes[i].node_id);
                    //alert("delete: "+nodes[i].node_id);
                }else{
                    updateList.push(nodes[i].node_id);
                   // alert("update: "+nodes[i].node_id);
                }
            }
            var dataStr="{\"ID\":\""+tempEditId+"\","+
                                       "\"deleteList\":\""+deleteList+"\","+
                                       "\"updateList\":\""+updateList+"\","+
                                                         "}";
              var data={"dataJson":dataStr,};
              $.ajax({
                    url:'/DataSourceManager/catalogTable',           //该路径在route中定义
                    data:data,
                    //dataType:"JSON",
                    async : false,
                    type:"GET",                     //必须是get类型，POST类型不行
                    traditional: true,
                    success:function(msg){
                         if(msg=="success"){
                             alert("编目表成功！");
                             tempEditId=null;
                             $("#modelTree").modal("hide");
                         }else{
                             alert("编目表失败！");
                             tempEditId=null;
                             $("#modelTree").modal("hide");
                         }

                    },
                    error:function(){
                          alert("编目表失败！");
                          tempEditId=null;
                          $("#modelTree").modal("hide");
                    }
              });
        //}
     }


     ,catalogColumn:function(){
            var deleteList=[];
            var updateList=[];
            var zTree = $.fn.zTree.getZTreeObj("addTree1");
            var nodes = zTree.getChangeCheckedNodes();
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].checked==false){
                    deleteList.push(nodes[i].node_id);
                    //alert("delete: "+nodes[i].node_id);
                }else{
                    updateList.push(nodes[i].node_id);
                    //alert("update: "+nodes[i].node_id);
                }
            }
            //alert("end");
            var dataStr="{\"ID\":\""+tempEditId+"\","+
                                       "\"deleteList\":\""+deleteList+"\","+
                                       "\"updateList\":\""+updateList+"\","+
                                                         "}";
             var data={"dataJson":dataStr,};
             $.ajax({
                   url:'/DataSourceManager/catalogColumn',           //该路径在route中定义
                   data:data,
                   //dataType:"JSON",
                   async : false,
                   type:"GET",                     //必须是get类型，POST类型不行
                   traditional: true,
                   success:function(msg){
                        if(msg=="success"){
                            alert("编目元数据成功！");
                            tempEditId=null;
                            $("#modelTree2").modal("hide");
                        }else{
                            alert("编目元数据失败！");
                            tempEditId=null;
                            $("#modelTree2").modal("hide");
                        }

                   },
                   error:function(){
                         alert("编目元数据失败！");
                         tempEditId=null;
                         $("#modelTree2").modal("hide");
                   }
             });
     }
     //未使用
     ,deleteDBMD:function (){
                  var ID=[];
                  var ischeck=document.getElementsByName("isChecked");
                  for(i=0;i<ischeck.length;i++){
                      if(ischeck[i].checked==true){
                           var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                           id=node.innerHTML.replace(/\s+/g,"");
                           ID.push(id);
                      }
                  }
                  if(ID.length<=0)
                      {
                          alert("您还没有选择要编目的数据");
                      }
                  else if(ID.length>1){
                          alert("一次只能选择一个要编目的数据");
                  }
                  else{
                             var zTree = $.fn.zTree.getZTreeObj("addTree1");
                             //alert(zTree);
                             var dataStr="{\"ID\":\""+ID[0]+"\","+
                                                                  "}";
                             var data = { "dataJson":dataStr, };
                             $.ajax({
                              url:'/DataSourceManager/selectNodes',           //该路径在route中定义
                              data:data,
                              dataType:"JSON",
                              async : false,
                              type:"GET",
                              success:function(msg){
                                 for(var o in msg){
                                 //alert("dfsf");
                                     var node = zTree.getNodeByParam("node_id",msg[o].node_id);
                                     node.checked = true;
                                     node.checkedOld=true;
                                     zTree.updateNode(node);
                                 }
                                 $("#modelTree1").modal("show");
                                 tempEditId=ID[0];
                              },
                              error:function(){
                                   alert("初始化编目失败！");
                                   tempEditId=null;
                                   $("#modelTree1").modal("hide");
                             }
                         });

                  }
           }

       ,changeTablePage:function(nowPage,size){
             var dataStr = "{\"page\":\""+nowPage+"\","+"\"size\":\""+size+"\"}";
             var data = { "dataJson":dataStr, };
             //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
			 //alert("aaa");
              $.ajax({
               url:'/DataSourceManager/showDataTable',                                                                                    //该路径在route中定义
               data:data,
               dataType:"JSON",
               async : false,
               type:"GET",                                                                                            //必须是get类型，POST类型不行
               success:function(msg)                                                                                 //传回字符串
               {
                  var num=0;
                  $("#property_body").empty();
                  for(var o in msg){
                    //alert("0");
                    debugger;
                      num++;
                      if(msg[o].updatestamp==null){
                            var updatetime="";
                      }else{
                            var date=new Date(msg[o].updatestamp.time);
                            var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                      }
                      if(msg[o].tab_c_name==null) msg[o].tab_c_name="";
                      if(msg[o].keyword==null) msg[o].keyword="";
                      if(msg[o].note==null) msg[o].note="";
                      //alert("num"+num);
                      $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].tab_id+"</td><td>"+msg[o].db_id+"</td><td> "+msg[o].tab_e_name+"</td><td>"+msg[o].tab_c_name+"</td><td>"+msg[o].keyword+"</td><td>"+msg[o].note+"</td><td>"+msg[o].rec_num+"</td><td>"+msg[o].tab_size+"</td><td>"+updatetime+"</td></tr>");

                 }

               },
               error:function(cer){
                    alert("showDataTable错误！");
               }
           });
       }

        //载入检索后符合条件的属性信息
       ,loadSpecificTable:function(){
                 var dbname=$("#dbname").val();
                 var dbcnname=$("#dbcnname").val();
                 var contacts=$("#contacts").val();
                 var company=$("#company").val();
                 var startTime=$("#startTime").val();
                 var endTime=$("#endTime").val();
                 var time_1 = new Date(startTime).getTime();//1的时间戳
                 var time_2 = new Date(endTime).getTime();//2的时间戳
                 if(time_1!=NaN && time_2!=NaN && time_1>time_2){
                     alert("您选择的起始时间晚于截止时间，请重新选择！");
                 }else
                 {
                     var dataStr="{\"dbname\":\""+dbname+"\","+
                                  "\"dbcnname\":\""+dbcnname+"\","+
                                  "\"contacts\":\""+contacts+"\","+
                                  "\"company\":\""+company+"\","+
                                  "\"startTime\":\""+startTime+"\","+
                                  "\"endTime\":\""+endTime+"\","+
                                                                 "}";
                 }
                 var data = { "dataJson":dataStr, };
                 $.ajax({
                       url:'/DataSourceManager/loadSpecificTable',           //该路径在route中定义
                       data:data,
                       dataType:"JSON",
                       async : false,
                       type:"GET",
                       success:function(msg){
                           $("#pagination").empty();
                           $("#pagination").Paging({pagesize:10,count:msg[0].size,toolbar:true,callback:function(page,size,count){
                               DataManage.submit(page,size);
                           }});
                           DataManage.submit(1,10);
                       }
                   });
                 }
        //提交按钮事件
      ,submit:function(nowPage,size){
                var dataStr="{\"page\":\""+nowPage+"\","+
                             "\"size\":\""+size+"\","+
                                                            "}";
                var data = { "dataJson":dataStr, };
                $.ajax({
                    url:'/DataSourceManager/submit',           //该路径在route中定义
                    data:data,
                    dataType:"JSON",
                    async : false,
                    type:"GET",
                    success:function(msg){
                        $("#property_body").empty();
                        for(var o in msg){
                            var date=new Date(msg[o].updatestamp);
                            var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                            if(msg[o].realname=="null") msg[o].realname="";
                            //if(msg[o].deptment=="null") msg[o].deptment="";
                            if(msg[o].dbdesc=="null") msg[o].dbdesc="";
                            if(msg[o].recordnum=="null") msg[o].recordnum="0";
                            $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].id+"</td><td> "+msg[o].dbcnname+"</td><td>"+msg[o].sid+"</td><td>"+""+"</td><td>"+msg[o].tbspace+"</td><td>"+msg[o].tablenum+"</td><td>"+msg[o].recordnum+"</td><td>"+updatetime+"</td><td></td></tr>");
                        }
                    },
                    error:function(cer){
                        alert("提交失败！");
                    }
                });
            //    DataManage.tableNumandrecordNum();//更新表的数量和记录数
      }

     /*,addCharger:function(){
          var data={};
          $.ajax({
                url:'/DataSourceManager/addCharger',           //该路径在route中定义
                data:data,
                dataType:"JSON",
                async : false,
                type:"GET",
                success:function(msg){
                    for(var o in msg){
                        if(msg[o]!=null){
                            $("#manager").append("<option>"+msg[o]+"</option>");
                            $("#charge").append("<option>"+msg[o]+"</option>");
                        }
                    }
                },
                error:function(cer){
                    alert("addCharger出错！")
                }
            });


     }*/



      //此函数没有被调用
      ,tableNumandrecordNum:function(){
            var ischeck=document.getElementsByName("isChecked");
            for(i=0;i<ischeck.length;i++){
                var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                var id=node.innerHTML.replace(/\s+/g,"");
                var dataStr="{\"ID\":\""+id+"\","+
                                                "}";
                var data = { "dataJson":dataStr, };
                $.ajax({
                    url:'/DataSourceManager/gettableNum',           //该路径在route中定义
                    data:data,
                    dataType:"JSON",
                    async : false,
                    type:"GET",
                    success:function(msg){
                        for(var o in msg){
                            var node1= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                            var node2= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                            if(msg[o].tablenum==null) msg[o].tablenum=0;
                            if(msg[o].recordnum==null) msg[o].recordnum=0;
                            node1.innerHTML=msg[o].tablenum;
                            node2.innerHTML=msg[o].recordnum;
                        }
                    }
                });
            }
      }
      ,getCharger:function(){
            var ischeck=document.getElementsByName("isChecked2");
            for(i=0;i<ischeck.length;i++){
                var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                var id=node.innerHTML.replace(/\s+/g,"");
                var dataStr="{\"ID\":\""+id+"\","+
                                                "}";
                var data = { "dataJson":dataStr, };
                $.ajax({
                    url:'/DataSourceManager/getCharger',           //该路径在route中定义
                    data:data,
                    dataType:"JSON",
                    async : false,
                    type:"GET",
                    success:function(msg){
                        for(var o in msg){
                            var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                            node.innerHTML=msg[o].username;
                        }
                    }
                });
            }
      }
      //清空搜索条件
      ,reset:function(){
            $("#dbname").val("");
            $("#dbcnname").val("");
            $("#contacts").val("");
            $("#company").val("");
            $("#startTime").val("");
            $("#endTime").val("");
      }
      ,submitForm:function(){
            //alert("submitForm");
            var tableName=$("#tableName").val();
            var tablecnName=$("#tablecnName").val();
            var startTime=$("#startTime").val();
            var endTime=$("#endTime").val();
            var dict=$("#diction").val();

            var dataStr="{\"tableName\":\""+tableName+"\","+
                         "\"tablecnName\":\""+tablecnName+"\","+
                         "\"startTime\":\""+startTime+"\","+
                         "\"endTime\":\""+endTime+"\","+
                         "\"databaseId\":\""+databaseId+"\","+
                "\"dict\":\""+dict+"\","+
                                                        "}";
            var data = { "dataJson":dataStr, };
            $.ajax({
                url:'/DataSourceManager/submitForm',           //该路径在route中定义
                data:data,
                dataType:"JSON",
                async : false,
                type:"GET",
                success:function(msg){
                    $("#pagination").empty();
                    $("#pagination").Paging({pagesize:10,count:msg[0],toolbar:true,callback:function(page,size,count){
                        DataManage.changeTablePage1(page,size);
                    }});
                    DataManage.changeTablePage1(1,10);

                }
            });
      }

      //表信息页面换页
     ,changeTablePage1:function(nowPage,size){
           var dataStr = "{\"page\":\""+nowPage+"\","+"\"size\":\""+size+"\"}";
           var data = { "dataJson":dataStr, };
           //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
            $.ajax({
             url:'/DataSourceManager/showCheckedTable',                                                                                    //该路径在route中定义
             data:data,
             dataType:"JSON",
             async : false,
             type:"GET",                                                                                            //必须是get类型，POST类型不行
             success:function(msg)                                                                                 //传回字符串
             {
                /* alert("aaaa");
                $("#property_body").empty();
                alert("bbbb");
                for(var o in msg){
                    alert("cccc");
                   // var date=new Date(msg[o].updatestamp.time);
                   // var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                   // if(msg[o].tab_c_name==null) msg[o].tab_c_name="";
                    //if(msg[o].keyword==null) msg[o].keyword="";
                    //if(msg[o].note==null) msg[o].note="";
                    alert("aaaaaaaaaaa");
                    $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].tab_id+"</td><td>"+msg[o].db_id+"</td><td> "+msg[o].tab_e_name+"</td><td>"+msg[o].tab_c_name+"</td><td>"+msg[o].keyword+"</td><td>"+msg[o].note+"</td><td>"+msg[o].rec_num+"</td><td>"+msg[o].tab_size+"</td><td>"+updatetime+"</td></tr>");
*/

                 var num=0;
                 $("#property_body").empty();
                 for(var o in msg){
                     //alert("0");
                     debugger;
                     num++;
                     if(msg[o].updatestamp==null){
                         var updatetime="";
                     }else{
                         var date=new Date(msg[o].updatestamp.time);
                         var updatetime=date.Format("yyyy-MM-dd HH:mm:ss");
                     }
                     if(msg[o].tab_c_name==null) msg[o].tab_c_name="";
                     if(msg[o].keyword==null) msg[o].keyword="";
                     if(msg[o].note==null) msg[o].note="";
                     //alert("num"+num);
                     $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>"+msg[o].tab_id+"</td><td>"+msg[o].db_id+"</td><td> "+msg[o].tab_e_name+"</td><td>"+msg[o].tab_c_name+"</td><td>"+msg[o].keyword+"</td><td>"+msg[o].note+"</td><td>"+msg[o].rec_num+"</td><td>"+msg[o].tab_size+"</td><td>"+updatetime+"</td></tr>");

                 }
               }


         });
     }
      ,resetForm:function(){
            $("#tableName").val("");
            $("#tablecnName").val("");
            $("#startTime").val("");
            $("#endTime").val("");
      }

      ,editTable:function (){
            $("#table_name").val();
            $("#table_cnname").val();
            $("#keyword").val();
            $("#table_desc").val();
            var ischeck=document.getElementsByName("isChecked");
                    var ID=[];
                    for(i=0;i<ischeck.length;i++){
                        if(ischeck[i].checked==true){
                            var node= ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                            var id=node.innerHTML.replace(/\s+/g,"");
                            ID.push(id);
                        }
                    }
                    if(ID.length>1)
                    {
                          alert("一次只能选择一个需要编辑的表");
                    }
                    else if(ID.length<=0)
                    {     alert("您还没有选择要编辑的表");}
                    else{
                          $('#tableModal').modal('show');
                          tempEditId=null;
                          tempEditId=id;
                          DataManage.edit_table(id);
                          }
      }
       ,edit_table:function(id){
                 var dataStr="{\"ID\":\""+id+"\","+
                             "}";
                 var data={"dataJson":dataStr,};
                 $.ajax({
                     url:'/DataSourceManager/edit_table',
                     data:data,
                     dataType:"JSON",
                     async:false,
                     type:"GET",
                     success:function(msg){
                         if(msg[0].tab_e_name==null) msg[0].tab_e_name='';
                         if(msg[0].tab_c_name==null) msg[0].tab_c_name='';
                         if(msg[0].keyword==null) msg[0].keyword='';
                         if(msg[0].note==null) msg[0].note='';
                         $("#table_name").val(msg[0].tab_e_name);
                         $("#table_cnname").val(msg[0].tab_c_name);
                         $("#keyword").val(msg[0].keyword);
                         $("#table_desc").val(msg[0].note);
                     },
                      error:function(){
                           tempEditId=null;
                           alert("error");
                     }
                 });

             }

       ,saveTableChanges:function(){
              var table_name=$("#table_name").val();
              var table_cnname=$("#table_cnname").val();
              var keyword=$("#keyword").val();
              var table_desc=$("#table_desc").val();
         //参数准备工作
              var dataStr = "{\"table_name\":\""+table_name+"\","+
                           "\"table_cnname\":\""+table_cnname+"\","+
                           "\"keyword\":\""+keyword+"\","+
                           "\"table_desc\":\""+table_desc+"\","+
                           "\"ID\":\""+tempEditId+"\","+
                             "}";
              var data = { "dataJson":dataStr, };
             //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
               $.ajax({
                         url:'/DataSourceManager/saveTableChanges',           //该路径在route中定义
                         data:data,
                         //dataType:"JSON",
                         async : false,
                         type:"GET",                     //必须是get类型，POST类型不行
                         success:function(msg){
                               $('#tableModal').modal('hide');


                               alert("保存编辑成功!");
                               DataManage.getDataTable(tempDBId);
                               //DataManage.go(2);
                               // DataManage.changeTablePage(2,10);
                               tempEditId=null;
                         },
                         error:function(){
                           alert("保存编辑失败！");
                           tempEditId=null;
                         }
                     });
         }


      //表格全选
       ,selectall:function(id,checkName){
           //var icheck=document.getElementById("checkboxes");
           var icheck=document.getElementById(id);
           if(icheck.checked==true){
               //$("input[name='isChecked']").each( function() {
               $("input[name="+checkName+"]").each( function() {
                   if(!($(this).prop('checked'))){
                       $(this).prop('checked',true );
                   }
               });
           }
           if(icheck.checked==false){
               $("input[name="+checkName+"]").each( function() {
                   if($(this).prop('checked')){
                       $(this).prop('checked',false);
                   }
               });
           }
       }
      ,checkpassword:function(inputid,info)
       {
           var mypassword=document.getElementById(inputid).value;
           var myDivpassword=document.getElementById(info);
           if(mypassword=="")
           {
               myDivpassword.innerHTML="<font color='red'>× 密码不能为空!</font>";
               return false;
           }
           else
           {
               myDivpassword.innerHTML="<font color='green'>√</font>";
               return true;
           }
       }
       ,checkmanager:function(inputid,info)
       {
           var a=document.getElementById(inputid).value;
           var b=document.getElementById(info);
           if(a=="")
           {
               b.innerHTML="<font color='red'>× 密码不能为空!</font>";
               return false;
           }
           else if(isNaN(a))
           {
               b.innerHTML="<font color='red'>× 请输入数字!</font>";
               return false;
           }
           else
           {
               b.innerHTML="<font color='green'>√</font>";
               return true;
           }
       }
       ,checkdatabase_name:function(inputid,info)
       {
           var a=document.getElementById(inputid).value;
           var b=document.getElementById(info);
           if(a=="")
           {
               b.innerHTML="<font color='red'>× 数据库名称不能为空!</font>";
               return false;
           }
           else
           {
                for(var i=0;i<a.length;i++)
                    {
                        var text=a.charAt(i);
                        if(!(text<=9&&text>=0)&&!(text>='a'&&text<='z')&&!(text>='A'&&text<='Z')&&text!="_")
                        {
                             b.innerHTML="<font color='red'>×必须是数字、字母、下划线！</font>";
                             break;
                        }
                    }
              if(i>=a.length)
                  {
                      b.innerHTML="<font color='green'>√</font>";
                      return true;
                  }
           }
       }
      ,checkdatabase_chinesename:function(inputid,info)
     {
         var a=document.getElementById(inputid).value;
         var b=document.getElementById(info);
         if(a=="")
         {
             b.innerHTML="<font color='red'>× 数据库中文名称不能为空!</font>";
             return false;
         }
         else
         {
             b.innerHTML="<font color='green'>√</font>";
             return true;
         }
     }
     ,checkdatabaseSid:function(inputid,info)
    {
        var a=document.getElementById(inputid).value;
        var b=document.getElementById(info);
        if(a=="")
        {
            b.innerHTML="<font color='red'>× 数据库SID不能为空!</font>";
            return false;
        }
        else
        {
            b.innerHTML="<font color='green'>√</font>";
            return true;
        }
    }
    ,checkIP:function(inputid,info)
     {
         var a=document.getElementById(inputid).value;
         var b=document.getElementById(info);
         var re=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;//正则表达式
         if(a=="")
         {
             b.innerHTML="<font color='red'>× IP不能为空!</font>";
             return false;
         }
         else
         {
            if(re.test(a))
            {
                b.innerHTML="<font color='green'>√</font>";
                return true;
            }
            else
            {
                b.innerHTML="<font color='red'>× 请输入正确的IP！</font>";
                return false;
            }
         }

     }
     ,checkport:function(inputid,info)
       {
           var a=document.getElementById(inputid).value;
           var b=document.getElementById(info);
           if(a=="")
           {
               b.innerHTML="<font color='red'>× 端口号不能为空!</font>";
               return false;
           }
           else
           {
               b.innerHTML="<font color='green'>√</font>";
               return true;
           }
       }
     ,checkusername:function(inputid,info)
       {
           var a=document.getElementById(inputid).value;
           var b=document.getElementById(info);
           if(a=="")
           {
               b.innerHTML="<font color='red'>× 用户名不能为空!</font>";
               return false;
           }
           else
           {
               b.innerHTML="<font color='green'>√</font>";
               return true;
           }
       }
     ,checktablespace:function(inputid,info){
          var a=document.getElementById(inputid).value;
          var b=document.getElementById(info);
          if(a=="")
          {
              b.innerHTML="<font color='red'>× 用户名不能为空!</font>";
              return false;
          }
          else
          {
              b.innerHTML="<font color='green'>√</font>";
              return true;
          }
     }

}

//将date转换成yyyy-MM-dd HH:mm:ss形式
Date.prototype.Format = function (fmt) { //author: meizz from the Internet
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
