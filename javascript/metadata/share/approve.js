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
		listNum:0,
		isAllChecked:false,//判断是否点击过全选按钮，防止先全选然后进行局部取消的操作，这样会使伪全选失效
		passOrRefusedErrorNum:0,//统计批量通过的出错数;,
			namelist: {},  //记录当前类型的配置文件 showDetail
			idlist: {}, //记录当前待显示的元数据内容
		list1:Object.create(null),

	},
	mounted(){

		that = this;
		getDataByPost('/user/getReqList',{
			pageNum:this.pageNum,
			pageSize:this.pageSize,
		},res=>{
			that.totalNum = res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		});
		getDataByPost('/user/getReqList',{
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
			if(that.forStart || isCilcked){
				$("#tbody").empty();
				app.renderNewList(list);
				that.forStart=false;
			}else{
				//非第一次则进行tr子元素的隐藏
				//将所有不是请求页也就是pageNum的tr标签进行隐藏，是的话就进行显示，否则就是tbody中没有，那么就从后台进行获取
				//是否要获取新的子元素
				var forGetNew = true;
				for(var i=0;i<$("#tbody").children("tr").length;i++){

					if($("#tbody").children("tr")[i].id.substr(0,1)===''+that.pageNum){

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
		},
		//
		changePage(nowPage, size){
			//将当前页获取到，来标注页内tr元素的唯一id
			that.pageNum=nowPage;

			getDataByPost('/user/getReqList',{
				pageNum:nowPage,
				pageSize:size,

			},res=>{
				that.totalNum = res.data.total;

				that.renderList(res.data.list);
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
		renderNew(list,list1){
			var name='';
			for (var j=0;j<list1.length;j++){
				name+=list1[j].mdName
				name+=','
			}
			console.log(name)
			that.newListNum++;
			that.listNum=2*that.newListNum
			if (list.status == 2) {
				that.status_show = "审核中";
			} else if (list.status == 4) {
				that.status_show = "未通过";
			} else {
				that.status_show = "已通过";
			}
			var onlyId = '' + that.pageNum + list.orderId;//tr的id
			var checkboxId = 'checkbox' + list.status + list.orderId;

			$("#tbody").append("<tr><td><input type='checkbox' name='single' onclick=app.single()>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + list.orderId +
				"</td><td><a style='cursor: pointer;' onclick=\"app.showdetail('" + list.orderId + "')\">" + app.renderTime(list.createTime) +
				"</a></td><td>" + list.proposer +
				"</td><td>" + list.org +
				"</td><td>" + list.contact +
				"</td><td><el-button type=\"success\" size=\"mini\">" + that.status_show + "</el-button></td>" +
				"<td><input type='button' value='拒绝'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.refuse('" + list.orderId + "','" + list.status + "')\"></td>" +
				"<td><input type='button' value='通过'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.pass('" + list.orderId + "','" + list.status + "')\"></td></tr>"
				+ "<tr>"+"<td></td>"+ "<td>"+name.substr(0,10)+"..."+"</td>"+"</tr>"
				// +"<tr>"+"<td></td>"+"<td>"+list1[1].mdFileId+"</td>" +"<td></td>"+
				// "<td>"+list1[1].mdName+"</td>"+"</tr>"
				// +"<tr>"+"<td></td>"+"<td>"+list1[2].mdFileId+"</td>" +"<td></td>"+
				// "<td>"+list1[2].mdName+"</td>"+"</tr>"
			)
			$(":checkbox[name='single']")[that.newListNum - 1].checked = that.isAllChecked;
			$(":checkbox[name='single']")[that.newListNum - 1].id = checkboxId;
			$("#tbody").children("tr")[that.listNum - 2].id = onlyId;
			$("#tbody").children("tr")[that.listNum - 1].id = onlyId;
			//console.log(($('#tbody').children("tr")))

		},
		 renderNewList(list) {
			for (let i = 0; i < list.length; i++) {
				//console.log(this.list1)
				//添加新的tr元素，统计数量
				// that.newListNum++;
				// if (list[i].status == 2) {
				// 	that.status_show = "审核中";
				// } else if (list[i].status == 4) {
				// 	that.status_show = "未通过";
				// } else {
				// 	that.status_show = "已通过";
				// }
				// var onlyId = '' + that.pageNum + list[i].orderId;//tr的id
				// var checkboxId = 'checkbox' + list[i].status + list[i].orderId;
				//
				// $("#tbody").append("<tr><td><input type='checkbox' name='single' onclick=app.single()>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + list[i].orderId +
				// 	"</td><td><a style='cursor: pointer;' onclick=\"app.showdetail('" + list[i].orderId + "')\">" + app.renderTime(list[i].createTime) +
				// 	"</a></td><td>" + list[i].proposer +
				// 	"</td><td>" + list[i].org +
				// 	"</td><td>" + list[i].contact +
				// 	"</td><td><el-button type=\"success\" size=\"mini\">" + that.status_show + "</el-button></td>" +
				// 	"<td><input type='button' value='拒绝'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.refuse('" + list[i].orderId + "','" + list[i].status + "')\"></td>" +
				// 	"<td><input type='button' value='通过'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.pass('" + list[i].orderId + "','" + list[i].status + "')\"></td></tr>")
					// "<tr><td>" + app.getMdFileIdByOrderId(list[i].orderId, 0) + "</td>" + "<td></td>" + "<td>" + app.getNameByOrderId(list[i].orderId, 0) + "</td></tr>" +
				// 	// "<tr><td>" + app.getMdFileIdByOrderId(list[i].orderId, 1) + "</td>" + "<td></td>" + "<td>" + app.getNameByOrderId(list[i].orderId, 1) + "</td></tr>" +
				// 	// "<tr><td>" + app.getMdFileIdByOrderId(list[i].orderId, 2) + "</td>" + "<td></td>" + "<td>" + app.getNameByOrderId(list[i].orderId, 2) + "</td></tr>"
				// 	// + "<tr>"+"<td></td>"+"<td>"+this.list1[0]+"</td>" +"<td></td>"+
				// 	// "<td>"+this.list1[0]+"</td>"+"</tr>"
				// 	// +"<tr>"+"<td></td>"+"<td>"+list1[1].mdFileId+"</td>" +"<td></td>"+
				// 	// "<td>"+list1[1].mdName+"</td>"+"</tr>"
				// 	// +"<tr>"+"<td></td>"+"<td>"+list1[2]+"</td>" +"<td></td>"+
				// 	// "<td>"+that.namelist[2]+"</td>"+"</tr>"
				// )
				let currentOrderId = list[i].orderId
				//console.log(currentOrderId)
			getDataByPost('/user/getOrderInfo', {
					id: currentOrderId
				}, res => {
					this.renderNew(list[i],res.data)

				})

				// $(":checkbox[name='single']")[that.newListNum - 1].checked = that.isAllChecked;
				// $(":checkbox[name='single']")[that.newListNum - 1].id = checkboxId;
				// $("#tbody").children("tr")[that.newListNum - 1].id = onlyId;


			}

		},
		getStatusNum(){
			getDataByPost('/user/getStatusNum',{
				pageSize:that.totalNum,
			},res=>{
				//console.log(res.data)
				that.reqNum = res.data.twoStatus;
				that.refusedNum=res.data.fourStatus;
				that.passNum=res.data.threeStatus;

			});
		},
		showdetail(orderId){
			console.log(orderId)
			if(orderId){
				$("#column_body").empty();
				$("#Modal").modal('show');
				getDataByPost(
					'/user/getOrderInfo',
					{
						id:orderId
					},
					res => {
						console.log(res.data);
						for (var o in res.data) {
							$("#column_body").append("<tr><td><div class='checker'><span><input type='checkbox' class='checkboxes' value='1' name='isChecked1'/></span></div></td><td>" + res.data[o].orderId + "</td><td>" + res.data[o].mdFileId + "</td><td>" + res.data[o].mdName + "</td></tr>");
						}
					},
					err => {
						toastr.error("查看表失败！");
					}
				)
			}

		},
		allChecked(){
			that.isAllChecked = $(":checkbox[name='allChecked']")[0].checked;//点击时同步状态，克表示取消了全选和全选，不用按钮来实现这个操作的原因时，这个复选框的状态可以表示是否被全选
			for(i=0;i<$(":checkbox[name='single']").length;i++){
				$(":checkbox[name='single']")[i].checked=$(":checkbox[name='allChecked']")[0].checked;
			}
		},
		single(){
			// // var singleStatus = Number($(":checkbox[name='single']").id.substr(8,1));
			// //绑定单击事件，进行check数量统计
			singleCount=0;
			for(i=0;i<$(":checkbox[name='single']").length;i++) {
				if ($(":checkbox[name='single']")[i].checked) singleCount++;
				$(":checkbox[name='allChecked']")[0].checked = (singleCount == $("#tbody").children("tr").length);
			}

		},

		pass(id,status,allPass){
			if(allPass){
				if (status != 2){
					// swal("状态已变，操作失败！", "", "error");
					// alert("状态以便操作失败！")
					that.passOrRefusedErrorNum++;
				}else {
					getDataByPost('/user/passReqMeta', {
						id: id
					}, res => {
						app.backMessage(res);
					});
				}

			}else{
				if (status != 2){
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
						getDataByPost('/user/passReqMeta',{
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
				if (status != 2){
					// swal("状态已变，操作失败！", "", "error");
					// alert("状态以便操作失败！")
					that.passOrRefusedErrorNum++;
				}else {
					getDataByPost('/user/refuseReqMeta', {
						id: id
					}, res => {
						app.backMessage(res,true);
					});
				}

			}else{
				if (status != 2){
					swal("状态已变，操作失败！", "", "error");
				}else {
					swal({
						title: "您确定要拒绝该数据吗",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "拒绝",
						closeOnConfirm: true
					}, confirm => {
						getDataByPost('/user/refuseReqMeta', {
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

							$.each($(that.allListData),function (index,element) {
								app.pass(element.orderId,element.status,true);

							})
							allNum = Number(that.allListData.length);

						}else{
							$.each($(":checkbox:checked"),function (index,element) {
								console.log(element);
								app.pass(element.id.substr(9),element.id.substr(8,1),true);

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
							app.refuse(element.orderId,element.status,true);

						})
						allNum = Number(that.allListData.length);

					}else{
						$.each($(":checkbox:checked"),function (index,element) {
							// console.log(element.id.substr(10));
							app.refuse(element.id.substr(9),element.id.substr(8,1),true);

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

				getDataByPost('/user/getReqList',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
				},res=>{
					that.totalNum = res.data.total;
					that.newListNum=0;
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
				getDataByPost('/user/getReqList',{
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
		renderTime(date) {
			var dates = new Date(date).toJSON();
			return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
		}

	}
})
