var edit_id;
var t_id;
var node_names;

SchemaManageEdit = {

    testdata: []
    ,addresult:[]
    ,Datailtable:[]
    ,Datailinfo:[]
    ,tree:Object
    ,nodecname:[]
    ,nodeename:[]
    ,node_path:[]
    ,cname:[]
    ,dnode_path:[]
    //文件点击配置进入页面显示

    ,edit: function (editid) {
        $(".sidebar-menu li").removeClass("active");
        $(".sidebar-menu .schema").addClass("active");
        var data = {};
        $("#pagination").empty();
        getStringData('/SchemaManager/editSchema', data, function (msg) {
            $(".content-wrapper").html(msg);
            //alert(editid);
            // $("#editid").val(editid);
            $("#editid").val(node_names);
            $("#editid01").text('/public/config/index/' + editid + '.xml');
            $("#editid02").text('/public/config/showDetial/' + editid + '.xml');
            $("#editid03").text('/public/config/result/' + editid + '.xml');
        });
        //alert('fdf'+editid);
        //alert($("#editid").val());
    }
//显示配置页面信息
    ,  show: function () {
        var table = document.getElementById("example1");
        var ischeck = document.getElementsByName("isChecked");
        var flag = false;//标记是否选中记录
        var n = 0;//表示选中记录的数量
        for (i = 0; i < ischeck.length; i++) {
            if (ischeck[i].checked == true) {
                var node = ischeck[i].parentNode.nextSibling;
                edit_id = node.innerHTML;
                //alert(editid);
                var nodename= ischeck[i].parentNode.nextSibling.nextSibling;
                node_names=nodename.innerHTML;
                flag = true;
                break;
            }
        }
        for (i = 0; i < ischeck.length; i++) {
            if (ischeck[i].checked == true) {
                var node = ischeck[i].parentNode.nextSibling;
                var row = node.parentNode.rowIndex;
                n++;
            }
        }
        if (flag == false) {
            alert("请选择");
        }
        if (n != 1 && flag == true) {
            alert("只能选择一个");
            var icheck = document.getElementById("checkboxes");
            if (icheck.checked == true) {
                icheck.checked = false;
            }
            $("input[name='isChecked']").each(function () {
                if ($(this).prop('checked')) {
                    $(this).prop('checked', false);
                }
            });
        }
        if (flag == true && n == 1) {
            SchemaManageEdit.edit(edit_id);
            /*
            $("#editModal").modal('show');
            var row=node.parentNode.rowIndex;
            var x=table.rows[row].cells;
            var chname=x[5].innerHTML;
            var  note=x[6].innerHTML;
            var id=node.innerHTML;
            console.log(chname,note,id);
            $("input[name='typeahead_example_modal_1']").val(id);
            */
            //document.getElementById("typeahead_example_modal_2").value=chname;
            //document.getElementById("typeahead_example_modal_3").value=note;
        }
    }
    //树状图展示
    , showtree: function () {
        var data = {};
        var Pid = edit_id;
        var url = '/SchemaManager/test/' + Pid + "";
        $("#treeModal").modal('show');
        $("#treeModal").draggable();
        $.ajax({
            url: url,
            async: true,
            data: data,
            dataType: "JSON",
            type: "GET",
            success: function (msg) {
                SchemaManageEdit.tree = $.fn.zTree.init($("#treetextarea"), setting, msg);
            }
            , error: function (msg) {
                console.log("错误！");
            }
        });

    }
    //可查询属性项index配置
    , showconfig: function () {
        var data = {};
        var Pid = edit_id;
        //alert(Sid);
        var url = '/SchemaManager/config/' + Pid + "";
        $("#indexModal").modal('show');
        $.ajax({
            url: url,
            data: data,
            dataType: "JSON",
            async: true,
            type: "GET",
            success: function (msg) {
                SchemaManageEdit.testdata = msg;
                SchemaManageEdit.configtable();
                // if(msg=="ok")
                // console.log("成功！");
            }
            , error: function (msg) {
                console.log("失败!");
            }
        });
    }
    //index模态框内容展示
    , configtable: function () {
        $("#testbody").empty();
        console.log("SchemaManageEdit.testdata:"+SchemaManageEdit.testdata);//打印所有index配置文件里内容
        for (var j = 0; j < SchemaManageEdit.testdata.length; j++) {
            $("#testbody").append("<tr><td><input type='checkbox' name='isChecked'/></td><td>" +
                SchemaManageEdit.testdata[j].indexName + "</td><td>" +
                SchemaManageEdit.testdata[j].showName + "</td><td>" +
                "<select  style=\"width:50px\"><option selected=\"selected\">" + SchemaManageEdit.testdata[j].type + "</option><option>0:快视图</option><option>1:String</option><option>2:integer</option><option>3:double</option><option>4:data</option></select></td><td>" +
                "<select  style=\"width:50px\"><option selected=\"selected\">" + SchemaManageEdit.testdata[j].analyzed + "</option><option>0:不分词</option><option>1:分词</option></select></td><td>" +
                SchemaManageEdit.testdata[j].path + "</td></tr>");
            $("#testbody").on("click", "tr", function () {
                var input = $(this).find("input");
                //alert($(input).prop("checked"));
                if (!$(input).prop("checked")) {
                    $(input).prop("checked",true);
                }else{
                    $(input).prop("checked",false);
                }
            });
            //多选框 防止事件冒泡
            $("#testbody").on("click", "input", function (event) {
                event.stopImmediatePropagation();
            });
        }
    }
    //result配置
    , showresult: function () {
        var data = {};
        var Pid = edit_id;
        //alert(Rid);
        var url = '/SchemaManager/result/' + Pid + "";
        $("#resultModal").modal('show');
        $.ajax({
            url: url,
            data: data,
            dataType: "JSON",
            async: true,
            type: "GET",
            success: function (msg) {
                SchemaManageEdit.resultdata = msg;
                SchemaManageEdit.resulttable();
                // if(msg=="ok")
                // console.log("成功！");
            }
            , error: function (msg) {
                console.log("失败!");
            }
        });
    }
    //result配置时获取index当前文件内容
    , indexforresult:function(){
        var data = {};
        var Pid = edit_id;
        var url = '/SchemaManager/config/' + Pid + "";
        $.ajax({
            url: url,
            data: data,
            dataType: "JSON",
            async: true,
            type: "GET",
            success: function (msg) {
                SchemaManageEdit.testdata = msg;
            }
            , error: function (msg) {
                console.log("失败!");
            }
        });
    }
    //result配置显示
    , resulttable: function () {
        $("#resulttb").empty();
        SchemaManageEdit.indexforresult();
        for (var j = 0; j < SchemaManageEdit.resultdata.length; j++) {

            var flag=false;
            for(var i=0;i<SchemaManageEdit.testdata.length;i++){
                if(SchemaManageEdit.testdata[i].indexName==SchemaManageEdit.resultdata[j].indexName){
                    //console.log(SchemaManageEdit.resultdata[j].indexName+":true");
                    flag=true;
                    break;
                }
            }
            if(flag==true){
                // if(confirm("有多余项，是否删除")){
                //     //console.log(SchemaManageEdit.resultdata[j].indexName);
                //     SchemaManageEdit.resultdata.splice(j,1);
                // }else {
                //
                // }
                $("#resulttb").append("<tr><td><input type='checkbox' name='isChecked'/></td><td>" +
                    SchemaManageEdit.resultdata[j].indexName + "</td><td>" +
                    SchemaManageEdit.resultdata[j].showName + "</td><td>" +
                    "<select  style=\"width:50px\"><option selected=\"selected\">" + SchemaManageEdit.resultdata[j].type + "</option><option>0:快视图</option><option>1:String</option><option>2:integer</option><option>3:double</option><option>4:data</option></select></td><td>");
            }

        }
    }
    //index下载文件
    , indexdown: function (dnumber) {

        var data = {};
        var Pid =  dnumber+edit_id;
        var url = '/SchemaManager/Editdownload/' + Pid + "";
        //alert(Pid);
        //alert(url);

        $.ajax({
            url: url,
            data: data,
            async: false,
            type: "GET",
            success: function (msg) {
                //alert(yes);
                window.open(url, '_blank');
            },
            error: function (msg) {
                alert("文件不存在");
            }
        });


    }
 // showdetail配置文件的展示
    , showdetail:function () {
        $("#detailModal").modal('show');
        var data={};
        var Pid = edit_id;
        var url='/SchemaManager/detailtable/'+ Pid + "";
        $.ajax({
            url:url,
            data:data,
            dataType:"JSON",
            async : true,
            type:"GET",
            success:function (msg) {
                SchemaManageEdit.Datailtable=msg;
                SchemaManageEdit.detailtable();
                // if(msg=="ok")
                // console.log("成功！");
            }
            ,error:function (msg) {
                console.log("失败!");
            }
        });
    }
    // showdetail中的tab页
    ,detailtable:function () {
        $("#tabname").empty();
        for(var i=0;i<SchemaManageEdit.Datailtable.length;i++){
            if(i==0)
                $("#tabname").append("<li style=\"width: "+100/SchemaManageEdit.Datailtable.length+"%\" " +
                    "class=\"active\"><a href=\"#tab_"+SchemaManageEdit.Datailtable[i].id+"\" data-toggle=\"tab\" " +
                    "aria-expanded=\"false\"><i class=\"fa fa-fw fa-minus\" " +
                    "onclick=\"SchemaManageEdit.deletetable("+SchemaManageEdit.Datailtable[i].id+")\"></i>"+SchemaManageEdit.Datailtable[i].tablename+"</a></li>")
            else
                $("#tabname").append("<li style=\"width: "+100/SchemaManageEdit.Datailtable.length+"%\" " +
                    "class=\"\"><a href=\"#tab_"+SchemaManageEdit.Datailtable[i].id+"\" data-toggle=\"tab\" " +
                    "aria-expanded=\"false\"><i class=\"fa fa-fw fa-minus\" " +
                    "onclick=\"SchemaManageEdit.deletetable("+SchemaManageEdit.Datailtable[i].id+")\"></i>"+SchemaManageEdit.Datailtable[i].tablename+"</a></li>")

        }
        SchemaManageEdit.detail();
    }
    // showdetail中tab页的内容展示
    ,detail:function () {
        var data={};
        var Pid = edit_id;
        var url='/SchemaManager/detailinfo/'+ Pid + "";
        $.ajax({
            url:url,
            data:data,
            dataType:"JSON",
            async : true,
            type:"GET",
            success:function (msg) {
                SchemaManageEdit.Datailinfo=msg;
                SchemaManageEdit.detailinfo();
                // if(msg=="ok")
                // console.log("成功！");
            }
            ,error:function (msg) {
                console.log("失败!");
            }
        });
    }
    // showdetail中tab页的表格框架
    ,detailinfo:function(){
        $("#table").empty();
        var Datailtable=SchemaManageEdit.Datailtable;
        var Datailinfo=SchemaManageEdit.Datailinfo;
        console.log("Datailtable:"+Datailtable);
        console.log("Datailinfo:"+Datailinfo);
        for(var i=0;i<Datailtable.length;i++){
            $("#table").append(SchemaManageEdit.creatTables(Datailtable[i].id));
        }
        SchemaManageEdit.tablesDetail();
        }
    ,creatTables:function(id){
        var tabframe="<div class=\" tab-pane "+(id==0? "active":"") +"\"  id=\"tab_"+id+"\">";
        tabframe+="<table id=\"table_"+id+"\" class=\"table table-bordered table-striped dataTable\" style=\"width:100%;float: left\">\n";
        tabframe+= "<thead style=\"font-size: 14px; background-color: #488AC6; color: white\">"+"<td><input type='checkbox' name='isChecked'/></td><td style='width: 60px'>显示顺序</td><td  style=\"display:none\">tableid</td><td>类型</td><td style=\"width:160px\">名称</td><td>路径</td></thead>";
        tabframe+="<tbody id=\"tbody_"+id+"\"></tbody></table>\n";
        tabframe+="<button type=\"button\" class=\"btn btn-default\" onclick=\"SchemaManageEdit.treefordetail("+id+")\">"+"<i class=\"fa fa-fw fa-plus\" ></i>增加</button>&nbsp";
        tabframe+="<button type=\"button\" class=\"btn btn-default\" onclick=\"SchemaManageEdit.deldetai("+id+")\">"+"<i class=\"fa fa-fw fa-minus\"></i>删除</button>&nbsp";
        tabframe+="<button type=\"button\" class=\"btn btn-default\" onclick=\"SchemaManageEdit.moveUp("+id+")\">"+"<i class=\"fa fa-fw fa-minus\"></i>上移</button>&nbsp";
        tabframe+="<button type=\"button\" class=\"btn btn-default\" onclick=\"SchemaManageEdit.moveDown("+id+")\">"+"<i class=\"fa fa-fw fa-minus\"></i>下移</button>"+"</div>"
        return tabframe;
    }
    //table详情内容
    ,tablesDetail:function(){
        var Datailtable=SchemaManageEdit.Datailtable;
        var Datailinfo=SchemaManageEdit.Datailinfo;
        for(var i=0;i<Datailtable.length;i++){
            var dom=$("#tbody_"+Datailtable[i].id);
            dom.empty();
            console.log("配置文件信息条数："+Datailinfo.length);
            for(var j=0;j<Datailinfo.length;j++) {
                if(Datailtable[i].id==Datailinfo[j].tableid) {
                    // console.log("Datailinfo[j].type:"+Datailinfo[j].type);
                    Datailinfo[j].path= Datailinfo[j].path.replace(/\./g,'/');
                    dom.append("<tr id=\"select_checkes\" multiple=\"multiple\">" +
                        "<td><input type='checkbox'  name=\"check_" + Datailtable[i].id + "\"/></td>" +
                        "<td>"+Datailinfo[j].showid+"</td>" +
                        "<td style=\"display:none\"><input type=\"text\" style=\"width:40px;display:none\" disabled value=\""+Datailinfo[j].tableid+"\"></td>" +
                        "<td>" +
                        "<select  style=\"width:50px\"><option selected=\"selected\">" +  Datailinfo[j].type + "</option><option>0:普通</option><option>1:属性</option><option>2:空间</option></select></td>" +
                        "<td>" + Datailinfo[j].name + "</td>" +
                        "<td>" + Datailinfo[j].path + "</td>" +
                        "</tr>");

                }
                    }
            $("#tbody_"+Datailtable[i].id).on("click", "tr", function () {
                var input = $(this).find("input");
                //alert($(input).prop("checked"));
                if (!$(input).prop("checked")) {
                    $(input).prop("checked",true);
                }else{
                    $(input).prop("checked",false);
                }
            });
            //多选框 防止事件冒泡
            $("#tbody_"+Datailtable[i].id).on("click", "input", function (event) {
                event.stopImmediatePropagation();
            });
        }
    }
    //上移代码
    ,moveUp:function(tbody_id){
        // var trd=document.getElementById("select_checkes");
        var tbody1=document.getElementById("tbody_"+tbody_id);
        var ischeck=document.getElementsByName("check_"+tbody_id);
        var trs = tbody1.children;
        // console.log(trd);
        var flag=false;
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                flag=true;break;
            }
        }
        if(flag==true){
            for(var i=2;i<trs.length;i++) {   //最上面的一个不需要移动，所以直接从i=1开始
                if(ischeck[i].checked==true){
                    // console.log(ischeck[i].checked);
                    if (!ischeck[i-1].checked) {
                        var selShowid=trs[i].cells[1].innerHTML;
                        console.log("selShowid:"+selShowid);
                        trs[i].cells[1].innerHTML=trs[i-1].cells[1].innerHTML;
                        trs[i-1].cells[1].innerHTML=selShowid;
                        var selValue = trs[i].innerHTML;
                        // txt = $(trs[i]).find('td:eq(1)').innerHTML;
                        trs[i].innerHTML= trs[i-1].innerHTML;
                        ischeck[i].checked = false;
                        trs[i-1].innerHTML= selValue;
                        ischeck[i-1].checked=true;

                }
            }
         }
       }
        else {
            alert("请选择！");
        }
    }
    //下移代码
    ,moveDown:function(tbody_id) {
        var tbody1=document.getElementById("tbody_"+tbody_id);
        var ischeck=document.getElementsByName("check_"+tbody_id);
        var trs = tbody1.children;
        console.log(trs);
        var flag=false;
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                flag=true;break;
            }
        }
        if(flag==true){
            for(var i=trs.length-2;i>=1;i--) {   //最上面的一个不需要移动，所以直接从i=1开始
                if(ischeck[i].checked==true){
                    // console.log(ischeck[i].checked);
                    if (!ischeck[i+1].checked) {
                        var selShowid=trs[i].cells[1].innerHTML;
                        console.log("selShowid:"+selShowid);
                        trs[i].cells[1].innerHTML=trs[i+1].cells[1].innerHTML;
                        trs[i+1].cells[1].innerHTML=selShowid;
                        var selValue = trs[i].innerHTML;
                        trs[i].innerHTML= trs[i+1].innerHTML;
                        ischeck[i].checked = false;
                        trs[i+1].innerHTML= selValue;
                        ischeck[i+1].checked=true;
                    }
                }
            }
        }
        else {
            alert("请选择！");
        }
    }
    // result配置增加表项
    ,addres:function(){
        var data = {};
        var Pid = edit_id;
        var url = '/SchemaManager/config/' + Pid + "";
        $("#addresModal").modal('show');
        $.ajax({
            url: url,
            data: data,
            dataType: "JSON",
            async: true,
            type: "GET",
            success: function (msg) {
                SchemaManageEdit.addresult = msg;
                SchemaManageEdit.resultadd();
            }
            , error: function (msg) {
                console.log("失败!");
            }
        });
    }
    // result配置文件增加表项时读取index文件
    ,resultadd:function () {
        $("#addbody").empty();
        var table = document.getElementById("restable");

        for (var j = 0; j < SchemaManageEdit.addresult.length; j++) {
            var flag=false;
            for(var i=1;i<table.rows.length;i++){
                if(table.rows[i].cells[1].innerHTML==SchemaManageEdit.addresult[j].indexName){
                    flag=true;
                    break;
                }
            }
            if(flag){
                $("#addbody").append("<tr><td><input type='checkbox' name='Checked' disabled=\"disabled\"  /></td><td>" +
                SchemaManageEdit.addresult[j].indexName + "</td><td>" +
                SchemaManageEdit.addresult[j].showName + "</td><td>" + SchemaManageEdit.addresult[j].type + "</td><td>");
            }else {
                $("#addbody").append("<tr><td><input type='checkbox' name='Checked'  /></td><td>" +
                    SchemaManageEdit.addresult[j].indexName + "</td><td>" +
                    SchemaManageEdit.addresult[j].showName + "</td><td>" + SchemaManageEdit.addresult[j].type + "</td><td>");
            }
        }
    }
    // result配置增加表项
    ,restbadd:function(){
        var check=document.getElementsByName("Checked");
        for(var i=0;i<check.length;i++) {
            if(check[i].checked==true){
                // $("#resulttb").append("<tr><td><input type='checkbox' name='isChecked'/></td><td>" +
                //     SchemaManageEdit.addresult[i].indexName + "</td><td>" +
                //     SchemaManageEdit.addresult[i].showName + "</td><td>" +
                //     "<select  style=\"width:50px\"><option selected=\"selected\">" + SchemaManageEdit.addresult[i].type + "</option><option>0:快视图</option><option>1:String</option><option>2:integer</option><option>3:double</option><option>4:data</option></select></td><td>");
                var result = new Object();
                result.indexName=SchemaManageEdit.addresult[i].indexName;
                result.showName=  SchemaManageEdit.addresult[i].showName;
                result.type= SchemaManageEdit.addresult[i].type;
                SchemaManageEdit.resultdata.push(result);
            }
        }
        $("#addresModal").modal('hide');
        SchemaManageEdit.resulttable();
    }
    // index配置树节点的勾选，获取节点
     ,choosenode:function(){
        var nodes=SchemaManageEdit.tree.getCheckedNodes(true);
        if(nodes.length==0){
            alert("您还未选择节点");
        } else {
           // var nodepath = [];
            var path = "";
            for (var i = 0; i < nodes.length; i++) {
                var halfCheck = nodes[i].getCheckStatus();
                if(!halfCheck.half){
                    var resultnode = new Object();
                    resultnode.indexName=nodes[i].node_ename;
                    resultnode.showName=nodes[i].node_cname;
                    resultnode.type="";
                    resultnode.analyzed="";
                    for(var j=0;j<nodes[i].getPath().length;j++){
                        path=path+"/"+nodes[i].getPath()[j].node_ename;
                    }
                    resultnode.path=path;
                    path="";
                    // SchemaManageEdit.nodecname.push(nodes[i].node_cname);
                    // SchemaManageEdit.nodeename.push(nodes[i].node_ename);
                    // nodepath.push(nodes[i].getPath());
                    SchemaManageEdit.testdata.push(resultnode);
                }
            }
            // for(var k=0;k<nodepath.length;k++){
            //     for(var j=0;j<nodepath[k].length;j++){
            //         path=path+"/"+nodepath[k][j].node_ename;
            //     }
            //     SchemaManageEdit.node_path.push(path);
            //     path="";
            // }
            // nodepath.splice(0,nodepath.length);
            $("#treeModal").modal('hide');
            //SchemaManageEdit.addinfo();
            SchemaManageEdit.configtable();
        }

    }
    // 将勾选的节点展示在index表格中
    // ,addinfo:function () {
    //      for(var i=0;i<SchemaManageEdit.nodeename.length;i++){
    //          $("#testbody").append("<tr><td><input type='checkbox' name='isChecked'/></td><td>" +
    //              SchemaManageEdit.nodeename[i] + "</td><td>" +
    //              SchemaManageEdit.nodecname[i] + "</td><td>" +
    //              "<select  style=\"width:50px\"><option selected=\"selected\">" + "</option><option>0:快视图</option><option>1:String</option><option>2:integer</option><option>3:double</option><option>4:data</option></select></td><td>" +
    //              "<select  style=\"width:50px\"><option selected=\"selected\">" + "</option><option>0:不分词</option><option>1:分词</option></select></td><td>" +
    //              SchemaManageEdit.node_path[i] + "</td></tr>");
    //      }
    //     SchemaManageEdit.nodeename.splice(0,SchemaManageEdit.nodeename.length);
    //     SchemaManageEdit.nodecname.splice(0,SchemaManageEdit.nodeename.length);
    //     SchemaManageEdit.node_path.splice(0,SchemaManageEdit.nodeename.length);
    // }
    //showdetail详情页信息增加时读取空白配置文件
    , treefordetail: function (table_id) {
        var data = {};
        var Pid = edit_id;
        t_id = table_id;
        var url = '/SchemaManager/test/' + Pid + "";
        $("#treeModal2").modal('show');
        $("#treeModal2").draggable();
        $.ajax({
            url: url,
            async: true,
            data: data,
            dataType: "JSON",
            type: "GET",
            success: function (msg) {
                SchemaManageEdit.tree = $.fn.zTree.init($("#treearea"), setting, msg);
            }
            , error: function (msg) {
                console.log("错误！");
            }
        });


    }
    // showdetail勾选节点
    , detailnode: function () {
        var nodes=SchemaManageEdit.tree.getCheckedNodes(true);
        console.log("nodes:"+nodes);
        if(nodes.length==0){
            alert("您还未选择节点");
        } else {
            var dnodepath = [];
            var path = "";
            for (var i = 0; i < nodes.length; i++) {
                var halfCheck = nodes[i].getCheckStatus();
                if(!halfCheck.half){
                    SchemaManageEdit.cname.push(nodes[i].node_cname);
                    dnodepath.push(nodes[i].getPath());
                    console.log("dnodepath:"+dnodepath);
                    console.log("dnodepath长度:"+dnodepath.length);
                }
            }
            for(var k=0;k<dnodepath.length;k++){
                for(var j=0;j<dnodepath[k].length;j++){
                        path+=dnodepath[k][j].node_ename+".";
                        console.log("path长度:"+path.length);
                }
                if (path.length > 0) {
                    path = path.substr(0, path.length - 1);
                }
                SchemaManageEdit.dnode_path.push(path);
                path="";
            }
            dnodepath.splice(0,dnodepath.length);
            $("#treeModal2").modal('hide');
            SchemaManageEdit.detailadd(t_id);
        }

    }
    // showdetail配置文件增加时，将勾选节点显示在表格中
    ,detailadd:function(tbody_id){
        var dom=$("#tbody_"+tbody_id);
        var tbody1=document.getElementById("tbody_"+tbody_id);
        var trs = tbody1.children.length;
        console.log("增加项目："+SchemaManageEdit);
        for(var i=0;i<SchemaManageEdit.cname.length;i++) {
            SchemaManageEdit.dnode_path[i]= SchemaManageEdit.dnode_path[i].replace(/\./g,'/');
            dom.append("<tr><td><input type='checkbox' name=\"check_"+tbody_id+"\"/></td>" +
                //设置最大显示顺序
                "<td>"+(trs+i)+"</td>" +
                "<td style=\"display:none\"><input type=\"text\" style=\"width:40px;display:none\" disabled value=\""+tbody_id+"\"></td>" +
                "<td>" +
                "<select  style=\"width:50px\"><option selected=\"selected\">" + SchemaManageEdit.Datailinfo[i].type + "</option><option>0:普通</option><option>1:属性</option><option>2:空间</option></select></td>"+
                "<td>" + SchemaManageEdit.cname[i] + "</td>" +
                "<td>" + SchemaManageEdit.dnode_path[i] + "</td></tr>");
            console.log("tbody_id"+tbody_id);
        }
        SchemaManageEdit.cname.splice(0,SchemaManageEdit.cname.length);
        SchemaManageEdit.dnode_path.splice(0,SchemaManageEdit.dnode_path.length);
    }
    // showdetai增加表
    ,addtable:function () {
        var detailtable = new Object();
        var name=$("input[name='addtable']").val();
        var tableid;
        var max=0;
        if(name==""){
            $("#help-blocks").html("表名不能为空").css({color:"red"});
        }
        else {
            for (var i = 0; i < SchemaManageEdit.Datailtable.length; i++) {
                if (SchemaManageEdit.Datailtable[i].id > max)
                    max = SchemaManageEdit.Datailtable[i].id;
            }

            tableid = Number(max) + 1;
            detailtable.id = tableid;
            detailtable.tablename = name;

            SchemaManageEdit.Datailtable.push(detailtable);
            SchemaManageEdit.detailtable();
        }
    }
    // showdetail删除表
    ,deletetable:function (table_id) {
        var tableid=table_id;
        //添加if判断别表内容是否为空
        if(confirm("您确定要删除吗？")==true){
        for(var i=0;i<SchemaManageEdit.Datailtable.length;i++){
            console.log("SchemaManageEdit.Datailtable.length:"+SchemaManageEdit.Datailtable.length);
            console.log("SchemaManageEdit.Datailtable[0].innerHTML:"+SchemaManageEdit.Datailtable[0]);
            if(SchemaManageEdit.Datailtable[i].id==tableid) {
                        SchemaManageEdit.Datailtable.splice(i, 1);
                        break;
                    }
                }
        }
        SchemaManageEdit.detailtable();
    }
    // showdetail配置文件的删除
    ,deldetai:function (tbody_id) {
        var table1=document.getElementById("table_"+tbody_id);
        var ischeck=document.getElementsByName("check_"+tbody_id);
        var flag=false;
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                flag=true;break;
            }
        }
        if(flag==true){
            if(confirm("您确定要删除吗？")==true){
                for(var i=0;i<ischeck.length;i++){
                    if(ischeck[i].checked==true){
                        console.log(i);
                        table1.deleteRow(i+1);
                        i=i-1;
                    }
                }
            }
        }
        else {
            alert("请选择！");
        }
    }
    // index删除
    ,deleteinfo:function () {
        var table=document.getElementById("testtb");
        var ischeck=document.getElementsByName("isChecked");
        var flag=false;
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                flag=true;break;
            }
        }
        if(flag==true){
            if(confirm("您确定要删除吗？")==true){
                for(var i=0;i<ischeck.length;i++){
                    if(ischeck[i].checked==true){
                        table.deleteRow(i+1);
                        i=i-1;
                    }
                }
            }
    }
    else {
            alert("请选择！");
        }
    }
    //result删除
    ,delresult:function(){
        var table=document.getElementById("restable");
        var ischeck=document.getElementsByName("isChecked");
        var flag=false;
        for(var i=0;i<ischeck.length;i++){
            if(ischeck[i].checked==true){
                flag=true;break;
            }
        }
        if(flag==true){
            if(confirm("您确定要删除吗？")==true){
                for(var i=0;i<ischeck.length;i++){
                    if(ischeck[i].checked==true){
                        table.deleteRow(i+1);
                        i=i-1;
                    }
                }
            }
        }
        else {
            alert("请选择！");
        }
    }
    //index文件的生成
    ,indexxml:function () {
        var table = document.getElementById("testtb");
        var tbdata="";
        var jsondata = [];
        var Pid = edit_id;
        for(var i=1;i<table.rows.length;i++){
            var indexname=table.rows[i].cells[1].innerHTML;
            var showname=table.rows[i].cells[2].innerHTML;
            var type=table.rows[i].cells[3].children[0].value.substr(0,1);
            var analyzed=table.rows[i].cells[4].children[0].value.substr(0,1);
            var path=table.rows[i].cells[5].innerHTML;
            tbdata = "{\"indexName\":\""+indexname+"\","+"\"showName\":\""+showname+"\","+"\"type\":\""+type+"\","+"\"analyzed\":\""+analyzed+"\","+"\"path\":\""+path+"\"}";
            jsondata.push(tbdata);
        }
        var data={"dataJson":"["+jsondata+"]","id":Pid};
        jsondata.splice(0,jsondata.length);
        $.ajax({
            url:'/SchemaManager/xmlindex',
            data:data,
            dataType:"JSON",
            traditional: true,
            async : true,
            type:"GET",
            success:function(msg){    //成功时执行函数
                if(msg=="ok")
               console.log("成功生成xml文件");
            },
            error:function (msg) {
                console.log(msg);
            }
        })
        $("#indexModal").modal('hide');
    }
    // result文件的生成
    ,resultxml:function () {
        var table = document.getElementById("restable");
        var resdata="";
        var result=[];
        var Pid = edit_id;
        for(var i=1;i<table.rows.length;i++){
            var indexname=table.rows[i].cells[1].innerHTML;
            var showname=table.rows[i].cells[2].innerHTML;
            var type=table.rows[i].cells[3].children[0].value.substr(0,1);
            resdata = "{\"indexName\":\""+indexname+"\","+"\"showName\":\""+showname+"\","+"\"type\":\""+type+"\"}";
            result.push(resdata);
        }
        var data={"dataJson":"["+result+"]","id":Pid};
        result.splice(0,result.length);
        $.ajax({
            url:'/SchemaManager/xmlresult',
            data:data,
            dataType:"JSON",
            traditional: true,
            async : true,
            type:"GET",
            success:function(msg){    //成功时执行函数
                if(msg=="ok")
                 console.log("成功生成xml文件");
            },
            error:function (msg) {
                console.log(msg);
            }

        })
        $("#resultModal").modal('hide');
    }
    //showdetail文件的生成
    ,detailxml:function () {
        var Pid = edit_id;
        var table = [];
        var tbody = [];
        var detailtab="";
        var detailtbody;
        console.log("SchemaManageEdit.Datailtable.length:"+SchemaManageEdit.Datailtable.length);
        for(var i=0;i<SchemaManageEdit.Datailtable.length;i++){
            var id=SchemaManageEdit.Datailtable[i].id;
            var tabname=SchemaManageEdit.Datailtable[i].tablename;
            detailtab = "{\"tabid\":\""+id+"\","+"\"tabname\":\""+tabname+"\"}";
            table.push(detailtab)
            console.log("table:"+table);
            var detailtable = document.getElementById("table_"+SchemaManageEdit.Datailtable[i].id);
            for(var j=1;j<detailtable.rows.length;j++){
                var showid=detailtable.rows[j].cells[1].innerHTML;
                var tableid=detailtable.rows[j].cells[2].children[0].value;
                var type=detailtable.rows[j].cells[3].children[0].value.substr(0,1);
                // var type=table.rows[i].cells[3].children[0].value.substr(0,1);
                var showname=detailtable.rows[j].cells[4].innerHTML;
                var path=detailtable.rows[j].cells[5].innerHTML;
                path= path.replace(/\//g,'.');
                detailtbody = "{\"showid\":\""+showid+"\","+"\"tableid\":\""+tableid+"\","+"\"type\":\""+type+"\","+"\"showname\":\""+showname+"\","+"\"path\":\""+path+"\"}";
                tbody.push(detailtbody);
                // console.log("tbody:"+tbody);
            }
        }
        var data={"tabledata":"["+table+"]","tbodydata":"["+tbody+"]","id":Pid};
        console.log("data1111111111111:"+table);
        table.splice(0,table.length);
        tbody.splice(0,tbody.length);
        $.ajax({
            url:'/SchemaManager/xmldetail',
            data:data,
            dataType:"JSON",
            traditional: true,
            async : true,
            type:"GET",
            success:function(msg){    //成功时执行函数
                console.log("cg");
                if(msg=="ok")
                    console.log("成功生成xml文件");
                alert("成功生成xml文件");
            },
            error:function (msg) {
                console.log("sb");
                console.log(msg);
            }
        })
        $("#detailModal").modal('hide');
    }
}