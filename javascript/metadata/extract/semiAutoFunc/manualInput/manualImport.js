/**
 Created by 马族隆, 2020/5/26
 元数据的手动填报
 */

ManualImport = {
    //全局变量
    zTreeObj: Object,
    zTreeObj1:Object,

    load: function () {
        //------- 以下代码为所有模块 load 函数必须添加的内容  --------------------------------
        // CatalogPage.pageLeave();  //提示保存资源目录管理页面中未保存的编辑状态
        $(".sidebar-menu .treeview-menu li").removeClass("active");  //清空框架菜单栏的状态
        $(".sidebar-menu .manualImport").addClass("active");  //点亮当前页面的菜单项
        $("#pagination").empty();  //清空框架内置分页器
        $("#text1").empty();       //清空框架内容结果数据显示器
        //--------------- 默认代码至此结束 ------------------------------------------------

        var data = {};
        getStringData('/manualImport', data, function (msg){
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
            //加载资源树
            var aJson = {};
            getDataByGet("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                $.fn.zTree.init($("#tree"), setting, dataStr);
                $.fn.zTree.init($("#tree1"), setting, dataStr);
            });
        });
    }
    //根据选择的类型，提供对应的表单
    ,selectTable:function (v){
        if(v == -1){
            $(".selectType").hide();
            $(".selectType1").hide();
        }else if(v ==1){
            $(".selectType1").hide();
            $(".selectType").show();
        }else if(v ==2){
            $(".selectType").hide();
            $(".selectType1").show();
        }
    }

//    根据选择的分类，提供对应的表单
    ,selectType:function (v){
        switch(v) {
            case "-1":
                $(".selectRES").hide();
                $(".selectST").hide();
                $(".selectPERS").hide();
                $(".selectAD").hide();
                $(".selectHYST").hide();
                break;
            case "450":
                $(".selectRES").show();
                $(".selectST").hide();
                $(".selectPERS").hide();
                $(".selectAD").hide();
                $(".selectHYST").hide();
                break;
            case "435":
                $(".selectRES").hide();
                $(".selectST").show();
                $(".selectPERS").hide();
                $(".selectAD").hide();
                $(".selectHYST").hide();
                break;
            case "457":
                $(".selectRES").hide();
                $(".selectST").hide();
                $(".selectPERS").show();
                $(".selectAD").hide();
                $(".selectHYST").hide();
                break;
            case "481":
                $(".selectRES").hide();
                $(".selectST").hide();
                $(".selectPERS").hide();
                $(".selectAD").show();
                $(".selectHYST").hide();
                break;
            case "439":
                $(".selectRES").hide();
                $(".selectST").hide();
                $(".selectPERS").hide();
                $(".selectAD").hide();
                $(".selectHYST").show();
                break;
        }
    }
    ,upload1:function () {
        var data = $('form').serializeArray();
//        console.log(data);
//        console.log(typeof(data));

        var obj = {};
        $.each(data,function(i,v){
            obj[v.name] = v.value;
        });
//        console.log(obj);
//        console.log(typeof(obj));

        var data1 =JSON.stringify(obj);
//        console.log(data1);
//        console.log(typeof(data1));

        var data2 = {"dataJson":data1};

        $.ajax({
            url:'/metadataImport/XML2Db',
            data:data2,
            //dataType:"JSON",
            async : false,
            type:"GET",
            success:function(msg){
                console.log(msg);
                alert("导入成功");
            },
            error:function(msg){
                console.log(msg);
                alert("导入失败");
            }
        });
        return;
    }



//显示模态框
    , showModal: function () {

        $("#updatedd").attr("disabled","disabled");
        $("#treeModal").modal("show");

    }




//编目
    //0表示编目1表示更新2表示更新节点
    , catalogue: function (flag) {

        var nodes=null;
        nodes=ObjectMetadataPage.zTreeObj.getCheckedNodes(true);

        if ((nodes.length == 0&&flag==0) ||(nodes.length == 0&&flag==2)) {
            alert("你没有选择节点！");
        } else {
            var nodeIdList = [];
            //alert("新编目的节点位置是:");
            for (var i = 0; i < nodes.length; i++) {
                nodeIdList.push(nodes[i].node_id);
                //  alert(nodes[i].node_id);
            }

            //alert(ObjectMetadataDetail.classId);

            var obj1 = {};
            var data = {
                nodeId: nodeIdList,//树上的节点。包括父节点
                obj: obj1,//元数据的MDFILEID的集合
            }

            var data1 = $('form').serializeArray();
            console.log(data);
            console.log(typeof(data));


            $.each(data1,function(i,v){
                obj1[v.name] = v.value;
            });
            var dataString = JSON.stringify(data);
            // alert("编目节点信息："+dataString);
            $("#treeModal").modal("hide");

            $("#updatedd").removeAttr("disabled");

            // $("#treeModal_1").modal('hide');
            $("#loading").css('display', 'block');
            //flag==0 编目 flag==1 更新对象 flag==2 更新节点
            //state==1 全选当前页 state==2全选所有内容 satate==0清空
            //全选编目

            getDataByGet('/metadataImport/XML2Db', dataString, function (msg) {
                if (msg.state == "ok") {
                    $("#loading").css('display', 'none');
                    alert("编目成功!");
                } else {
                    $("#loading").css('display', 'none');
                    // ObjectMetadataDetail.queryData();
                    alert("编目失败!");
                }
            });



        }
    }


    //打开联系人模态框
    , showContactModal: function () {
        var data={};
        getDataByGet('/metadataImport/contactsconfig',data,function (msg) {
            $("#dataContactTableBody").empty();
            $("#dataContactPage").empty();
            $("#searchContact").val("");
            var page_count=parseInt(msg);
            //分页
            $("#dataContactPage").Paging({
                pagesize: 5,
                count: page_count,
                toolbar: true,
                callback: function (page, size, count) {
                    //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    ManualImport.contactPage(page, size);
                }
            });
            $("#contactConfigModal").modal();
            ManualImport.contactPage(1, 5);
        })
    }


