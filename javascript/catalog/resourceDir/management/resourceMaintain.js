var that;
var aJson = {};
/**
 * metadataInfo : 待传输给后台的数据结构
 *      - mdfileidList   选择部分结果时，记录的元数据 mdfileid;
 *      - sourceNode     源系统目录的选择节点
 *      - syncTo         目标系统的名称
 *      - ifSync         是否筛选同步状态
 */
var metadataInfo = {};
var setting;
var setting1 = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentId",
            rootPId: "0"
        },
        key: {
            name: "text"
        }
    }, check: {
        enable: true,
        chkStyle: "checkbox",
        chkboxType: {"Y": "ps", "N": "s"}
    }
};
var app = new Vue({
    //绑定html页面的id
    el:"#vue",
    //成员变量
    data:{
        nodeId:'',

        // 新增联系人
        contactName:'',
        contactOrg:'',
        contactTel:'',
        contactFaxnumb:'',
        contactMail:'',

        searchContact:'',//联系人搜索关键词
        contactList:[],//联系人列表
        contactSelect:'',//选中联系人
    },
    //初始化方法
    mounted() {
        that = this;
        that.load();
        that.object={};
        settingFast = {
            async: {
                enable: true,
                type: "GET",
                dataType: 'json',
                url: BASE_URL + "/index_manager/getResTreeByCode",
                autoParam: ["nodeCode"],
                otherParam: {"addCount": "true"}
            },
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
            callback: {
                onClick: function zTreeSolr(event, treeId, treeNode) {
                    nodeId = treeNode.nodeId;
                    that.metaNode = nodeId
                    that.showTable();
                    sessionStorage.setItem('metadataSelect', JSON.stringify(treeNode));
                    that.object = JSON.parse(sessionStorage.getItem("metadataSelect"));
                },
            }
        };
    },
    //成员方法
    methods:{
        load(){
            $(".sidebar-menu .treeview-menu li").removeClass("active");
            $(".sidebar-menu .resMaintain").addClass("active");
            $("#count").empty();
            $("#pagination").empty();
            //初始化目录树
            getDataByGet(
                '/index_manager/getResTreeByCode?nodeCode=1000&addCount=true',
                aJson,
                res => {
                    $.fn.zTree.init($("#serviceTree"), settingFast, res);
                }
            )
            $('#tbody').on('click','tr', function() {
                $("input:checked").prop("checked",false);
                $(this).find("input[name='optionsRadios']").prop("checked",true);
            });
        },

        zTreeSolr(event, treeId, treeNode) {
            nodeId = treeNode.nodeId;
            that.metaNode = nodeId
            that.showTable();
        },
        synczTreeSolr(event, treeId, treeNode) {
            that.isSyncYu = true
            that.syncYuNodeCode = treeNode.nodeCode
            that.syncYuNodes = []
            let syncNode = treeNode
            let syncNodeId = syncNode.nodeId
            while (true) {
                that.syncYuNodes.push(syncNodeId)
                syncNode = syncNode.getParentNode()
                if (syncNode !== null) {
                    syncNodeId = syncNode.nodeId
                } else
                    break
            }
        },

        showTable() {
            $('#select2-ifSync-container').attr("title", "所有资源");
            $("#select2-ifSync-container").empty();
            var str = "所有资源";
            $("#select2-ifSync-container").prepend(str);
            $("#ifSync").find("option[value = '2']").prop("selected", "selected");
            getDataByPost(
                '/yuIndexSync/querySolrNumByNodeId',
                {nodeId: nodeId},
                res => {
                    $("#count").text("结果数量:  " + res.data);
                    $("#pagination").empty();
                    $("#pagination").Paging({
                        pagesize: 10, count: res.data, toolbar: true, callback: function (page, size, count) {
                            that.changePage(page, size);
                        }
                    });
                    that.changePage(1, 10);
                },
                err => {
                    toastr.error("查询数据失败！");
                }
            )
        },

        changePage(nowPage, size) {
            var ifSync = $("#ifSync").val();
            var data = {
                page: nowPage,
                size: size,
                nodeId: nodeId
            }
            getDataByPost(
                '/yuIndexSync/querySolrDataByNodeId',
                data,
                res => {
                    $("#modaltbody1").empty();
                    $("#sample_1").append("<tbody id='modaltbody1'>");
                    var msg = res.data;
                    for (var o in msg) {
                        /*$("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td><td>" + msg[o].id + "</td><td>" + msg[o].idtitle + "</td><td title='" + msg[o].idabs + "' style='width:250px'><div title='" + msg[o].idabs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].idabs + "</div></td><td title='" + msg[o].usr_abs + "' style='width:250px'><div title='" + msg[o].usr_abs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].usr_abs + "</div></td></tr>");*/
                        $("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td><td>" + msg[o].id + "</td><td>" + msg[o].name + "</td><td title='" + msg[o].idabs + "' style='width:250px'><div title='" + msg[o].idabs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].idabs + "</div></td><td title='" + msg[o].AD + "' style='width:250px'><div title='" + msg[o].AD + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].AD + "</div></td></tr>");
                        var icheck1 = document.getElementById("allpage");
                        if (icheck1.checked == true) {
                            $("input[name='cellChecker']").each(function () {
                                if (!($(this).prop('checked'))) {
                                    $(this).prop('checked', true);
                                }
                            });
                        }
                    }
                    $("#sample_1").append("</tbody>");
                },
                err => {

                }
            )
        },

        selectTable() {
            var pageChecker = document.getElementById("thispage");
            var tableChecker = document.getElementById("tableChecker");
            var allChecker = document.getElementById("allpage");

            if (tableChecker.checked == true) {
                pageChecker.checked = true;
                allChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', true);
                })
            } else {
                pageChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', false);
                })
            }
        },

        selectThisPage() {
            var pageChecker = document.getElementById("thispage");
            var tableChecker = document.getElementById("tableChecker");
            var allChecker = document.getElementById("allpage");

            if (pageChecker.checked == true) {
                tableChecker.checked = true;
                allChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', true);
                })
            } else {
                tableChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', false);
                })
            }
        },

        selectAllPage() {
            var pageChecker = document.getElementById("thispage");
            var tableChecker = document.getElementById("tableChecker");
            var allChecker = document.getElementById("allpage");

            if (allChecker.checked == true) {
                pageChecker.checked = false;
                tableChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', true);
                })
            } else {
                pageChecker.checked = false;
                tableChecker.checked = false;
                $("input[name='cellChecker']").each(function () {
                    $(this).prop('checked', false);
                })
            }
        },

        ifSync() {
            var syncTo = $("#syncTo").val();
            var ifSync = $("#ifSync").val();
            var data = {
                nodeName: syncTo,
                ifSync: ifSync,
                nodeId: nodeId
            }
            if (ifSync == 1 || ifSync == 0) {
                if (ifSync == 1) {
                    $("#delete").removeAttr("disabled");
                } else {
                    $("#delete").attr("disabled", "disabled");
                }
                getDataByPost(
                    '/yuIndexSync/querySolrNumifSync',
                    data,
                    res => {
                        $("#count").text("结果数量:  " + res.data);
                        $("#pagination").empty();
                        $("#pagination").Paging({
                            pagesize: 10, count: res.data, toolbar: true, callback: function (page, size, count) {
                                that.changePage1(page, size);
                            }
                        });
                        that.changePage1(1, 10);
                    },
                    err => {
                        toastr.error("查询数据失败!")
                    }
                )
            } else {
                $("#delete").attr("disabled", "disabled");
                that.showTable();
            }
        },

        changePage1(nowPage, size) {
            var ifSync = $("#ifSync").val();
            var data = {
                nowPage: nowPage,
                size: size,
                nodeId: nodeId,
                ifSync: ifSync
            }
            getDataByPost(
                '/yuIndexSync/querySolrDataifSync',
                data,
                res => {
                    $("#modaltbody1").empty();
                    $("#sample_1").append("<tbody id='modaltbody1'>");
                    var msg = res.data;
                    for (var o in msg) {
                        $("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td><td>" + msg[o].id + "</td><td>" + msg[o].idtitle + "</td><td title='" + msg[o].idabs + "' style='width:250px'><div title='" + msg[o].idabs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].idabs + "</div></td><td title='" + msg[o].usr_abs + "' style='width:250px'><div title='" + msg[o].usr_abs + "' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>" + msg[o].usr_abs + "</div></td></tr>");
                        var icheck1 = document.getElementById("allpage");
                        if (icheck1.checked == true) {
                            $("input[name='cellChecker']").each(function () {
                                if (!($(this).prop('checked'))) {
                                    $(this).prop('checked', true);
                                }
                            });
                        }
                    }
                    $("#sample_1").append("</tbody>");
                },
                err => {
                    toastr.error("查询数据失败")
                }
            )
        },

        showShareModel() {
            var icheck1 = document.getElementById("allpage");
            if (icheck1.checked != true) {
                //  选择部分结果
                var ischeck = document.getElementsByName("cellChecker");
                var flag = false;
                for (i = 0; i < ischeck.length; i++) {
                    if (ischeck[i].checked == true) {
                        flag = true;
                        break;
                    }
                }
                if (flag == true) {
                    var selectedMdFileIdList = new Array();
                    for (i = 0; i < ischeck.length; i++) {
                        if (ischeck[i].checked == true) {
                            var mdfileid = ischeck[i].parentNode.nextSibling.innerHTML;
                            selectedMdFileIdList.push(mdfileid);
                        }
                    }
                    metadataInfo.mdfileidList = selectedMdFileIdList;
                    $("#sharemodal").modal("show");
                } else {
                    toastr.warning("请选择需要更改的内容");
                }
            } else {
                $("#sharemodal").modal("show");
            }
        },

        //共享模式"确定"
        changeShareModal(){
            metadataInfo.nodeId = that.metaNode;
            var sharefrequency = document.getElementById("sharefrequency");
            var sharetype = document.getElementById("sharetype");
            var sharecondition = document.getElementById("sharecondition").value;//input内容
            var sharemethod = document.getElementById("sharemethod");


            metadataInfo.sharefrequencyselect = sharefrequency.options[sharefrequency.selectedIndex].text;
            metadataInfo.sharetypeselect = sharetype.options[sharetype.selectedIndex].text;
            metadataInfo.shareconditionselect = document.getElementById("sharecondition").value;
            metadataInfo.sharemethodselect = sharemethod.options[sharemethod.selectedIndex].text;


            var icheck1 = document.getElementById("allpage");
            if (icheck1.checked != true) {
                //  选择部分结果
                var ischeck = document.getElementsByName("cellChecker");
                var selectedMdFileIdList = new Array();
                for (i = 0; i < ischeck.length; i++) {
                    if (ischeck[i].checked == true) {
                        var mdfileid = ischeck[i].parentNode.nextSibling.innerHTML;
                        selectedMdFileIdList.push(mdfileid);
                    }
                }
                metadataInfo.mdfileidList = selectedMdFileIdList;
            }else{
                //选择全部结果
                metadataInfo.mdfileidList = new Array();
            }
            getDataByPost('/matadata_extract_management/updateShareModal',{
                metadataInfo:metadataInfo,
            },res=>{
                if(res.msg=='SUCCESS'){
                    toastr.success("修改成功")
                    $("#sharemodal").modal("hide");
                }else{
                    toastr.error(res.msg)
                }
            },err=>{
                toastr.error(err)
            })
        },
        updateContactModal(){
            $("#dataContactTable").each(function () {
                var check = $("input[name='contactcheckbox']:checked");
                if (check.val() == null) {
                    toastr.warning("请选择联系人")
                } else{
                    //循环获取每行td的内容
                    for (var j = 1; j < $(this).find("tr").length; j++) {
                        for (var i = 0; i < $(this).find("tr").eq(1).find("td").length; i++) {
                            var sValue = $(this).find("tr").eq(j).find("td").eq(i).find("input").val();//获取td里面的input内容
                            if (sValue == check.val()) {
                                var sValue1 = $(this).find("tr").eq(j).find("td").eq(i + 1).html();//获取td内容
                                var sValue2 = $(this).find("tr").eq(j).find("td").eq(i + 2).html();//获取td内容
                                var sValue3 = $(this).find("tr").eq(j).find("td").eq(i + 3).html();//获取td内容
                                var sValue4 = $(this).find("tr").eq(j).find("td").eq(i + 4).html();//获取td内容
                                var sValue5 = $(this).find("tr").eq(j).find("td").eq(i + 5).html();//获取td内容
                                break;
                            }
                        }
                    }
                    $("#updatecontactName").val(sValue1);
                    $("#updatecontactOrg").val(sValue2);
                    $("#updatecontactTel").val(sValue3);
                    $("#updatecontactFaxnumb").val(sValue4);
                    $("#updatecontactMail").val(sValue5);
                    $('#updatecontactModal').modal('show');

                }
            });
        },
        updateContact(){
            var updatecontactName = document.getElementById("updatecontactName").value;
            var updatecontactOrg = document.getElementById("updatecontactOrg").value;
            var updatecontactTel = document.getElementById("updatecontactTel").value;
            var updatecontactFaxnumb = document.getElementById("updatecontactFaxnumb").value;
            var updatecontactMail = document.getElementById("updatecontactMail").value;
            if(updatecontactName==""){
                toastr.warning("用户名称不能为空！");
                return;
            }
            if(updatecontactMail!=''){
                if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(updatecontactMail)){
                    toastr.warning("请输入正确的邮箱");
                    return;
                }
            }
            getDataByPost('/matadata_extract_management/updateContact',{
                updatecontactName:updatecontactName,
                updatecontactOrg:updatecontactOrg,
                updatecontactTel:updatecontactTel,
                updatecontactFaxnumb:updatecontactFaxnumb,
                updatecontactMail:updatecontactMail,
                contactId:that.contactSelect
            },res=>{
                if(res.msg=='SUCCESS'){
                    toastr.success("修改成功")
                    $('#updatecontactModal').modal('hide');
                    that.showContact();
                }else{
                    toastr.error(res.msg)
                }
            })
        },
        //显示联系人模态框
        showContact() {
            var ischeck = document.getElementsByName("cellChecker");
            var flag = false;
            for (i = 0; i < ischeck.length; i++) {
                if (ischeck[i].checked == true) {
                    flag = true;
                    break;
                }
            }
            if (flag == true) {
                $("#contactConfigModal").modal("show");
                that.searchContact = ''
                getDataByPost('/matadata_extract_management/get_contact', {//此方法用不到？页面获取的是所有联系人的列表
                    className: that.object.nodeName
                }, res => {
                    that.contactSelect = res.data;
                    that.getContactList(1, 5, '')
                }, err => {
                    toastr.error("获取联系人失败")
                })
                getDataByPost('/matadata_extract_management/get_contact_list', {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 5
                }, res => {
                    $("#dataContactPage").empty();
                    //分页
                    $("#dataContactPage").Paging({
                        pagesize: 5,
                        count: res.data.total,
                        toolbar: true,
                        callback: function (page, size, count) {
                            that.getContactList(page, size, that.searchContact);
                        }
                    });
                    that.contactList = res.data.list;
                }, err => {
                    toastr.error("获取联系人列表失败")
                });
            } else {
                toastr.warning("请选择需要更改的内容");
            }
        },
        //获取联系人列表
        getContactList(page,size,searchContact){
            getDataByPost('/matadata_extract_management/get_contact_list',{
                keyword:searchContact,
                pageNum:page,
                pageSize:size
            },res=>{
                that.contactList = res.data.list;
            },err=>{
                toastr.error("获取联系人列表失败")
            });
        },
        //选择联系人
        selectContact(id){
            this.contactSelect = id;
        },
        contactSearch(){
            getDataByPost('/matadata_extract_management/get_contact_list',{
                keyword:that.searchContact,
                pageNum:1,
                pageSize:5
            },res=>{
                $("#dataContactPage").empty();
                //分页
                $("#dataContactPage").Paging({
                    pagesize: 5,
                    count: res.data.total,
                    toolbar: true,
                    callback: function (page, size, count) {
                        that.getContactList(page, size,that.searchContact);
                    }
                });
                that.contactList = res.data.list;
            },err=>{
                toastr.error("获取联系人列表失败")
            });
        },
        //增加联系人
        addContact(){
            if(that.contactName==""){
                toastr.warning("用户名称不能为空！");
                return;
            }
            if(that.contactMail!=''){
                if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(that.contactMail)){
                    toastr.warning("请输入正确的邮箱");
                    return;
                }
            }
            getDataByPost('/matadata_extract_management/add_contact',{
                objName:that.contactName,
                orgName:that.contactOrg,
                telnumber:that.contactTel,
                faxnumb:that.contactFaxnumb,
                email:that.contactMail
            },res=>{
                var entityArray=[];
                entityArray.push(res.data);
                var nodeIdList = [];
                nodeIdList.push(0);
                /**
                 * //树上的节点。包括父节点 long
                 * @type {{classId: number, nodeId: Array, state: *, entityArray: Array, queryCondition: (ObjectMetadataDetail.data|{classId, classGUID, entityName, extractor, beginTime, endTime, keyword, hasCataLog, pageSize, nowPage}|*), flag: *}}
                 */
                toastr.success("新增联系人成功!");
                $('#contactModal').modal('hide')
                //成功以后展示出来
                that.searchContact=that.contactName;
                that.contactName=''
                that.contactOrg=''
                that.contactTel=''
                that.contactFaxnumb=''
                that.contactMail=''


                that.getContactList(1,5,that.searchContact)
            },err=>{
                toastr.error(err)
            })
        },
        //绑定联系人
        bindContact(){
            $("#dataContactTable").each(function () {
                var check = $("input[name='contactcheckbox']:checked");
                if (check.val() == null) {
                    toastr.warning("请选择需要确认的联系人")
                } else {
                    metadataInfo.nodeId = that.metaNode;
                    var icheck1 = document.getElementById("allpage");
                    if (icheck1.checked != true) {
                        //  选择部分结果
                        var ischeck = document.getElementsByName("cellChecker");
                        var selectedMdFileIdList = new Array();
                        for (i = 0; i < ischeck.length; i++) {
                            if (ischeck[i].checked == true) {
                                var mdfileid = ischeck[i].parentNode.nextSibling.innerHTML;
                                selectedMdFileIdList.push(mdfileid);
                            }
                        }
                        metadataInfo.mdfileidList = selectedMdFileIdList;
                    } else {
                        //选择全部结果
                        metadataInfo.mdfileidList = new Array();
                    }
                    getDataByPost('/matadata_extract_management/resourcebind_contact', {
                        metadataInfo: metadataInfo,
                        contactId: that.contactSelect
                    }, res => {
                        if (res.msg == 'SUCCESS') {
                            toastr.success("联系人确认成功")
                            $('#contactConfigModal').modal('hide')
                        } else {
                            toastr.error(res.msg)
                        }
                    }, err => {
                        toastr.error(err)
                    })
                }
            })
        },
        deleteContact(){
            $("#dataContactTable").each(function () {
                var check = $("input[name='contactcheckbox']:checked");
                if (check.val() == null) {
                    toastr.warning("请选择联系人")
                } else {
                    swal({
                            title: "是否要删除这个联系人？",
                            //type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确认删除",
                            closeOnConfirm: true
                        }, confirm => {
                            getDataByPost('/matadata_extract_management/delete_contact', {
                                contactId: that.contactSelect
                            }, res => {
                                if (res.msg == 'SUCCESS') {
                                    toastr.success("删除成功")
                                    that.showContact();
                                } else {
                                    toastr.error(res.msg)
                                }
                            })
                        }
                    )
                }
            })
        },
    }
})