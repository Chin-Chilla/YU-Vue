var that;
var aJson = {};
/**
 * synInfo : 待传输给后台的数据结构
 *      - mdfileidList   选择部分结果时，记录的元数据 mdfileid;
 *      - sourceNode     源系统目录的选择节点
 *      - syncTo         目标系统的名称
 *      - ifSync         是否筛选同步状态
 */
var synInfo = {};
var setting;
var setting1 = {
	data: {
		simpleData:{
			enable:true,
			idKey:"id",
			pIdKey:"parentId",
			rootPId:"0"
		},
		key: {
			name: "text"
		}
	}, check:{
		enable:true,
		chkStyle: "checkbox",
		chkboxType: { "Y": "ps", "N": "s" }
	}
};
var app = new Vue({
	//绑定html页面的id
	el:"#vue",
	//成员变量
	data:{
		nodeId:'',
	},
	//初始化方法
	mounted() {
		that = this;
		that.load();
		setting = {
			async:  {
				enable: true,
				type: "GET",
				dataType: 'json',
				url: BASE_URL+"/index_manager/getResById",
				autoParam: ["nodeId"]
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
			callback:{
				onClick:that.zTreeSolr
			}
		};
	},
	//成员方法
	methods:{
		load(){
			$(".sidebar-menu .treeview-menu li").removeClass("active");
			$(".sidebar-menu .menuSync").addClass("active");
			$("#count").empty();
			$("#pagination").empty();
			//初始化目录树
			getDataByGet(
				'/index_manager/getResById?nodeId=1000',
				aJson,
				res => {
					$.fn.zTree.init($("#serviceTree"), setting, res);
				}
			)
			$('#tbody').on('click','tr', function() {
				$("input:checked").prop("checked",false);
				$(this).find("input[name='optionsRadios']").prop("checked",true);
			});
		},

		zTreeSolr(event,treeId, treeNode){
			nodeId = treeNode.nodeId;
			that.showTable();
		},

		showTable(){
			$('#select2-ifSync-container').attr("title","所有资源");
			$("#select2-ifSync-container").empty();
			var str="所有资源";
			$("#select2-ifSync-container").prepend(str);
			$("#ifSync").find("option[value = '2']").prop("selected","selected");
			getDataByPost(
				'/index_sync/querySolrNumByNodeId',
				{nodeId:nodeId},
				res=>{
					$("#count").text("结果数量:  "+res.data);
					$("#pagination").empty();
					$("#pagination").Paging({pagesize:10,count:res.data,toolbar:true,callback:function(page,size,count){
							that.changePage(page,size);
						}});
					that.changePage(1,10);
				},
				err=>{
					toastr.error("查询数据失败！");
				}
			)
		},

		changePage(nowPage,size){
			var ifSync = $("#ifSync").val();
			var data = {
				page:nowPage,
				size:size,
				nodeId:nodeId
			}
			getDataByPost(
				'/index_sync/querySolrDataByNodeId',
				data,
				res=>{
					$("#modaltbody1").empty();
					$("#sample_1").append("<tbody id='modaltbody1'>");
					var msg = res.data;
					for (var o in msg) {
						$("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td><td>"+msg[o].id+"</td><td>"+msg[o].idtitle+"</td><td title='"+msg[o].idabs+"' style='width:250px'><div title='"+msg[o].idabs+"' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>"+msg[o].idabs+"</div></td><td title='"+msg[o].usr_abs+"' style='width:250px'><div title='"+msg[o].usr_abs+"' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>"+msg[o].usr_abs+"</div></td></tr>");
						var icheck1 = document.getElementById("allpage");
						if (icheck1.checked == true) {
							$("input[name='cellChecker']").each( function() {
								if(!($(this).prop('checked'))){
									$(this).prop('checked',true );
								}
							});
						}
					}
					$("#sample_1").append("</tbody>");
				},
				err=>{

				}
			)
		},

		selectTable(){
			console.log("--------")
			var pageChecker = document.getElementById("thispage");
			var tableChecker = document.getElementById("tableChecker");
			var allChecker = document.getElementById("allpage");

			if (tableChecker.checked == true){
				pageChecker.checked = true;
				allChecker.checked = false;
				$("input[name='cellChecker']").each(function () {
					$(this).prop('checked',true);
				})
			}else{
				pageChecker.checked = false;
				$("input[name='cellChecker']").each(function () {
					$(this).prop('checked',false);
				})
			}
		},

		selectThisPage(){
			var pageChecker = document.getElementById("thispage");
			var tableChecker = document.getElementById("tableChecker");
			var allChecker = document.getElementById("allpage");

			if (pageChecker.checked == true){
				tableChecker.checked = true;
				allChecker.checked = false;
				$("input[name='cellChecker']").each(function () {
					$(this).prop('checked',true);
				})
			} else {
				tableChecker.checked = false;
				$("input[name='cellChecker']").each(function () {
					$(this).prop('checked',false);
				})
			}
		},

		selectAllPage(){
			var pageChecker = document.getElementById("thispage");
			var tableChecker = document.getElementById("tableChecker");
			var allChecker = document.getElementById("allpage");

			if (allChecker.checked == true){
				pageChecker.checked = false;
				tableChecker.checked = false;
				$("input[name='cellChecker']").each(function () {
					$(this).prop('checked',true);
				})
			} else {
				pageChecker.checked = false;
				tableChecker.checked = false;
				$("input[name='cellChecker']").each(function () {
					$(this).prop('checked',false);
				})
			}
		},

		ifSync(){
			var syncTo = $("#syncTo").val();
			var ifSync = $("#ifSync").val();
			var data = {
				nodeName:syncTo,
				ifSync:ifSync,
				nodeId:nodeId
			}
			if (ifSync==1||ifSync==0){
				if (ifSync==1){
					$("#delete").removeAttr("disabled");
				}else{
					$("#delete").attr("disabled","disabled");
				}
				getDataByPost(
					'/index_sync/querySolrNumifSync',
					data,
					res=>{
						$("#count").text("结果数量:  "+res.data);
						$("#pagination").empty();
						$("#pagination").Paging({pagesize:10,count:res.data,toolbar:true,callback:function(page,size,count){
								that.changePage1(page,size);
							}});
						that.changePage1(1,10);
					},
					err=>{
						toastr.error("查询数据失败!")
					}
				)
			}else{
				$("#delete").attr("disabled","disabled");
				that.showTable();
			}
		},

		changePage1(nowPage,size){
			var ifSync = $("#ifSync").val();
			var data = {
				nowPage:nowPage,
				size:size,
				nodeId:nodeId,
				ifSync:ifSync
			}
			getDataByPost(
				'/index_sync/querySolrDataifSync',
				data,
				res=>{
					$("#modaltbody1").empty();
					$("#sample_1").append("<tbody id='modaltbody1'>");
					var msg = res.data;
					for (var o in msg) {
						$("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='cellChecker'/></td><td>"+msg[o].id+"</td><td>"+msg[o].idtitle+"</td><td title='"+msg[o].idabs+"' style='width:250px'><div title='"+msg[o].idabs+"' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>"+msg[o].idabs+"</div></td><td title='"+msg[o].usr_abs+"' style='width:250px'><div title='"+msg[o].usr_abs+"' style='width:250px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>"+msg[o].usr_abs+"</div></td></tr>");
						var icheck1 = document.getElementById("allpage");
						if (icheck1.checked == true) {
							$("input[name='cellChecker']").each( function() {
								if(!($(this).prop('checked'))){
									$(this).prop('checked',true );
								}
							});
						}
					}
					$("#sample_1").append("</tbody>");
				},
				err=>{
					toastr.error("查询数据失败")
				}
			)
		},

		showModel(){
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
					synInfo.mdfileidList = selectedMdFileIdList;
					$("#targetCatalogTree").modal("show");
					that.treeShow();
				}else {
					toastr.warning("请选择需要同步的内容");
				}
			}
			else {
				//todo
				$("#targetCatalogTree").modal("show");
				that.treeShow();
			}
		},

		treeShow(){
			var targetName = $("#syncTo").val();
			var data = {
				nodeName:targetName
			};
			getDataByGet(
				'/index_sync/showRevokeTree',
				data,
				res=>{
					console.log(res)
					$.fn.zTree.init($("#serviceTree2"), setting1, res);
				},
				err=>{
					toastr.error("加载目录树失败！");
				}
			)
		},

		syncFunc(){
			var treeObj = $.fn.zTree.getZTreeObj("serviceTree2");
			//目标树被点击的节点
			var nodes = treeObj.getCheckedNodes(true);
			var array = new Array();
			var arrayNode = new Array();
			for (var i=0;i<nodes.length;i++){
				array.push(nodes[i].id);
				//如果父节点是根节点，则将该节点的node_code加进数组
				if(nodes[i].parentId==1000){
					arrayNode.push(nodes[i].node_code);
				}
			}
			if(array.length==0) {
				toastr.warning("请选择目的节点");
				return;
			}
			synInfo.nodes = array;
			synInfo.nodeForCode = arrayNode;
			synInfo.sourceNode = nodeId;
			synInfo.syncTo = $("#syncTo").val();
			synInfo.ifSync = $("#ifSync").val();
			//区别处理部分数据或全部结果
			if (document.getElementById("allpage").checked == true){
				// 处理全部结果
				synInfo.mdfileidList = new Array(); //清空部分选择的记录
			}
			that.sync();
		},

		sync(){
			$("#loading").css('display', 'block');
			var data = {
				synInfo:synInfo
			};
			getDataByPost(
				'/index_sync/syncData',
				data,
				res=>{
					if (res.code == 200) {
						toastr.success("同步成功！");
					}else if(res.data == "Permission denied"){
						toastr.warning("不允许在该节点下进行同步（本地与目标主管部门不一致）！");
					}else if(res.data == "data nonexistence"){
						toastr.warning("未找到同步的数据");
					}else if(res.data == "node nonexistence"){
						toastr.warning("未选中要同步的节点");
					}else if(res.data == "source nonexistence"){
						toastr.warning("未找到本系统源地址");
					}
					$("#loading").css('display', 'none');
				},
				err=>{
					toastr.error("同步失败！");
				}
			)
		}
	}
})