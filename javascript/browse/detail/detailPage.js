var detailPage = new Vue({
    el: '#detailPage',
    data: {
        Xmlstr: '',
        Sequence: '',
        datailTable: [],  //记录详情页中所有TAB的标题
        datailinfo: [],
        detailContent: {
            configData: {},  //记录当前类型的配置文件 showDetail
            dataContent: {}, //记录当前待显示的元数据内容
            type: '2'//1代表本地 2代表非本地打开
        },
        ahtml: "",
        keySearch_html: ""
    },
    mounted(){

    },
    methods:{
        //重载页面
        load: function (metadataId, source) {
            detailPage.detailContent.type = source;
            var aJson = {};
            var data = {};
            var aDiv = $(".left_down");
            detailPage.keySearch_html = aDiv.html();
            //获得详情页
            $.ajax({
                type:'GET',
                url:'/YU/html/browse/detail/DePage.html',
                success:function(body,heads,status){
                    detailPage.ahtml = body;
                    detailPage.getConfig(metadataId);
                }
            })
        },
        //自动展开当前元数据结点的路径并高亮结点
        autoOpenCurrentData:function(metadataId){
            //ajax 根据id获取node
            var zTree = $.fn.zTree.getZTreeObj("tree");//treeDemo界面中加载ztree的div
            var objTree = $.fn.zTree.getZTreeObj("objectTree");//treeDemo界面中加载ztree的div
            //var dataString = JSON.stringify(data);
            getDataByPost('/show_detail/queryNodeById', {
                nodeId: metadataId,
            }, res=>{
                //取最后一个结点用于展开树、高亮最后一个结点
                var msg = res.data;
                var flag = msg[msg.length-1];
                var lastNode = msg[msg.length-2];
                var index;
                for(var i=0;i<msg.length;i++){
                    if(msg[i]=="1000"){
                        index = i;
                    }
                }
                //对象树1 目录树0
                if (flag == '0'){
                    var firstNode = msg[index+1];
                    var resPnode = zTree.getNodeByParam("nodeId",firstNode);
                    //关闭所有结点
                    zTree.expandAll(false);
                    //模拟点击资源目录树
                    $('#'+resPnode.tId+"_switch").click();
                    //延迟 确保点击回调之后获取到树结点
                    setTimeout(function () {
                        var node = zTree.getNodeByParam("nodeId",lastNode);
                        $("#tab_catalog_title").trigger("click");
                        zTree.cancelSelectedNode();//先取消所有的选中状态
                        zTree.selectNode(node,true);//将指定ID的节点选中
                        zTree.expandNode(node, true, false);//将指定ID节点展开
                    },1500);

                }else {
                    var firstNode = msg[index+2];
                    var objPnode = objTree.getNodeByParam("nodeId",firstNode);
                    objTree.expandAll(false);
                    //模拟点击对象分类树
                    $('#'+objPnode.tId+"_switch").click();
                    //延迟 确保点击回调之后获取到树结点
                    setTimeout(function () {
                        var objnode = objTree.getNodeByParam("nodeId",lastNode);
                        $("#tab_obj_title").trigger("click");
                        objTree.cancelSelectedNode();//先取消所有的选中状态
                        objTree.selectNode(objnode,true);//将指定ID的节点选中
                        objTree.expandNode(objnode, true, false);//将指定ID节点展开
                    },1500);
                }

            });
        },

        getDataSequence:function (metadataId,curClassid) {
            var data={
                classId:curClassid
            };
            getDataByPost('/show_detail/getDetailContents',data,res=>{
                detailPage.Sequence=res.data;
            })
        },
        //获得配置文件
        getConfig: function (metadataId) {
            var data = {
                metadataId: metadataId
            };
            detailPage.autoOpenCurrentData(metadataId);
            getDataByPost('/show_detail/getDetailConfig', data, function (res) {//返回2001.xml文件或者其他xml文件
                try {
                    var msg = res.data;
                    //detailPage.configData = xmlToJson(new DOMParser().parseFromString(msg,"text/html"));
                    detailPage.detailContent.configData = toJson(parseXML(msg));

                    setRelationByProperty(
                        detailPage.detailContent.configData.show.table,
                        detailPage.detailContent.configData.show.detail,
                        "content", "id", "tableid");
                    // console.log("msg after parsing: " +
                    //     detailPage.detailContent.configData.toString());
                    // console.log(detailPage.detailContent.configData);
                    detailPage.getData(metadataId);

                } catch (cer) {
                    console.log(cer);
                    window.location.href = "/404";
                    return;
                }

            });
        },
        //获得元数据
        getData: function (metadataId) {
            var data = {
                metadataId: metadataId
            };
            getDataByPost('/show_detail/getDetailContent', data, function (res) {//content的xml
                var msg = res.data;
                detailPage.detailContent.dataContent = toJson(parseXML(msg));
                if (typeof(detailPage.detailContent.dataContent.Metadata.Ident)!="undefined") {
                    var curClassid="";
                    curClassid=detailPage.detailContent.dataContent.Metadata.Ident.classId;//对象类型 如450为水库
                    if(curClassid !=null ){
                        detailPage.getDataSequence(metadataId,curClassid);
                    }
                }
                // console.log(detailPage.detailContent.dataContent);
                detailPage.refresh();

                detailPage.readConfigFile(metadataId);
            });
        },
        //页面刷新
        refresh: function () {
            try {
                var tmp = detailPage.detailContent
                var dHtml = detailPage.keySearch_html
                var html = bt(detailPage.ahtml,
                    {
                        tplData: detailPage.detailContent,
                    });
                var aDiv = $(".left_down");
                $("#pagination").empty();
                aDiv.html(html);
                aDiv.trigger("create");
                detailPage.detailContent = tmp
                detailPage.keySearch_html = dHtml
                $("#title").append(eval("detailPage.detailContent.dataContent." +
                    detailPage.detailContent.configData.show.detail[0].path));
            } catch (cer) {
                console.log(cer);
            }
        },

        createMap: function () {
            var height = $("#tab_0 .table").height();
            $("#mapDiv").css("height", height);
            $("#mapDiv").css("max-height", 350);
            var map;
            rl_lat = [];
            r_lat=[];
            r_long=[];
            rl_long=[];
            try {
                map = new T.Map("mapDiv");
                //经纬度获取
                var detailConfigs = detailPage.detailContent.configData.show.detail;
                var detailORMap=detailPage.detailContent.dataContent.Metadata.mdExtInfo.obj_att;

                if(detailORMap!=undefined){
                    for(i=0;i<detailORMap.length;i++) {
                        if (detailORMap[i].key.split("纬度").length > 1) {
                            rl_lat.push(detailORMap[i].value);
                            console.log("rl_lat   :::"+rl_lat);
                            if(detailORMap[i].key.split("右上角纬度").length > 1 || detailORMap[i].key.split("终点纬度").length > 1){
                                r_lat.push(detailORMap[i].value);
                            }
                        }
                        if (detailORMap[i].key.split("经度").length > 1) {
                            rl_long.push(detailORMap[i].value);
                            if(detailORMap[i].key.split("右上角经度").length > 1 || detailORMap[i].key.split("终点经度").length > 1){
                                r_long.push(detailORMap[i].value);
                            }
                        }
                    }
                    if(rl_lat.length==2 && rl_long.length==2){
                        var up_right_lat = r_lat[0];
                        var up_right_long = r_long[0];
                        for(i=0;i<rl_lat.length;i++){
                            if(rl_lat[i]!=up_right_lat){
                                var up_left_lat = rl_lat[i];
                            }
                        }
                        for(j=0;j<rl_long.length;j++){
                            if(rl_long[j]!=up_right_long){
                                var up_left_long = rl_long[j];
                            }
                        }
                        var latitude = (parseFloat(up_right_long) + parseFloat(up_left_long)) / 2;
                        var longitude = (parseFloat(up_right_lat) + parseFloat(up_left_lat)) / 2;
                        var zoom = detailPage.getZoom(parseFloat(up_right_long), parseFloat(up_left_long), parseFloat(up_right_lat), parseFloat(up_left_lat));
                        map.centerAndZoom(new T.LngLat(latitude, longitude), zoom);
                        var bounds = new T.LngLatBounds(new T.LngLat(parseFloat(up_right_long), parseFloat(up_right_lat)), new T.LngLat(parseFloat(up_left_long), parseFloat(up_left_lat)));
                        // :::test
                        //map.centerAndZoom(new T.LngLat(111.2514,28.33324),13);
                        //var bounds = new T.LngLatBounds(new T.LngLat(111.2514,28.33324),new T.LngLat(110.909,27.99991));
                        var rect = new T.Rectangle(bounds);
                        map.addOverLay(rect);
                    }else {
                        var zoom = 12;
                        var up_left_lat = rl_lat[0];
                        var up_right_long = rl_long[0];
                        map.centerAndZoom(new T.LngLat(parseFloat(up_right_long), parseFloat(up_left_lat)), zoom);
                        var marker = new T.Marker(new T.LngLat(parseFloat(up_right_long), parseFloat(up_left_lat)));
                        map.addOverLay(marker);

                    }
                }

            }catch (cer) {
                console.log(cer);
            }
        },
        getZoom: function (maxJ, minJ, maxW, minW) {
            if (maxJ == minJ && maxW == minW) return 13;   // 经纬度相等时
            var diff = maxJ - minJ;
            if (diff < (maxW - minW)) diff = maxW - minW;  // diff取较大的差值
            diff = parseInt(10000 * diff) / 10000;
            var zoomArr = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);    // 映射关系，
            var diffArr = new Array(180, 90, 30, 10, 5, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.008, 0.004, 0.002);

            for (var i = 0; i < diffArr.length; i++) {
                if ((diff - diffArr[i]) >= 0) {
                    return zoomArr[i];
                }
            }
            return 14;

        },
        //读取配置文件获得TAB页标题
        readConfigFile: function (metadataId) {
            var data = {
                metadataId:metadataId
            };
            getDataByPost('/show_detail/GetDetail',data,function(msg){
                detailPage.datailTable = msg.data;
                detailPage.parseConfigFile();
            });
        },
        //解析配置文件得到t_tablename
        parseConfigFile: function () {
            $("#t_tablename").empty();
            for (var i = 0; i < detailPage.datailTable.length; i++) {
                if (i == 0)
                    $("#t_tablename").append("<li style=\"width: " + 100 / detailPage.datailTable.length + "%\" class=\"active\"><a href=\"#tab_" + detailPage.datailTable[i].id + "\" data-toggle=\"tab\" aria-expanded=\"false\">" + detailPage.datailTable[i].tablename + "</a></li>")
                else
                    $("#t_tablename").append("<li style=\"width: " + 100 / detailPage.datailTable.length + "%\" class=\"\"><a href=\"#tab_" + detailPage.datailTable[i].id + "\" data-toggle=\"tab\" aria-expanded=\"false\">" + detailPage.datailTable[i].tablename + "</a></li>")
            }
            detailPage.detailinfo();
        },
        //生成各TAB标题和框架
        tableTed: function () {
            $("#t_table").empty();
            var detailConfigs = detailPage.detailContent.configData.show.detail;
            tableIDsWithMap = [];
            for (var j = 0; j < detailConfigs.length; j++) {
                if (detailConfigs[j].type == 2){
                    tableIDsWithMap.push(detailConfigs[j].tableid);
                    console.log("tableIDsWithMap:::"+tableIDsWithMap);
                }
            }
            for (var i = 0; i < detailPage.datailTable.length; i++) {
                var containsMap = false;
                for (var j = 0; j < tableIDsWithMap.length; j++ ){
                    if ( i == tableIDsWithMap[j] ){
                        containsMap = true;
                        break;
                    }
                }
                $("#t_table").append(detailPage.createTable(detailPage.datailTable[i].id, containsMap));
            }
        },
        createTable: function(id, containsMap){
            var detailConfigs = detailPage.detailContent.configData.show.detail;
           
            var isMapVisible=false;

            var tabDescription = " <div class=\" tab-pane "+ (id == 0 ?  "active": "" ) +  " \"  id=\"tab_" + id + "\">";
            tabDescription += "<table id=\"table_" + id + "\" class=\"table table-bordered table-striped dataTable\" ";

            if (containsMap  && isMapVisible){
                tabDescription += "style=\"width:69%;float: left\">\n";
            } else {
                tabDescription += "style=\"width:100%;float: left\">\n";
            }
            tabDescription += "<thead style=\"font-size: 14px; background-color: #488AC6; color: white\">" +
                "<td style='width:40%'>元数据项</td><td>内容</td></thead>";
            tabDescription += "<tbody id=\"tbody_" + id + "\"></tbody></table>";
            if (containsMap  && isMapVisible) {
                tabDescription += "<div  id=\"mapDiv\" style=\"border:2px #488AC6 solid;width:30%;float: right\"></div>"
            }
            tabDescription += "</div>"

            return tabDescription;
        },
        //详情页信息
        detailinfo:function () {
            var detailConfigs = detailPage.detailContent.configData.show.detail;
            var detailTable = detailPage.detailContent.configData.show.table;
            detailPage.tableTed();
            for (var i =0 ; i < detailPage.datailTable.length; i++){
                var dom = $("#tbody_" + detailPage.datailTable[i].id);
                dom.empty();
                for (var j in detailConfigs){
                    if (detailConfigs[j].tableid == i){
                        if (detailConfigs[j].type == 0) {
                            // 属性名从showDetail配置文件读取，属性值从元数据内容读取
                            var detailValue = eval("detailPage.detailContent.dataContent." +
                                detailConfigs[j].path);
                            if (detailValue != null) {
                                dom.append("<tr><td>"
                                    + detailConfigs[j].name + "</td><td>"
                                    + detailValue
                                    + "</td></tr>");
                            }
                        } else if (detailConfigs[j].type == 1) {
                            // 属性名和属性值均从元数据内容读取
                            var detailProperty = eval("detailPage.detailContent.dataContent." +
                                detailConfigs[j].path);
                            ww = detailPage.Sequence;
                            res = [];
                            for(var keys in ww){
                                for (var p in detailProperty) {
                                    var key1 =detailProperty[p].key;
                                    var value1=detailProperty[p].value;
                                    if(ww[keys]==key1){
                                        res.push({key: key1, value: value1});
                                    }else {
                                        continue;
                                    }
                                }
                            }
                            for(var m in res){
                                dom.append("<tr><td>"
                                    + res[m].key + "</td><td>"
                                    + res[m].value
                                    + "</td></tr>");
                            }
                        }


                    }
                }
            }
            detailPage.createMap();
        },

        //详情页返回上一页
        goBack: function () {
            var aDiv = $(".left_down");
            aDiv.html(detailPage.keySearch_html);
            $("#pagination").Paging({
                pagesize: keySearch.pageSize,
                count: keySearch.count,
                current: keySearch.pageNo,
                toolbar: true,
                callback: function (page, size, count) {
                    //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    keySearch.pageNo = page;
                    keySearch.getOnePage();
                }
            });

            keySearch.renderDynamicTree();

        }
    },
});