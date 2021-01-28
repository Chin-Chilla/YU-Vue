var that;
var app = new Vue({
	//绑定html页面的id
	el:"#vue",
	//成员变量
	data:{

	},
	//初始化方法
	mounted:{
		var setting = {
	        data: {
	            simpleData:{
	                enable:true,
	                idKey:"node_id",
	                pIdKey:"pnode_id",
	                rootPId:"0"
	            },
	            key: {
	                name: "node_name"
	            }
	        },
	        callback:{
	            onClick:zTreeSolr
	        }
	    };
		getDataByPost('/matadata_sync/initial_revokeresource_dirtree','',res=>{
			$.fn.zTree.init($("#tree"), setting, res.data);
        },err=>{
        	toastr.error("获取对象实体列表失败")
        });
		$('#tbody').on('click','tr', function() {
			$("input:checked").prop("checked",false);
            $(this).find("input[name='optionsRadios']").prop("checked",true);
		});
	},
	//成员方法
	methods:{

	}
})