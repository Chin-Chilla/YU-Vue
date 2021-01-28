/**
 * create by XiaoFeng
 * @type {{load: ObjectMetadataPage.load}}
 */
ObjectMetadataPage = {
    entityClass: [],
    filter: [],
    zTreeObj: Object,
    zTreeObj1:Object,
    //加载页面框架
    load: function () {
        //判断资源目录树上是否有未保存的节点信息
        // CatalogPage.pageLeave();
        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .metadataManager").addClass("active");
        $("#pagination").empty();
        $("#text1").empty();
        var data = {};
        getStringData('/MetadataManager/showOM', data, function (msg) {
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
            //加载资源树
            var aJson = {};
            getDataByGet("/ReSourceDir/initialReSourceDirTree", aJson, function (dataStr) {
                ObjectMetadataPage.zTreeObj = $.fn.zTree.init($("#tree"), setting, dataStr);
                ObjectMetadataPage.zTreeObj1 = $.fn.zTree.init($("#tree1"), setting, dataStr);
            });
            $("#filter").on('keypress',function (event) {
                if(event.keyCode == 13){
                    ObjectMetadataPage.filterKey();
                }
            });
            ObjectMetadataPage.getEntityClass();
        })
    }
    //打开模态对话框
    , showModal: function () {
        var classId = $("input[name='optionsRadios']:checked").val();
        if (typeof(classId) != "undefined") {
            var className = "";
            for (var i = 0; i < ObjectMetadataPage.filter.length; i++) {
                if (ObjectMetadataPage.filter[i].class_id == classId) {
                    className = ObjectMetadataPage.filter[i].class_name;
                }
            }

            $("#treeModal").modal("show");

        }
        else {
            alert("请选择一个对象类");
        }
    }
    //打开数据源模态框 create by zn
    , showDataSourceModal: function () {
        var classId = $("input[name='optionsRadios']:checked").val();
        console.log(classId);
        if (classId == null) {
            console.log(1);
            alert("请选择对象类");
        } else {
            console.log(2);
            AttributeManager.dataSource();
            $('#dataSoureModal').modal("show");
        }

    }
    //打开联系人模态框
    , showContactModal: function () {
        var data={};
        getDataByGet('/ObjectModelManager/contactsconfig',data,function (msg) {
            console.log(msg)
            $("#dataContactTableBody").empty();
            $("#dataContactPage").empty();
            $("#searchContact").val("");
            var page_count=msg.length;
            //分页
            $("#dataContactPage").Paging({
                pagesize: 5,
                count: page_count,
                toolbar: true,
                callback: function (page, size, count) {
                    //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    metadataManualImport.contactPage(page, size);
                }
            });
            $("#contactConfigModal").modal();
            metadataManualImport.contactPage(1, 5);
        })
    }
//    , contactPage:function (page,size) {
//        var searchContact=$("#searchContact").val();
//        var dataStr = "{\"page\":\"" + page + "\"," +
//            "\"size\":\"" + size + "\"," +
//            "\"searchContact\":\"" + searchContact + "\"," +
//            "}";
//        getDataByGet('/ObjectModelManager/showdata',dataStr,function (msg){
//            $("#dataContactTableBody").empty();
//            console.log(msg+2222)
//            for(var o in msg){
//                console.log(msg[o])
//                var abs= msg[o].obj_name;
//                $("#dataContactTableBody").append("<tr id="+msg[o].obj_id+"><td style='width: 50px'><input type='radio' name='contactcheckbox' value="+msg[o].obj_id+"></td><td>"+abs+"</td></tr>");
//
//            }
//        });
//    }
    //查找联系人
    , search:function () {
        var searchContact=$("#searchContact").val();
        var dataStr = "{\"searchContact\":\""+searchContact+"\"}";
        getDataByGet('/ObjectModelManager/searchContact',dataStr,function (msg){
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
        });
    }
    //绑定联系人
    , bindContact:function() {
        var contactId = $("input[name='contactcheckbox']:checked").val();
        var classId = $("input[name='optionsRadios']:checked").val();
        if (contactId != ""&&classId!="") {
            var data={
                contactId:contactId,
                classId:classId
            }
            var dataStr=JSON.stringify(data);
            getDataByGet('/MetadataManager/changeClassContract',dataStr,function (msg) {
                if(msg.state=="ok"){
                    $("#contactConfigModal").modal("hide");
                }else{
                    alert("修改失败!");
                }
            });
        }else{
            $("#contactConfigModal").modal("hide");
        }

    }
    //打开详细页面
    , viewObjectMetadata: function () {
        // var radios=document.getElementsByName("optionsRadios");
        // for(var i=0;i<radios.length;i++){
        //
        // }
        var classId = $("input[name='optionsRadios']:checked").val();
        if (typeof(classId) != "undefined") {
            var className = "";
            for (var i = 0; i < ObjectMetadataPage.filter.length; i++) {
                if (ObjectMetadataPage.filter[i].class_id == classId) {
                    className = ObjectMetadataPage.filter[i].class_name;
                }
            }
            //alert("aaa");
            //alert(classId);
            ObjectMetadataDetail.load(classId, className);
        }
        else {
            alert("请选择一个对象类");
        }

    }
    //获得对象类
    , getEntityClass: function () {
        var aData = {};
        getDataByGet('/MetadataManager/getEntityClassTable', aData, function (msg) {
            ObjectMetadataPage.entityClass = msg;
            ObjectMetadataPage.filterKey("");
        })
    }
    //过滤对象
    , filterKey: function (key) {
        //alert(key);
        if (key == "") {
            ObjectMetadataPage.filter = ObjectMetadataPage.entityClass;
            ObjectMetadataPage.renderPagination();
        } else {
            key = $("#filter").val();
            ObjectMetadataPage.filter = [];
            for (var i = 0; i < ObjectMetadataPage.entityClass.length; i++) {
                if (ObjectMetadataPage.entityClass[i].class_name.split(key).length > 1) {
                    ObjectMetadataPage.filter.push(ObjectMetadataPage.entityClass[i]);
                }
            }
            ObjectMetadataPage.renderPagination();
        }
    }
    //渲染分页匡
    , renderPagination: function () {
        //初始化
        // dataPagination.pageNo=1;
        // dataPagination.pageSize=10;
        // dataPagination.totalPage=Math.floor(ObjectMetadataPage.filter.length/dataPagination.pageSize)+1;
        $("#pagination").empty();
        $("#pagination").Paging({
            pagesize: 15,
            count: ObjectMetadataPage.filter.length,
            toolbar: true,
            callback: function (page, size, count) {
                //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                ObjectMetadataPage.changePage(page, size);
            }
        });
        ObjectMetadataPage.changePage(1, 15);

    }
    //跳页
    , changePage: function (nowPage, size) {
        var nowPageMin = (nowPage - 1) * size;
        var nowPageMax = nowPage * size;
        $(".box-body .table tbody").empty();
        for (var i = nowPageMin; i < (ObjectMetadataPage.filter.length < nowPageMax ? ObjectMetadataPage.filter.length : nowPageMax); i++) {
            var classId = "";
            if (ObjectMetadataPage.filter[i].class_id != null) {
                classId = ObjectMetadataPage.filter[i].class_id;
            }
            var chName = "";
            if (ObjectMetadataPage.filter[i].class_name != null) {
                chName = ObjectMetadataPage.filter[i].class_name;
                //alert(chName);
            }
            var enName = "";
            if (ObjectMetadataPage.filter[i].class_code != null) {
                enName = ObjectMetadataPage.filter[i].class_code;
            }
            var extractor = "";
            if (ObjectMetadataPage.filter[i].extractor != null) {
                extractor = ObjectMetadataPage.filter[i].extractor;
            }
            var entityCount = "";
            if (ObjectMetadataPage.filter[i].im_obj_num != null) {
                entityCount = ObjectMetadataPage.filter[i].im_obj_num;
            }
            var catalogNum = "";
            if (ObjectMetadataPage.filter[i].catal_num != null) {
                catalogNum = ObjectMetadataPage.filter[i].catal_num;
                //alert(catalogNum);
            }
            var extractTime = "";
            if (ObjectMetadataPage.filter[i].extr_time != null) {
                extractTime = new Date(ObjectMetadataPage.filter[i].extr_time.time).toLocaleDateString();
            }

            var catalogtime = "";
            if (ObjectMetadataPage.filter[i].catal_time != null) {
                //catalogtime=ObjectMetadataPage.filter[i].catal_time.time.toLocaleString();
                catalogtime = new Date(ObjectMetadataPage.filter[i].catal_time.time).toLocaleDateString();
            }
            var isLeave = "";
            if (ObjectMetadataPage.filter[i].class_order == 1) {
                isLeave = "已建立";
            } else if (ObjectMetadataPage.filter[i].class_order == 0) {
                isLeave = "未建立";
            }

            $(".box-body .table tbody").append("<tr><td>" +
                "<input name='optionsRadios' value='" + classId + "' type='radio'></td>" +
                "<td>" + chName + "</td><td>" + enName + "</td>" +
                "<td>" + isLeave + "</td><td>" + extractor + "</td>" +
                "<td>" + entityCount + "</td>" +
                "<td>" + catalogNum + "</td><td>" + extractTime + "</td><td>" + catalogtime + "</td></tr>");
        }
    }
    //编目
    , catalogue: function () {
        //
        var classId = $("input[name='optionsRadios']:checked").val();
        console.log(classId);
        var nodes = ObjectMetadataPage.zTreeObj.getCheckedNodes(true);
        if (nodes.length !=2) {
            alert("二级结点只能选择一个！");
        } else {
            var nodeIdList = [];
            // alert("新编目的节点位置是:");
            for (var i = 0; i < nodes.length; i++) {
                nodeIdList.push(nodes[i].node_id);
                // alert(nodes[i].node_id);
            }

            var data = {
                classId: classId,
                nodeId: nodeIdList,
                state: 100,
                flag:0
            };
            var dataString = JSON.stringify(data);
            $("#treeModal").modal("hide");
            $("#loading").css('display', 'block');
            if((TaskManage.taskflag=="1")&&(confirm("是否要加入任务队列")==true)){
                getDataByPost('/TaskManager/addCatalog2Quene', dataString, function (msg) {
                    console.log(msg);
                    if (msg.state== "ok") {
                        alert("成功添加到任务队列中");
                    } else if (msg.state == "exist") {
                        alert("添加任务失败，该任务已存在");
                    } else if (msg.state == "proerr"){
                        alert("添加任务失败, 有相关任务未完成");
                    } else{
                        alert("添加任务失败，有前序任务未完成！");
                    }
                    $("#loading").css('display','none'); //取消 loading 界面
                });
            }else {
                getDataByPost('/MetadataManager/catalogByClass',dataString,function (msg) {
                    console.log(msg);
                    if (msg.state == "ok") {
                        $("#loading").css('display', 'none');
                        alert("编目成功!");

                    } else {
                        $("#loading").css('display', 'none');
                        alert("编目失败!");
                    }
                });
            }
        }
    }
    //更换联系人
    , changeContract:function () {
        var classId = $("input[name='optionsRadios']:checked").val();
        var contractId=$("input[name='metadataContact']:checked").val();
        var aJson={
            classId:classId,
            contractId:contractId
        };
        var dataString = JSON.stringify(aJson);
        getDataByGet('/MetadataManager/changeClassContract',dataString,function (msg) {
            if(msg.state=='ok') {
                $("#contactConfigModal").modal("hide");
            }else {
                alert("修改联系人失败!");
            }
        });
    }
}







