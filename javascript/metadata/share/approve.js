// import '../../browse/search/KeySearch'
// import '../../browse/detail/detailPage'

var that;


var app = new Vue({
	el:"#vue",

	data:{
		allListData: [],
		pageSize:5,//分页数目
		pageNum:1,

		reqNum:0,//数量统计
		passNum:0,
		refusedNum:0,
		totalNum:0,
		status_show:"",//状态


		forStart:true,//判断是否是第一次进行当前页的加载，来决定是否清空tbody的子元素
		newListNum:0,
		isAllChecked:false,//判断是否点击过全选按钮，防止先全选然后进行局部取消的操作，这样会使伪全选失效
		passOrRefusedErrorNum:0,//统计批量通过的出错数;

	},
	mounted(){

		that = this;
		getDataByPost('/user/getSubList',{
			pageNum:this.pageNum,
			pageSize:this.pageSize,
		},res=>{
			console.log(res.data);
			that.totalNum = res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		});
		getDataByPost('/user/getSubList',{
			pageNum:1,
			pageSize:that.totalNum,
		},res=>{
			that.allListData=res.data.list;
		});
		that.getStatusNum();
		// that.forStart=true;
	},
	methods:{
		renderList(list,isCilcked){
			console.log("isclicked是："+isCilcked)
			if(that.forStart || isCilcked){
				//第一次加载进行tbody子元素的清空,并且初始化
				$("#tbody").empty();
				console.log("走了empty")
				// $(":checkbox[name='allChecked']")[0].checked=false;
				app.renderNewList(list);

				that.forStart=false;
			}else{
				//非第一次则进行tr子元素的隐藏
				//将所有不是请求页也就是pageNum的tr标签进行隐藏，是的话就进行显示，否则就是tbody中没有，那么就从后台进行获取
				//是否要获取新的子元素
				var forGetNew = true;
				for(var i=0;i<$("#tbody").children("tr").length;i++){

					if($("#tbody").children("tr")[i].id.substr(0,1)===''+that.pageNum){
						console.log("标签已存在，直接设置display")
						$("#tbody").children("tr")[i].style.display='';
						forGetNew = false;//已有子元素 ，只需设置display显示
					}else{
						$("#tbody").children("tr")[i].style.display="none";
					}
				}

				if(forGetNew){
					app.renderNewList(list);
				}
			}
			//
			// console.log($("#tbody").children("tr")[0].id.substr(0,1));
			// console.log($("#tbody").children("tr")[0].id);
			// console.log($("#tbody").children("tr")[0].id.substr(0,1)==='1');
			// console.log($("#tbody").children("tr")[0].id.substr(0,1)===''+that.pageNum);
			// console.log(that.pageNum);
			// console.log($("#tbody").children("tr").length);
			// var test1=$("#tbody").children("tr")[0];
			// var test2 = $(test1).children("td")[0];
			// var test3 = $(test2).children("input")[0];
			// console.log("选中的："+test3)



		},
		//
		changePage(nowPage, size){
			//将当前页获取到，来标注页内tr元素的唯一id
			that.pageNum=nowPage;

			getDataByPost('/user/getSubList',{
				pageNum:nowPage,
				pageSize:size,

			},res=>{
				that.totalNum = res.data.total;

				that.renderList(res.data.list);
				that.renderPagination();
			});
		},
		//渲染分页
		renderPagination(){
			$("#pagination").empty();
			$("#pagination").Paging({
				pagesize: that.pageSize,
				count: that.totalNum,
				toolbar: true,
				callback: function (page, size, count) {
					that.changePage(page, size);
				}
			});
		},
		renderNewList(list){
			for(var i=0;i<list.length;i++){
				//添加新的tr元素，统计数量
				that.newListNum++;
				if (list[i].status == 0){
					that.status_show = "审核中";
				}else if(list[i].status == 1){
					that.status_show = "未通过";
				}else{
					that.status_show = "已通过";
				}
				var onlyId = ''+that.pageNum+list[i].mdFileId;//tr的id
				var checkboxId = 'checkbox'+list[i].status+(that.newListNum-1)+list[i].mdFileId; //checkbox的id，方便后台获取批量处理的dom
				// var singleIndex = that.newListNum-1;
				// var singleStatus = list[i].status

				$("#tbody").append("<tr><td><input type='checkbox' name='single' onclick=app.single()>&nbsp&nbsp"+list[i].mdFileId+
					"</td><td><a style='cursor: pointer;'' onclick=\"keySearch.detail('"+list[i].mdFileId+
					"','"+list[i].loc+"')\">"+list[i].mdName+
					"</a></td><td>"+list[i].createTime+
					"</td><td><el-button type=\"success\" size=\"mini\">"+that.status_show+"</el-button></td>" +
					// "<td><input type='button' value='取消订阅'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td>" +
					"<td><input type='button' value='拒绝'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.refuse('"+list[i].mdFileId+"','"+list[i].status+"')\"></td>" +
					"<td><input type='button' value='通过'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.pass('"+list[i].mdFileId+"','"+list[i].status+"')\"></td></tr>")

				$(":checkbox[name='single']")[that.newListNum-1].checked=that.isAllChecked;
				$(":checkbox[name='single']")[that.newListNum-1].id=checkboxId;
				$("#tbody").children("tr")[that.newListNum-1].id=onlyId;



			}
		},
		// unsubscribe(id){
		//
		// 	swal({
		// 		title: "您确定要取消订阅吗",
		// 		type: "warning",
		// 		showCancelButton: true,
		// 		confirmButtonColor: "#DD6B55",
		// 		confirmButtonText: "取消订阅",
		// 		closeOnConfirm: false
		// 	}, confirm=> {
		// 		getDataByPost('/user/unsubscribe',{
		// 			id:id
		// 		},res=>{
		// 			if(res.code==200){
		// 				swal("取消订阅成功！", "", "success");
		// 				that.changePage(1,that.pageSize);
		// 				// that.reload();
		// 			}
		// 		});
		// 	});
		//
		// },

		getStatusNum(){
			getDataByPost('/user/getStatusNum',{
				pageSize:that.totalNum,
			},res=>{
				that.reqNum = res.data.zeroStatus;
				that.passNum=res.data.oneStatus;
				that.refusedNum=res.data.twoStatus;

			});
		},

		allChecked(){
			that.isAllChecked = $(":checkbox[name='allChecked']")[0].checked;//点击时同步状态，克表示取消了全选和全选，不用按钮来实现这个操作的原因时，这个复选框的状态可以表示是否被全选
			for(i=0;i<$(":checkbox[name='single']").length;i++){
				$(":checkbox[name='single']")[i].checked=$(":checkbox[name='allChecked']")[0].checked;
			}
		},
		single(){
			// var singleStatus = Number($(":checkbox[name='single']").id.substr(8,1));


			//绑定单击事件，进行check数量统计
			singleCount=0;
			for(i=0;i<$(":checkbox[name='single']").length;i++){
				if($(":checkbox[name='single']")[i].checked) singleCount++;
				//通过实现加载过的tr与加载过的checkbox的选中状态实现伪全选，视觉上没问题，然后后台改实现逻辑，实际功能也不会有问题
				$(":checkbox[name='allChecked']")[0].checked=(singleCount==$("#tbody").children("tr").length);
			}

		},


		pass(id,status,allPass){
			if(allPass){
				if (status != 0){
					// swal("状态已变，操作失败！", "", "error");
					// alert("状态以便操作失败！")
					that.passOrRefusedErrorNum++;
				}else {
					getDataByPost('/user/passSubMeta', {
						id: id
					}, res => {
						app.backMessage(res);
					});
				}

			}else{
				if (status != 0){
					swal("状态已变，操作失败！", "", "error");
				}else{
					swal({
						title: "您确定要通过该数据吗",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#dd6b55",
						confirmButtonText: "通过",
						closeOnConfirm: true
					}, confirm=> {
						getDataByPost('/user/passSubMeta',{
							id:id
						},res=>{
							app.backMessage(res);
						});
					});
				}
			}
		},

		refuse(id,status,allRefuse){
			if(allRefuse){
				if (status != 0){
					// swal("状态已变，操作失败！", "", "error");
					// alert("状态以便操作失败！")
					that.passOrRefusedErrorNum++;
				}else {
					getDataByPost('/user/refuseSubMeta', {
						id: id
					}, res => {
						app.backMessage(res,true);
					});
				}

			}else{
				if (status != 0){
					swal("状态已变，操作失败！", "", "error");
				}else {
					swal({
						title: "您确定要拒绝该数据吗",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "拒绝",
						closeOnConfirm: false
					}, confirm => {
						getDataByPost('/user/refuseSubMeta', {
							id: id
						}, res => {

							app.backMessage(res,true);
						});
					});
				}
			}

		},
		passChecked(){
			if($(":checkbox:checked").length){
				swal({
						title: "您确定要通过这批数据吗",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "确定",
						closeOnConfirm: false
					},function(){
						var allNum=0;
						if($(":checkbox[name='allChecked']")[0].checked){
							console.log("走了全选分支");
							// that.isAllChecked=false;

							// for(var i=0;i<that.allListData.length;i++){
							// 	var id = that.allListData[i].mdFileId;
							// 	var status = that.allListData[i].status;
							// 	console.log(id)
							// 	app.pass(id,status,true);
							// }
							$.each($(that.allListData),function (index,element) {
								app.pass(element.mdFileId,element.status,true);

							})
							allNum = Number(that.allListData.length);

						}else{
							$.each($(":checkbox:checked"),function (index,element) {
								console.log(element.id.substr(10));
								app.pass(element.id.substr(10),element.id.substr(8,1),true);

							})
							allNum = Number($(":checkbox:checked").length);
						}


						var leftNum = allNum-that.passOrRefusedErrorNum;

						if(that.passOrRefusedErrorNum){
							if(leftNum){
								swal({
									title:"其中有"+that.passOrRefusedErrorNum+"个数据状态已变，修改失败！"+leftNum+"个数据修改成功！",
									type: "success",
								});
							}else{
								swal({
									title:"所有数据状态已变，修改失败！",
									type: "error",
								});
							}
							that.passOrRefusedErrorNum=0;
						}else{
							swal({
								title:allNum+"个数据全部修改成功！",
								type: "success",
							});
						}
					})

			}else{
				swal("无选中数据！", "", "error");
			}
			that.passOrRefusedErrorNum=0;
		},
		refuseChecked(){
			if($(":checkbox:checked").length){
				swal({
					title: "您确定要拒绝这批数据吗",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},function(){
					var allNum=0;
					if($(":checkbox[name='allChecked']")[0].checked){
						console.log("走了全选分支");
						// that.isAllChecked=false;

						$.each($(that.allListData),function (index,element) {
							app.refuse(element.mdFileId,element.status,true);

						})
						allNum = Number(that.allListData.length);

					}else{
						$.each($(":checkbox:checked"),function (index,element) {
							// console.log(element.id.substr(10));
							app.refuse(element.id.substr(10),element.id.substr(8,1),true);

						})
						allNum = Number($(":checkbox:checked").length);
					}


					var leftNum = allNum-that.passOrRefusedErrorNum;

					if(that.passOrRefusedErrorNum){
						if(leftNum){
							swal({
								title:"其中有"+that.passOrRefusedErrorNum+"个数据状态已变，修改失败！"+leftNum+"个数据修改成功！",
								type: "success",
							});
						}else{
							swal({
								title:"所有数据状态已变，修改失败！",
								type: "error",
							});
						}
						that.passOrRefusedErrorNum=0;
					}else{
						swal({
							title:allNum+"个数据全部修改成功！",
							type: "success",
						});
					}
				})

			}else{
				swal("无选中数据！", "", "error");
			}
			that.passOrRefusedErrorNum=0;
		},
		backMessage(res,isRefuse){
			if(res.code==200){
				// swal("通过数据成功！", "", "success");
				if(isRefuse){
					that.reqNum--;
					that.refusedNum++;
					that.status_show = "未通过";
					console.log("拒绝的总数："+that.refusedNum)
				}else{
					that.reqNum--;
					that.passNum++;
					that.status_show = "已通过";
				}


				getDataByPost('/user/getSubList',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
				},res=>{
					that.totalNum = res.data.total;
					that.newListNum=0;
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
				getDataByPost('/user/getSubList',{
					pageNum:1,
					pageSize:that.totalNum,
				},res=>{
					that.allListData=res.data.list;
				});
			}else{
				console.log(res.code)
				swal("请求错误，通过数据失败！", "", "error");
			}
		},

	}
})
