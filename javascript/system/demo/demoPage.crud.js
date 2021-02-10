/**
 Created by Jiamin Lu, 2018/6/1
 页面通过 lazy load 方法进行加载。
*/

var isNodeInfoCorrect = true;

CRUDDemoPage = {
    //全局变量

    load: function () {
        //------- 以下代码为所有模块 load 函数必须添加的内容  --------------------------------
        CatalogPage.pageLeave();  //提示保存资源目录管理页面中未保存的编辑状态
        $(".sidebar-menu .treeview-menu li").removeClass("active");  //清空框架菜单栏的状态
        $(".sidebar-menu .crudDemo").addClass("active");  //点亮当前页面的菜单项
        $("#pagination").empty();  //清空框架内置分页器
        $("#text1").empty();       //清空框架内容结果数据显示器
        //--------------- 默认代码至此结束 ------------------------------------------------

        var data = {};
        var firstPage = 1;
        var defaultPageSize = 10;
        CRUDDemoPage.showPage(firstPage, defaultPageSize);
    }

    //初始化列中结果的数量
    , initializeResultNum: function (num){
        $("#text1").text("结果数量： " + num);
    }

    , setPageSize: function (pageSize) {
        $("#length_selector").val(pageSize);
    }

    //设置分页器
    , setPagination: function (pageSize, currentPage, totalSize) {
        $("#pagination").empty();
        $("#pagination").Paging({
            // paging 中的具体参数见 paging.js
            pagesize: pageSize,
            count: totalSize,
            toolbar: true,
            current: currentPage,
            callback: function (page, size, count) {
                //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                CRUDDemoPage.showPage(page, size);
            }
        });
    }

    //加载并显示特定页的数据
    , showPage: function(currentPage, selectedSize) {
        var pageSize = (selectedSize != null) ? selectedSize : $("#length_selector").val();
        if (currentPage == null) currentPage = 1;

        // 传递“选择全部结果”的状态给新的页面
        var allChecker = document.getElementById("allChecker");
        var allSelected = false;
        if (allChecker != null) {
            allSelected = allChecker.checked;
        }

        // 针对节点路径中关键词的过滤
        var nodePathWordInput = document.getElementById("nodePathWord");
        var nodePathWord = "";
        if (nodePathWordInput != null){
            nodePathWord = $("#nodePathWord").val();
        }

        // 针对节点细节字段的过滤
        var details = {};
        if (document.getElementById("detailConditions") != null) {
            details.nodeID      = $("#nodeid").val();
            details.pNodeID     = $("#pnodeid").val();
            details.nodeName    = $("#nodeName").val();
            details.pathWord    = $("#pathWord").val();
        }

        var url = '/demo/CRUDCatalogNodes';
        var data = {};
        data.pageSize = pageSize;
        data.currentPage = currentPage;
        data.allSelected = allSelected;
        data.nodePathWord = nodePathWord;
        data.details = details;

        getStringData(url, JSON.stringify(data), function(msg){
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
        })
    }

    //设置每一行记录的选择状态
    , setCellCheckerStatus: function (status) {
        $("input[name='cellChecker']").each(function () {
            $(this).prop('checked',status);
        })
    }

    //更新“全选当前页”
    , selectPage: function () {
        var pageChecker = document.getElementById("pageChecker");
        var tableChecker = document.getElementById("tableChecker");
        var allChecker = document.getElementById("allChecker");

        if (pageChecker.checked == true){
            tableChecker.checked = true;
            allChecker.checked = false;
            CRUDDemoPage.setCellCheckerStatus(true);
        } else {
            tableChecker.checked = false;
            CRUDDemoPage.setCellCheckerStatus(false);
        }
    }

    //更新“全选当前表格”，同当前页面的更新，但需要设置不同的函数，以便对不同来源的变化进行响应
    , selectTable: function () {
        var pageChecker = document.getElementById("pageChecker");
        var tableChecker = document.getElementById("tableChecker");
        var allChecker = document.getElementById("allChecker");

        if (tableChecker.checked == true){
            pageChecker.checked = true;
            allChecker.checked = false;
            CRUDDemoPage.setCellCheckerStatus(true);
        } else {
            pageChecker.checked = false;
            CRUDDemoPage.setCellCheckerStatus(false);
        }
    }

    //更新“全选所有结果”
    , selectAll: function () {
        var pageChecker = document.getElementById("pageChecker");
        var tableChecker = document.getElementById("tableChecker");
        var allChecker = document.getElementById("allChecker");

        if (allChecker.checked == true){
            pageChecker.checked = false;
            tableChecker.checked = false;
            CRUDDemoPage.setCellCheckerStatus(true);
        } else {
            pageChecker.checked = false;
            tableChecker.checked = false;
            CRUDDemoPage.setCellCheckerStatus(false);
        }
    }

    //若有记录行未被选中，则取消“全选当页”，“全选当前表格”或“全选所有结果"的选项
    , selectCell: function () {
        var existUnchecked = false;
        var cells =  document.getElementsByName("cellChecker");

        for(i=0; i < cells.length; i++){
            if (cells[i].checked == false){
                existUnchecked = true;
                break;
            }
        }

        if (existUnchecked){
            document.getElementById("pageChecker").checked = false;
            document.getElementById("tableChecker").checked = false;
            document.getElementById("allChecker").checked = false;
        } else if ( ! document.getElementById("allChecker").checked){
            document.getElementById("pageChecker").checked = true;
            document.getElementById("tableChecker").checked = true;
        }
    }

    // 接受路径关键字后，检索相关节点记录
    , filterPathWords: function () {
        CRUDDemoPage.showPage(1);
    }

    , filterWithDetails: function () {
        var nodePathWordInput = document.getElementById("nodePathWord");
        nodePathWordInput.value = "";
        CRUDDemoPage.showPage(1);
    }

    //对点击的行进行高亮表示选中了
    , selectRecord: function (obj) {
        if(event.srcElement.tagName=="TD"){
            var cells =  document.getElementsByName("cellChecker");
            curRow=event.srcElement.parentElement;
            var rowIndex = curRow.rowIndex - 1;
            var selected = cells[rowIndex].checked;

            if (selected == true) {
                // 若已选中，则取消选择
                cells[rowIndex].checked = false;
                // curRow.style.background="#3c8dbc";  //需考虑奇偶行的颜色区分
            } else {
                // 若未选中，则添加选择
                cells[rowIndex].checked = true;
                // curRow.style.background="#3c8dbc";
            }

            //根据当前选择情况，对“全选当前页” 和 “全选所有结果” 的状态进行更新
            CRUDDemoPage.selectCell();
        }
    }

    // 对编辑框元素外观进行初始化
    , initializeEidtorElements: function () {
        // 清空所有待编辑文本框的值
        $("input[id$='editor']").each(function () { $(this).prop('value',""); })

        //todo 待优化
        document.getElementById("pnodeid_editor_info").style.color = 'gray';
        document.getElementById("pnodeid_editor_info").innerHTML = "*(必填)";
        document.getElementById("nodename_editor_info").style.color = 'gray';
        document.getElementById("nodename_editor_info").innerHTML = "*(必填)";
    }

    // 对编辑框内容进行初始化
    , initializeNodeEditor: function (isNew) {
        var nodeID      = null;
        var pnodeID     = null;
        var nodeName    = null;
        var treeID      = null; // 不在catalogNodeList中
        var nodeDetail  = null; // 不在catalogNodeList中
        var nodePath    = null;
        var nodeVisible = null; // 不在catalogNodeList中
        var nodeCode    = null;

        CRUDDemoPage.initializeEidtorElements();

        if (isNew){
            // 创建一个新的节点，返回一个新的节点ID
            var url = '/demo/createNewNode';
            var data = {};
            getDataByGet(url, data, function (msg) {
                nodeID = msg["nodeid"];
                document.getElementById("nodeid_editor").value = nodeID;
            })
        } else {
            // 获取所选择编辑的节点信息
            var cells =  document.getElementsByName("cellChecker");
            var selectedNum = 0;
            var selectedRowIndex = -1;
            for(i=0; i < cells.length; i++){
                if (cells[i].checked == true){
                    selectedNum++;
                    if (selectedNum == 1){
                        selectedRowIndex = i + 1;
                    }
                }
            }
            if (selectedNum == 0){
                alert("未选择待编辑的目录节点");
                return;
            } else if (selectedNum > 1){
                alert("无法同时编辑多个目录节点");
                return;
            }

            var rows = document.getElementById("catalogNodeList").rows;
            var selectedRow = rows[selectedRowIndex];
            nodeID      = selectedRow.cells[1].innerHTML;
            pnodeID     = selectedRow.cells[2].innerHTML;
            nodeName    = selectedRow.cells[3].innerHTML;
            nodePath    = selectedRow.cells[4].innerHTML;
            nodeCode    = selectedRow.cells[5].innerHTML;

            document.getElementById("nodeid_editor").value = nodeID;
            document.getElementById("pnodeid_editor").value = pnodeID;
            document.getElementById("nodename_editor").value = nodeName;
            document.getElementById("nodepath_editor").value = nodePath;
            document.getElementById("nodecode_editor").value = nodeCode;

            $("#nodeEditor").modal('show');
        }
    }

    // 辅助用方法，来打印出 obj 中所有的值。
    , printObj: function (obj) {
        var output = "";
        for(var i in obj){
            var property=obj[i];
            output+=i+" = "+property+"\n";
        }
        console.log(output);
    }

    // 对父节点 ID 进行验证，必须是已存在的结点 ID
    , validatePNodeID: function (){
        var pnodeid = document.getElementById("pnodeid_editor").value;
        var pnodeid_info = document.getElementById("pnodeid_editor_info");
        var treeid = document.getElementById("treeid_selector").value;

        if (pnodeid.trim().length != 0){
            pnodeid_info.innerHTML = "×";
            pnodeid_info.style.color = "red";

            var re=/^[1-9]\d*$/;
            if (re.test(pnodeid)){
                var url = '/demo/existNode/' + treeid + '/' + pnodeid;
                var data = {};
                var nodeExist = false;
                getDataByGet1(url, data, function(msg){
                    nodeExist = msg["exist"];
                })
                if (nodeExist) {
                    pnodeid_info.innerHTML = "√";
                    pnodeid_info.style.color = "green";

                    var url = '/demo/retrivePath/' + treeid + '/' + pnodeid;
                    var data = {};
                    var nodePath = "";
                    getDataByGet1(url, data, function(msg){
                        nodePath = msg["path"];
                    })
                    nodePath += ( '/' + document.getElementById("nodename_editor").value);
                    document.getElementById("nodepath_editor").value = nodePath;
                    return;
                } else {
                    document.getElementById("nodepath_editor").value = "";
                }
            }
        }
    }

    // 对节点名称进行验证，只要非空即可
    , validatePNodeName: function (){
        var nodename = document.getElementById("nodename_editor").value;
        var nodename_info = document.getElementById("nodename_editor_info");
        if (nodename.trim().length == 0){
            nodename_info.innerHTML = "×";
            nodename_info.style.color = "red";
        } else {
            nodename_info.innerHTML = "√";
            nodename_info.style.color = "green";
            return true;
        }
    }

    // 提交结点内容并更新
    , submitNodeChanges:function () {
        //todo, 如果存在错误消息，则不可被提交

        //todo, 如果确认提交，则保存内容至数据库
    }
}