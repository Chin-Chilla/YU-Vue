var that;
var app = new Vue({
	el:"#vue",
	data:{
		allListDataReq:[],
		isCheckedId:[],
		pageSize:10,//分页数目
		pageNum:1,
		totalNum:0,
		status_show:"",
		req_loc:"",
		isReq:'1',
		FileId:"",
		name:"",
		forStart:true,//判断是否是第一次进行当前页的加载，来决定是否清空tbody的子元素
		newListNumReq:0,
		isAllChecked:false,//判断是否点击过全选按钮，防止先全选然后进行局部取消的操作，这样会使伪全选失效
	},
	mounted(){
		that = this;
		getDataByPost('/user/getSubListByStatus',{
			pageNum:this.pageNum,
			pageSize:this.pageSize,
			status:that.isReq
		},res=>{
			that.totalNum=res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		})

	},
	methods:{
		renderList(list,isCilcked){
			if (that.isReq==1){
				document.getElementById("request").style.display=''
			}else
				document.getElementById("request").style.display='none';
			if(that.forStart || isCilcked){
				//第一次加载进行tbody子元素的清空,并且初始化
				$("#tbody").empty();
				//console.log("走了empty")

				that.renderNewList(list,isCilcked);

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
					that.renderNewList(list);
				}
			}
		},
		//翻页
		changePage(nowPage, size){
			that.pageNum=nowPage;
			getDataByPost('/user/getSubListByStatus',{
				pageNum:nowPage,
				pageSize:size,
				status:that.isReq
			},res=>{
				this.mdid=[];
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
					//that.pageNum=page
					that.changePage(page, size);

				}
			});
		},
		renderNewList(list){
			$("#text1").text("结果数量:  "+that.totalNum);
			for(var i=0;i<list.length;i++){
				//添加新的tr元素，统计数量
				that.newListNumReq++;
				if (list[i].status == 1){
					that.status_show = "未申请";
				}else if(list[i].status == 2){
					that.status_show = "已申请";
				}else if(list[i].status == 3){
					that.status_show = "已通过";
				}else
					that.status_show="未通过";

				//顺序是元数据名称 订阅时间 状态
				$("#tbody").append("" + "<tr>" + "<td>" + "<input type='checkbox' name='single' value='"+list[i].mdFileId+","+list[i].mdName+"' onclick=app.single('"+list[i].mdName+"')>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+list[i].mdName+ "</td>" +
					"<td>" + "<a style='cursor: pointer;'' onclick=\"keySearch.detail('"+list[i].mdName+ "','"+list[i].loc+"')\">"+app.renderTime(list[i].createTime)+ "</a>" + "</td>" +
					"<td><el-button type=\"success\" size=\"mini\">"+that.status_show+"</el-button></td></tr>"
					// "<td><input type='button' value='取消'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td>"+
					// "<td><input type='button' value='申请'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.showModal('"+list[i].status+","+list[i].mdFileId+","+list[i].mdName+"')\"></td></tr>"
				)
			}
		},
		//申请信息模态框
		showModal: function(){
			if($(":checkbox:checked").length){
				$("#ReqModal").modal("show");
				getDataByGet1("/user/getCurrentUserInfo", "", function (res) {
					var id = res.data;
					getDataByGet1("/user/getUserInfo/" + id, "", function (res) {
						$("#proposer").val(res.data.username);
						$("#org").val(res.data.orgname);
						$("#contact").val(res.data.mobileNumber);

					})
				})}
			else
				toastr.warning("请选择数据！")
				//swal("无选中数据！", "", "error");


		},
		request() {
			var proposer = $("#proposer").val();
			var org = $("#org").val();
			var contact = $("#contact").val();
			var description = $("#description").val();
			getDataByPost('/user/request', {
				loc: this.req_loc,
				proposer: proposer,
				org: org,
				contact: contact,
				description: description,
				status: 2,
			}, res => {
				console.log(res)
				if (res.code == 200) {
					toastr.success("申请成功！");
					app.orderChecked(res.data);
				} else {
					toastr.error(res.msg);
				}
			})
		},
		orderChecked(orderId){
			if($(":checkbox:checked").length){
			for(var i=0;i<$(":checkbox:checked").length;i++){
				var Id=$(":checkbox:checked")[i].value.substr(0,32)
				var name=$(":checkbox:checked")[i].value.substr(33)
				this.order(Id,name,orderId)
			}
			}else{
				swal("无选中数据！", "", "error");
			}
		},
		order(id,name,orderId){
			console.log(id);
			console.log(name);
			getDataByPost('/user/order',{
				mdFileId:id,
				mdName:name,
				orderId:orderId
			},res=>{
				if(res.code==200)
					app.changeStatus(id);
			})

		},
		changeStatus(id){
			//console.log(id)
			getDataByPost('/user/passSubMeta', {
				id: id
			}, res => {
				app.backMessage(res);
			});
		},
		renderTime(date) {
			var dates = new Date(date).toJSON();
			return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
		},
		changeIsReq(value){
			console.log(value);
			that.isReq=value
			that.pageNum=1
			that.search()

		},
		search(status) {
			getDataByPost('/user/getSubListByStatus',{
				pageNum:this.pageNum,
				pageSize:this.pageSize,
				status:that.isReq
			},res=>{
				console.log(res)
				that.totalNum=res.data.total;
				that.newListNumReq=0;
				that.renderList(res.data.list,true);
				that.renderPagination()
			});

		},
		allChecked(){
			that.isAllChecked = $(":checkbox[name='allChecked']")[0].checked;//点击时同步状态，克表示取消了全选和全选，不用按钮来实现这个操作的原因时，这个复选框的状态可以表示是否被全选
			for(i=0;i<$(":checkbox[name='single']").length;i++){
				$(":checkbox[name='single']")[i].checked=$(":checkbox[name='allChecked']")[0].checked;
			}
		},
		single(){


		},
		backMessage(res){
			if(res.code==200){
				that.changePage(1,that.pageSize);
				getDataByPost('/user/getSubListByStatus',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					status:that.isReq
				},res=>{
					that.totalNum = res.data.total;
					that.newListNumReq=0;
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
			}else{
				swal("请求错误，申请数据失败！", "", "error");
			}
		},
	}
})