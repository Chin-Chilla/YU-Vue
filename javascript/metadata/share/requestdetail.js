var that;
var app = new Vue({
	el:"#vue",
	data:{
		allListDataReq:[],
		pageSize:5,//分页数目
		pageNum:1,
		totalNum:0,
		status_show:"",
		forStart:true,//判断是否是第一次进行当前页的加载，来决定是否清空tbody的子元素
		newListNumReq:0,
		isAllChecked:false,//判断是否点击过全选按钮，防止先全选然后进行局部取消的操作，这样会使伪全选失效
		orderId:"",
		isPass:'3'

	},
	mounted(){
		that = this;
		//第一次请求获取当前页并且展示
		getDataByPost('/user/getReqListByStatus',{
			pageNum:this.pageNum,
			pageSize:this.pageSize,
			status:that.isPass
		},res=>{
			that.totalNum = res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		});
		//第二次请求获取全部的List存储起来
		getDataByPost('/user/getReqListByStatus',{
			pageNum:1,
			pageSize:that.totalNum,
			status:that.isPass
		},res=>{
			that.allListDataReq=res.data.list;
		});
		// that.forStart=true;

	},
	methods:{

		renderList(list,isCilcked){
			if (that.isPass==4){
				document.getElementById("reRequest").style.display=''
			}else
				document.getElementById("reRequest").style.display='none';

			if(that.forStart || isCilcked){
				//第一次加载进行tbody子元素的清空,并且初始化
				$("#tbody").empty();
				app.renderNewList(list,isCilcked);

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
		//翻页
		changePage(nowPage, size){
			that.pageNum=nowPage;
			getDataByPost('/user/getReqListByStatus',{
				pageNum:nowPage,
				pageSize:size,
				status:that.isPass
			},res=>{

				that.totalNum = res.data.total;
				that.renderList(res.data.list);
				//that.renderPagination();
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

			$("#tbody").append("<tr><td><input type='checkbox' name='single' value='"+list.orderId+"' onclick=app.single()>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+list.orderId+ "</td>" +
							"<td><a style='cursor: pointer;' onclick=\"app.showdetail('"+list.orderId+"')\">"+app.renderTime(list.createTime)+ "</a></td>" +
							"<td>"+list.proposer+ "</td>" +
							"<td>"+list.org+ "</td>" +
							"<td>"+list.contact+
							"</td><td><el-button type=\"success\" size=\"mini\">"+that.status_show+"</el-button></td></tr>" +
				+ "<tr>"+"<td></td>"+ "<td>"+name.substr(0,10)+"..."+"</td>"+"</tr>"
			)

		},
		renderNewList(list) {
			$("#text1").text("结果数量:  "+that.totalNum);
			for (let i = 0; i < list.length; i++) {
				
				let currentOrderId = list[i].orderId
				//console.log(currentOrderId)
				getDataByPost('/user/getOrderInfo', {
					id: currentOrderId
				}, res => {
					this.renderNew(list[i],res.data)

				})
				
				
			}
			
		},
		changeIsPass(pass){
			that.isPass=pass
			that.pageNum=1
			that.search()

		},
		search() {
			getDataByPost('/user/getReqListByStatus',{
				pageNum:this.pageNum,
				pageSize:this.pageSize,
				status:that.isPass
			},res=>{
				//console.log(res)
				that.totalNum=res.data.total;
				that.newListNumReq=0;
				that.renderList(res.data.list,true);
				that.renderPagination()
			});

		},
		reRequestChecked(){
			if($(":checkbox:checked").length) {
				swal({
					title: "您确定要重新申请这批数据吗",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: true
				},function(){
				$.each($(":checkbox:checked"),function (index,element){
					console.log(element.value)
					// that.reRequest(element.value)
					app.reRequest(element.value)
				})
			})}
			else
				toastr.warning("请选择数据！")
		},
		showdetail(orderId){
			//console.log(orderId)
			if(orderId){
				$("#column_body").empty();
				$('#exampleModal').modal('show');
				getDataByPost(
					'/user/getOrderInfo',
					{
						id:orderId
					},
					res => {
						//console.log(res.data);
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
			// var singleStatus = Number($(":checkbox[name='single']").id.substr(8,1));
			//
			// //绑定单击事件，进行check数量统计
			// singleCount=0;
			// for(i=0;i<$(":checkbox[name='single']").length;i++){
			// 	if($(":checkbox[name='single']")[i].checked) singleCount++;
			// 	//通过实现加载过的tr与加载过的checkbox的选中状态实现伪全选，视觉上没问题，然后后台改实现逻辑，实际功能也不会有问题
			// 	$(":checkbox[name='allChecked']")[0].checked=(singleCount==$("#tbody").children("tr").length);
			// }

		},
		reRequest(id){
					getDataByPost('/user/reRequest',{
						id:id
					},res=>{
						app.backMessage(res)
					});

		},
		backMessage(res){
			if(res.code==200){
				toastr.success("重新申请成功！")
				that.changePage(1,that.pageSize);
				getDataByPost('/user/getReqListByStatus',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					status:that.isPass
				},res=>{
					that.totalNum = res.data.total;
					that.newListNumReq=0;
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
			}else{
				swal("请求错误，重新申请失败！", "", "error");
			}
		},
		renderTime(date) {
			var dates = new Date(date).toJSON();
			return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
		}

}
})