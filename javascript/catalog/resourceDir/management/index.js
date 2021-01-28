var that;
var app = new Vue({
    el: "#vue",
    data: {
        className: '', //对象分类
        classId: '', //分类ID
        objId: '', //对象ID
        objName: '', //对象名
        selectedState: '', //审核状态
        pageSize: 20,
        pageNum: 1,
        varList: [],
        total: '',
        stateList: [{
            value: '',
            name: '所有状态'
        }, {
            value: '0',
            name: '未审核'
        }, {
            value: '1',
            name: '审核通过'
        }, {
            value: '2',
            name: '审核未通过'
        }], //审核状态
        pageSizeList: ['10', '20', '50', '100'], //页面大小列表
        note:'',//拒绝理由
        progress:'',//进度
        progressTitle:'',
    },
    mounted() {
        that = this;
        $('.objDatepicker').datepicker({
            autoclose: true,
            language: "zh-CN",
            todayHighlight: true
        });

    },
    methods: {
        //选择对象
        chooseClass() {
            var setting = {
                data: {
                    simpleData: {
                        enable: true, //true 、 false 分别表示 使用 、 不使用 简单数据模式
                        idKey: "classId", //节点数据中保存唯一标识的属性名称
                        pIdKey: "pClassId", //节点数据中保存其父节点唯一标识的属性名称
                        rootPId: 1 //用于修正根节点父节点数据，即 pIdKey 指定的属性值
                    },
                    key: {
                        name: "className" //zTree 节点数据保存节点名称的属性名称  默认值："name"
                    }
                },
                check: {
                    enable: true, //true 、 false 分别表示 显示 、不显示 复选框或单选框
                    nocheckInherit: true //当父节点设置 nocheck = true 时，设置子节点是否自动继承 nocheck = true
                }
            };

            getDataByGet("/matadata_extract_management/get_classtree", "", res => {
                var jsonFlag, jsonLack, jsonExtra;
                jsonFlag = res.data[0].flag;
                if (jsonFlag == 1) {
                    jsonLack = res.data[1].lack;
                    jsonExtra = res.data[2].extra;
                    var classNameLack = "";
                    for (var i = 0; i < jsonLack.length; i++) {
                        classNameLack = classNameLack + jsonLack[i].class_name + ' ';
                    }
                    var classNameExtra = "";
                    for (var i = 0; i < jsonExtra.length; i++) {
                        classNameExtra = classNameExtra + jsonExtra[i].class_name + ' ';
                    }
                    //alert("本地缺少节点："+classNameLack+"\n"+"本地多余节点："+classNameExtra);
                    res.data.splice(0, 3);
                    $.fn.zTree.init($("#objectTree"), setting, res.data);
                } else {
                    res.data.splice(0, 1);
                    $.fn.zTree.init($("#objectTree"), setting, res.data);
                }
            }, err => {
                toastr.error("初始化树失败")
            })
        },
        confirmClass() {
			var treeObj = $.fn.zTree.getZTreeObj("objectTree");
	        var nodes = treeObj.getCheckedNodes(true);
	        that.className = nodes[nodes.length-1].className
            that.classId =  nodes[nodes.length-1].classId
            that.search();
        },
        //选择状态
        selectState(e) {
            this.selectedState = e.target.value
        },
        //时间戳转时间字符串
        timestampToDate(timestamp) {
            var d = new Date(timestamp); //根据时间戳生成的时间对象
            var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
            var day = (d.getDate()) < 10 ? '0' + (d.getDate()) : (d.getDate())
            var date = (d.getFullYear()) + "-" +
                month + "-" +
                day
            return date
        },
        //审核状态
        getState(state) {
            switch (state) {
                case 0:
                    return '未审核';
                case 1:
                    return '审核通过';
                case 2:
                    return '审核未通过';
            }
        },
        //更改页面大小
        changePageSize(e) {
            that.pageNum = 1
            that.pageSize = e.target.value
            this.search();
        },
        //全选当前页
        choosePage() {
            if ($("#thisPage").is(':checked')) {
                $("input[name='choose']").prop("checked", true);
            } else {

            }
        },
        //清空当前页
        clear() {
            if ($("#clear").is(':checked')) {
                $("input[name='choose']").removeAttr("checked");
            } else {}
        },
        //全选
        chooseAll() {
            if ($("#all").is(':checked')) {
                $("input[name='choose']").prop("checked", true);
            } else {

            }
        },
        //勾选单个
        chooseOne() {
            $("input[name='optionsChoose']").removeAttr("checked");
        },

        //导出
        download(id) {
            window.open(BASE_URL + "/metadata_register/download?id=" + id, '_blank')
        },
        //搜索
        search() {
            $("#loading").css('display', 'block');
            $('input[name=choose]').prop('checked', false);
            $('input[type=radio]').prop('checked', false);
            that.pageNum = 1
            that.getPageData(res => {
                that.varList = res.data.list
                that.total = res.data.total
                $("#text1").text("结果数量:  " + that.total);
                $("#pagination").empty();
                $("#pagination").Paging({
                    pagesize: that.pageSize,
                    count: that.total,
                    toolbar: true,
                    callback: function(page, size, count) {
                        that.pageNum = page
                        if ($("#thisPage").is(':checked')) {
                            $("input[name='choose']").removeAttr("checked");
                            $("#thisPage").attr("checked", false)
                        }
                        that.getPageData(res => {
                            that.varList = res.data.list
                        })
                    }
                });
                $("#loading").css('display', 'none');
            })
        },
        //获取列表
        getPageData(callback) {
            getDataByPost('/resource_dir/search_data', {
                pageSize: that.pageSize,
                pageNum: that.pageNum,
                objId: that.objId,
                startTime: $("#regtime").val(),
                endTime: $("#to").val(),
                state: that.selectedState,
                classId: that.classId,
                objName: that.objName
            }, callback)
        },
        //重置搜索
        reset() {
            $("#regtime").val('')
            $("#to").val('')
            that.objId = ''
            that.objName = ''
            that.className = ''
            that.classId = ''
            that.selectedState = ''
            that.pageNum = 1
        },
        //审核拒绝modal
        showRefuseModal(){
	        var ischeck=document.getElementsByName("choose");
	        var flag=false;
	        for(i=0;i<ischeck.length;i++){
	            if(ischeck[i].checked==true){
	                flag=true;break;
	            }
	        }
	        if(flag==true){
	            $("#myModal").modal("show");
	        }
	        else{
	            toastr.warning("请选择");
	        
	        }
        },
        //审核拒绝
        reviewRefuse(){
	        var icheck1 = document.getElementById("all");
	        if (icheck1.checked != true) {
	        	that.progressTitle="审核拒绝进度"
	        	that.progress = 0
            	$("#progressModal").modal({backdrop: 'static', keyboard: false})
            	var interval = 100
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

	            var str=''
	            var table=document.getElementById("sample_1");
	            var ischeck=document.getElementsByName("choose");
	            for(i=0;i<ischeck.length;i++){
	                if(ischeck[i].checked==true){
	                    var node= ischeck[i].parentNode.nextSibling;
	                    var row=node.parentNode.rowIndex;
	                    var x=table.rows[row].cells;
	                    var id = x[6].firstChild.value;
	                    str = str +','+id
	                }
	            }
	            getDataByPost('/resource_dir/refuse',{
	            	array:str.substring(1),
	            	note:that.note
	            },res=>{
	            	$("#myModal").modal("hide");
	            	if(res.msg=='SUCCESS'){
	            		that.progress=100;
                    	setTimeout(function(){
                    		$("#progressModal").modal('hide')
                    	},500)
                        setTimeout(function(){
							swal("审核拒绝成功！", "", "success");
							that.search()
                        },1000)
                    }else{
                    	$("#progressModal").modal('hide')
                        toastr.error("审核拒绝失败!");
                    }
	            })
	        }else {
	        	that.progressTitle="审核拒绝进度"
	        	that.progress = 0
            	$("#progressModal").modal({backdrop: 'static', keyboard: false})
                var interval = 1.49*that.total/90
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
	            getDataByPost('/resource_dir/refuse',{
	            	array:'',
	            	note:that.note
	            },res=>{
	            	$("#myModal").modal("hide");
					if(res.msg=='SUCCESS'){
						that.progress=100;
                    	setTimeout(function(){
                    		$("#progressModal").modal('hide')
                    	},500)
                        setTimeout(function(){
							swal("审核拒绝成功！", "", "success");
							that.search()
                        },1000)
                    }else{
                    	$("#progressModal").modal('hide')
                        toastr.error("审核拒绝失败!");
                    }
	            })
	        }
        },
        //审核通过
        passReview() {
            var icheck1 = document.getElementById("all"); //全选所有内容框
            if(app.className==""){
                toastr.warning("请选择对象分类!")
                return;
            }
            if (icheck1.checked != true) { //如果没有全选所有内容
                var table = document.getElementById("sample_1");
                var ischeck = document.getElementsByName("choose");
                var flag = false;
                //判断是否至少有一行被选中
                for (i = 0; i < ischeck.length; i++) {
                    //第i行被选中
                    if (ischeck[i].checked == true) {
                        flag = true;
                        break;
                    }
                }
                if (flag == true) {
                    var str = "";
                    for (i = 0; i < ischeck.length; i++) {
                        if (ischeck[i].checked == true) {
                            var node = ischeck[i].parentNode.nextSibling;
                            var row = node.parentNode.rowIndex; //所在行数
                            var x = table.rows[row].cells; //所有列数
                            var mdfileid = x[6].firstChild.value; //元数据id
                            var state = x[4].innerHTML;
                            if (state == "审核通过") {
                                toastr.warning("已经审核通过的元数据不能再审核！");
                                return;
                            } else {
                                str=str+","+mdfileid
                            }
                        }
                    }
                    that.progressTitle="审核通过进度"
                    that.progress = 0
	            	$("#progressModal").modal({backdrop: 'static', keyboard: false})
                    var interval = 100
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
                    getDataByPost('/resource_dir/pass', {
                        array: str.substring(1),
                        flag: 0
                    }, res => {
                        if (res.msg == "SUCCESS") {
                            that.progress=100;
                        	setTimeout(function(){
                        		$("#progressModal").modal('hide')
                        	},500)
                            setTimeout(function(){
								swal("审核通过成功！", "", "success");
								that.search()
                            },1000)
                        }else{
                        	$("#progressModal").modal('hide')
                            if(res.msg==""){
                                toastr.error("已经审核通过的元数据不能再审核！");
                            }else{
                                toastr.error(res.msg);
                            }
                        }
                    })
                } else { //一行都没被选中
                    toastr.warning("请选择");
                }
            } else { //如果全选所有内容
                that.progressTitle="审核通过进度"
                that.progress = 0
            	$("#progressModal").modal({backdrop: 'static', keyboard: false})
                var interval = 3.89*that.total/90
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
                // if ((TaskManage.taskflag == "1") && (confirm("是否要加入任务队列") == true)) {
                //     //审核任务添加到任务队列中
                //     getStringData('/TaskManager/addReview2Quene', dataStr, function(msg) {
                //         console.log(msg);
                //         if (msg == "ok") {
                //             alert("成功添加到任务队列中，完成后将更新目录结构");
                //         } else if (msg == "exist") {
                //             alert("添加任务失败，该任务已存在");
                //         } else if (msg == "proerr") {
                //             alert("添加任务失败, 有相关任务未完成");
                //         } else {
                //             alert("添加任务失败，有前序任务未完成！");
                //         }
                //         $("#loading").css('display', 'none'); //取消 loading 界面
                //         MenuReviewPage.load();
                //     });
                // } else { //不加入任务队列
                	getDataByPost('/resource_dir/pass',{
                		state:that.selectedState,
                		flag:'1'
                	},res=>{
                		if (res.msg == "SUCCESS") {
                            that.progress=100;
                        	setTimeout(function(){
                        		$("#progressModal").modal('hide')
                        	},500)
                            setTimeout(function(){
								swal("审核通过成功！", "", "success");
								that.search()
                            },1000)
                        }else{
                        	$("#progressModal").modal('hide')
                            if(res.msg==""){
                                toastr.error("已经审核通过的元数据不能再审核！");
                            }else{
                                toastr.error(res.msg);
                            }

                        }
                	})
                // }
            }
        },
        //数据更新
        updateReview(){
        	if(that.className==''){
        		toastr.warning("请选择对象分类")
        		return;
        	}
        	that.progressTitle="索引更新进度"
        	that.progress = 0
        	$("#progressModal").modal({backdrop: 'static', keyboard: false})
            var interval = 3.7*that.total/90
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
	        getDataByPost('/resource_dir/update',{
				objId: that.objId,
                startTime: $("#regtime").val(),
                endTime: $("#to").val(),
                state: that.selectedState,
                classId: that.classId,
                objName: that.objName
	        },res=>{
	        	if(res.msg=="SUCCESS"){
					that.progress=100;
                	setTimeout(function(){
                		$("#progressModal").modal('hide')
                	},500)
                    setTimeout(function(){
						swal("索引更新成功！", "", "success");
                    },1000)
	        	}else{
					$("#progressModal").modal('hide')
                    toastr.error("索引更新失败!");
	        	}
	        })
        }
    }
})