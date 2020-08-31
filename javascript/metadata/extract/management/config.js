var that
var app = new Vue({
	el:"#vue",
	data:{
		title:'',
		object:'',//缓存的对象
		databaseId:'',//数据源id
		attenchname:'',//属性名
		attnameSelect:'',//选中关联字段
		metaId:'',//选中属性的metaId（用于编辑属性）

		newAttList:[],//可添加的新属性
		

		relationList:[],//点击属性查询到的关联表列表
		attInfoList:[],//属性列表

		mainTableList :[],//关联表主表
		subTableList:[],//关联表子表
		mainTableFieldList:[],//主表字段列表
		subTableFieldList:[],//子表字段列表
		mainFieldSelect:'',//主表选中字段
		subFieldSelect:'',//子表选中字段
		mainTableIdSelect:'',//选中主表ID
		subTableIdSelect:'',//选中子表ID

		mainTableKeyword:'',//主表搜索关键字
		subTableKeyword:'',//子表搜索关键字

		relationTableName:'',//关联表名
		relationFieldList:[],//关联字段

		enumFieldList:[],//枚举字段
		enumeration:'',//枚举

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
	mounted(){
		that = this;
		
		that.object = JSON.parse(sessionStorage.getItem("metadataSelect"));
		that.databaseId = sessionStorage.getItem("metadataDatabaseId")
		this.title= that.object.className + "元数据抽取方案配置";

		//初始化树
		this.initTree(0,that.object.className,that.object.classId,that.databaseId)

        $.fn.modal.Constructor.prototype.enforceFocus = function() {};

	    //初始化select2搜索框
	    $(".select2").select2({
	        placeholder:"请搜索"
	    });

	    //样式初始化
		$("#enumerationOverlay").css('display','none');//将enumeration 区域进行遮盖
        $("#attriubteCountConfigureOverlay").css('display','block');
        $("#attriubteCountConfigure").css('display','none');
        $("input[name='radio6']").change(function () {
            var attributeStyle=$("input[name='radio6']:checked").val();
            if (attributeStyle=="描述属性"){
                $("#enumerationOverlay").css('display','none');
                $("#attriubteCountConfigureOverlay").css('display','block');
                $("#attriubteCountConfigure").css('display','none');
                $("#enumerationCover").css('display','block');
            }else{
                $("#enumerationOverlay").css('display','block');
                $("#attriubteCountConfigureOverlay").css('display','none');
                $("#enumerationCover").css('display','none');
                $("#attriubteCountConfigure").css('display','block');
            }
        })

        //监听选择枚举
		$("#contrastTable").change(function () {
			var tableName = $("#contrastTable").find("option:selected").attr("data-name")
			var tabId = $("#contrastTable").find("option:selected").val()
			getDataByPost('/matadata_extract_management/enumeration_select',{
				databaseId:that.databaseId,
				tableEName:tableName,
				tabId:tabId
			},res=>{
				if(res.data==null||res.data==undefined){
					that.enumFieldList = []
					toastr.warning("该表没有枚举数据，请选择其他表")
				}else{
					that.enumFieldList = res.data
				}
			},err=>{
				toastr.error("获取枚举数据失败")
			})
		})

        //查询关联表
        this.modalSelect(that.object.classCode,that.databaseId)
	},
	methods:{
		//初始化树
		initTree(type,className,classId,databaseId){
			$("#pagination").empty();
			var settingss = {
	            data: {
	                simpleData: {
	                    enable: true,  //true 、 false 分别表示 使用 、 不使用 简单数据模式
	                    idKey: "nodeid",   //节点数据中保存唯一标识的属性名称
	                    pIdKey: "pnodeid",    //节点数据中保存其父节点唯一标识的属性名称
	                    rootPId: 0  //用于修正根节点父节点数据，即 pIdKey 指定的属性值
	                            },
	                key: {
	                    name: "nodename"  //zTree 节点数据保存节点名称的属性名称  默认值："name"
	                     }
	            },
				callback:{
					onClick:that.zTreeOnClickObjectModel
				}
	        };
	        getDataByPost("/matadata_extract_management/get_attinfo",{
	        	className:className,
	        	classId:classId,
	        	databaseId:databaseId,
	        	type:type
	        },res=>{
	        	$.fn.zTree.init($("#tree"), settingss, res.data); //初始化树
	        },err=>{
	        	toastr.error("初始化树失败")
	        })
		},
		//点击对象树事件
		zTreeOnClickObjectModel(event, treeId, treeNode) {
			//判断是否为父节点
			var treeObj = $.fn.zTree.getZTreeObj("tree");
			var nodes = treeObj.getSelectedNodes();
			var flag = nodes[0].isParent;

			//如果为子节点
			if(!flag){
				that.metaId = nodes[0].metaid
				$("#loading").css('display','block');
	            var atttableenname=treeNode.atttableenname;       //关联数据表英文名称
	            var atttablechname=treeNode.atttablechname;      //关联数据表中文名
	            that.attnameSelect=treeNode.attenname;                  //待添加属性英文名 （与关联字段英文名相同）
	            var attenchname=treeNode.nodename;               //待添加属性中文名 （与关联字段中文名可能不同）
	            var metaid=treeNode.metaid;                      //属性ATT_ID
	            var enumerationcode=treeNode.enumerationcode;    //所属枚举项字段名称
	            that.relationTableName = "("+atttableenname+")";
	            var selectedFieldChName = null;

	            getDataByPost("/matadata_extract_management/modal_table_dynamic",{
		        	datatableId:that.subTableList[0].tabId
		        },res=>{
		        	$("#loading").css('display','none');
		        	that.relationFieldList = res.data

		        },err=>{
		        	toastr.error("没有对象标识表,请更换数据源")
		        })

	            that.attenchname = attenchname

	            that.enumeration = ''
	            if(enumerationcode!="null"){
	                that.enumeration = enumerationcode
	            }

	            //清除统计字段
	            // var row=$("#attributeCount tr").length;
	            // for(row;row>1;row--){
	            //     AttributeManager.deleteCount();
	            // }

	            //遮盖层
	            if(treeNode.attributestyle=="描述属性"){
	                $("input[type='radio'][name='radio6']").attr("checked",false);
	                $("input[type='radio'][name='radio6']").get(0).checked=true;

	                $("#enumerationOverlay").css('display','none');
	                $("#attriubteCountConfigureOverlay").css('display','block');
	                $("#attriubteCountConfigure").css('display','none');
	                $("#enumerationCover").css('display','block');
	            }else{
	                $("input[type='radio'][name='radio6']").attr("checked",false);
	                $("input[type='radio'][name='radio6']").get(1).checked=true;
	                $("#enumerationOverlay").css('display','block');
	                $("#attriubteCountConfigureOverlay").css('display','none');
	                $("#enumerationCover").css('display','none');
	                $("#attriubteCountConfigure").css('display','block');
	            }

	            getDataByPost("/matadata_extract_management/atttree_onclick",{
					databaseId:that.databaseId,
					metaId:treeNode.metaid
	            },res=>{
	            	var msg = res.data
					that.relationList = msg.tablerelation;

                    // $("#attributeCountBody").empty();
                    // for(var o in msg.countList){
                    //   //  $("#attributeCount").append("<tr><td>msg.countList[o].STS_ORDER</td><td><select id='' style='width:200px' onchange='AttributeManager.CountFiled($(this))'></select></td>")
                    //     $("#attributeCount").append("<tr><td>"+msg.countList[o].stsOrder+"</td><td><select style='width:200px'><option>"+msg.countList[o].stsType+"</option></select></td>" +
                    //         "<td><select style='width:400px'><option>"+msg.countList[o].stsBase+"</option></select></td>")
                    // }
	            },err=>{
	            	toastr.error("获取关联表失败")
	            })

			}
		},
		//打开关联表modal
		showRelationTable(){
			$("#selectserach").change(function () {
				that.mainTableIdSelect=$("#selectserach").find("option:selected").val();
				that.modalTableDynamic1(that.mainTableIdSelect)
			})
			$("#selectserach1").change(function () {
				that.subTableIdSelect=$("#selectserach1").find("option:selected").val();
				that.modalTableDynamic2(that.subTableIdSelect)
			})
		},
		//搜索主表字段
		searchField1(){
			getDataByPost("/matadata_extract_management/search_field",{
				datatableId:that.mainTableIdSelect,
				keyword:that.mainTableKeyword
			},res=>{
				that.mainTableFieldList = res.data
			},err=>{
				toastr.error("搜索关键字失败")
			})
		},	
		//搜索子表字段
		searchField2(){
			getDataByPost("/matadata_extract_management/search_field",{
				datatableId:that.subTableIdSelect,
				keyword:that.subTableKeyword
			},res=>{
				that.subTableFieldList = res.data
			},err=>{
				toastr.error("搜索关键字失败")
			})
		},
		//查询表字段
		modalSelect(classCode,databaseId){
			getDataByPost("/matadata_extract_management/modal_select",{
	        	classCode:classCode,
	        	databaseId:databaseId
	        },res=>{
	        	var msg = res.data
	        	that.mainTableList = msg.mainTable
	        	that.subTableList = msg.subTable
	        	that.mainTableIdSelect = that.mainTableList[0].tabId
	        	that.subTableIdSelect = that.subTableList[0].tabId
	  			that.modalTableDynamic1(that.mainTableIdSelect)
	  			that.modalTableDynamic2(that.subTableIdSelect)
	        },err=>{
	        	toastr.error("没有对象标识表,请更换数据源")
	        })
		},
		//获取主表字段
		modalTableDynamic1(datatableId){
			that.mainFieldSelect=''
			getDataByPost("/matadata_extract_management/modal_table_dynamic",{
	        	datatableId:datatableId
	        },res=>{
	        	that.mainTableFieldList = res.data
	        },err=>{
	        	toastr.error("没有对象标识表,请更换数据源")
	        })
		},
		//获取子表字段
		modalTableDynamic2(datatableId){
			that.subFieldSelect=''
			getDataByPost("/matadata_extract_management/modal_table_dynamic",{
	        	datatableId:datatableId
	        },res=>{
	        	that.subTableFieldList = res.data
	        },err=>{
	        	toastr.error("没有对象标识表,请更换数据源")
	        })
		},
		//主表字段选择
		selectMainTableField(name){
			this.mainFieldSelect = name;
		},
		//子表字段选择
		selectSubTableField(name){
			this.subFieldSelect = name;
		},
		//删除关联表
		deleteRelation(){
			this.relationList.pop()
			this.relationTableName=''
			this.relationFieldList=[]
		},
		//确认添加关联表
		addRelation(){
			if(this.mainFieldSelect==''||this.subFieldSelect==''){
				toastr.warning("请选择字段")
				return;
			}
			if(this.mainFieldSelect!=this.subFieldSelect){
				toastr.warning("请选择相同的字段标识")
				return;
			}
			var table1=$("#select2-selectserach-container").html();
            var table2=$("#select2-selectserach1-container").html();

            var obj = {
            	ptabId:table1,
            	ftabId:table2,
            	pfdId:this.mainFieldSelect,
            	ffdId:this.subFieldSelect
            }
            that.relationList.push(obj)
            toastr.success("添加关联成功")
            $('#exampleModal').modal("hide");
            this.relationTableName = table2
            this.relationFieldList = this.subTableFieldList
            this.mainFieldSelect = ''
            this.subFieldSelect = ''
		},
		//打开枚举modal
		showEnumModal(){
			var foundDefaultValue = false;
			var msg = that.mainTableList
            for (var o in msg) {
                var selected = "";
                var name = msg[o].tabCName==null?'':msg[o].tabCName
                if(msg[o].tabEName.indexOf('DIC')!=-1){
                    selected = " selected = \"selected\" ";
                    foundDefaultValue = true;
                }
                $("#contrastTable").append("<option data-name='"+msg[o].tabEName+"'  value='" + msg[o].tabId + "' " + selected + ">"
                    + name + "(" + msg[o].tabEName + ")</option>")
                $("#codeselect").empty();
                $('#enumerationModal').attr("data-target", "#exampleModal2");
            }
            if (foundDefaultValue){
                $("#contrastTable").change();
            }
		},
		//确认枚举
		confirmEnumeration(){
			if( $("#codeselect").find("option:selected").text()==""){
	            toastr.warning("请选择枚举项");
	        }else{
	            that.enumeration=$("#contrastTable").find("option:selected").text()+":"+
	                $("#codeselect").find("option:selected").text();
	            $('#exampleModal2').modal("hide");
	        }
		},
		//清空枚举
		cleanEnumeration(){
			this.enumeration=''
		},
		//获取未配置属性
		getProperty(){
			getDataByPost("/matadata_extract_management/get_property",{
	        	className:that.object.className,
	        	databaseId:that.databaseId,
	        	classCode:that.object.classCode,
	        	classId:that.object.classId
	        },res=>{
	        	var msg = res.data
	        	that.newAttList = msg.newattribute;
                //多选框 防止事件冒泡
                $("#modal-body1").on("click", "input", function (event) {
                event.stopImmediatePropagation();
                });
	        },err=>{
	        	toastr.error("获取属性失败")
	        })
		},
		//添加属性
		addPropertyTo(){
			var attribute= $('input[name=optionsRadios3]:checked').parent().next().html();
	        if(attribute==null){
	            toastr.warning("请选择一个属性");
	        }else{
	            //取消树中已经选定的节点
	            var treeObj = $.fn.zTree.getZTreeObj("tree");
	            treeObj.cancelSelectedNode();

	            $("#enumerationInput").val("");

	            $('#exampleModal1').modal("hide");
	            that.attenchname = attribute;
	            $("#modal-body1").find("input").prop("checked",false)
	        }
		},
		//删除属性
		deleteProperty(){
            var treeObj = $.fn.zTree.getZTreeObj("tree");//
            var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true);
            var root=node.nodename;//根节点
            if (treeObj==null){
                toastr.warning("请选择节点");
                return;
            }
            var nodes = treeObj.getSelectedNodes();//叶子节点
 			if (nodes.length==0){
                toastr.warning("请选择节点");
                return;
            }
            var flag = nodes[0].isParent;
            if(flag){
            	toastr.warning("请选择正确的节点");
                return;
            }
			swal({
                title: "您确定要删除该属性吗",
                text: "删除后将无法恢复，请谨慎操作！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "删除",
                closeOnConfirm: false
            }, function () {

                console.log(nodes[0])
                var metaId = nodes[0].metaid


                getDataByPost('/matadata_extract_management/delete_property',{
                	metaId:metaId
                },res=>{
                	if(res.msg=="SUCCESS"){
                		swal("删除成功！", "您已经永久删除了这项属性。", "success");
						var type=nodes[0].attributestyle;
	                    that.attenchname=''
	                    that.relationTableName=''
	                    that.relationFieldList=[]
	                    //清除统计字段
	                    var row=$("#attributeCount tr").length;
	                    for(row;row>1;row--){
	                        if(row>1){
	                            $("#attributeCount tr:last").remove();
	                        }
	                    }
	                    //清除关联表
	                    that.relationList=[]
	                    if (type=="描述属性"){
	                    	that.initTree(1,that.object.className,that.object.classId,that.databaseId)
	                    }else{
	                    	that.initTree(2,that.object.className,that.object.classId,that.databaseId)
	                    }
                	}else{
                		toastr.warning("删除失败，请重试！")
                	}
					
				},res=>{
                	toastr.error("删除属性失败")
                })
            });
		},
		//选择关联表字段事件
		selectRelationField(e){
			var selected = e.target.value
			that.attnameSelect = selected.substr(0,selected.indexOf("("))
		},
		//增加测验
		//增加属性统计
		addCount(){

		},
		deleteCount(){

		},
		addProperty(){
			if (that.relationList.length==0) {
	            toastr.warning("请添加关联");// todo 同时获取属性英文名称和量纲
	        }
	        else if(that.attenchname==''){
	            toastr.warning("请添加属性名称");
	        } else {



                //属性类型数据
                var attributestyle = $("input[name='radio6']:checked").val();
                var enumerationcode=$("#codeselect").find("option:selected").text();

                var attCountTable=new Array();
                var m=0,n=0;
                /**
                 * 将属性统计配置表格保存到二维数组中
                 */
                $("#attributeCount").find("tr").each(function () {
                    attCountTable[m] = new Array();
                    n = 0;
                    $(this).find("td").each(function () {
                        if(n==0){
                            attCountTable[m][n] = $(this).text();
                        }else{
                            attCountTable[m][n] = $(this).find("option:selected").text();
                        }
                        n++;
                    });
                    m++;
                });

               
                //成功重新刷新树
                getDataByPost('/matadata_extract_management/add_property',{
					attributeCName:that.attenchname,
                	attributeEName:that.attnameSelect,
                	dataTable:that.relationTableName,
                	enumerationCode:enumerationcode,
                	attributeStyle:attributestyle,
                	databaseId:that.databaseId,
                	table:that.relationList,
                	attCountTable:JSON.stringify(attCountTable),
                	classId:that.object.classId
                },res=>{
					if (res.msg == "SUCCESS") {
                        toastr.success("增加成功");
                        if (attributestyle=="描述属性"){
                    		that.initTree(1,that.object.className,that.object.classId,that.databaseId)
                        }else{
                    		that.initTree(2,that.object.className,that.object.classId,that.databaseId)
                        }
                        //清空枚举项，否则再次增加非枚举型的属性时，会出错
                        that.enumFieldList=[]
                    } else {
                       toastr.warning(res.msg);
                    }
                },err=>{
                	toastr.error("增加属性失败")
                })
	        }
		},
		//修改属性
		alterProperty(){
			if (that.relationList.length==0) {
	            toastr.warning("请添加关联");// todo 同时获取属性英文名称和量纲
	        }
	        else if(that.attenchname==''){
	            toastr.warning("请添加属性名称");
	        } else {
                var selected=$("#attributeField option:selected").val();
                var attributeEName = selected.substr(0,selected.indexOf("("));

                //属性类型数据
                var attributestyle = $("input[name='radio6']:checked").val();
                var enumerationcode=$("#codeselect").find("option:selected").text();
                var attCountTable=new Array();

                var m=0,n=0;
                /**
                 * 将属性统计配置表格保存到二维数组中
                 */
                $("#attributeCount").find("tr").each(function () {
                    attCountTable[m] = new Array();
                    n = 0;
                    $(this).find("td").each(function () {
                        if(n==0){
                            attCountTable[m][n] = $(this).text();
                        }else{
                            attCountTable[m][n] = $(this).find("option:selected").text();
                        }
                        n++;
                    });
                    m++;
                });

               
                //成功重新刷新树
                getDataByPost('/matadata_extract_management/alter_property',{
                	metaId:that.metaId,
                	attributeEName:that.attnameSelect,
                	dataTable:that.relationTableName,
                	enumerationCode:that.enumeration,
                	databaseId:that.databaseId,
                	table:that.relationList,
                	attCountTable:JSON.stringify(attCountTable),
                	classId:that.object.classId
                },res=>{
					if (res.msg == "SUCCESS") {
                        toastr.success("修改成功");
                        if (attributestyle=="描述属性"){
                    		that.initTree(1,that.object.className,that.object.classId,that.databaseId)
                        }else{
                    		that.initTree(2,that.object.className,that.object.classId,that.databaseId)
                        }
                        //清空枚举项，否则再次增加非枚举型的属性时，会出错
                        that.enumFieldList=[]
                    } else {
                       toastr.warning(res);
                    }
                },err=>{
                	toastr.error("修改属性失败")
                })
	        }
		},
		//显示属性顺序modal
		showAttorder(){
			getDataByPost('/matadata_extract_management/get_attlist',{
				classId:that.object.classId,
				databaseId:that.databaseId
			},res=>{
				that.attInfoList = res.data;
			},err=>{
				toastr.error("获取属性列表失败")
			})
		},
		//取消保持属性顺序
		cancelOrder(){
			that.attInfoList = []
		},
		//属性上移
		moveUp(){
			var obj=document.getElementById('saved_attributes');
	        for(var i=1;i<obj.length;i++){   //最上面的一个不需要移动，所以直接从i=1开始
	            if(obj.options[i].selected){
	                if(!obj.options.item(i-1).selected){
	                    var selText = obj.options[i].text;
	                    var selValue = obj.options[i].value;
	                    obj.options[i].text = obj.options[i-1].text;
	                    obj.options[i].value = obj.options[i-1].value;
	                    obj.options[i].selected = false;
	                    obj.options[i-1].text = selText;
	                    obj.options[i-1].value = selValue;
	                    obj.options[i-1].selected=true;
	                }
	            }
	        }
	    },
	    //属性下移
	    moveDown(){
	    	var obj=document.getElementById('saved_attributes');
	        for(var i=obj.length-2;i>=0;i--){  //向下移动，最后一个不需要处理，所以直接从倒数第二个开始
	            if(obj.options[i].selected){
	                if(!obj.options[i+1].selected){
	                    var selText=obj.options[i].text;
	                    var selValue=obj.options[i].value;
	                    obj.options[i].text = obj.options[i+1].text;
	                    obj.options[i].value = obj.options[i+1].value;
	                    obj.options[i].selected = false;
	                    obj.options[i+1].text = selText;
	                    obj.options[i+1].value = selValue;
	                    obj.options[i+1].selected=true;
	                }
	            }
	        }
	    },
	    //保存属性顺序
	    saveAttributeSequence() {
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            var root = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true);
            var rootname=root.nodename;
            var selValue = new Array();
            var obj=document.getElementById('saved_attributes');
            for(var i=0;i<obj.length;i++){
                selValue[i]=obj.options[i].text;
            }
            getDataByPost('/matadata_extract_management/save_attribute_sequence',{
            	selValue:JSON.stringify(selValue),
            	databaseId:that.databaseId,
            	classId:that.object.classId
            },res=>{
            	if(res.msg=='SUCCESS'){
            		toastr.success("保存成功")
            		that.attInfoList = []
            	}else{
            		toastr.warning(res.msg)
            	}
            },err=>{
            	toastr.error("修改属性顺序失败")
            })
        },
        //去摘要配置
        goAbstractConfig(){
        	$('.content-wrapper').load('metadata/extract/management/extract.html', function() {});
        },
		//显示联系人模态框
		showContact(){
			that.searchContact=''
			getDataByPost('/matadata_extract_management/get_contact',{
				className:that.object.className
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
			if(this.contactSelect==''){
				toastr.warning("请选择联系人")
				return;
			}
			getDataByPost('/matadata_extract_management/bind_contact',{
				classId:that.object.classId,
				contactId:that.contactSelect
			},res=>{
				if(res.msg=='SUCCESS'){
					toastr.success("添加成功")
					$('#contactConfigModal').modal('hide')
				}else{
					toastr.error(res.msg)
				}
			},err=>{
				toastr.error(err)
			})
		},
		//保存属性
		save(){
			var treeObj = $.fn.zTree.getZTreeObj("tree");
	        var nodes = treeObj.getSelectedNodes();//
	        if(nodes.length==0){
	            that.addProperty();
	        }else{
	            var flag = nodes[0].isParent;
	            if (!flag){
	                that.alterProperty();
	                that.attenchname=''
	            }else{
	                toastr.warning("请选择正确的节点");
	            }
	        }
		},
		//重置
		reset(){
			that.attenchname=''
			that.relationList=[]
			that.attnameSelect=''
			that.relationFieldList=[]
			that.enumeration=''
			that.relationTableName=''
		}
	}
})