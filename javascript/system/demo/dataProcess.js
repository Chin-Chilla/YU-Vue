/**
 Created by Wei Wu, 2020/5/26
 */

DataProcessPage = {
    load: function () {
        $(".sidebar-menu .treeview-menu li").removeClass("active");  //清空框架菜单栏的状态
        $(".sidebar-menu .frameDemo").addClass("active");  //点亮当前页面的菜单项
        $("#pagination").empty();  //清空框架内置分页器
        $("#text1").empty();       //清空框架内容结果数据显示器
        //--------------- 默认代码至此结束 ------------------------------------------------

        var data = {};
        getStringData('/showDataProcess', data, function (msg){
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
        });
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
                KGConfigPage.showPage(page, size);
            }
        });
    }

    //加载并显示特定页的数据
    , showPage: function(currentPage, selectedSize) {
        var pageSize = (selectedSize != null) ? selectedSize : $("#length_selector").val();
        if (currentPage == null) currentPage = 1;

        var url = "/objectImport/ontoRelCfg/" + pageSize + "/" + currentPage;

        var data={};
        getStringData(url, data, function(msg){
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
        });
    }
}