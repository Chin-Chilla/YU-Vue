//# sourceURL=request.js
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

	},
	mounted(){
		that = this;
		//第一次请求获取当前页并且展示
		getDataByPost('/user/getSubList',{
			pageNum:this.pageNum,
			pageSize:this.pageSize,
		},res=>{
			that.totalNum = res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		});
		//第二次请求获取全部的List存储起来
		getDataByPost('/user/getSubList',{
			pageNum:1,
			pageSize:that.totalNum,
		},res=>{
			that.allListDataReq=res.data.list;
		});
		// that.forStart=true;

	},
	methods:{

		renderList(list,isCilcked){
			console.log("isclicked是："+isCilcked)
			if(that.forStart || isCilcked){
				//第一次加载进行tbody子元素的清空,并且初始化
				$("#tbody").empty();
				console.log("走了empty")

				app.renderNewList(list,isCilcked);

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
		},
		//翻页
		changePage(nowPage, size){
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
			console.log(list);
			for(var i=0;i<list.length;i++){
				//添加新的tr元素，统计数量
				that.newListNumReq++;
				if (list[i].status == 0){
					that.status_show = "审核中";
				}else if(list[i].status == 1){
					that.status_show = "未通过";
				}else{
					that.status_show = "已通过";
				}
				var onlyId = ''+that.pageNum+list[i].mdFileId;//tr的id
				var checkboxId = 'checkbox'+list[i].status+(that.newListNumReq-1)+list[i].mdFileId; //checkbox的id，方便后台获取批量处理的dom
				//顺序是元数据名称 订阅时间 状态 申请人 申请单位 联系方式
				$("#tbody").append("<tr><td><input type='checkbox' name='single' onclick=app.single()>&nbsp&nbsp"+list[i].mdName+
					"</td><td><a style='cursor: pointer;'' onclick=\"keySearch.detail('"+list[i].mdName+
					"','"+list[i].loc+"')\">"+app.renderTime(list[i].createTime)+
					"</a></td><td>"+list[i].proposer+
					"</td><td>"+list[i].org+
					"</td><td>"+list[i].contact+
					"</td><td><el-button type=\"success\" size=\"mini\">"+that.status_show+"</el-button></td>" +
					// "<td><input type='button' value='取消订阅'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td>" +
					"<td><input type='button' value='取消订阅'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td></tr>")

				$(":checkbox[name='single']")[that.newListNumReq-1].checked=that.isAllChecked;
				$(":checkbox[name='single']")[that.newListNumReq-1].id=checkboxId;
				$("#tbody").children("tr")[that.newListNumReq-1].id=onlyId;



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


			//绑定单击事件，进行check数量统计
			singleCount=0;
			for(i=0;i<$(":checkbox[name='single']").length;i++){
				if($(":checkbox[name='single']")[i].checked) singleCount++;
				//通过实现加载过的tr与加载过的checkbox的选中状态实现伪全选，视觉上没问题，然后后台改实现逻辑，实际功能也不会有问题
				$(":checkbox[name='allChecked']")[0].checked=(singleCount==$("#tbody").children("tr").length);
			}

		},
		unsubscribe(id,unsubscribeChecked){
			console.log("unsubscribeChecked"+unsubscribeChecked)
			if(unsubscribeChecked){
				//这个if分支是为了协调点击批量的时候的swal的异步弹窗
				getDataByPost('/user/unsubscribe',{
					id:id
				},res=>{
					app.backMessage(res)
				});
			}else{
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
						app.backMessage(res)
					});
				});
			}


		},
		unsubscribeChecked(){
			if($(":checkbox:checked").length){
				swal({
					title: "您确定要取消订阅这批数据吗",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "确定",
					closeOnConfirm: false
				},function(){
					if($(":checkbox[name='allChecked']")[0].checked){
						console.log("走了全选分支");
						// that.isAllChecked=false;
						for(var i=0;i<that.allListDataReq.length;i++){
							var id = that.allListDataReq[i].mdFileId;
							console.log(id)
							app.unsubscribe(id,true);
						}
					}else{
						$.each($(":checkbox:checked"),function (index,element) {
							console.log("这是第："+index+"选中对象"+"其状态是"+element.id.substr(8,1));
							app.unsubscribe(element.id.substr(10),element.id.substr(8,1),true);
						})
					}
					swal("选中数据取消订阅成功！",'',"success");

				})

			}else{
				swal("无选中数据！", "", "error");
			}

		},
		backMessage(res){
			if(res.code==200){
				// swal("取消订阅成功！", "", "success");
				that.changePage(1,that.pageSize);
				getDataByPost('/user/getSubList',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
				},res=>{
					that.totalNum = res.data.total;
					that.newListNumReq=0;
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
			}else{
				swal("请求错误，通过数据失败！", "", "error");
			}
		},
		renderTime(date) {
			var dates = new Date(date).toJSON();
			return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
		}

}
})