var keySearch = new Vue({
    el: "#keySearch",
    data: {
        nodeId: "",
        firstName: "",
        secondName: "",
        pageSize: 10,
        pageNo: 0,
        keyWord: "",
        keyWord2: "",
        count: 0,
        msg: '',
        treeType: '' ,
        classID:'',
        src_md_file_id:'',
        md_file_id:'',
        datacat:'',
        value: '',
        sub_id:'',
        sub_name:'',
        sub_loc:'',
        subcount: 0,
        subed: 0,
        flag:'',
        treeId:''
    },

    mounted(){
    },
    methods: {
        load(sign){
            if ($("#keyWord").val() == "") {
                toastr.warning("关键词不能为空!");
            }else{
                var data = {};
                $("#pagination").empty();
                $("#text1").empty();
                keySearch.keyWord2 = $("#keyWord2").val();
                //二次搜索输入的关键词


                $.ajax({
                    type:'GET',
                    url:'/YU/html/browse/search/keySearch.html',
                    success:function(body,heads,status){

                        $(".left_down").html(body);//分布图、遥感影像、元数据热搜榜
                        keySearch.firstName = "";
                        keySearch.secondName = "";
                        keySearch.keyWord = $("#keyWord").val();
                        keySearch.keySearch(sign,keySearch.treeType);

                    }
                });}

        },
        filter:function () {
            var data = {
                "datacat":keySearch.datacat
            };
            getDataByGet("/key_search/initialRevokeReSourceDirTreeWithDataCat",data,function (dataStr) {
                HRCindex.catalogTreeData=dataStr;
                $.fn.zTree.init($("#resTreeDyn"), setting, dataStr);
            });

            getDataByGet("/key_search/initialRevokeClassDirTreeWithDataCat",JSON.stringify(data),function (dataStr) {
                HRCindex.objectTreeData=dataStr;
                $.fn.zTree.init($("#objTreeDyn"), settingObject, dataStr);
                $("#loading").css("display","none");

            });
        },
        renderDynamicTree: function (flag,treeId) {
            //动态树
            var settings = {
                data: {
                    simpleData:{
                        enable:true,
                        idKey:"node_id",
                        pIdKey:"pnode_id",
                        rootPId:"0"
                    },
                    key: {
                        name: "node_name"
                    }
                },
                callback:{
                    onClick:function zTreeOnClickDynamictree(event, treeId, treeNode) {
                        var nodeId=treeNode.node_id;
                        keySearch.nodeId=nodeId;
                        //keySearch.loadFromTree1();
                        keySearch.keySearch(3,treeId)//当前目录
                    }
                }
            }
            var value1 = $("#keyWord").val();
            var nodeId= keySearch.nodeId;
            var data = { dataJson:value1,node:nodeId,key2:keySearch.keyWord2 };
            if ( treeId == "" || flag == "1" ){
                getDataByPost('/key_search/dynamictree', data, res=>{
                    $.fn.zTree.init($("#resTreeDyn"), settings, res.data);//初始化检索结果分布树(jquery树形控件ztree)
                });
                getDataByPost('/key_search/dynamicObjTree', data, res=>{
                    $.fn.zTree.init($("#objTreeDyn"), settings, res.data);//初始化检索结果分布树(jquery树形控件ztree)
                })
            }else{
                //如果是点击右侧树节点或搜索当前目录搜索的，只加载相应的单棵动态树即可
                if (treeId == "ReSourceTree") {
                    getDataByPost('/key_search/dynamictree', data, res=>{
                        $.fn.zTree.init($("#resTreeDyn"), settings, res.data);//初始化检索结果分布树(jquery树形控件ztree)
                    });
                }else if(treeId=="ObjectTree"){
                    getDataByPost('/key_search/dynamicObjTree', data, res=>{
                        $.fn.zTree.init($("#objTreeDyn"), settings, res.data);//初始化检索结果分布树(jquery树形控件ztree)
                    })
                }
            }

        },
        loadFromTree: function (nodeId,treeType) {
            var data = {};
            $("#pagination").empty();
            $.ajax({
                type:'GET',
                url:'/YU/html/browse/search/keySearch.html',
                success:function(body,heads,status){
                    $(".left_down").html(body);
                    keySearch.firstName = "";
                    keySearch.secondName = "";
                    keySearch.nodeId = nodeId;
                    keySearch.treeType = treeType;
                    $("#keyWord").val("");
                    keySearch.keySearch(3,treeType);//节点搜索
                }
            });
        },

        //1是全局 2是当前目录 3是结点 4是二次搜索
        keySearch: function (flag,treeId) {
            keySearch.pageNo = 1;
            keySearch.count = 0;
            if(flag!=undefined)keySearch.flag=flag
            if(treeId!=undefined)keySearch.treeId=treeId

            if (keyWord == "") {
                toastr.warning("关键词不能为空!");
            } else {
                var keyword = "";
                var keyword2 = "";
                var nodeId = "";
                var treeType = "";
                if (flag == 1) {
                    keyword = keySearch.keyWord;
                    keyword2 = "";
                    nodeId = "";
                    sessionStorage.setItem("Word",keyword);
                } else if (flag == 2) {
                    keyword = keySearch.keyWord;
                    keyword2 = "";
                    nodeId = keySearch.nodeId;
                    sessionStorage.setItem("Word",keyword);
                } else if (flag == 3) {
                    keyword = "";
                    keyword2 = "";
                    nodeId = keySearch.nodeId;
                }else if (flag == 4)  {
                    keyword = sessionStorage.getItem("Word");
                    keyword2 = keySearch.keyWord2;
                    nodeId = "";
                    //将搜索结果回显到二次搜索的搜索框
                    $('#keyWord2').val(keyword2);

                }
                var data = {
                    nodeId: nodeId,
                    firstName: keySearch.firstName,
                    secondName: keySearch.secondName,
                    Word: keyword,
                    Word2: keyword2,
                    TreeType: keySearch.treeType,
                    PageNo: keySearch.pageNo,
                    PageSize: keySearch.pageSize,
                    datacat:keySearch.datacat,
                    flag:flag
                };

                getDataByPost('/key_search/queryforindex', data, function (res) {
                    var msg = res.data;
                    keySearch.msg = msg;
                    keySearch.count = msg.num;
                    if (typeof(msg.facet) != 'undefined') {
                        $(".facet").empty();
                        $(".facet").append("<div style='width: 100%;padding: 15px 15px 15px 20px;font-size: 18px;background: #e7e3e7;border-bottom: 1px solid #9d9d9d'>精炼检索结果(" + msg.num + ") </div>");
                        var ahtml = "";
                        for (var i = 0; i < msg.facet.length; i++) {

                            var facet = msg.facet[i];
                            ahtml += "<div style='width: 100%;padding:10px;background:#e7e3e7;font-size:14px;font-weight: 700;border-bottom: 1px solid #E7E3E7'>" + facet.chineseName + "</div>";
                            ahtml += "<div style='border-top: 1px solid #9d9d9d;border-bottom: 1px solid #9d9d9d;padding-bottom: 15px'>";
                            for (var j = 0; j < facet.facetnum.length; j++) {
                                if (facet.name == keySearch.firstName && facet.facetnum[j].name == keySearch.secondName) {
                                    ahtml += "<div class='facet_item' style='color:#3366FF' onclick=keySearch.facetSearch('" + facet.name + "','" + facet.facetnum[j].name + "',this);>" + facet.facetnum[j].name + "(" + facet.facetnum[j].num + ")" + "</div>";
                                } else {
                                    ahtml += "<div class='facet_item' onclick=keySearch.facetSearch('" + facet.name + "','" + facet.facetnum[j].name + "',this);>" + facet.facetnum[j].name + "(" + facet.facetnum[j].num + ")" + "</div>";
                                }

                            }
                            ahtml += "</div>";
                        }
                        $(".facet").append(ahtml);//精炼检索结果
                        keySearch.renderDynamicTree(flag,treeId);
                    } else {
                        ;
                    }
                    keySearch.renderPagination(flag);
                })
            }
        },
        renderPagination: function (flag) {
            $("#pagination").empty();
            $("#pagination").Paging({
                pagesize: keySearch.pageSize,
                count: keySearch.count,
                toolbar: true,
                callback: function (page, size, count) {
                    //toastr.warning('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    keySearch.pageNo = page;
                    keySearch.getOnePage(flag,false);
                }
            });
            keySearch.getOnePage(flag,true);
        },

        //获取检索结果
        getOnePage: function (flag,is_first,node) {
            $("#cardPage").empty();
            var keyword="";
            var keyword2="";
            var nodeId="";
            if(flag==1){//全局搜索
                keyword=keySearch.keyWord;
                keyword2="";
                nodeId="";
            }else if (flag==2){//当前目录
                keyword=keySearch.keyWord;
                keyword2="";
                nodeId=keySearch.nodeId;
            }else if(flag==3){
                keyword="";
                keyword2="";
                nodeId=keySearch.nodeId;
            }else if (flag == 4)  {
                keyword = sessionStorage.getItem("Word");
                keyword2 = keySearch.keyWord2;
                nodeId = "";
            }
            var data = {
                nodeId: nodeId,
                firstName: keySearch.firstName,
                secondName: keySearch.secondName,
                Word: keyword,
                TreeType: keySearch.treeType,
                Word2: keyword2,
                PageNo: keySearch.pageNo,
                PageSize: keySearch.pageSize,
                datacat:keySearch.datacat,
                flag:flag
            };
            //长江委按钮
            if(LOCATION=="cjw"){
                buttonhtml="</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                if (is_first) {
                    var msg = keySearch.msg;

                    if (msg.result.length == 0){
                        var ahtml = "<p class=\"link\">" + " <img src=\"/YU/statics/imgs/glass.png\" alt=\"404\" style=\"padding-left: 50%\">" + "<h4 style=\"text-align: center;font-family:Microsoft YaHei;\">该数据不存在，请检查检索条件</h4><p>";
                        $("#cardPage").append(ahtml);
                    } else {
                        for (var i = 0; i < msg.result.length; i++) {
                            //长江委的跳转按钮，获取相关参数，判断按钮是否出现
                            if(msg.result[i][0].source==""&&msg.result[i][0].classId!=""){    //按钮出现1.是长江委的数据2.是实体类
                                buttonhtml="<input type=\"button\"  value=\"资料详情\" id=\"RESinf\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.getDRparam('" + msg.result[i][0].id + "')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }else{
                                buttonhtml="</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }

                            var ahtml = "<div style=\"border: 1px silver solid; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                "<div class=\"row\">" +
                                "<input type='checkbox' value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"+' name='single'onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                "<a target=\"_blank\" onclick=keySearch.detail('"+$.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">"
                                + msg.result[i][1].value+"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;
                            // $("#t_titles").append(xxx);


                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='特征分类'){
                                        var color
                                        if(msg.result[i][j].value.indexOf('业务')!=-1){
                                            color = 'bg-blue'
                                        }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                            color = 'bg-olive'
                                        }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                            color = 'bg-orange'
                                        }else{
                                            color = 'bg-purple'
                                        }
                                        ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                        continue;
                                    }
                                    ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                        msg.result[i][j].value + "</td></tr>";
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    }
                } else {
                    getDataByPost('/key_search/queryforindex', data, function (msg) {
                        for (var i = 0; i < msg.result.length; i++) {
                            //长江委的跳转按钮，获取相关参数，判断按钮是否出现
                            if(msg.result[i][0].source==""&&msg.result[i][0].classId!=""){    //按钮出现1.是长江委的数据2.是实体类
                                buttonhtml="<input type=\"button\"  value=\"资料详情\" id=\"RESinf\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.getDRparam('" + msg.result[i][0].id + "')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }else{
                                buttonhtml="</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }

                            var ahtml = "<div style=\"border: 1px silver solid; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                "<div class=\"row\">" +
                                "<input type='checkbox' value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"'name='single' onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">"
                                + msg.result[i][1].value+"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;

                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='特征分类'){
                                        var color
                                        if(msg.result[i][j].value.indexOf('业务')!=-1){
                                            color = 'bg-blue'
                                        }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                            color = 'bg-olive'
                                        }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                            color = 'bg-orange'
                                        }else{
                                            color = 'bg-purple'
                                        }
                                        ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                        continue;
                                    }
                                    ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                        msg.result[i][j].value + "</td></tr>";
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    })
                }
            }
            else if(LOCATION=="huaiwei"){
                buttonhtml="</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                if (is_first) {
                    var msg = keySearch.msg;

                    if (msg.result.length == 0){
                        var ahtml = "<p class=\"link\">" + " <img src=\"/YU/statics/imgs/glass.png\" alt=\"404\" style=\"padding-left: 50%\">" + "<h4 style=\"text-align: center;font-family:Microsoft YaHei;\">该数据不存在，请检查检索条件</h4><p>";
                        $("#cardPage").append(ahtml);
                    } else {
                        for (var i = 0; i < msg.result.length; i++) {


                            //淮河委按钮，获取相关参数，判断按钮是否出现
                            if(msg.result[i][0].source==""&&msg.result[i][0].classId!=""){    //按钮出现1.是淮河委的数据2.是实体类
                                buttonhtml="<input type=\"button\"  value=\"资料详情\" id=\"RESinf\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.getDRparam('" + msg.result[i][0].id + "')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }else if(msg.result[i][0].retracelink!=""){

                                buttonhtml="<input type=\"button\"  value=\"资料详情\" id=\"RESinf\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.openDocument('" +msg.result[i][0].retracelink +"')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";

                            }else{
                                buttonhtml="</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }

                            var ahtml = "<div style=\"border: 1px silver solid; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                "<div class=\"row\">" +
                                "<input type='checkbox' name='single'value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"' onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">"
                                + msg.result[i][1].value+"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;
                            // $("#t_titles").append(xxx);


                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='特征分类'){
                                        var color
                                        if(msg.result[i][j].value.indexOf('业务')!=-1){
                                            color = 'bg-blue'
                                        }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                            color = 'bg-olive'
                                        }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                            color = 'bg-orange'
                                        }else{
                                            color = 'bg-purple'
                                        }
                                        ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                        continue;
                                    }

                                    ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                        msg.result[i][j].value + "</td></tr>";
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    }
                } else {
                    getDataByPost('/key_search/queryforindex', data, function (res) {
                        var msg = res.data;
                        for (var i = 0; i < msg.result.length; i++) {
                            //淮河委的跳转按钮，获取相关参数，判断按钮是否出现
                            if(msg.result[i][0].source==""&&msg.result[i][0].classId!=""){    //按钮出现1.是淮河委的数据2.是实体类
                                buttonhtml="<input type=\"button\"  value=\"资料详情\" id=\"RESinf\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.getDRparam('" + msg.result[i][0].id + "')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }else if(msg.result[i][0].retracelink!=""){

                                buttonhtml="<input type=\"button\"  value=\"资料详情\" id=\"RESinf\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.openDocument('" +msg.result[i][0].retracelink +"')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";

                            }
                            else{
                                buttonhtml="</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }

                            var ahtml = "<div style=\"border: 1px silver solid;position: relative; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                "<div class=\"row\">" +
                                "<input type='checkbox' name='single'value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"'onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">"
                                + msg.result[i][1].value+"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;

                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='特征分类'){
                                        var color
                                        if(msg.result[i][j].value.indexOf('业务')!=-1){
                                            color = 'bg-blue'
                                        }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                            color = 'bg-olive'
                                        }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                            color = 'bg-orange'
                                        }else{
                                            color = 'bg-purple'
                                        }
                                        ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                        continue;
                                    }
                                    ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                        msg.result[i][j].value + "</td></tr>";
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    })
                }
            }else if(LOCATION =="beijing") {  //其他情况
                //toastr.warning("aaaa");
                if (is_first) {
                    var msg = keySearch.msg;
                    if (msg.result.length == 0) {
                        //window.LOCATION.href="/empty";
                        var ahtml = "<p class=\"link\">" + " <img src=\"/YU/statics/imgs/glass.png\" alt=\"404\" style=\"padding-left: 50%\">" + "<h4 style=\"text-align: center;font-family:Microsoft YaHei;\">该数据不存在，请检查检索条件</h4><p>";
                        $("#cardPage").append(ahtml);
                    } else {
                        for (var i = 0; i < msg.result.length; i++) {
                            var innerStyle;
                            if(msg.result[i][1].name.indexOf("栅格")!=-1){
                                innerStyle = " style=\"margin-left:100px;\""
                            }else{
                                innerStyle = ""
                            }
                            var ahtml = "<div style=\"border: 1px silver solid;position: relative; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                "<div class=\"row\">" +
                                "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">" +
                                msg.result[i][1].value + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class=\"row\" "+innerStyle+"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='特征分类'){
                                        var color
                                        if(msg.result[i][j].value.indexOf('业务')!=-1){
                                            color = 'bg-blue'
                                        }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                            color = 'bg-olive'
                                        }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                            color = 'bg-orange'
                                        }else{
                                            color = 'bg-purple'
                                        }
                                        ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                        continue;
                                    }
                                    ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                        msg.result[i][j].value + "</td></tr>";
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    }
                } else {
                    getDataByPost('/key_search/queryforindex', data, function (res) {
                        var msg = res.data;
                        for (var i = 0; i < msg.result.length; i++) {
                            if(msg.result[i][1].name.indexOf("栅格")!=-1){
                                innerStyle = " style=\"margin-left:100px;\""
                            }else{
                                innerStyle = ""
                            }
                            var ahtml = "<div style=\"border: 1px silver solid;position: relative; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                "<div class=\"row\">" +
                                "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">" +
                                msg.result[i][1].value + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class=\"row\" "+innerStyle+" ><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='特征分类'){
                                        var color
                                        if(msg.result[i][j].value.indexOf('业务')!=-1){
                                            color = 'bg-blue'
                                        }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                            color = 'bg-olive'
                                        }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                            color = 'bg-orange'
                                        }else{
                                            color = 'bg-purple'
                                        }
                                        ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                        continue;
                                    }
                                    ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                        msg.result[i][j].value + "</td></tr>";
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    })
                }
            }else /*if(readConf.value=="nanjing_test")*/{
                //默认获取检索结果并渲染至前台
                var buttonhtml;
                if(is_first){
                    var msg=keySearch.msg;
                    if(msg.result.length==0){      //不为0
                        var ahtml="<p class=\"link\">"+" <img src=\"/YU/statics/imgs/glass.png\" alt=\"404\" style=\"padding-left: 50%\">"+"<h4 style=\"text-align: center;font-family:Microsoft YaHei;\">该数据不存在，请检查检索条件</h4><p>";
                        $("#cardPage").append(ahtml);
                    }else {
                        for (var i = 0; i < msg.result.length; i++) {
                            var j;

                            //根据关键字从solr检索数据，返回的数据会给检索文字标红，此处要去掉<font color="red"></font>标签。
                            buttonhtml = keySearch.getButtonhtml(msg,i);

                            for (j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].name == 'classId') {
                                    keySearch.classID = msg.result[i][j].value;
                                    break;
                                }
                            }
                            /* var objid=msg.result[i][0].id;
                             var datasource=keySearch.getSrcmdfileid(objid);*/
                            if(keySearch.classID!=''){
                                var ahtml = "<div style=\"border: 1px silver solid;position: relative; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                    "<div class=\"row\">" +
                                    "<input type='checkbox' name='single'value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"'onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                    "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].
                                        source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">" +
                                    msg.result[i][1].value+"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;
                                // "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class=\"btn btn-primary\" style=\"width:80px;height: " +
                                // "30px;margin: 0px 5px 5px 5px\" onclick=onclick=keySearch.detail('"+$.trim(msg.result[i][4].value)+"','"+$.trim(msg.result[i][3].value)+"','" + $.trim(msg.result[i][0].id) + "','" +
                                // msg.result[i][0].source + "')>摘要信息</a>"+
                                // "&nbsp;&nbsp;<a class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\" " +
                                // "onclick=keySearch.getTwo('" + msg.result[i][0].id + "','" + keySearch.classID +
                                // "')>详情信息</a><a class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\" " +
                                // "onclick=onclick=keySearch.detail('"+$.trim(msg.result[i][4].value)+"','"+$.trim(msg.result[i][3].value)+"','" +keySearch.getSrcmdfileid(msg.result[i][0].id)+ "','" +
                                // msg.result[i][0].source + "')>数据源</a>&nbsp;&nbsp;&nbsp;</div><div class=\"row\" ><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }else{
                                var ahtml = "<div style=\"border: 1px silver solid; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                    "<div class=\"row\" >" +
                                    "<input type='checkbox' name='single'value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"'onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                    "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">" +
                                    msg.result[i][1].value +"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;

                            }

                            keySearch.classID='';
                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "")
                                {

                                    if(msg.result[i][j].name!="classId")
                                    {
                                        if(msg.result[i][j].name=='特征分类'){
                                            var color
                                            if(msg.result[i][j].value.indexOf('业务')!=-1){
                                                color = 'bg-blue'
                                            }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                                color = 'bg-olive'
                                            }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                                color = 'bg-orange'
                                            }else{
                                                color = 'bg-purple'
                                            }
                                            ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                            continue;
                                        }

                                        ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                            "<br>" + msg.result[i][j].value.replaceAll("\n","<br><br>") + "</td></tr>";
                                    }

                                }
                            }

                            ahtml += "</tbody></table></div></div></div>";
                            $("#cardPage").append(ahtml);
                        }
                    }
                }else {

                    getDataByPost('/key_search/queryforindex', data, function (res) {
                        var msg = res.data;
                        for (var i = 0; i < msg.result.length; i++) {
                            var j;

                            buttonhtml = keySearch.getButtonhtml(msg,i);

                            for (j = 2; j < msg.result[i].length; j++) {

                                if (msg.result[i][j].name == 'classId') {
                                    keySearch.classID = msg.result[i][j].value;
                                    break;
                                }
                            }
                            /*var objid=msg.result[i][0].id;
                            var datasource=keySearch.getSrcmdfileid(msg.result[i][0].id);*/
                            if(keySearch.classID!='')
                            {

                                var ahtml = "<div style=\"border: 2px silver solid; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                    "<div class=\"row\">" +
                                    "<input type='checkbox' name='single'value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"'onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                    "<a target=\"_blank\" onclick='" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].
                                        source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">" +
                                    msg.result[i][1].value+"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;
                                // "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class=\"btn btn-primary\" style=\"width:80px;height: " +
                                // "30px;margin: 0px 5px 5px 5px\" onclick=onclick=keySearch.detail('"+$.trim(msg.result[i][4].value)+"','"+$.trim(msg.result[i][3].value)+"','" + $.trim(msg.result[i][0].id) + "','" +
                                // msg.result[i][0].source + "')>摘要信息</a>"+
                                // "&nbsp;&nbsp;<a class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\" " +
                                // "onclick=keySearch.getTwo('" + msg.result[i][0].id + "','" + keySearch.classID +
                                // "')>详情信息</a><a class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\" " +
                                // "onclick=onclick=keySearch.detail('"+$.trim(msg.result[i][4].value)+"','"+$.trim(msg.result[i][3].value)+"','" + keySearch.getSrcmdfileid(msg.result[i][0].id) + "','" +
                                // msg.result[i][0].source + "')>数据源</a>&nbsp;&nbsp;&nbsp;</div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
                            }
                            else
                            {
                                var ahtml = "<div style=\"border: 1px silver solid; margin-bottom: 10px;padding: 10px 20px 0px 20px\">" +
                                    "<div class=\"row\">" +
                                    "<input type='checkbox' name='single'value='"+$.trim(msg.result[i][0].id)+","+msg.result[i][1].value+"'onclick=keySearch.single('"+$.trim(msg.result[i][0].id)+"')>"+
                                    "<a target=\"_blank\" onclick=keySearch.detail('" + $.trim(msg.result[i][0].id) + "','" + msg.result[i][0].source + "') style=\"font-size: 18px;color: #1E6BB4;font-weight: 500;cursor:pointer\">" +
                                    msg.result[i][1].value +"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +buttonhtml;
                            }
                            keySearch.classID='';
                            for (var j = 2; j < msg.result[i].length; j++) {
                                if (msg.result[i][j].value != "") {
                                    if(msg.result[i][j].name=='classId')
                                    {
                                        classID=msg.result[i][j].value;
                                    }
                                    else {
                                        if(msg.result[i][j].name=='特征分类'){
                                            var color
                                            if(msg.result[i][j].value.indexOf('业务')!=-1){
                                                color = 'bg-blue'
                                            }else if(msg.result[i][j].value.indexOf('行政')!=-1){
                                                color = 'bg-olive'
                                            }else if(msg.result[i][j].value.indexOf('综合')!=-1){
                                                color = 'bg-orange'
                                            }else{
                                                color = 'bg-purple'
                                            }
                                            ahtml += "<tr><td><small class='label "+color+"'>"+msg.result[i][j].value+"</small></td></tr>";
                                            continue;
                                        }
                                        ahtml += "<tr><td class=\"title\" style=\"width:100px;\" valign=\"center\">" + msg.result[i][j].name + "</td><td></td><td>" +
                                            "<br>" + msg.result[i][j].value.replaceAll("\n","<br><br>") + "</td></tr>";
                                    }
                                }
                            }
                            ahtml += "</tbody></table></div></div></div>";

                            $("#cardPage").append(ahtml);
                        }
                    })
                }
            }
        },
        // showModal: function(id,name,loc){
        //     $("#myModal").modal("show");
        //     this.sub_id = id;
        //     this.sub_name = name;
        //     this.sub_loc = loc;
        // },
        subscribe: function(id,name,loc){
            var proposer = $("#proposer").val();
            var org = $("#org").val();
            var contact = $("#contact").val();
            var description = $("#description").val();
            getDataByPost('/user/subscribe',{
                id:id,
                name:name,
                loc:loc,
                proposer:proposer,
                org:org,
                contact:contact,
                description:description,
                status:1
            },res=>{
                if(res.code==200){

                    toastr.success("订阅成功！");

                }else{
                    toastr.error(res.msg);
                }
            })




        },
        //封面搜索
        facetSearch: function (firstName, secondName, e) {
            keySearch.firstName = firstName;
            keySearch.secondName = secondName;
            keySearch.keySearch(2);//当前目录
        },
        //详情页
        detail:function (metadataId,source) {
            $("html,body").animate({scrollTop:0}, 100);
            if (source == ""||source == "null") {
                detailPage.load(metadataId,1);
            } else {
                detailPage.autoOpenCurrentData(metadataId);
                
                var data = {
                    id:metadataId
                }
                getDataByPost('/key_search/getSolrDataById', data, function (res) {
                    var msg = res.data;
                    var aDiv = $(".left_down");
                    detailPage.keySearch_html = aDiv.html();
                    $("#pagination").empty()
                    var name = msg.name||msg.idtitle||' ';
                    var abs = msg.abs||msg.idabs||' ';
                    var key = msg.key||msg.keyword||' ';
                    var prname = msg.prname||msg.CAP||' ';
                    var usrabs = msg.usr_abs||msg.contact||' ';
                    var url = source+'/key_search/showDetail?metadataId=' + metadataId+"&source="+2;
                    var loc = "<tr><td>源系统</td><td><a target='_blank' href='"+url+"'>访问源系统</a></td></tr>";
                    //根据nodeCode判断数据表类型
                    var nodeCode=msg.nodeCode;
                    var shareway=msg.shareway;
                    //获取shareway的方式，如果是网址，就写作链接，不是链接当作为普通文本
                    if (shareway!=null || ""){
                        if(shareway.startsWith("http")){
                            var share_way="<tr><td>共享方式</td><td><a target='_blank' href='"+shareway+"'>共享方式链接</a></td></tr>";
                        }
                        else{
                            var share_way="<tr><td>共享方式</td><td>"+shareway+"</td></tr>";
                        }
                    }

                    if(source=='http://http://10.2.76.94:9000/'){
                        loc="";
                    }
                    if(nodeCode!='TABLE'){
                        share_way="";
                    }
                    $(".right_down").html("<style type=\"text/css\">body,html{width:100%;height:100%;margin:0;font-family:\"Microsoft YaHei\"}#mapDiv{width:50%}input,b,p{margin-left:5px;font-size:14px}</style><div class=\"row\">    <div class=\"col-md-2\"></div>    <div class=\"col-md-8\" style=\"border-bottom: 1px solid #9d9d9d;        text-align: center;        margin: 20px 0 20px 0\">        " +
                        "<h3 id=\"title\">" +name+
                        "（汇交数据）</h3>    " +
                        "</div></div><div class=\"row\" style=\"margin-top: 0;\">    " +
                        "<div class=\"col-md-2\"></div>    <div class=\"col-md-8\">        " +
                        "<div class=\"nav-tabs-custom\" style=\"border: 3px solid #e6e5f24d;\">                       " +
                        "<div class=\"tab-content detail-tab-content\" id=\"t_table\"> " +
                        "<div class=\"tab-pane active\" id=\"tab_0\">" +
                        "<table id=\"table_0\" class=\"table table-bordered table-striped dataTable\" style=\"width:100%;float: left\">\n" +
                        "<thead class='bg-yellow' style=\"font-size: 14px; color: white\"><tr><td style=\"width:40%\">元数据项</td><td>内容</td></tr></thead>" +
                        "<tbody id=\"tbody_0\">" +
                        "<tr><td>名称</td><td>" +name+
                        "</td>" +
                        "</tr><tr><td>摘要</td><td>" +abs+
                        "</td>" +
                        "</tr><tr><td>关键字</td><td>" +key+
                        "</td></tr>" +
                        "<tr><td>单位</td><td>" +prname+
                        "</td></tr>" +
                        "<tr><td>联系人信息</td><td>" +usrabs+
                        "</td></tr>" +
                        "<tr><td>发布日期</td><td>" +msg.uptime+
                        "</td></tr>" +
                        loc +
                        share_way+
                        "</tbody></table></div>   </div>        </div>    </div>    <div class=\"col-md-2\"></div><div class=\"row\">    <div class=\"col-xs-12\" style=\"  text-align: center\">        <input type=\"button\" value=\"返回\" class=\"btn-warning btn\" onclick=\"detailPage.goBack()\">    <input type=\"button\" value=\"订阅\" class=\"btn-primary btn\" onclick=\"keySearch.subscribe('" + msg.id + "','"+name+"')\">   </div></div></div>")
                    
                });
                

            }
        },
        openDocument:function(_lnk){
            window.open(_lnk);
        },
        //资料详情
        getTwo:function(id,clas) {

            if(clas=="")
            {
                window.open("http://10.42.7.109:8080/p42_fkjsjzsxt/dist/index.html#/index?type=OBJ_"+ "&guid=" + id);
            }
            else
            {
                var dataStr="{\"classID\":\""+clas+"\","+"}";
                var data={"dataJson":dataStr};
                //toastr.warning(clas);
                $.ajax({
                    url:'/key_search/getName',
                    data:data,
                    dataType:"JSON",
                    async:false,
                    type:"GET",
                    success: function(msg)
                    {
                        // toastr.success("成功啦");
                        for(var o in msg) {
                            window.open("http://"+msg[o].ip+":8080/p42_fkjsjzsxt/dist/index.html#/index?type=OBJ_" + msg[o].CLASS_NAME + "&guid=" + id);
                        }
                    }
                });

            }
        },
        //长江委资料详情
        getDRparam:function(metadataId){
            var id={ objid : metadataId };
            toastr.warning("跳转到长江委资料详情");
            //查找ORIG_ID，CLASS_CODE
            getDataByGet('/key_search/querydata', JSON.stringify(id), function (msg1) {
                objGuid = msg1[0].ORIG_ID;
                objType = msg1[0].CLASS_CODE;
                if(objGuid == null||objType==null){
                    toastr.warning("objguid出错！");
                    return;
                }
                window.open("http://10.6.96.231:8095/framework/samplesc/sampledc/showsyslinkparas.action?sysId=zhanxian&objType="+objType+"&objGuid="+objGuid);
            })
        },
        getSrcmdfileid:function(objid){
            var url = "/key_search/getSrcmdfileid/"+objid+"";
            var data = {};
            var rs;
            $.ajax({
                url: url,
                data: data,
                async: false,
                type: "GET",
                success: function (id) {
                    rs= id;
                },
                /*         error: function (msg) {
                             toastr.warning("数据库无该元数据");
                         }*/

            })
            return rs;
        },
        getButtonhtml(msg,i){
            var str = msg.result[i][1].value;
            var index1 = str.indexOf('<');
            var content1 = str.substring(0,index1);
            var index2 = str.indexOf('>');
            var str1 = str.substring(index2+1,str.length);
            var index3 = str1.indexOf('<');
            var content2 = str1.substring(0,index3);
            var index4 = str1.indexOf('>');
            var content3 = str1.substring(index4+1,str1.length);
            var name = content1 + content2 + content3;
            name=name.replace(/<font color="red">/,"");
            name=name.replace(/<\/font>/,"");
            var buttonhtml = "<input type=\"button\"  value=\"订阅\" class=\"btn btn-primary\" style=\"width:80px;height: 30px;margin: 0px 5px 5px 5px\"  onclick=keySearch.subscribe('" + msg.result[i][0].id + "','"+name+"')></input>&nbsp;&nbsp;&nbsp;</a></div><div class=\"row\"><div class=\"col-md-12\" style='padding-bottom:10px'><table><tbody><tr>";
            return buttonhtml;
        },
        allChecked(){
                for (i = 0; i < $(":checkbox[name='single']").length; i++) {
                    $(":checkbox[name='single']")[i].checked = 1;
                }
        },
        allClearChecked(){
            for (i = 0; i < $(":checkbox[name='single']").length; i++) {
                $(":checkbox[name='single']")[i].checked = 0;
            }
        },
        sub: function(id,name,loc){
            var proposer = $("#proposer").val();
            var org = $("#org").val();
            var contact = $("#contact").val();
            var description = $("#description").val();
            getDataByPost('/user/subscribe',{
                id:id,
                name:name,
                loc:loc,
                proposer:proposer,
                org:org,
                contact:contact,
                description:description,
                status:1
            },res=>{
                    keySearch.countCode(res.code)
            })
        },
        countCode(code){
            keySearch.subcount++
            if (code==200){
            }else{
            keySearch.subed=1
            }
            keySearch.toastrSub()
        },
        toastrSub(){
            if (keySearch.subcount==$(":checkbox:checked").length) {
                if (keySearch.subed== 0)
                    toastr.success("订阅成功！");
                else {
                    toastr.warning("已订阅！请勿重复订阅！")
                    keySearch.subcount = 0;
                    keySearch.subed=0
                }
            }

        },
        subscribeChecked() {
            var i=0;
            if($(":checkbox:checked").length) {
                swal({
                    title: "您确定要订阅这批数据吗",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                }, function () {
                    var arr = new Array();
                    for (var i = 0; i < $(":checkbox:checked").length; i++) {
                        if ($(":checkbox:checked")[i].checked) {
                            arr.push($(":checkbox")[i].value);
                        }
                    }
                    //console.log(arr)
                    for (var i = 0; i < arr.length; i++) {
                        id=arr[i].substr(0,32)
                        name=arr[i].substr(33)
                        keySearch.sub(id,name)
                    }
                    //console.log(keySearch.subcount)

                })
            }else{
                swal("无选中数据！", "", "error");
            }

        },

        single(id){
            //console.log(id)
        }


    },
});

