/**
 * @author: 柳菁铧、郭涛、陆佳民
 * @Description: "对象抽取方案管理"
 * @type {Vue}
 *
 * 根据 SL/T 213 - 2020 进行规范化管理
 */

var app = new Vue({
	el:"#vue",
	data:{
		id:'',//结点编号
		name:'',//对象类名称
		ename:'',//对象类英文名称
		classCode:'',//对象类编码
		listOrder:'',//结点显示顺序
		dataList:[],//数据源列表
	},
	mounted(){
		// res.pageLeave();
		var settingss = {
            data: {
                simpleData: {
                    enable: true,  //true 、 false 分别表示 使用 、 不使用 简单数据模式
                    idKey: "classId",   //节点数据中保存唯一标识的属性名称
                    pIdKey: "pClassId",    //节点数据中保存其父节点唯一标识的属性名称
                    rootPId: 1  //用于修正根节点父节点数据，即 pIdKey 指定的属性值
                            },
                key: {
                    name: "className"  //zTree 节点数据保存节点名称的属性名称  默认值："name"
                     }
            },
            check:{
				enable:false,  //true 、 false 分别表示 显示 、不显示 复选框或单选框
				nocheckInherit:true   //当父节点设置 nocheck = true 时，设置子节点是否自动继承 nocheck = true
			},
			callback:{
				onClick:function zTreeOnClickObjectModel(event, treeId, treeNode) {
					app.name = treeNode.className
					app.id = treeNode.classId
					app.ename = treeNode.arci
					app.classCode = treeNode.classCode
					app.listOrder = treeNode.listOrder
					sessionStorage.setItem('metadataSelect',JSON.stringify(treeNode));
				}
			}
        };
        getDataByGet("/matadata_extract_management/get_classtree","",res=>{
			// 从 OOM_CLASS 中获取标准化的对象分类树
        	var jsonFlag,jsonLack,jsonExtra;

			res.data.splice(0,1); //删除对象分类树的顶层节点
			$.fn.zTree.init($("#treeDemo"), settingss, res.data);
        },err=>{
        	toastr.error("初始化树失败")
        })
	},
	methods:{
		//抽取配置按钮
		goExtract(){
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
			var nodes = treeObj.getSelectedNodes();
			if(nodes.length==0){
				toastr.warning("请选择对象")
			}else{
	            var i=0;
				var flag = nodes[0].isParent;
				if (!flag){
					getDataByGet("/matadata_extract_management/get_datasource","",res=>{
						app.dataList = res.data
					},err=>{
			        	toastr.error("获取数据源失败")
			        })
					$('#attDataSoureModal').modal("show");

				}else{
					toastr.warning("请选择正确的对象");
				}
			}
		},
		//选择数据源确认
		datasourceConfirm(){
			$('#attDataSoureModal').modal("hide");
	    	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		    var nodes = treeObj.getSelectedNodes();
		    var databaseid= $("#attributeSource").val();
		    sessionStorage.setItem("metadataDatabaseId",databaseid);
		    setTimeout(function(){//给个延时，等遮罩层关闭
		    	$('.content-wrapper').load('metadata/extract/management/config.html', function() {});
		    },500)
		}
	}
})