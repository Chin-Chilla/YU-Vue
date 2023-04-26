var that;
function quickSort(nums,l,h){
	if(l<h){
		var i=l, j=h, x=nums[l];
		while(i<j){
			while( i<j && nums[j].name<=x.name ){
				j--;
			}
			if (i<j){
				nums[i++] = nums[j];
			}
			while( i<j && nums[i].name>x.name){
				i++;
			}
			if (i<j){
				nums[j--] = nums[i];
			}
		}
		nums[i] = x;
		quickSort(nums,l,i-1);
		quickSort(nums,i+1,h);
	}
}
var app = new Vue({
	el:"#vue",
	data:{
		userName:'',
		keyword:'',
		className:'',
		pClassName:'',
		pageSize:10,//分页数目
		pageNum:1,
		totalNum:0,
		name:"",
		myChartrightDown: '',
		save:0,
		viewChart: {
			title: {
				text: '资源目录分布图',
				x: 'center',
				bottom: '0%',
				textStyle: {
					fontSize: 14
				}
			},
			color: ['rgb(25, 183, 207)'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				}
			},
			legend: {
				name: '基础对象数据',
				orient: 'vertical',
				left: 'left',
				data: ['基础对象数据']
			},
			grid: {
				x: 80,
				y: 80,
				bottom: 80
			},
			xAxis: {
				data: ["江河湖泊", "水利工程", "监测站(点)", "其他管理对象"],
				axisLabel: {
					inside: false,
				},
				axisTick: {
					show: false
				},
			},
			yAxis: {
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},

			},
			series: [{
				name: '基础对象数据',
				type: 'bar',
				data: [],
				barWidth: 40,
			}]
		},
		viewChart2: {
			title: {
				text: '水利信息目录资源对象分布图',
				x: 'center',
				bottom: '0%',
				textStyle: {
					fontSize: 14
				}
			},
			color: ['#668B8B', '#19B7CF', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: []
			},
			calculable: true,
			series: {
				//minAngle: 5,
				name: '对象数据分布',
				type: 'pie',
				radius: ['35%', '70%'],
				label: {
					normal: {
						show: false
					},
					emphasis: {
						show: true
					}
				},
				lableLine: {
					normal: {
						show: false
					},
					emphasis: {
						show: true
					}
				},
				data: []
			}
		},
		viewChart3:{
			title: {
				text: '资源目录分布图',
				x: 'center',
				bottom: '0%',
				textStyle: {
					fontSize: 14
				}
			},
			xAxis:{
				type:'category',
				data:[],
				axisLabel: {
					inside: false,
				},
				axisTick: {
					show: false
				},
			},
			yAxis:{
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				type:'value'
			},
			series:[
				{
					type:'line',
					data:[],
					itemStyle : { normal: {label : {show: true}}}
				}
			]

		},
		arrayObjTotal:{
		},
		arrayDepObjTotal:[],
		forStart:true,//判断是否是第一次进行当前页的加载，来决定是否清空tbody的子元素
	},
	mounted(){
		that = this;
		getDataByPost('/show_detail/get_view_by_page',{
			userName: that.userName,
			pageSize:that.pageSize,
			pageNum:that.pageNum,
			keyword:that.keyword,
			className:that.className,
			pClassName:that.pClassName,
			startTime:$("#beginTime").val(),
			endTime:$("#endTime").val()
		},res=>{
			//console.log(res.data)
			that.totalNum=res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		})
		that.myChartrightDown = echarts.init(document.getElementById('right_down'));
		$(function() {
			$('.datepicker').datepicker({
				autoclose: true,
				todayHighlight: true,
				language: "zh-CN"
			});
		})

	},
	methods:{
		renderList(list,isCilcked){
			if(that.forStart || isCilcked){
				//第一次加载进行tbody子元素的清空,并且初始化
				$("#tbody").empty();

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
			getDataByPost('/show_detail/get_view_by_page',{
				userName: that.userName,
				pageSize:that.pageSize,
				pageNum:that.pageNum,
				keyword:that.keyword,
				className:that.className,
				pClassName:that.pClassName,
				startTime:$("#beginTime").val(),
				endTime:$("#endTime").val()
			},res=>{
				this.mdid=[];
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
					//that.pageNum=page
					that.changePage(page, size);

				}
			});
		},
		renderNewList(list){
			$("#text1").text("结果数量:  "+that.totalNum);
			for(var i=0;i<list.length;i++){
				$("#tbody").append("" + "<tr>" + "<td>" + list[i].userId+ "</td>" +
					"<td>" +app.renderTime(list[i].createTime).substr(0,10)+ "</a>" + "</td>" +
					"<td>"+list[i].mdFileId+"</td>+" +
					"<td>"+list[i].mdName+"</td>+" +
					"<td>"+list[i].className+"</td>+" +
					"<td>"+list[i].pClassName+"</td>+" +
					"<td>"+list[i].userName+"</td>+" +
					"<td>"+list[i].contact+"</td>+" +
					"<td>"+list[i].org+"</td></tr>"
				)
			}

		},

		renderTime(date) {
			var dates = new Date(date).toJSON();
			return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
		},
		reset(){
			$("#beginTime").val('')
			$("#endTime").val('')
			$("#userName").val('')
			$("#keyWord").val('')
			$("#className").val('')
			$("#pClassName").val('')
			that.className=''
			that.pClassName=''
			that.userName=''
			that.keyword =''
			that.pageNum=1
		},
		search() {
			getDataByPost('/show_detail/get_view_by_page',{
				userName: that.userName,
				pageSize:that.pageSize,
				pageNum:that.pageNum,
				keyword:that.keyword,
				className:$("#className").val(),
				pClassName:$("#pClassName").val(),
				startTime:$("#beginTime").val(),
				endTime:$("#endTime").val()
			},res=>{
				//console.log(res)
				that.totalNum=res.data.total;
				that.newListNumReq=0;
				that.renderList(res.data.list,true);
				that.renderPagination()
			});

		},
		backMessage(res){
			if(res.code==200){
				that.changePage(1,that.pageSize);
				getDataByPost('/show_detail/get_view_by_page',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
				},res=>{
					that.totalNum = res.data.total;
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
			}else{
				swal("请求错误，申请数据失败！", "", "error");
			}
		},
		getNum(){
			var flag=$("#chartType").val();
			getDataByPost('/show_detail/getViewList',{
					pageSize:that.totalNum,
					pageNum:1,
				},res=> {
					if(flag==1)
						this.viewPictureShow1(res.data.list)
					else if(flag==2)
						this.viewPictureShow2(res.data.list)
					else if(flag==3)
						this.viewPictureShow3(res.data.list)
				}
			)
		},
		viewPictureShow1(list) {
			that.save=1
			that.myChartrightDown.clear();
			if($("#xData").val()=="时间"){
				that.arrayDepObjTotal = [];
				var Xdata=[];
				var data=new Array();
				for(var i=0;i<list.length;i++){
					time=list[i].createTime.substr(0,10)
					time=that.DateC(time).substr(0,10)
					if (data.length==0){
						data.push({
							name:time,
							value:1,
						})}
					else{
						var find=0
						for (var j=0;j<data.length;j++){
							if(time==data[j].name){
								find=1
								data[j].value++;
								break;
							}
						}
						if(find==0){
							data.push({
								name:time,
								value:1
							})
						}
					}
				}
				quickSort(data,0,data.length-1)
				data=that.CDate(data)
				for(var i=data.length-1;i>=0;i--){
					that.arrayDepObjTotal.push(data[i].value)
					Xdata.push(data[i].name)
				}
				$("#right_down").removeClass("hidden");
				$("#right_downall").addClass("hidden");
				$("#no_objdata").addClass("hidden");
				that.viewChart.series[0].data = that.arrayDepObjTotal;
				that.viewChart.xAxis.data=Xdata
				that.myChartrightDown.clear();
				that.myChartrightDown.setOption(that.viewChart);
				that.myChartrightDown.hideLoading();

			}
			else{
				that.arrayDepObjTotal = [];
				var sum1 = sum2 = sum3 = sum4 = 0;
				for (var i = 0; i < list.length; i++) {
					switch (list[i].pClassName) {
						case "江河湖泊":
							sum1++;
							break;
						case "水利工程":
							sum2++;
							break;
						case "监测站（点）":
							sum3++;
							break;
						default:
							sum4++;
							break;
					}
				}
				that.arrayDepObjTotal.push(sum1);
				that.arrayDepObjTotal.push(sum2);
				that.arrayDepObjTotal.push(sum3);
				that.arrayDepObjTotal.push(sum4);
				that.viewChart.title.text = '用户浏览统计图';
				$("#right_down").removeClass("hidden");
				$("#right_downall").addClass("hidden");
				$("#no_objdata").addClass("hidden");
				that.viewChart.series[0].data = that.arrayDepObjTotal;
				that.viewChart.xAxis.data=["江河湖泊", "水利工程", "监测站(点)", "其他管理对象"]
				that.myChartrightDown.clear();
				that.myChartrightDown.setOption(that.viewChart);
				that.myChartrightDown.hideLoading();
			}

		},
		saveChartBar(){
			if(that.save){
				if (that.save==1){
					// console.log("柱状图")
					getDataByPost('/show_detail/addChartBar',{
						chartName:'用户浏览统计图',
						xData:that.viewChart.xAxis.data,
						xName:$("#xData").val(),
						yData:that.arrayDepObjTotal,
						yName:"数量",
						flag:that.save
					},res=>
					{
						if (res.code==200)toastr.success("更新成功！")
						else toastr.error("更新失败！")
					})
				}else if(that.save==2){
					// console.log("饼图")
					getDataByPost('/show_detail/addChartBar',{
						chartName:'用户浏览统计图',
						xData:that.viewChart2.legend.data,
						xName:$("#xData").val(),
						yData:that.viewChart2.series.data,
						yName:"数量",
						flag:that.save
					},res=>
					{
						if (res.code==200)toastr.success("更新成功！")
						else toastr.error("更新失败！")
					})
				}else{
					// console.log("折线图")
					getDataByPost('/show_detail/addChartBar',{
						chartName:"用户浏览统计图",
						xData: that.viewChart3.xAxis.data,
						xName:$("#xData").val(),
						yData:that.arrayDepObjTotal,
						yName:"数量",
						flag:that.save
					},res=>
					{
						if (res.code==200)toastr.success("更新成功！")
						else toastr.error("更新失败！")
					})

				}
			}else
				toastr.warning("无选中图！")
		},
		viewPictureShow2(list) {
			that.save=2
			that.myChartrightDown.clear();
			if($("#xData").val()=="时间"){
				that.arrayObjTotal = [];
				var Xdata=[];
				var data=new Array();
				for(var i=0;i<list.length;i++){
					time=list[i].createTime.substr(0,10)
					time=that.DateC(time).substr(0,10)
					if (data.length==0){
						data.push({
							name:time,
							value:1,
						})}
					else{
						var find=0
						for (var j=0;j<data.length;j++){
							if(time==data[j].name){
								find=1
								data[j].value++;
								break;
							}
						}
						if(find==0){
							data.push({
								name:time,
								value:1
							})
						}
					}
				}
				quickSort(data,0,data.length-1)
				data=that.CDate(data)
				var length = data.length<5?data.length:5;

				for(var i=0;i<length;i++){
					Xdata.push(data[i].name)
					that.arrayObjTotal.push(data[i])
				}
				$("#right_down").removeClass("hidden");
				$("#right_downall").addClass("hidden");
				$("#no_objdata").addClass("hidden");
				that.viewChart2.series.data = that.arrayObjTotal;
				that.viewChart2.legend.data = Xdata;
				that.myChartrightDown.setOption(that.viewChart2);
				that.myChartrightDown.hideLoading();

			}else{
				that.arrayObjTotal=[]
				that.viewChart2.title.text = '用户浏览统计图';
				var sum1 = sum2 = sum3 = sum4 = 0;
				for (var i = 0; i < list.length; i++) {
					switch (list[i].pClassName) {
						case "江河湖泊":
							sum1++;
							break;
						case "水利工程":
							sum2++;
							break;
						case "监测站（点）":
							sum3++;
							break;
						default:
							sum4++;
							break;
					}
				}
				that.arrayObjTotal.push({
					name: "江河湖泊",
					value: sum1,
				});
				that.arrayObjTotal.push({
					name:"水利工程",
					value: sum2,
				});
				that.arrayObjTotal.push({
					name:"监测站（点）",
					value:sum3,
				});
				that.arrayObjTotal.push({
					name:"其他管理对象",
					value:sum4
				});
				that.viewChart2.series.data = that.arrayObjTotal;
				that.viewChart2.legend.data = ["江河湖泊","水利工程","监测站（点）","其他管理对象"];
				that.myChartrightDown.setOption(that.viewChart2);
				that.myChartrightDown.hideLoading();

			}

		},
		viewPictureShow3(list) {
			that.save=3
			that.myChartrightDown.clear();
			if($("#xData").val()=="时间"){
				that.arrayDepObjTotal=[]
				var Xdata=[];
				var data=new Array();
				for(var i=0;i<list.length;i++){
					time=list[i].createTime.substr(0,10)
					time=that.DateC(time).substr(0,10)
					if (data.length==0){
						data.push({
							name:time,
							value:1,
						})}
					else{
						var find=0
						for (var j=0;j<data.length;j++){
							if(time==data[j].name){
								find=1
								data[j].value++;
								break;
							}
						}
						if(find==0){
							data.push({
								name:time,
								value:1
							})
						}
					}
				}
				quickSort(data,0,data.length-1)
				data=that.CDate(data,1)

				//console.log(data)
				for(var i=data.length-1;i>=0;i--){
					that.arrayDepObjTotal.push(data[i].value)
					Xdata.push(data[i].name)
				}
				that.viewChart3.title.text="用户浏览统计图"
				that.viewChart3.series[0].data=that.arrayDepObjTotal;
				that.viewChart3.xAxis.data =Xdata;
				that.myChartrightDown.setOption(that.viewChart3);
				that.myChartrightDown.hideLoading();
			}
			else{
				that.arrayDepObjTotal=[]
				var sum1 = sum2 = sum3 = sum4 = 0;
				for (var i = 0; i < list.length; i++) {
					switch (list[i].pClassName) {
						case "江河湖泊":
							sum1++;
							break;
						case "水利工程":
							sum2++;
							break;
						case "监测站（点）":
							sum3++;
							break;
						default:
							sum4++;
							break;
					}
				}
				that.arrayDepObjTotal.push(sum1);
				that.arrayDepObjTotal.push(sum2);
				that.arrayDepObjTotal.push(sum3);
				that.arrayDepObjTotal.push(sum4);
				that.viewChart3.title.text="用户浏览统计图"
				that.viewChart3.series[0].data=that.arrayDepObjTotal;
				that.viewChart3.xAxis.data = ["江河湖泊","水利工程","监测站（点）","其他管理对象"];
				that.myChartrightDown.setOption(that.viewChart3);
				that.myChartrightDown.hideLoading();
			}

		},
		showObjLev2(){
			$("#className").empty();
			var level1 = $("#pClassName").val();
			if (level1 == "江河湖泊"){
				$("#className").append("<option value=''>全选</option>");
				$("#className").append("<option value='流域'>流域</option>");
				$("#className").append("<option value='河流'>河流</option>");
				$("#className").append("<option value='湖泊'>湖泊</option>");
				$("#className").append("<option value='其他'>其他</option>");
			}else if (level1 == "水利工程") {
				$("#className").append("<option value=''>全选</option>");
				$("#className").append("<option value='水库'>水库</option>");
				$("#className").append("<option value='水库大坝'>水库大坝</option>");
				$("#className").append("<option value='水电站'>水电站</option>");
				$("#className").append("<option value='灌区'>灌区</option>");
				$("#className").append("<option value='渠（沟）道'>渠（沟）道</option>");
				$("#className").append("<option value='取水井'>取水井</option>");
				$("#className").append("<option value='水闸'>水闸</option>");
				$("#className").append("<option value='渡槽'>渡槽</option>");
				$("#className").append("<option value='倒虹吸'>倒虹吸</option>");
				$("#className").append("<option value='泵站'>泵站</option>");
				$("#className").append("<option value='涵洞'>涵洞</option>");
				$("#className").append("<option value='引调水工程'>引调水工程</option>");
				$("#className").append("<option value='农村供水工程'>农村供水工程</option>");
				$("#className").append("<option value='窖池'>窖池</option>");
				$("#className").append("<option value='塘坝'>塘坝</option>");
				$("#className").append("<option value='蓄滞洪区'>蓄滞洪区</option>");
				$("#className").append("<option value='堤防'>堤防</option>");
				$("#className").append("<option value='圩垸'>圩垸</option>");
				$("#className").append("<option value='治河工程'>治河工程</option>");
				$("#className").append("<option value='淤地坝'>淤地坝</option>");
				$("#className").append("<option value='橡胶坝'>橡胶坝</option>");
				$("#className").append("<option value='其他'>其他</option>");
			}else if(level1 == "检测站点"){
				$("#className").append("<option value=''>全选</option>");
				$("#className").append("<option value='水文监测站'>水文监测站</option>");
				$("#className").append("<option value='水土保持监测站'>水土保持监测站</option>");
				$("#className").append("<option value='水工程安全监测站'>水工程安全监测站</option>");
				$("#className").append("<option value='供（取）水量监测点'>供（取）水量监测点</option>");
				$("#className").append("<option value='水事影像监视点'>水事影像监视点</option>");
				$("#className").append("<option value='其他'>其他</option>");
			}
		},
		showY(){
			$("#yData").empty();
			var level1 = $("#xData").val();
			if (level1 == "时间"){
				$("#yData").append("<option value='0'></option>");
				$("#yData").append("<option value='用户访问量'>用户访问量</option>");
			}else if(level1 == "对象类型") {
				$("#yData").append("<option value='0'></option>");
				$("#yData").append("<option value='用户访问量'>用户访问量</option>");
			}
		},
		showMethod(){
			$("#chartType").empty();
			var level2=$("#yData").val();
			if (level2){
				$("#chartType").append("<option value='0'>全选</option>");
				$("#chartType").append("<option value='1'>柱状图</option>");
				$("#chartType").append("<option value='2'>饼状图</option>");
				$("#chartType").append("<option value='3'>折线图</option>");
			}

		},
		//判断日期是否连续
		CDate(data){
			do{
				uncontinue=0;
				for (var i=data.length-1;i>0;i--){
					var day=that.DateC(data[i].name).substr(0,10)
					if (day==data[i-1].name)continue;
					else{
						uncontinue=1
						data.push({
								name:day,
								value:0
							}
						)
					}
				}
				quickSort(data,0,data.length-1)
			}while (uncontinue==1)
			return data
		},
		DateC(date){
			var day=new Date(date);
			day=day.setDate(day.getDate()+1)
			day=new Date(+new Date(day) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
			return day;

		}
	}
})