/**
 Created by Jiamin Lu, 2018/6/1
 页面通过 lazy load 方法进行加载。
*/

KGConfigPage= {
    //全局变量

    load: function () {
        //------- 以下代码为所有模块 load 函数必须添加的内容  --------------------------------
        // CatalogPage.pageLeave();  //提示保存资源目录管理页面中未保存的编辑状态
        $(".sidebar-menu .treeview-menu li").removeClass("active");  //清空框架菜单栏的状态
        $(".sidebar-menu .kgconfig").addClass("active");  //点亮当前页面的菜单项
        $("#pagination").empty();  //清空框架内置分页器
        $("#text1").empty();       //清空框架内容结果数据显示器
        //--------------- 默认代码至此结束 ------------------------------------------------

        var data = {};
        var firstPage = 1;
        var defaultPageSize = 5;
        KGConfigPage.showPage(firstPage, defaultPageSize);
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

        var url = "/objectImport/ontoRelCfg";

        var data={};
        getStringData(url, data, function(msg){
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
        });
    },
    postData:function(tableName,rel,csrf){
        var data = {
            "tableName":tableName,
            "rel":rel
        };
        getDataByPostWithToken("/objectImport/addObjRelConfig",data,csrf,function(response){
            alert("配置成功！")
        })
    }
}

