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
        $('.datepicker').datepicker({
            autoclose: true,
            todayHighlight: true,
            language: "zh-CN"
        });

        //初始化资源目录树
        getDataByGet('/resource_dir/initial_resource_dirtree', '', res => {
            that.zTreeObj = $.fn.zTree.init($("#addTree3"), setting, res.data);
        })
    },
    methods: {
        //表信息分页
        changeTablePage: function (nowPage, size, id) {
            // 接受从index.js传来的id
            dataBaseId = id;
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
                        $("#property_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked2'/></span></div></td><td>" + res.data[o].tabId + "</td><td>" + res.data[o].dbId + "</td><td> " + res.data[o].tabEName + "</td><td>" + res.data[o].tabCName + "</td><td>" + res.data[o].keyword + "</td><td>" + res.data[o].note + "</td><td>" + res.data[o].recNum + "</td><td>" + res.data[o].tabSize + "</td><td>" + updatetime + "</td></tr>");
                    }
                },
                err => {
                    toastr.error("查看数据库失败！");
                }
            )
        },

        //查询表的搜索条件重置
        resetForm: function () {
            $("#tableName").val("");
            $("#tablecnName").val("");
            $("#startTime").val("");
            $("#endTime").val("");
        },

        //根据搜索条件查询表的提交按钮
        submitForm: function () {
            var tableName = $("#tableName").val();
            var tablecnName = $("#tablecnName").val();
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();

            var data = {
                tableName: tableName,
                tablecnName: tablecnName,
                startTime: startTime,
                endTime: endTime,
                databaseId: dataBaseId,
            };

            getDataByPost(
                '/system_rdbms/getTabNumByCon',
                data,
                res => {
                    $("#pagination").empty();
                    $("#pagination").Paging({
                        pagesize: 10, count: res.data, toolbar: true, callback: function (page, size, count) {
                            that.changeTablePage1(page, size);
                        }
                    });
                    that.changeTablePage1(1, 10);
                },
                err => {
                    toastr.error("查看表失败！");
                }
            )
        },

        //根据搜索条件查询表的具体信息
        changeTablePage1: function (nowPage, size) {
            var data = {
                page: nowPage,
                size: size
            };
            getDataByPost(
                '/system_rdbms/getTabInfoByCon',
                data,
                res => {
                    console.log(res.data);
                    var num = 0;
                    $("#property_body").empty();
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
                    toastr.error("查看表失败！");
                }
            )
        },

        //查看表详情
        getColumn: function () {
            var ischeck = document.getElementsByName("isChecked2");
            var ID = [];
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    var id = node.innerHTML.replace(/\s+/g, "");
                    ID.push(id);
                }
            }
            if (ID.length > 1) {
                toastr.warning("一次只能选择一个要查看的表");
            } else if (ID.length <= 0) {
                toastr.warning("您还没有选择要查看的表");
            } else {
                $('#exampleModal').modal('show');
                that.getColumnDetail(id);
            }

        },
        getColumnDetail: function (id) {
            $("#column_body").empty();
            var data = {
                ID: id
            };
            getDataByPost(
                '/system_rdbms/getColumn',
                data,
                res => {
                    console.log(res, data);
                    for (var o in res.data) {
                        $("#column_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked1'/></span></div></td><td>" + res.data[o].fdId + "</td><td>" + res.data[o].fdName + "</td><td>" + res.data[o].fdCName + "</td><td> " + res.data[o].fdType + "</td><td>" + res.data[o].isFk + "</td></tr>");
                    }
                },
                err => {
                    toastr.error("查看表失败！");
                }
            )
        },

        //编辑表
        editTable: function () {
            $("#table_name").val();
            $("#table_cnname").val();
            $("#keyword").val();
            $("#table_desc").val();
            var ischeck = document.getElementsByName("isChecked2");
            var ID = [];
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    var node = ischeck[i].parentNode.parentNode.parentNode.nextSibling;
                    var id = node.innerHTML.replace(/\s+/g, "");
                    ID.push(id);
                }
            }
            if (ID.length > 1) {
                toastr.warning("一次只能选择一个需要编辑的表");
            } else if (ID.length <= 0) {
                toastr.warning("您还没有选择要编辑的表");
            } else {
                $('#tableModal').modal('show');
                tempEditId = id;
                that.editTableDetail(id);
            }
        },
        editTableDetail: function (id) {
            var data = { ID: id };
            getDataByPost(
                '/system_rdbms/editTable',
                data,
                res => {
                    console.log(res.data);
                    if (res.data.tabEName == null) res.data.tabEName = '';
                    if (res.data.tabCName == null) res.data.tabCName = '';
                    if (res.data.keyword == null) res.data.keyword = '';
                    if (res.data.note == null) res.data.note = '';
                    $("#table_name").val(res.data.tabEName);
                    $("#table_cnname").val(res.data.tabCName);
                    $("#keyword").val(res.data.keyword);
                    $("#table_desc").val(res.data.note);
                },
                err => {
                    tempEditId = null;
                    toastr.warning("error");
                }
            )
        },

        //保存编辑
        saveEditTable: function () {
            var tabEName = $("#table_name").val();
            var tabCName = $("#table_cnname").val();
            var keyword = $("#keyword").val();
            var tabDesc = $("#table_desc").val();
            var data = {
                tabEName: tabEName,
                tabCName: tabCName,
                keyword: keyword,
                tabDesc: tabDesc,
                tabId: tempEditId
            };
            getDataByPost(
                '/system_rdbms/saveEditTable',
                data,
                res => {
                    $('#tableModal').modal('hide');
                    toastr.success("保存编辑成功!");
                    that.changeTablePage(1, 10, dataBaseId);
                    tempEditId = null;
                },
                err => {
                    toastr.error("保存编辑失败！");
                    tempEditId = null;
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