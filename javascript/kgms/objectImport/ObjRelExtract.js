/**
 Created by Jiamin Lu, 2018/6/1
 页面通过 lazy load 方法进行加载。
*/

ObjRelExtract= {
    //全局变量

    load: function () {
        //------- 以下代码为所有模块 load 函数必须添加的内容  --------------------------------
        // CatalogPage.pageLeave();  //提示保存资源目录管理页面中未保存的编辑状态
        $(".sidebar-menu .treeview-menu li").removeClass("active");  //清空框架菜单栏的状态
        $(".sidebar-menu .objextract").addClass("active");  //点亮当前页面的菜单项
        $("#pagination").empty();  //清空框架内置分页器
        $("#text1").empty();       //清空框架内容结果数据显示器
        //--------------- 默认代码至此结束 ------------------------------------------------
        ObjRelExtract.showPage();
    }
    , showPage: function() {

        var url = "/objectImport/objRelExtractPage";
        var data={};
        getStringData(url, data, function(msg){
            $(".content-wrapper").html(msg);
            Permission.ShieldButton();
        });
    },
};

