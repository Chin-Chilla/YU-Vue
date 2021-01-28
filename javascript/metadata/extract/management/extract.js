var that;
var app = new Vue({
    el: '#vue',
    data: {
        object: '', //缓存的对象
        databaseId: '', //数据源ID
        candidateAttributeList: [], //候选属性
        abstractList: [], //摘要属性
        sampleAbstractList:[],//摘要样例列表
        exampleAbs:'',//样例属性
    },
    mounted() {
        that = this;
        //初始化select2搜索框
	    $(".select2").select2({
	        placeholder:"请搜索"
	    });
        that.object = JSON.parse(sessionStorage.getItem("metadataSelect"));
        that.databaseId = sessionStorage.getItem("metadataDatabaseId");
        $("#loading").css('display', 'block');
        getDataByPost('/matadata_extract_management/get_candidate_attribute', {
            classId: that.object.classId,
            databaseId: that.databaseId
        }, res => {
            if (res.msg == 'SUCCESS') {
                that.candidateAttributeList = res.data
            } else {
                toastr.error(res.msg)
            }
        }, err => {
            toastr.error("获取候选属性失败")
        })
        getDataByPost('/matadata_extract_management/get_abstract', {
            classId: that.object.classId,
            databaseId: that.databaseId
        }, res => {
            if (res.msg == 'SUCCESS') {                that.abstractList = res.data

            } else {
                toastr.error(res.msg)
            }
        }, err => {
            toastr.error("获取摘要属性失败")
        })

		getDataByPost('/matadata_extract_management/get_extract_objext_list', {
            className: that.object.className
        }, res => {
            if (res.msg == 'SUCCESS') {
                that.sampleAbstractList = res.data
                if(that.sampleAbstractList.length==0){
                	$("#loading").css('display', 'none');
                }else{
                	that.getAbsAtt(that.sampleAbstractList[0].origId)
                }
            } else {
                toastr.error(res.msg)
            }
        }, err => {
            toastr.error("获取摘要样例失败")
        })

        $("#abstractexmObjName").change(function(){
        	var origId=$("#abstractexmObjName").find("option:selected").val();//选择对象
        	that.getAbsAtt(origId)
        })
    },
    methods: {
    	getAbsAtt(origId){
			getDataByPost('/matadata_extract_management/get_abstract_att',{
            	origId:origId
            },res=>{
				$("#loading").css('display', 'none');
           		that.exampleAbs = res.data
            },err=>{
            	toastr.error("获取摘要详细属性失败")
            })
    	},
        backToConfig() {
            $('.content-wrapper').load('metadata/extract/management/config.html', function() {});
        },
        add() {
            //先判断是否有选中
            if (!$("#select_candidate option").is(":selected")) {
                toastr.warning("请选择需要移动的选项")
                return;
            }
            //获取选中的选项，删除并追加给对方
            $('#select_candidate option:selected').appendTo('#select_checked');
        },
        addAll() {
            //获取全部的选项,删除并追加给对方
            $('#select_candidate option').appendTo('#select_checked');
        },
        remove() {
            //先判断是否有选中
            if (!$("#select_checked option").is(":selected")) {
                toastr.warning("请选择需要移动的选项")
            } else {
                $('#select_checked option:selected').appendTo('#select_candidate');
            }
        },
        moveUp() {
            var obj = document.getElementById('select_checked');
            for (var i = 1; i < obj.length; i++) { //最上面的一个不需要移动，所以直接从i=1开始
                if (obj.options[i].selected) {
                    if (!obj.options.item(i - 1).selected) {
                        var selText = obj.options[i].text;
                        var selValue = obj.options[i].value;
                        obj.options[i].text = obj.options[i - 1].text;
                        obj.options[i].value = obj.options[i - 1].value;
                        obj.options[i].selected = false;
                        obj.options[i - 1].text = selText;
                        obj.options[i - 1].value = selValue;
                        obj.options[i - 1].selected = true;
                    }
                }
            }
        },
        moveDown() {
            var obj = document.getElementById('select_checked');
            for (var i = obj.length - 2; i >= 0; i--) { //向下移动，最后一个不需要处理，所以直接从倒数第二个开始
                if (obj.options[i].selected) {
                    if (!obj.options[i + 1].selected) {
                        var selText = obj.options[i].text;
                        var selValue = obj.options[i].value;
                        obj.options[i].text = obj.options[i + 1].text;
                        obj.options[i].value = obj.options[i + 1].value;
                        obj.options[i].selected = false;
                        obj.options[i + 1].text = selText;
                        obj.options[i + 1].value = selValue;
                        obj.options[i + 1].selected = true;
                    }
                }
            }
        },
        saveSequence(){
            var selValue = new Array();
            //已经设置好的摘要属性顺序
            var obj=document.getElementById('select_checked');
            for(var i=0;i<obj.length;i++){
                selValue[i]=obj.options[i].text;
            }
            if(selValue.length==0){
                toastr.warning("请至少选择一个摘要属性")
                return;
            }
            getDataByPost('/matadata_extract_management/save_sequence',{
                selValue:JSON.stringify(selValue),
                classId:that.object.classId,
                databaseId:that.databaseId
            },res=>{
                if(res.msg=="SUCCESS"){
                    toastr.success("摘要属性配置保存成功");
                    $('.content-wrapper').load('metadata/extract/management/config.html', function() {});
                }
            })
        },
        preExtract(){
        	$("#loading").css('display', 'block');
        	var selValue = new Array();
	        //已经设置好的摘要属性顺序
	        var obj=document.getElementById('select_checked');
	        for(var i=0;i<obj.length;i++){
	            selValue[i]=obj.options[i].text;
	        }
	        if(selValue.length==0){
	        	toastr.warning("请至少选择一个摘要属性")
	        	$("#loading").css('display', 'none');
	        	return;
	        }
        	getDataByPost('/matadata_extract_management/save_sequence',{
        		selValue:JSON.stringify(selValue),
        		classId:that.object.classId,
        		databaseId:that.databaseId
        	},res=>{
        		if(res.msg=='SUCCESS'){
        			getDataByPost('/matadata_extract_management/pre_import_entity',{
		        		className:that.object.className,
		        		databaseId:that.databaseId
		        	},res2=>{
		        		if(res2.msg=='SUCCESS'){
		        			getDataByPost('/matadata_extract_management/pre_extract_entity',{
				        		className:that.object.className,
		        				databaseId:that.databaseId
				        	},res3=>{
				        		if(res3.msg=="SUCCESS"){
				        			toastr.success("配置刷新成功！")
				        			that.sampleAbstractList=[]
				        			getDataByPost('/matadata_extract_management/get_extract_objext_list', {
							            className: that.object.className
							        }, res => {
							            if (res.msg == 'SUCCESS') {
							                that.sampleAbstractList = res.data
							                that.getAbsAtt(that.sampleAbstractList[0].origId)
							            } else {
							                toastr.error(res.msg)
							            }
							        }, err => {
							            toastr.error("获取摘要样例失败")
							        })
				        		}else{
				        			toastr.error(res3.msg);
				        			$("#loading").css('display', 'none');
				        		}
				        	},err3=>{
				        		$("#loading").css('display', 'none');
				        		toastr.error(err3.msg)
				        	})
		        		}else{
		        			toastr.error(res2.msg)
		        			$("#loading").css('display', 'none');
		        		}      	
		        	},err2=>{
		        		$("#loading").css('display', 'none');
		        		toastr.error(err2.msg)
		        	})
        		}else{
        			$("#loading").css('display', 'none');
		        	toastr.error(res.msg)
        		}
        	},err=>{
        		$("#loading").css('display', 'none');
        		toastr.error(err.msg)
        	})
        }
    }
})