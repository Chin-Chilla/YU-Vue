var app = new Vue({
	el:"#vue",
	data:{
		id:'',//结点编号
		name:'',//结点名字
		arci:'',//结点arci
		listOrder:'',//结点显示顺序
		dataList:[],//数据源列表
	},
	mounted(){
		res.pageLeave();
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
					app.arci = treeNode.arci
					app.listOrder = treeNode.listOrder
					sessionStorage.setItem('metadataSelect',JSON.stringify(treeNode));
				}
			}
        };
        getDataByGet("/matadata_extract_management/get_classtree","",res=>{
        	var jsonFlag,jsonLack,jsonExtra;
			jsonFlag=res.data[0].flag;
			if (jsonFlag==1){
				jsonLack = res.data[1].lack;
				jsonExtra = res.data[2].extra;
				var classNameLack="";
				for (var i = 0;i<jsonLack.length;i++){
					classNameLack=classNameLack+jsonLack[i].class_name+' ';
				}
				var classNameExtra="";
				for (var i = 0;i<jsonExtra.length;i++){
					classNameExtra=classNameExtra+jsonExtra[i].class_name+' ';
				}
				//alert("本地缺少节点："+classNameLack+"\n"+"本地多余节点："+classNameExtra);
				res.data.splice(0,3);
				$.fn.zTree.init($("#treeDemo"), settingss, res.data);
			}else {
				res.data.splice(0,1);
				$.fn.zTree.init($("#treeDemo"), settingss, res.data);
			}
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