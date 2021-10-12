var that;
var app = new Vue({
	el:"#vue",
	data:{
		className:'',//对象名
		classId:'',//对象ID
		entityName:'',//搜索对象名
		pageSizeList:['10','20','50','100'],//页面大小列表
		pageSize:20,//页大小
		pageNum:1,//页码
		keyword:'',//关键字
		isCataLog:'0',//是否编目
		varList:[],//页面列表
		total:'',//数据总数
		databaseName:'',//数据源名字

		searchContact:'',//联系人搜索关键词
		contactList:[],//联系人列表
		contactSelect:'',//选中联系人

		isUpdate:false,//是否更新节点

		zTreeObj:'',//zTree

		progress:0,
		progressTitle:''
	},
	mounted(){
		that = this;
		$("#loading").css('display', 'block');
		that.className = sessionStorage.getItem("objClassName")
		that.classId = sessionStorage.getItem("objClassId")
		that.getPageData(res=>{

			that.varList = res.data.list
			that.total = res.data.total
			$("#text1").text("结果数量:  "+that.total);
			$("#loading").css('display', 'none');
			$("#pagination").empty();
	        $("#pagination").Paging({
	            pagesize: that.pageSize,
	            count: that.total,
	            toolbar: true,
	            callback: function (page, size, count) {
	                that.pageNum = page
	               	if($("#thisPage").is(':checked')){
	                	$("input[name='choose']").removeAttr("checked");
	                	$("#thisPage").attr("checked",false)
	                }
	                that.getPageData(res=>{
						that.varList = res.data.list
					})
	            }
	        });
	        $("#loading").css('display', 'none');
		})

		$(function() {
		    $('.datepicker').datepicker({
		        autoclose: true,
		        todayHighlight: true,
		        language: "zh-CN"
		    });
		})


		//树
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

		getDataByGet('/object_manage/getObjTreeByCode?nodeCode=1000', '', res => {
			that.zTreeObj = $.fn.zTree.init($("#obj_org_tree"), setting, res);
		})
	},
	methods:{
		//搜索
		search(){
			that.pageNum=1
			$("#loading").css('display', 'block');
			that.getPageData(res=>{
				that.varList = res.data.list
				that.total = res.data.total
				$("#loading").css('display', 'none');
				$("#text1").text("结果数量:  "+that.total);
				$("#pagination").empty();
				getDataByPost('/matadata_management/getdbname_by_id',{
					srcId:that.varList[0].srcId,
				},res=>{
					that.databaseName = res.data
				})
		        $("#pagination").Paging({
		            pagesize: that.pageSize,
		            count: that.total,
		            toolbar: true,
		            callback: function (page, size, count) {
		                that.pageNum = page
		                if($("#thisPage").is(':checked')){
		                	$("input[name='choose']").removeAttr("checked");
		                	$("#thisPage").attr("checked",false)
		                }
		                that.getPageData(res=>{
							that.varList = res.data.list
						})
		            }
		        });
			})
		},
		//重置
		reset(){
			$("#beginTime").val('')
			$("#endTime").val('')
			that.entityName=''
			that.keyword =''
			that.pageNum=1
		},
		//更改页面大小
		changePageSize(e){
			that.pageNum=1
			that.pageSize = e.target.value
			this.search();
		},
		//是否编目
		changeIsCataLog(value){
			that.isCataLog = value
			that.pageNum=1
			that.search()
		},
		//获取分页数据
		getPageData(callback){
			getDataByPost('/matadata_management/get_meta_by_page',{
				classId:that.classId,
				entityName:that.entityName,
				pageSize:that.pageSize,
				pageNum:that.pageNum,
				keyword:that.keyword,
				isCataLog:that.isCataLog,
				startTime:$("#beginTime").val(),
				endTime:$("#endTime").val()
			},callback)
		},


		//去编目对象
		goCataLog(){
			var ch = $("input[name='choose']");
	        var i = 0;
	        for (i; i < ch.length; i++) {
	            if (ch[i].checked) {
	                break;
	            }
	        }
	        if ($("#clear").is(':checked') || i == ch.length) {
	            toastr.warning("请选择至少一个条目!");
	        } else {
	            $("#updatedd").attr("disabled","disabled");
	            $("#treeModal").modal("show");
	        }
		},


		//更换联系人modal
		showContactModal(){
			that.searchContact=''
			getDataByPost('/matadata_extract_management/get_contact',{
				className:that.className
			},res=>{
				that.contactSelect = res.data;
				that.getContactList(1,5,'')
			},err=>{
				toastr.error("获取联系人失败")	
			})
			getDataByPost('/matadata_extract_management/get_contact_list',{
            	keyword:'',
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
				$('#contactConfigModal').modal('show')
            },err=>{
            	toastr.error("获取联系人列表失败")
            });
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
		//搜索联系人
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
		//绑定联系人
		bindContact(){
			if(this.contactSelect==''){
				toastr.warning("请选择联系人")
				return;
			}
			getDataByPost('/matadata_extract_management/bind_contact',{
				classId:that.classId,
				contactId:that.contactSelect
			},res=>{
				if(res.msg=='SUCCESS'){
					toastr.success("更换联系人成功！")
					$('#contactConfigModal').modal('hide')
				}else{
					toastr.error(res.msg)
				}
			},err=>{
				toastr.error(err)
			})
		},


	    //全选当前页
		choosePage(){
			if ($("#thisPage").is(':checked')) {
	            $("input[name='choose']").prop("checked", true);
	        }
	        else {

	        }
		},
		//清空当前页
		clear(){
			if ($("#clear").is(':checked')) {
	            $("input[name='choose']").removeAttr("checked");
	        }
	        else {
	        }
		},
		//全选
		chooseAll(){
			if ($("#all").is(':checked')) {
	            $("input[name='choose']").prop("checked", true);
	        }
	        else {

	        }
		},
		//勾选单个
		chooseOne(){
			$("input[name='optionsChoose']").removeAttr("checked");
		},

		//导出
		download(id){
        	window.open(BASE_URL + "/metadata_register/download?id=" + id, '_blank')
		},
		//更新节点
		showUpdate(){
			var ch = $("input[name='choose']");
	        var i = 0;
	        for (i; i < ch.length; i++) {
	            if (ch[i].checked) {
	                break;
	            }
	        }
	        if ($("#clear").is(':checked') || i == ch.length) {
	            toastr.warning("请选择至少一个条目!");
	        } else {
	        	that.isUpdate=true
	            $("#treeModal").modal("show");
	        }
		},
		//更新对象
		catalogue(flag){
			that.progressTitle="编目进度"
			var state = -1;
            if ($("#thisPage").is(':checked')) {
                state = 1;
            } else if ($("#all").is(':checked')) {
                state = 2;
            } else if ($("#clear").is(':checked')) {
                state = 0;
            }
            var nodeList = []
            if(flag==0||flag==2){
            	var nodes = that.zTreeObj.getCheckedNodes(true);
            	if (nodes.length < 2) {
			        toastr.warning("二级结点必须选择一个！");
			        return;
			    }else{
			    	for (var i = 0; i < nodes.length; i++) {
			            nodeList.push(nodes[i].nodeId);
			        }
			    }
            }
            var ch = $("input[name='choose']");
            var entityArray = []
            //alert(ObjectMetadataDetail.classId);
            for (var i = 0; i < ch.length; i++) {
                if (ch[i].checked) {
                    entityArray.push(ch[i].value);
                }
            }
            var queryData = {
        		entityName:that.entityName,
        		keyword:that.keyword,
        		beginTime:$("#beginTime").val(),
				endTime:$("#endTime").val(),
				hasCataLog:'0'
        	}
			var nodes = that.zTreeObj.getCheckedNodes(true);
			var nodeCode = nodes[(nodes.length-1)].nodeCode+"_"+sessionStorage.getItem("objClassCode");
	        var data = {
            	nodeCode:nodeCode,
	            classId: that.classId,
	            nodeId: JSON.stringify(nodeList),
	            entityArray:JSON.stringify(entityArray),
	            state: state,
	            flag:flag,
	            queryCondition:JSON.stringify(queryData)
	        }

	        $('#progressModal').modal({backdrop: 'static', keyboard: false})
	        var interval =4*that.total/90;
	        //最快100ms
	        if(interval<100){
	        	interval=100;
	        }
        	var	timer = setInterval(function(){
    			if(that.progress==100){
    				clearInterval(timer)
    				return;
    			}
    			var tmp = Math.random()/2
    			if(Math.random()>0.5){
    				tmp = 1+tmp
    			}else{
    				tmp =1-tmp
    			}
    			that.progress = Math.round((that.progress+tmp)*10)/10
    			if(that.progress>99){
    				that.progress = 99
    				clearInterval(timer);
    			}
    		},interval)
			
            getDataByPost('/metadata_register/catalog_by_class',data,res=> {
                if (res.msg == "SUCCESS") {
                	that.progress=100;
                	setTimeout(function(){
                		$("#progressModal").modal('hide')
                		$("#treeModal").modal('hide')
                	},500)
                    setTimeout(function(){
	                    toastr.success("编目成功!");
	                    $('.content-wrapper').load('metadata/manager/detail.html', function() {});
                    },1000)
                } else {
                	that.progress=0;
                	clearInterval(timer);
                    toastr.error("编目失败!");
                    $("#progressModal").modal('hide')
                }
            },err=>{
            	toastr.error(err.msg);
            	$("#progressModal").modal('hide')
            });
		},
		//取消编目
		deleteCatalog(){
			swal({
                title: "审核通过的数据将无法删除",
                text: "删除后将无法恢复，请谨慎操作！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                closeOnConfirm: false
            }, function () {
            	swal.close()
           	 	var state = -1;
	            if ($("#thisPage").is(':checked')) {
	                state = 1;
	            } else if ($("#all").is(':checked')) {
	                state = 2;
	            } else if ($("#clear").is(':checked')) {
	                state = 0;
	            }
	            var ch = $("input[name='choose']");
	            if (ch.length > 0) {
	            	var timer;
		            if(state == 2){
		            	that.progressTitle="取消编目进度"
	            		$("#progressModal").modal({backdrop: 'static', keyboard: false})
	            		var interval = 0.6*that.total/90
	            		if(interval<100){
	            			interval = 100
	            		}
	            		timer = setInterval(function(){
	            			if(that.progress==100){
	            				clearInterval(timer)
	            				return;
	            			}
	            			var tmp = Math.random()/2
	            			if(Math.random()>0.5){
	            				tmp = 1+tmp
	            			}else{
	            				tmp =1-tmp
	            			}
	            			that.progress = Math.round((that.progress+tmp)*10)/10
	            			if(that.progress>99){
	            				that.progress = 99
	            				clearInterval(timer);
	            			}
	            		},interval)
	            	}
	            	var queryData = {
	            		entityName:that.entityName,
	            		keyword:that.keyword
	            	}
	          		var arr = new Array();
	                for (var i = 0; i < ch.length; i++) {
	                    if (ch[i].checked) {
	                        arr.push(ch[i].value);
	                    }
	                }
	                var data = {
	                    classId: that.classId,
	                    state: state,
	                    entityArray: JSON.stringify(arr),//要删除的数据的MD_FILE_ID
	                    queryCondition:JSON.stringify(queryData)
	                }
	                // if((TaskManage.taskflag=="1")&&(state == 2)&&(confirm("是否要加入任务队列")==true)) {
	                //     getDataByPost('/TaskManager/addDisCatalog2Quene', dataString, function (msg) {
	                //         console.log(msg);
	                //         if (msg.state== "ok") {
	                //             alert("成功添加到任务队列中");
	                //         } else if (msg.state == "exist") {
	                //             alert("添加任务失败，该任务已存在");
	                //         } else if (msg.state == "proerr"){
	                //             alert("添加任务失败, 有相关任务未完成");
	                //         } else{
	                //             alert("添加任务失败，有前序任务未完成！");
	                //         }
	                //         $("#loading").css('display', 'none'); //取消 loading 界面
	                //     });
	                // }else{
	                    getDataByPost('/metadata_register/delete_catalog', data, res=>{
	                        if (res.msg == "SUCCESS") {
	                        	that.progress=100;
	                        	setTimeout(function(){
	                        		$("#progressModal").modal('hide')
	                        	},500)
	                            setTimeout(function(){
									swal("取消编目成功！", "", "success");
	                            	$('.content-wrapper').load('metadata/manager/detail.html', function() {});
	                            },1000)
	                        } else {
	                            $("#progressModal").modal('hide')
	                            toastr.error("取消编目失败!");
	                        }
	                    });
	                // }
	            } else {
	                toastr.warning("请选择一个目标!");
	            }
	            return true;
	        })
		},
		//批量导出
		batchExport(){
			var state = -1;
	        if ($("#thisPage").is(':checked')) {
	            state = 1;
	        } else if ($("#all").is(':checked')) {
	            state = 2;
	        } else if ($("#clear").is(':checked')) {
	            state = 0;
	        } else {
	            state = 1;
	        }
	        var ch = $("input[name='choose']");
	        if (ch.length <= 0) {

	        } else {
	        	var queryData = {
            		entityName:that.entityName,
            		keyword:that.keyword,
            		beginTime:$("#beginTime").val(),
					endTime:$("#endTime").val()
            	}
            	var arr = []
	            for (var i = 0; i < ch.length; i++) {
	                if (ch[i].checked) {
	                    arr.push(ch[i].value);
	                }
	            }
	            if(state == 0 || arr.length == 0){
	                toastr.warning("未选中文件！");
	                return;
	            }
	            var data = {
	                classId: that.classId,//class的id
	                state: state,//选择状态，全选或者什么
	                entityArray: JSON.stringify(arr),//元数据的MDFILEID的集合
	                queryCondition: JSON.stringify(queryData)//查询条件
	            }
	            $("#loading").css('display', 'block');
	            getDataByPost('/metadata_register/export_batch',data,res=>{
	            	setTimeout(function(){
	            		$("#loading").css('display','none'); //取消 loading 界面
	            		window.open(BASE_URL + "/metadata_register/downloadZip?id=" + res.data, '_blank')
	            	},1000)
	            },res=>{
	            	toastr.error("导出失败");
	                $("#loading").css('display','none'); //取消 loading 界面
	            })
	        }
		},
		//返回
		back(){
			 $('.content-wrapper').load('metadata/manager/index.html', function() {});
		}
	}
})