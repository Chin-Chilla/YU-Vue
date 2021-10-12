var that;
var app = new Vue({
	el:"#vue",
	data:{
		entityClassList:[],//实体对象列表
		originList:[],//实体对象副本
		dataList:[],//数据源列表
		keyword:'',//关键字
		pageSize:15,//分页数目

		searchContact:'',//联系人搜索关键词
		contactList:[],//联系人列表
		contactSelect:'',//选中联系人

		contactName:'',
		contactOrg:'',
		contactTel:'',
		contactFaxnumb:'',
		contactMail:'',

		zTreeObj:'',

		progress:0,
		total:''
	},
	mounted(){
		// res.pageLeave();
		that = this
		getDataByPost('/matadata_management/get_entity_classtable','',res=>{
			that.entityClassList = res.data;
			$("#text1").text("结果数量:  "+that.entityClassList.length);
			that.originList = res.data;
			that.filterKey("")
        },err=>{
        	toastr.error("获取对象实体列表失败")
        });
		$('#tbody').on('click','tr', function() {
			$("input:checked").prop("checked",false);
            $(this).find("input[name='optionsRadios']").prop("checked",true);
		});

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
			that.zTreeObj = $.fn.zTree.init($("#class_org_tree"), setting, res);
		})
	},
	methods:{
		//翻页
		changePage(nowPage, size){
			var nowPageMin = (nowPage - 1) * size;
	        var nowPageMax = nowPage * size;
	        $(".box-body .table tbody").empty();
	        for (var i = nowPageMin; i < (that.entityClassList.length < nowPageMax ? that.entityClassList.length : nowPageMax); i++) {
	            var classId = "";
	            if (that.entityClassList[i].classId != null) {
	                classId = that.entityClassList[i].classId;
	            }
	            var chName = "";
	            if (that.entityClassList[i].className != null) {
	                chName = that.entityClassList[i].className;
	                //alert(chName);
	            }
	            var enName = "";
	            if (that.entityClassList[i].classCode != null) {
	                enName = that.entityClassList[i].classCode;
	            }
	            var extractor = "";
	            if (that.entityClassList[i].extractor != null) {
	                extractor = that.entityClassList[i].extractor;
	            }
	            var entityCount = "";
	            if (that.entityClassList[i].imObjNum != null) {
	                entityCount = that.entityClassList[i].imObjNum;
	            }
	            var catalogNum = "";
	            if (that.entityClassList[i].catalNum != null) {
	                catalogNum = that.entityClassList[i].catalNum;
	                //alert(catalogNum);
	            }
	            var extractTime = "";
	            if (that.entityClassList[i].extrTime != null) {
	                extractTime = that.entityClassList[i].extrTime;
	            }

	            var catalogtime = "";
	            if (that.entityClassList[i].catalTime != null) {
	                catalogtime = that.entityClassList[i].catalTime;
	            }
	            var isLeave = "";
	            if (that.entityClassList[i].listOrder == 1) {
	                isLeave = "已建立";
	            } else if (that.entityClassList[i].listOrder == 0) {
	                isLeave = "未建立";
	            }

	            $(".box-body .table tbody").append("<tr><td>" +
	                "<input name='optionsRadios' value='" + classId + "' type='radio' data-name='"+chName+"' data-total='"+entityCount+"'></td>" +
	                "<td>" + chName + "</td><td>" + enName + "</td>" +
	                "<td>" + isLeave + "</td><td>" + extractor + "</td>" +
	                "<td>" + entityCount + "</td>" +
	                "<td>" + catalogNum + "</td><td>" + extractTime + "</td><td>" + catalogtime + "</td></tr>");
	        }
	    },
	    //渲染分页
		renderPagination(){
			$("#pagination").empty();
	        $("#pagination").Paging({
	            pagesize: that.pageSize,
	            count: that.entityClassList.length,
	            toolbar: true,
	            callback: function (page, size, count) {
	                //alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
	                that.changePage(page, size);
	            }
	        });
	        that.changePage(1, that.pageSize);
		},
		//筛选
		filterKey(key){
	        if (key == "") {
	            that.renderPagination();
	        } else {
	            key = $("#filter").val();
	            var list = that.originList.concat();
	            that.entityClassList = [];
	            for (var i = 0; i < list.length; i++) {
	                if (list[i].className.split(key).length > 1) {
	                    that.entityClassList.push(list[i]);
	                }
	            }
	            that.renderPagination();
	        }
		},
		//显示数据源modal
		showDataSourceModal(){
			var classId = $("input[name='optionsRadios']:checked").val();
	        if (classId == null) {
	            toastr.warning("请选择对象类");
	        } else {
	            getDataByGet("/matadata_extract_management/get_datasource","",res=>{
					app.dataList = res.data
				},err=>{
		        	toastr.error("获取数据源失败")
		        })
	            $('#dataSoureModal').modal("show");
	        }
		},
		//确认抽取对象
		confirmExtractClass(){
			var classId=$("input[name='optionsRadios']:checked").val();
	        var className=$("input[name='optionsRadios']:checked").parent().next().html();
	        var databaseId=$("#attributeSource").val();
            if (databaseId==""){
                toastr.warning("请选择数据源");
            }else{

                $("#dataSoureModal").modal("hide");
                $("#loading").css('display','block');

                //测试
                //实体导入
                // if((TaskManage.taskflag=="1")&&(confirm("是否要加入任务队列")==true)){
                //     getStringData('/TaskManager/addExtract2Quene', dataStr, function (msg) {
                //         if (msg== "ok") {
                //             alert("成功添加到任务队列中");
                //         } else if (msg == "exist") {
                //             alert("添加任务失败，该任务已存在");
                //         } else if (msg == "proerr"){
                //             alert("添加任务失败, 有相关任务未完成");
                //         } else{
                //             alert("添加任务失败，有前序任务未完成！");
                //         }
                //         $("#loading").css('display','none'); //取消 loading 界面
                //     });
                // }else{

                	getDataByPost('/matadata_management/collect_by_attribute',{
                		databaseId:databaseId,
                		className:className,
                		classId:classId
                	},res=>{
                		if(res.msg=="SUCCESS"){
							toastr.success("实体导入成功，正在进行摘要抽取");
                            //摘要抽取
                            getDataByPost('/matadata_management/extract_abstract',{
                            	databaseId:databaseId,
		                		className:className,
		                		classId:classId
                            },res=>{
                            	if(res.msg=="SUCCESS"){
                            		toastr.success("摘要抽取成功");
                                    $("#loading").css('display','none');
                                    $('.content-wrapper').load('metadata/manager/index.html', function() {});
                                    // ObjectMetadataPage.load();
                                    // //关键字抽取
                                    // getStringData('/ObjectModelManager/extractkeywords', dataStr, function (msg) {
                                    //     if (msg=="success"){
                                    //         $("#loading").css('display','none');
                                    //         alert("关键字抽取成功");
                                    //     }else{
                                    //         $("#loading").css('display','none');
                                    //         alert("关键字抽取失败")
                                    //     }
                                    //     ObjectMetadataPage.load();
                                    // });
                            	}else{
									$("#loading").css('display','none');
                                    toastr.error("摘要抽取失败")
                            	}
                            })
                		}else{
                			$("#loading").css('display','none');
                            toastr.error("实体导入失败")
                		}
                	})
                  
                // }
            }
		},
		//去编目对象Modal
		catalogClass(){
			var classId = $("input[name='optionsRadios']:checked").val();
			var className = $("input[name='optionsRadios']:checked").attr("data-name");
			that.total = $("input[name='optionsRadios']:checked").attr("data-total");
	        if (typeof(classId) != "undefined") {
	            $("#treeModal").modal("show");
	        }
	        else {
	            toastr.warning("请选择一个对象类");
	        }
		},
		catalogue(){
			var classId = $("input[name='optionsRadios']:checked").val();
			var classCode = $("input[name='optionsRadios']:checked").parent().parent().find("td")[2].innerHTML;
			var nodes = that.zTreeObj.getCheckedNodes(true);
			var nodeCode = nodes[(nodes.length-1)].nodeCode+"_"+sessionStorage.getItem("objClassCode");
		    if (nodes.length < 2) {
		        toastr.warning("二级结点必须选择一个！");
		    } else {
		        var nodeIdList = [];
		        // alert("新编目的节点位置是:");
		        for (var i = 0; i < nodes.length; i++) {
		            nodeIdList.push(nodes[i].nodeId);
		            // alert(nodes[i].node_id);
		        }
		        var data = {
		            classId: classId,
					nodeCode:nodeCode,
		            nodeId: JSON.stringify(nodeIdList),
		            state: 100,
		            flag:0
		        }
		        $("#treeModal").modal("hide");
		        $('#progressModal').modal({backdrop: 'static', keyboard: false})
		        var interval = 4*that.total/90;
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
				console.log("The nodeCode in 2 is: " + data.nodeCode);
	            getDataByPost('/metadata_register/catalog_by_class',data,res=> {
	                if (res.msg == "SUCCESS") {
	                	that.progress=100;
	                	setTimeout(function(){
                    		$("#progressModal").modal('hide')
                    	},500)
                        setTimeout(function(){
		                    toastr.success("编目成功!");
		                    $('.content-wrapper').load('metadata/manager/index.html', function() {});
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
		    }
		},
		//查看对象
		seeClass(){
			var classId = $("input[name='optionsRadios']:checked").val();
			var className = $("input[name='optionsRadios']:checked").attr("data-name");
			var classCode = $("input[name='optionsRadios']:checked").parent().parent().find("td")[2].innerHTML;
			sessionStorage.setItem("objClassName",className);
			sessionStorage.setItem("objClassId",classId);
			sessionStorage.setItem("objClassCode",classCode);
		    if (typeof(classId) != "undefined") {
		        $('.content-wrapper').load('metadata/manager/detail.html', function() {});
		    }
		    else {
		        toastr.warning("请选择一个对象类");
		    }
		},

		//更换联系人modal
		showContactModal(){
			var className = $("input[name='optionsRadios']:checked").attr("data-name");
			that.searchContact=''
			getDataByPost('/matadata_extract_management/get_contact',{
				className:className
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
                //nodeIdList.push(obj.id);

                          // var data = {
                          //     classId: 457,
                          //     nodeId: nodeIdList,//树上的节点。包括父节点
                          //     state: -1,//选择状态，全选或者什么
                          //     entityArray: entityArray,//元数据的MDFILEID的集合
                          //     queryCondition: AttributeManager.data,//查询条件
                          //     flag:0
                          // }
                          // getDataByPost('/MetadataManager/catalogByClass',dataString,function (msg) {
                          //     if (msg.state == "ok") {
                                  //$("#loading").css('display', 'none');
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
                          //     } else {
                          //         //$("#loading").css('display', 'none');
                          //         alert("新增联系人失败!");
                          //     }
                          // });
                      //}

                  // },
	        },err=>{
	        	toastr.error(err)
	        })
		},
		//绑定联系人
		bindContact(){
			var classId = $("input[name='optionsRadios']:checked").val();
			if(this.contactSelect==''){
				toastr.warning("请选择联系人")
				return;
			}
			getDataByPost('/matadata_extract_management/bind_contact',{
				classId:classId,
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
	}
})