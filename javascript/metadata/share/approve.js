// import '../../browse/search/KeySearch'
// import '../../browse/detail/detailPage'

var that;


var app = new Vue({
	el:"#vue",

	data:{
		tableData: [],
		pageSize:5,//分页数目
		pageNum:1,

		reqNum:0,//数量统计
		passNum:0,
		refusedNum:0,
		totalNum:0,

		status_show:"",//状态

	},
	mounted(){

		that = this;
		getDataByPost('/user/getSubList',{
			pageNum:this.pageNum,
			pageSize:this.pageSize,
		},res=>{

			that.totalNum = res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		});
		that.getStatusNum();
	},
	methods:{
		renderList(list){

			$("#tbody").empty();

			for(var i=0;i<list.length;i++){

				if (list[i].status == 0){
					that.status_show = "审核中";
				}else if(list[i].status == 1){
					that.status_show = "未通过";
				}else{
					that.status_show = "已通过";
				}



				$("#tbody").append("<tr><td>"+list[i].mdFileId+
					"</td><td><a style='cursor: pointer;'' onclick=\"keySearch.detail('"+list[i].mdFileId+
					"','"+list[i].loc+"')\">"+list[i].mdName+
					"</a></td><td>"+list[i].createTime+
					"</td><td><el-button type=\"success\" size=\"mini\">"+that.status_show+"</el-button></td>" +
					// "<td><input type='button' value='取消订阅'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td>" +
					"<td><input type='button' value='拒绝'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.refuse('"+list[i].mdFileId+"','"+list[i].status+"')\"></td>" +
					"<td><input type='button' value='通过'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.pass('"+list[i].mdFileId+"','"+list[i].status+"')\"></td></tr>")
			}

			// console.log(reqNum);

		},
		//
		changePage(nowPage, size){
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
				console.log(res.data);
				that.reqNum = res.data.zeroStatus;
				that.passNum=res.data.oneStatus;
				that.refusedNum=res.data.twoStatus;

			});
		},

		pass(id,status){

			if (status != 0){
				swal("状态已变，操作失败！", "", "error");
			}else{
				swal({
					title: "您确定要通过该数据吗",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#dd6b55",
					confirmButtonText: "通过",
					closeOnConfirm: false
				}, confirm=> {
					getDataByPost('/user/passSubMeta',{
						id:id
					},res=>{

						if(res.code==200){
							swal("通过数据成功！", "", "success");
							that.reqNum--;
							that.passNum++;
							that.status_show = "已通过";

							getDataByPost('/user/getSubList',{
								pageNum:this.pageNum,
								pageSize:this.pageSize,
							},res=>{
								that.totalNum = res.data.total;
								that.renderList(res.data.list);
								that.renderPagination();
							});
						}else{
							swal("通过数据失败！", "", "error");
						}
					});
				});
			}


		},

		refuse(id,status){
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

						if (res.code == 200) {
							console.log(res);
							swal("拒绝数据成功！", "", "success");
							that.reqNum--;
							that.refusedNum++;
							that.status_show = "未通过";

							getDataByPost('/user/getSubList',{
								pageNum:this.pageNum,
								pageSize:this.pageSize,
							},res=>{
								that.totalNum = res.data.total;

								that.renderList(res.data.list);
								that.renderPagination();
							});
						} else {
							swal("拒绝数据失败！", "", "error");
						}
					});
				});
			}
		}

	}
})
