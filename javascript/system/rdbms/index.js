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
        zTreeObj: '', //资源目录树（单位部门部分）
        zTreeObj_Edit: '',
        dataSourceList: ''
    },
    mounted() {
        that = this;
        $('.datepicker').datepicker({
            autoclose: true,
            todayHighlight: true,
            language: "zh-CN"
        });

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
            getDataByGet('/object_manage/getObjTreeByCode?nodeCode=1000', aJson, res => {
                that.zTreeObj = $.fn.zTree.init($("#addTree3"), setting, res);
            })
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
                if (text == "本级") {
                    $("#department").val(node.getParentNode().nodeName);
                } else {
                    $("#department").val(text);
                }
            }
            $("#modelTree3").modal("hide");
        },

        newConn: function () {
            this.restoreModalStatus();
            $('#exampleModal').modal('show');
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

                var status = document.getElementById("saveConnectButton").innerHTML;
                if (status == "保存"){
                    // 后台方法调用
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
                } else if (status == "更新"){
                    data.ID =  tempEditId;
                    getDataByPost(
                        '/system_rdbms/save_edit',
                        data,
                        res => {
                            toastr.success("保存编辑成功!");
                            that.loadTable();
                            tempEditId = null;
                        },
                        err => {
                            toastr.error("保存编辑失败！");
                            tempEditId = null;
                        }
                    )

                }

                //将模态框内容重置
                $('#exampleModal').modal('hide');
                this.restoreModalStatus();
            }
        },

        restoreModalStatus: function (){
            document.getElementById("exampleModalLabel1").innerHTML = "新建数据库连接";
            document.getElementById("saveConnectButton").innerHTML = "保存";

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
            } else if (ID.length <= 0) {
                toastr.warning("您还没有选择要编辑的数据库");
            } else {
                tempEditId = null;
                tempEditId = ID[0];
                that.edit_connect(id);
            }
        },

        edit_connect: function (id){
            document.getElementById("exampleModalLabel1").innerHTML = "编辑数据库连接";
            document.getElementById("saveConnectButton").innerHTML = "更新";
            $('#exampleModal').modal('show');
            $("#loadingModal").css('display', 'block');
            var data = { ID: id };
            var orgId;
            getDataByPost(
                '/system_rdbms/showEditConnect',
                data,
                res => {
                    $("#DBtype").val(res.data.dbtype);
                    $("#database_chinesename").val(res.data.dbCName);
                    $("#databaseSid").val(res.data.srcSid);
                    $("#IP").val(res.data.ipAddr);
                    $("#port").val(res.data.srcPort);
                    $("#username").val(res.data.srcUser);
                    $("#password").val(res.data.srcPsw);
                    orgId = res.data.orgId;
                    // $("#editDepartment").val(node.nodeName);
                    $("#database_describe").val(res.data.note);
                }
            );
            getDataByGet('/object_manage/getObjTreeByCode?nodeCode=1000', {}, res => {
                that.zTreeObj_Edit = $.fn.zTree.init($("#addTree4"), setting, res);

                var zTree4 = $.fn.zTree.getZTreeObj("addTree4");
                var node = zTree4.getNodeByParam("nodeId", orgId);
                $("#department").val(node.nodeName);
                departmentId = orgId;
            })
            $("#loadingModal").css('display', 'none');
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
                document.getElementById("testConnButton").disabled = true;
                $("#loading").css('display', 'block');
                var data = { databaseid: ID[0] };
                getDataByPost(
                    '/system_rdbms/testConnect',
                    data,
                    res => {
                        if (res.data == true) {
                            tempnode.innerHTML = "连接成功";
                            toastr.success("连接成功");
                        }
                        else {
                            toastr.error("连接失败！");
                            tempnode.innerHTML = "连接失败";
                        }
                        document.getElementById("testConnButton").disabled = false;
                        $("#loading").css('display', 'none');
                    },
                    err => {
                        toastr.error("测试连接出错！");
                        tempnode.innerHTML = "连接失败";
                        document.getElementById("testConnButton").disabled = false;
                        $("#loading").css('display', 'none');
                    }
                )
            }
        },

        //在模态框中测试数据库连接
        testConnectInModal: function () {
            $("#loadingModal").css('display', 'block');

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
                    $("#loadingModal").css('display', 'none');
                },
                err => {
                    toastr.error("测试连接出错！");
                    $("#loadingModal").css('display', 'none');
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
                document.getElementById("extractButton").disabled = true;
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
                        document.getElementById("extractButton").disabled = false;
                    },
                    err => {
                        toastr.error("抽取表失败！");
                        $("#loading").css('display', 'none');
                        document.getElementById("extractButton").disabled = false;
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
                            that.changeTablePage(page, size, id);
                        }
                    });
                    //将改js的dataBaseId通过参数方式传递到tabDetail.js中，那边要用到
                    that.changeTablePage(1, 10, id);
                },
                err => {
                    toastr.error("查看数据库失败！");
                }
            )
        },

        //清空搜索条件
        reset: function () {
            $("#dbname").val("");
            $("#dbcnname").val("");
            $("#contacts").val("");
            $("#company").val("");
            $("#startTime").val("");
            $("#endTime").val("");
        },

        //载入检索后符合条件的数据库数量
        loadSpecificTable: function () {
            var dbname = $("#dbname").val();
            var dbcnname = $("#dbcnname").val();
            var contacts = $("#contacts").val();
            var company = $("#company").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            var time_1 = new Date(startTime).getTime();//1的时间戳
            var time_2 = new Date(endTime).getTime();//2的时间戳
            if (time_1 != NaN && time_2 != NaN && time_1 > time_2) {
                toastr.warning("您选择的起始时间晚于截止时间，请重新选择！");
            } else {
                var data = {
                    dbname: dbname,
                    dbcnname: dbcnname,
                    contacts: contacts,
                    company: company,
                    startTime: startTime,
                    endTime: endTime
                };
            }
            getDataByPost(
                '/system_rdbms/loadSpecificTable',
                data,
                res => {
                    $("#pagination").empty();
                    $("#pagination").Paging({
                        pagesize: 10, count: res.data, toolbar: true, callback: function (page, size, count) {
                            that.showSpecificTable(page, size);
                        }
                    });
                    that.showSpecificTable(1, 10);
                },
                err => {
                    toastr.error("查看数据库失败！");
                }
            )
        },

        //载入检索后符合条件的数据库具体信息
        showSpecificTable: function (nowPage, size) {
            var data = {
                page: nowPage,
                size: size
            };
            getDataByPost(
                '/system_rdbms/showSpecificTable',
                data,
                res => {
                    $("#property_body").empty();
                    for (var o in res.data) {
                        var date = new Date(res.data[o].updatestamp);
                        var updatetime = date.Format("yyyy-MM-dd HH:mm:ss");
                        if (res.data[o].realname == "null") res.data[o].realname = "";
                        if (res.data[o].dbdesc == "null") res.data[o].dbdesc = "";
                        if (res.data[o].recordnum == "null") res.data[o].recordnum = "0";
                        if (res.data[o].dbdesc == '"null"') res.data[o].dbdesc = "";
                        $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked2'/></span></div></td><td>" + res.data[o].id + "</td><td> " + res.data[o].dbcnname + "</td><td>" + res.data[o].sid + "</td><td>" + "" + "</td><td>" + res.data[o].dbdesc + "</td><td>" + res.data[o].tablenum + "</td><td>" + res.data[o].recordnum + "</td><td>" + updatetime + "</td><td></td></tr>");
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