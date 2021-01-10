var that;
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "nodeId",
            pIdKey: "pnodeId",
            rootPId: "0"
        },
        key: {
            name: "nodeName"
        }
    },
    check: {
        enable: true
    }
};
var app = new Vue({
    el: "#vue",
    data: {
        tempNode: '',
        dataBaseId: '',
        tempEditId: '',
        tempDBId: '',
        departmentId: '',
        zTreeObj: '', //资源目录树
        dataSourceList: ''
    },
    mounted() {
        that = this;
        $('.objDatepicker').datepicker({
            autoclose: true,
            language: "zh-CN",
            todayHighlight: true
        });

        //初始化资源目录树
        getDataByGet('/resource_dir/initial_resource_dirtree', '', res => {
            that.zTreeObj = $.fn.zTree.init($("#addTree3"), setting, res.data);
        })

        //
        that.loadTable();
    },
    methods: {
        //加载数据库连接表
        loadTable: function () {
            getDataByGet('/system_rdbms/getDataBaseTolCount', '', res => {
                $("#pagination").empty();
                $("#pagination").Paging({
                    pagesize: 10, count: res.data, toolbar: true, callback: function (page, size, count) {
                        that.changePage(page, size);
                    }
                });
                that.changePage(1, 10);
            }, err => {
                toastr.error("loadTable error！");
                console.log(err);
            })
        },

        changePage: function (nowPage, size) {
            var data = {
                page: nowPage,
                size: size
            }
            getDataByPost(
                '/system_rdbms/getDataBaseAndDataSource',
                data,
                res => {
                    dataSourceList = res.data;
                    $("#property_body").empty();
                    for (var o in dataSourceList) {
                        if (dataSourceList[o].realname == '"null"') dataSourceList[o].realname = "";
                        if (dataSourceList[o].deptment == '"null"') dataSourceList[o].deptment = "";
                        if (dataSourceList[o].dbdesc == '"null"') dataSourceList[o].dbdesc = "";
                        if (dataSourceList[o].recordnum == '"null"') dataSourceList[o].recordnum = "0";
                        $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked2'/></span></div></td><td>" + dataSourceList[o].id + "</td><td> " + dataSourceList[o].dbcnname + "</td><td>" + dataSourceList[o].sid + "</td><td>" + "" + "</td><td>" + dataSourceList[o].dbdesc + "</td><td>" + dataSourceList[o].tablenum + "</td><td>" + dataSourceList[o].recordnum + "</td><td>" + dataSourceList[o].updatestamp + "</td><td></td></tr>");
                    }
                },
                err => {
                    toastr.error("loadTable error！");
                })
        },

        //选择单位
        showSelectDpModel: function () {
            var aJson = {};
            $("#modelTree3").modal("show");
        },

        //确认所选择的单位
        selectDp: function () {
            function filter(node) {
                return (node.checked == true && node.level == 1);
            }
            var treeObj = $.fn.zTree.getZTreeObj("addTree3");
            var node = treeObj.getNodesByFilter(filter, true); // 仅查找一个节点
            if (node == null) {
                toastr.warning("您还没有选择部门！");
            } else {
                departmentId = node.nodeId;
                var text = node.nodeName;
                $("#department").val(text);
            }
            $("#modelTree3").modal("hide");
        },

        //保存新建的链接
        create_connect: function () {
            var b = that.checkdatabase_chinesename('database_chinesename', 'database_chinesename_info');
            var c = that.checkdatabaseSid('databaseSid', 'databaseSid_info');
            var e = that.checkIP('IP', 'IP_info');
            var f = that.checkport('port', 'port_info');
            var g = that.checkusername('username', 'username_info');
            var h = that.checkpassword('password', 'password_info');
            if (b && c && e && f && g && h) {
                var DBtype = $("#DBtype").val();
                var database_chinesename = $("#database_chinesename").val();
                var databaseSid = $("#databaseSid").val();
                var IP = $("#IP").val();
                var port = $("#port").val();
                var username = $("#username").val();
                var password = $("#password").val();
                var database_describe = $("#database_describe").val();
                //参数准备工作
                var data = {
                    DBtype: DBtype,
                    database_chinesename: database_chinesename,
                    databaseSid: databaseSid,
                    IP: IP,
                    port: port,
                    username: username,
                    password: password,
                    department: departmentId,             //在选择单位中赋值
                    database_describe: database_describe
                };
                //后台方法调用
                getDataByPost(
                    '/system_rdbms/createConnect',
                    data,
                    res => {
                        toastr.success("新建连接成功！");
                        that.loadTable();
                        departmentId = null;
                    },
                    err => {
                        toastr.error("新建连接失败！");
                        departmentId = null;
                    }
                )

                //将模态框内容重置
                $('#exampleModal').modal('hide');
                document.getElementById("database_chinesename").value = "";
                document.getElementById("databaseSid").value = "";
                document.getElementById("IP").value = "";
                document.getElementById("port").value = "";
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
                document.getElementById("department").value = "";
                document.getElementById("database_describe").value = "";
                document.getElementById("database_chinesename_info").innerHTML = "*(必填)";
                document.getElementById("databaseSid_info").innerHTML = "*(必填)";
                document.getElementById("IP_info").innerHTML = "*(必填)";
                document.getElementById("port_info").innerHTML = "*(必填)";
                document.getElementById("username_info").innerHTML = "*(必填)";
                document.getElementById("password_info").innerHTML = "*(必填)";
            }
        },

        //数据库参数检查
        checkdatabase_chinesename: function (inputid, info) {
            var a = document.getElementById(inputid).value;
            var b = document.getElementById(info);
            if (a == "") {
                b.innerHTML = "<font color='red'>× 数据库中文名称不能为空!</font>";
                return false;
            }
            else {
                b.innerHTML = "<font color='green'>√</font>";
                return true;
            }
        },
        checkdatabaseSid: function (inputid, info) {
            var a = document.getElementById(inputid).value;
            var b = document.getElementById(info);
            if (a == "") {
                b.innerHTML = "<font color='red'>× 数据库SID不能为空!</font>";
                return false;
            }
            else {
                b.innerHTML = "<font color='green'>√</font>";
                return true;
            }
        },
        checkIP: function (inputid, info) {
            var a = document.getElementById(inputid).value;
            var b = document.getElementById(info);
            var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;//正则表达式
            if (a == "") {
                b.innerHTML = "<font color='red'>× IP不能为空!</font>";
                return false;
            }
            else {
                if (re.test(a)) {
                    b.innerHTML = "<font color='green'>√</font>";
                    return true;
                }
                else {
                    b.innerHTML = "<font color='red'>× 请输入正确的IP！</font>";
                    return false;
                }
            }
        },
        checkport: function (inputid, info) {
            var a = document.getElementById(inputid).value;
            var b = document.getElementById(info);
            if (a == "") {
                b.innerHTML = "<font color='red'>× 端口号不能为空!</font>";
                return false;
            }
            else {
                b.innerHTML = "<font color='green'>√</font>";
                return true;
            }
        },
        checkusername: function (inputid, info) {
            var a = document.getElementById(inputid).value;
            var b = document.getElementById(info);
            if (a == "") {
                b.innerHTML = "<font color='red'>× 用户名不能为空!</font>";
                return false;
            }
            else {
                b.innerHTML = "<font color='green'>√</font>";
                return true;
            }
        },
        checkpassword: function (inputid, info) {
            var mypassword = document.getElementById(inputid).value;
            var myDivpassword = document.getElementById(info);
            if (mypassword == "") {
                myDivpassword.innerHTML = "<font color='red'>× 密码不能为空!</font>";
                return false;
            }
            else {
                myDivpassword.innerHTML = "<font color='green'>√</font>";
                return true;
            }
        },

        //删除数据库连接
        deleteDataBase: function () {
            var ID = "";
            var ischeck = document.getElementsByName("isChecked2");
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    id = node.innerHTML;
                    ID += id + ",";
                }
            }
            if (ID.length <= 0) {
                toastr.warning("您还没有选择要删除的数据库");
            }
            else {
                if (confirm("将删除数据库及数据库表的所有信息，确定吗？")) {
                    $("#loading").css('display', 'block');
                    var data = { ID: ID };
                    console.log(data);
                    getDataByPost(
                        '/system_rdbms/deleteDataBase',
                        data,
                        res => {
                            that.loadTable();
                            toastr.success("删除数据库成功！");
                            $("#loading").css('display', 'none');
                        },
                        err => {
                            toastr.error("删除数据库失败！");
                            $("#loading").css('display', 'none');
                        }
                    )
                }
            }
        },

        //打开编辑的模态框
        edit: function () {
            getDataByGet('/resource_dir/initial_resource_dirtree', '', res => {
                that.zTreeObj = $.fn.zTree.init($("#addTree4"), setting, res.data);
                var ischeck = document.getElementsByName("isChecked2");
                var ID = [];
                for (i = 0; i < ischeck.length; i++) {
                    if (ischeck[i].checked == true) {
                        var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                        var id = node.innerHTML;
                        ID.push(id);
                    }
                }
                if (ID.length > 1) {
                    toastr.warning("一次只能选择一个需要编辑的数据库");
                }
                else if (ID.length <= 0) { toastr.warning("您还没有选择要编辑的数据库"); }
                else {
                    tempEditId = null;
                    tempEditId = ID[0];
                    that.edit_connect(id);
                }
            })
        },
        edit_connect: function (id) {
            var zTree = $.fn.zTree.getZTreeObj("addTree4");
            document.getElementById("databasechinesename_info").innerHTML = "*(必填)";
            document.getElementById("database_sid_info").innerHTML = "*(必填)";
            document.getElementById("IPaddr_info").innerHTML = "*(必填)";
            document.getElementById("portnum_info").innerHTML = "*(必填)";
            document.getElementById("user_name_info").innerHTML = "*(必填)";
            document.getElementById("key_info").innerHTML = "*(必填)";
            document.getElementById("editDepartment_info").innerHTML = "*(必填)";
            var data = { ID: id };
            getDataByPost(
                '/system_rdbms/showEditConnect',
                data,
                res => {
                    var node = zTree.getNodeByParam("nodeId", res.data.orgId);
                    $("#DBtype2").val(res.data.dbtype);
                    $("#databasechinesename").val(res.data.dbCName);
                    $("#database_sid").val(res.data.srcSid);
                    $("#IPaddr").val(res.data.ipAddr);
                    $("#portnum").val(res.data.srcPort);
                    $("#user_name").val(res.data.srcUser);
                    $("#key").val(res.data.srcPsw);
                    $("#editDepartment").val(node.nodeName);
                    $("#dbdesc").val(res.data.note);
                    $('#exampleModal1').modal('show');
                }
            )
        },
        showEditDpModel: function () {
            $("#modelTree4").modal("show");
        },
        EditDp: function () {
            function filter(node) {
                return (node.checked == true && node.level == 1);
            }
            var treeObj = $.fn.zTree.getZTreeObj("addTree4");
            var node = treeObj.getNodesByFilter(filter, true); // 仅查找一个节点
            if (node == null) {
                toastr.warning("您还没有选择部门！");
            } else {
                departmentId = node.nodeId;
                var text = node.nodeName;
                $("#editDepartment").val(text);
            }
            $("#modelTree4").modal("hide");

        },
        save_edit: function () {
            var dbtype = $("#DBtype2").val();
            var databasechinesename = $("#databasechinesename").val();
            var database_sid = $("#database_sid").val();
            var IPaddr = $("#IPaddr").val();
            var portnum = $("#portnum").val();
            var user_name = $("#user_name").val();
            var key = $("#key").val();
            var depart = $("#editDepartment").val();
            var dbdesc = $("#dbdesc").val();
            //获得数据源所属单位的ID
            var zTree = $.fn.zTree.getZTreeObj("addTree4");
            var node = zTree.getNodeByParam("nodeName", depart);
            var departId = node.nodeId;
            //参数准备工作
            var data = {
                dbtype: dbtype,
                databasechinesename: databasechinesename,
                database_sid: database_sid,
                IP: IP,
                IPaddr: IPaddr,
                user_name: user_name,
                key: key,
                portnum: portnum,
                department: departId,
                dbdesc: dbdesc,
                ID: tempEditId            //tempEditId在edit()函数中赋值，当前所编辑的databaseId
            };
            //以上两步是play中利用ajax向后台传输参数的准备工作，以后统一用dataJson来做为key值。
            getDataByPost(
                '/system_rdbms/save_edit',
                data,
                res => {
                    $('#exampleModal1').modal('hide');
                    $('#property_body').remove();
                    $('#example1').append("<tbody id='property_body'></tbody>");
                    toastr.success("保存编辑成功!");
                    that.loadTable();
                    tempEditId = null;
                },
                err => {
                    toastr.error("保存编辑失败！");
                    tempEditId = null;
                }
            )
        },

        //测试数据库连接
        testConnect: function () {
            var ID = [];
            var ischeck = document.getElementsByName("isChecked2");
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    tempnode = ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var databaseid = node.innerHTML;
                    ID.push(databaseid);
                }
            }
            if (ID.length <= 0) {
                toastr.warning("您还没有选择要测试的数据库！")
            } else if (ID.length > 1) {
                toastr.warning("一次只能测试一个数据库！");
            } else {
                var data = { databaseid: ID[0] };
                getDataByPost(
                    '/system_rdbms/testConnect',
                    data,
                    res => {
                        if (res.data == true) {
                            tempnode.innerHTML = "连接成功"
                            $("#loading").remove();
                        }
                        else {
                            toastr.error("连接失败！");
                            tempnode.innerHTML = "连接失败";
                            $("#loading").remove();
                        }
                    },
                    err => {
                        toastr.error("测试连接出错！");
                        tempnode.innerHTML = "连接失败";
                        $("#loading").remove();
                    }
                )
            }
        },

        //在模态框中测试数据库连接
        testConnectInModal: function () {
            var ipaddr = document.getElementById("IP").value;//从modal框取ip地址
            var port_number = document.getElementById("port").value;
            var sid = document.getElementById("databaseSid").value;
            var username = $("input[id='username']").val();    //页面中有两个id为username的元素，需要加以区分
            var password = document.getElementById("password").value;
            var dbtype = $("#DBtype option:selected").val();

            var data = {
                ip: ipaddr,
                port: port_number,
                sid: sid,
                user: username,
                password: password,
                dbtype: dbtype
            }
            getDataByPost(
                '/system_rdbms/testConnectInModal',
                data,
                res => {
                    if (res.data == true) {
                        toastr.success("连接成功")
                    } else {
                        toastr.error("连接失败")
                    }
                },
                err => {
                    toastr.error("测试连接出错！")
                }
            )
        },

        //抽取表
        extractTable: function () {
            var ID = [];
            var ischeck = document.getElementsByName("isChecked2");
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    var node1 = ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var node2 = ischeck[i].parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
                    var id = node.innerHTML.replace(/\s+/g, "");
                    var tableNum = node1.innerHTML.replace(/\s+/g, "");
                    var recordNum = node2.innerHTML.replace(/\s+/g, "");
                    ID.push(id);
                }
            }
            if (ID.length <= 0) {
                toastr.warning("您还没有选择要抽取的数据库！");
            } else if (ID.length > 1) {
                toastr.warning("一次只能抽取一个数据库！");
            } else {
                toastr.warning("开始抽取数据，请稍等...");
                $("#loading").css('display', 'block');
                var data = { ID: ID };
                getDataByPost(
                    '/system_rdbms/extractDataTable',
                    data,
                    res => {
                        if (res.data == true) {
                            toastr.success("抽取表成功！");
                        } else {
                            toastr.error("抽取表失败！");
                        }
                        that.loadTable();
                        console.log(res.data);
                        $("#loading").css('display', 'none');
                    },
                    err => {
                        toastr.error("抽取表失败！");
                        $("#loading").css('display', 'none');
                    }
                )
            }
        },

        //查看表信息按钮事件
        seeDataTable: function () {
            var id = null;
            var ID = [];
            var ischeck = document.getElementsByName("isChecked2");
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    id = node.innerHTML.replace(/\s+/g, "");
                    ID.push(id);
                }
            }
            if (ID.length <= 0) { toastr.warning("您还没有选择要查看的数据库！"); }
            else if (ID.length > 1) { toastr.warning("一次只能选择一个数据库！"); }
            else {
                $('.content-wrapper').load('system/rdbms/table_detail.html', function () { });
                that.getDataTable(id);
            }
        },

        //获得指定数据库的所有表信息并展示
        getDataTable: function (id) {
            var data = { databaseId: id };
            getDataByPost(
                '/system_rdbms/loadDataTable',
                data,
                res => {
                    tempDBId = id;
                    $("#pagination").empty();
                    $("#pagination").Paging({
                        pagesize: 10, count: res.data, toolbar: true, callback: function (page, size, count) {
                            that.changeTablePage(page, size);
                        }
                    });
                    that.changeTablePage(1, 10);
                },
                err => {
                    toastr.error("查看数据库失败！");
                }
            )
        },

        //表信息分页
        changeTablePage: function (nowPage, size) {
            var data = {
                page: nowPage,
                size: size
            };
            getDataByPost(
                '/system_rdbms/showDataTable',
                data,
                res => {
                    var num = 0;
                    $("#property_body").empty();
                    console.log(res.data);
                    for (var o in res.data) {
                        num++;
                        if (res.data[o].updatestamp == null) {
                            var updatetime = "";
                        } else {
                            var date = new Date(res.data[o].updatestamp.time);
                            var updatetime = date.Format("yyyy-MM-dd HH:mm:ss");
                        }
                        if (res.data[o].tabCName == null) res.data[o].tabCName = "";
                        if (res.data[o].keyword == null) res.data[o].keyword = "";
                        if (res.data[o].note == null) res.data[o].note = "";
                        $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></span></div></td><td>" + res.data[o].tabId + "</td><td>" + res.data[o].dbId + "</td><td> " + res.data[o].tabEName + "</td><td>" + res.data[o].tabCName + "</td><td>" + res.data[o].keyword + "</td><td>" + res.data[o].note + "</td><td>" + res.data[o].recNum + "</td><td>" + res.data[o].tabSize + "</td><td>" + updatetime + "</td></tr>");
                    }
                },
                err => {
                    toastr.error("查看数据库失败！");
                }
            )
        }






    }
})

//日期格式转化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}