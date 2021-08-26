var that;
var app = new Vue({
	el:"#vue",
	data:{
		pageSize:5,//分页数目
		pageNum:1,
		totalNum:'',
		status_show:""
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

	},
	methods:{

		renderList(list){
			$("#tbody").empty();
			for(var i=0;i<list.length;i++){


				if (list[i].status == 0){
					status_show = "审核中";
				}else if(list[i].status == 1){
					status_show = "未通过";
				}else{
					status_show = "已通过";
				}


				$("#tbody").append("<tr><td>"+list[i].mdFileId+
					"</td><td><a style='cursor: pointer;'' onclick=\"keySearch.detail('"+list[i].mdFileId+
					"','"+list[i].loc+"')\">"+list[i].mdName+
					"</a></td><td>"+list[i].createTime+
					"</td><td><el-button type=\"success\" size=\"mini\">"+status_show+"</el-button></td>" +
					"<td><input type='button' value='取消订阅'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td></tr>")
			}
		},
		//翻页
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
		unsubscribe(id){
			swal({
				title: "您确定要取消订阅吗",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "取消订阅",
				closeOnConfirm: false
			}, confirm=> {
				getDataByPost('/user/unsubscribe',{
					id:id
				},res=>{
					if(res.code==200){
						swal("取消订阅成功！", "", "success");
						that.changePage(1,that.pageSize);
						getDataByPost('/user/getSubList',{
							pageNum:this.pageNum,
							pageSize:this.pageSize,
						},res=>{
							that.totalNum = res.data.total;
							that.renderList(res.data.list);
							that.renderPagination();
						});
					}
				});
			});

		}
	}
})