//分页
    , contactPage:function (page,size) {
        var searchContact=$("#searchContact").val();
        var dataStr = "{\"page\":\"" + page + "\"," +
            "\"size\":\"" + size + "\"," +
            "\"searchContact\":\"" + searchContact + "\"," +
            "}";
        getDataByGet('/metadataImport/showdata',dataStr,function (msg){
            $("#dataContactTableBody").empty();
//                console.log(msg+2222)
            for(var o in msg){
//                    console.log("111");
                console.log(msg[o]);
                $("#dataContactTableBody").append("<tr id="+msg[o].obj_id+"><td style='width: 50px'><input type='radio' name='contactcheckbox' value="+msg[o].obj_id+"></td><td>"+msg[o].obj_name+"</td><td>"+msg[o].obj_id+"</td><td>"+msg[o].sex+"</td><td>"+msg[o].org_name+"</td><td>"+msg[o].telnumber+"</td><td>"+msg[o].faxnumb+"</td><td>"+msg[o].email+"</td></tr>");

            }
        });
    }


//查找联系人
    , search:function () {
        var searchContact=$("#searchContact").val();
        var dataStr = "{\"searchContact\":\""+searchContact+"\"}";
        getDataByGet('/metadataImport/searchContact',dataStr,function (msg){
            $("#dataContactTableBody").empty();
            $("#dataContactPage").empty();
            var pagecount=msg.length;
            $("#dataContactPage").Paging({
                pagesize: 5,
                count: pagecount,
                toolbar: true,
                callback: function (page, size, count) {
                    //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    ManualImport.contactPage(page, size);
                }
            });
            ManualImport.contactPage(1, 5);
        });
    }


//选择联系人，并填写在对应的表单中
    , selectContract:function () {
        var contactId = $("input[name='contactcheckbox']:checked").val();
        console.log("contactId"+contactId);
        var tr = document.getElementById(contactId);
//          console.log(tr);
        $('#rpIndID').val(tr.cells[2].innerHTML);
        $('#rpIndName').val(tr.cells[1].innerHTML);
        $('#rpOrgName').val(tr.cells[4].innerHTML);
        $('#voiceNum').val(tr.cells[5].innerHTML);
        $('#faxNum').val(tr.cells[6].innerHTML);
        $('#email').val(tr.cells[7].innerHTML);

        $("#contactConfigModal").modal("hide");
    }

    //新建联系人
    , newContact:function(){
        $("#newContact").modal({
            show:true,
            backdrop:'static'
        });
        var contactName = $("#contactName").val();
        var contactOrg = $("#contactOrg").val();
        var contactTel = $("#contactTel").val();
        var contactFaxnumb = $("#contactFaxnumb").val();
        var contactMail = $("#contactMail").val();
        if(contactName==""){
            alert("用户名称不能为空！");
        }else{
            var strData = {
                contactName:contactName,
                contactOrg:contactOrg,
                contactTel:contactTel,
                contactFaxnumb:contactFaxnumb,
                contactMail:contactMail
            }
            var stringData = JSON.stringify(strData);
            var data = {"dataJson":stringData};
            $.ajax({
                url:'/ObjectModelManager/contactIncre',
                data:data,
                dataType:"JSON",
                async : false,
                type:"GET",
                success:function(msg){
                    var entityArray=[];
                    entityArray.push(msg[0].id);
                    var nodeIdList = [];
                    nodeIdList.push(0);
                    /**
                     * //树上的节点。包括父节点 long
                     * @type {{classId: number, nodeId: Array, state: *, entityArray: Array, queryCondition: (ObjectMetadataDetail.data|{classId, classGUID, entityName, extractor, beginTime, endTime, keyword, hasCataLog, pageSize, nowPage}|*), flag: *}}
                     */
                        //nodeIdList.push(obj.id);
                    var data = {
                            classId: 457,
                            nodeId: nodeIdList,//树上的节点。包括父节点
                            state: -1,//选择状态，全选或者什么
                            entityArray: entityArray,//元数据的MDFILEID的集合
                            queryCondition: AttributeManager.data,//查询条件
                            flag:0
                        }
                    var dataString = JSON.stringify(data);
                    getDataByPost('/MetadataManager/catalogByClass',dataString,function (msg) {
                        if (msg.state == "ok") {
                            //$("#loading").css('display', 'none');
                            alert("新增联系人成功!");
                            //成功以后展示出来
                            var searchContact=contactName;
                            var dataStr = "{\"searchContact\":\""+searchContact+"\"}";
                            var data = { "dataJson":dataStr, };
                            $.ajax({
                                url:'/ObjectModelManager/searchContact',
                                data:data,
                                dataType:"JSON",
                                async : false,
                                type:"GET",
                                success:function(msg)
                                {
                                    $("#dataContactTableBody").empty();
                                    $("#dataContactPage").empty();
                                    var pagecount=msg.length;
                                    $("#dataContactPage").Paging({
                                        pagesize: 5,
                                        count: pagecount,
                                        toolbar: true,
                                        callback: function (page, size, count) {
                                            //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                                            metadataManualImport.contactPage(page, size);
                                        }
                                    });
                                    metadataManualImport.contactPage(1, 5);
                                }
                            });
                        } else {
                            //$("#loading").css('display', 'none');
                            alert("新增联系人失败!");
                        }
                    });
                    //}

                },
                error:function(msg){
                    alert("用户名称重复，新增联系人失败！");
                }
            });
        }


    }

}