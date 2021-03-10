//菜单栏前端交互逻辑控制
MainPage = {
    inRes: false,
    inObj: false,
    inDep: false,
    //获得菜单栏json
    getMenu: function () {
        getDataByPost('/getMenu?roleCode=' + sessionStorage.getItem("role"), '', function (res) {
            MainPage.showMenu(res.data);

        }, err => {
            toastr.error(err)
        })
    },
    setContent: function (href, classname) {
        if (classname != "catalog") {
            if (MainPage.inRes) {
                res.pageLeave();
            }
        } else if (classname != "object") {
            if (MainPage.inObj) {
                obj.pageLeave();
            }
        } else if (classname != "HWCatalog") {
            if (MainPage.inDep) {
                dep.pageLeave();
            }
        }
        if (classname != 'none') {
            $(".sidebar-menu li li").removeClass("active");
            $(".sidebar-menu").find("." + classname).addClass("active");
            $("#pagination").empty();
            $("#text1").empty();
            $('.content-wrapper').load(href, function () { });
        } else {
            //如果是主页
            window.location.assign(href);
        }

    }

    //生成菜单栏
    , showMenu: function (menuJson) {
        $(".sidebar-menu");
        var aHtml = "";
        //遍历json数组,拼接菜单树
        for (var i = 0; i < menuJson.length; i++) {
            if (menuJson[i].children.length == 0 && menuJson[i].show == "show") {
                aHtml += "<li class=" + menuJson[i].className + ">" +
                    "<a href='#' onclick=MainPage.setContent('" + menuJson[i].href + "','none') style='background-color:#E7F3FA'> " +
                    "<span>" + menuJson[i].name + "</span></a></li>";
            } else if (menuJson[i].show == "show") {
                aHtml += "<li class='treeview " + menuJson[i].className + "'>" +
                    "<a href='#' style='background-color:#E7F3FA'> " +
                    "<span>" + menuJson[i].name + "</span><span class='pull-right-container'>" +
                    "<i class='fa fa-plus-circle pull-right'></i>" +
                    "<i class='fa fa-minus-circle pull-right'></i></span>" +
                    "</a><ul class='treeview-menu'>";
                for (var j = 0; j < menuJson[i].children.length; j++) {
                    if (menuJson[i].children[j].children.length == 0 && menuJson[i].children[j].show == "show") {
                        aHtml += " <li class=" + menuJson[i].children[j].className + ">" +
                            "<a href='#' onclick=MainPage.setContent('" + menuJson[i].children[j].href + "','" + menuJson[i].children[j].className + "')>" +
                            "<i class='fa fa-folder'></i>" + menuJson[i].children[j].name + "</a></li>";
                    }
                    else if (menuJson[i].children[j].show == "show") {
                        aHtml += "<li class='treeview " + menuJson[i].children[j].className + "'>" +
                            "<a href='#' style='background-color:#E7F3FA'> " +
                            "<i class='fa fa-folder'></i>" +
                            "<span>" + menuJson[i].children[j].name + "" + "</span><span class='pull-right-container'>" +
                            "<i class='fa fa-plus-circle pull-right'></i>" +
                            "<i class='fa fa-minus-circle pull-right'></i></span>" +
                            "</a><ul class='treeview-menu'>";
                        for (var k = 0; k < menuJson[i].children[j].children.length; k++) {

                            aHtml += " <li class=" + menuJson[i].children[j].children[k].className + ">" +
                                "<a href='#' onclick=MainPage.setContent('" + menuJson[i].children[j].children[k].href + "','" + menuJson[i].children[j].children[k].className + "')>" +
                                "<i class='fa fa-folder'></i>" + menuJson[i].children[j].children[k].name + "</a></li>";

                        }
                        aHtml += "</ul> </li>";
                    }
                }
                aHtml += "</ul> </li>";
            }
        }
        $(".sidebar-menu").append(aHtml);

        MainPage.welcome();
    }
    , load: function () {

        $(".sidebar-menu li").removeClass("active");
        $(".sidebar-menu .main").addClass("active");
        $(".sidebar-menu li ul").css('display', 'none');

        window.location.href = "/index"

    }
    , welcome: function () {
        $("#pagination").empty();
        $("#text1").empty();
    }
}
