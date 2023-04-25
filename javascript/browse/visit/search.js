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
		pageSize:10,//分页数目
		pageNum:1,
		totalNum:0,
		name:"",
		forStart:true,//判断是否是第一次进行当前页的加载，来决定是否清空tbody的子元素
		myChartrightDown: '',
		searchChart: {
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
				data:[],
				axisLabel: {
					inside: false,
				},
				axisTick: {
					show: false
				},
			},
			yAxis: {
				// type: 'log',
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				// logBase: 10,
				// min: 1,
				// axisLabel: {
				// }
			},
			series: [{
				name: '基础对象数据',
				type: 'bar',
				data: [],
				barWidth: 40,
			}]
		},
		searchChart2: {
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
		searchChart3:{
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
		arrayDepObjTotal:[]
	},
	mounted(){
		that = this;
		$("#loading").css('display', 'block');
		getDataByPost('/key_search/get_search_by_page',{
			userName: that.userName,
			pageSize:that.pageSize,
			pageNum:that.pageNum,
			keyword:that.keyword,
			startTime:$("#beginTime").val(),
			endTime:$("#endTime").val()
		},res=>{
			$("#loading").css('display', 'none');
			//console.log(res.data)
			that.totalNum=res.data.total;
			that.renderList(res.data.list);
			that.renderPagination();
		})
		//that.myChartrightDown = echarts.init(document.getElementById('right_down'));
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
			getDataByPost('/key_search/get_search_by_page',{
				userName: that.userName,
				pageSize:that.pageSize,
				pageNum:that.pageNum,
				keyword:that.keyword,
				startTime:$("#beginTime").val(),
				endTime:$("#endTime").val()
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
					"<td>"+list[i].keyWord+"</td>+" +
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
			that.userName=''
			that.keyword =''
			that.pageNum=1
		},
		search() {
			that.pageNum=1
			$("#loading").css('display', 'block');
			getDataByPost('/key_search/get_search_by_page',{
				userName: that.userName,
				pageSize:that.pageSize,
				pageNum:that.pageNum,
				keyword:that.keyword,
				startTime:$("#beginTime").val(),
				endTime:$("#endTime").val()
			},res=>{
				$("#loading").css('display', 'none');
				//console.log(res)
				that.totalNum=res.data.total;
				that.renderList(res.data.list,true);
				that.renderPagination()
			});

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
					that.renderList(res.data.list,true);
					that.renderPagination();
				});
			}else{
				swal("请求错误，申请数据失败！", "", "error");
			}
		},
		searchPictureShow1() {
			getDataByPost('/show_detail/getChartByType',{
				flag:1,
			},res=>{
				that.findNew(res.data,1)
			})
		},
		searchPictureShow2() {
			getDataByPost('/show_detail/getChartByType',{
				flag:2,
			},res=>{
				that.findNew(res.data,2)
			})
		},
		searchPictureShow3() {
			getDataByPost('/show_detail/getChartByType',{
				flag:3,
			},res=>{
				that.findNew(res.data,3)
			})
		},
		showChart(list){
			//that.searchChart.title.text = list.chartName;

			//只要有统计项，则设置相关控件为可视
			$("#right_down").removeClass("hidden");
			$("#right_downall").addClass("hidden");
			$("#no_objdata").addClass("hidden");
			var arr=new Array()
			x_Data=list.xData.split(',')
			for(var i=0;i<x_Data.length;i++){
				arr.push(x_Data[i].substr(1,x_Data[i].length-2))
			}
				that.searchChart.series[0].data=list.yData.split(',');
				that.searchChart.xAxis.data=arr;
			that.myChartrightDown.clear();
			that.myChartrightDown.setOption(that.searchChart);
			that.myChartrightDown.hideLoading();

		},
		showObjLev2(){
			$("#obj-sel-lev2").empty();
			var level1 = $("#obj-sel-lev1").val();
			if (level1 == "RL"){
				$("#obj-sel-lev2").append("<option value='RL*'>全选</option>");
				$("#obj-sel-lev2").append("<option value='RL001'>流域</option>");
				$("#obj-sel-lev2").append("<option value='RL002'>河流</option>");
				$("#obj-sel-lev2").append("<option value='RL003'>湖泊</option>");
				$("#obj-sel-lev2").append("<option value='RL999'>其他</option>");
			}else if (level1 == "HP") {
				$("#obj-sel-lev2").append("<option value='HP*'>全选</option>");
				$("#obj-sel-lev2").append("<option value='HP001'>水库</option>");
				$("#obj-sel-lev2").append("<option value='HP002'>水库大坝</option>");
				$("#obj-sel-lev2").append("<option value='HP003'>水电站</option>");
				$("#obj-sel-lev2").append("<option value='HP004'>灌区</option>");
				$("#obj-sel-lev2").append("<option value='HP005'>渠（沟）道</option>");
				$("#obj-sel-lev2").append("<option value='HP006'>取水井</option>");
				$("#obj-sel-lev2").append("<option value='HP007'>水闸</option>");
				$("#obj-sel-lev2").append("<option value='HP008'>渡槽</option>");
				$("#obj-sel-lev2").append("<option value='HP009'>倒虹吸</option>");
				$("#obj-sel-lev2").append("<option value='HP010'>泵站</option>");
				$("#obj-sel-lev2").append("<option value='HP011'>涵洞</option>");
				$("#obj-sel-lev2").append("<option value='HP012'>引调水工程</option>");
				$("#obj-sel-lev2").append("<option value='HP013'>农村供水工程</option>");
				$("#obj-sel-lev2").append("<option value='HP014'>窖池</option>");
				$("#obj-sel-lev2").append("<option value='HP015'>塘坝</option>");
				$("#obj-sel-lev2").append("<option value='HP016'>蓄滞洪区</option>");
				$("#obj-sel-lev2").append("<option value='HP017'>堤防</option>");
				$("#obj-sel-lev2").append("<option value='HP018'>圩垸</option>");
				$("#obj-sel-lev2").append("<option value='HP019'>治河工程</option>");
				$("#obj-sel-lev2").append("<option value='HP020'>淤地坝</option>");
				$("#obj-sel-lev2").append("<option value='HP021'>橡胶坝</option>");
				$("#obj-sel-lev2").append("<option value='HP999'>其他</option>");
			}else if(level1 == "MS"){
				$("#obj-sel-lev2").append("<option value='MS*'>全选</option>");
				$("#obj-sel-lev2").append("<option value='MS001'>水文监测站</option>");
				$("#obj-sel-lev2").append("<option value='MS002'>水土保持监测站</option>");
				$("#obj-sel-lev2").append("<option value='MS003'>水工程安全监测站</option>");
				$("#obj-sel-lev2").append("<option value='MS004'>供（取）水量监测点</option>");
				$("#obj-sel-lev2").append("<option value='MS005'>水事影像监视点</option>");
				$("#obj-sel-lev2").append("<option value='MS999'>其他</option>");
			}
		},
		showChart1(list){
			// if(list.xName=="对象类型")
			// {
				var arr=new Array()
				that.arrayDepObjTotal = []
				y_Data = list.yData.replaceAll('},', '}+')
				y_Data = y_Data.split('+')
				x_Data=list.xData.split(',')
				for (var i = 0; i < y_Data.length; i++) {
					y_Data[i] = y_Data[i].substr(1, y_Data[i].length).split(',')
					that.arrayDepObjTotal.push({
						name: y_Data[i][0].split(':')[1].replaceAll('\"', ''),
						value: y_Data[i][1].split(':')[1].replace('}', '')
					})
					arr.push(x_Data[i].substr(1,x_Data[i].length-2))
				}
				console.log(arr)
				that.myChartrightDown.clear();
				that.searchChart2.title.text = list.chartName;
				that.searchChart2.series.data = that.arrayDepObjTotal;
				that.searchChart2.legend.data = arr;
				that.myChartrightDown.setOption(that.searchChart2);
				that.myChartrightDown.hideLoading();
			// }else{
			// 	var arr=new Array()
			// 	that.arrayDepObjTotal = []
			// 	y_Data = list.yData.replaceAll('},', '}+')
			// 	y_Data = y_Data.split('+')
			// 	x_Data=list.xData.split(',')
			// 	for (var i = 0; i < y_Data.length; i++) {
			// 		y_Data[i] = y_Data[i].substr(1, y_Data[i].length).split(',')
			// 		that.arrayDepObjTotal.push({
			// 			name: y_Data[i][0].split(':')[1].replaceAll('\"', ''),
			// 			value: y_Data[i][1].split(':')[1].replace('}', '')
			// 		})
			// 		arr.push(x_Data[i].substr(1,10))
			//
			// 	}
			// 	that.myChartrightDown.clear();
			// 	that.searchChart2.title.text = list.chartName;
			// 	that.searchChart2.series.data = that.arrayDepObjTotal;
			// 	that.searchChart2.legend.data = arr;
			// 	// console.log(that.arrayDepObjTotal)
			// 	// console.log(arr)
			// 	that.myChartrightDown.setOption(that.searchChart2);
			// 	that.myChartrightDown.hideLoading();
			//
			// }

		},
		showChart2(list){
				that.myChartrightDown.clear();
				var arr=list.xData.split(',');
				for (var i=0;i<arr.length;i++){
					arr[i]=arr[i].substr(1,arr[i].length-2)
				}
				$("#right_down").removeClass("hidden");
				$("#right_downall").addClass("hidden");
				$("#no_objdata").addClass("hidden");
				that.searchChart3.series[0].data=list.yData.split(',');
				that.searchChart3.xAxis.data=arr;
				that.myChartrightDown.setOption(that.searchChart3);
				that.myChartrightDown.hideLoading();


		},
		findNew(list,flag){
			var arr=new Array()
			// console.log(list)
			for(var i=0;i<list.length;i++){
				arr.push({
					name:list[i].chartId
				})
			}

			quickSort(arr,0,arr.length-1)

			getDataByPost('/show_detail/getChartBar',{
				id:arr[0].name,
			},res=>{
				// console.log(res.data)
				if(flag==1)
				that.showChart(res.data)
				else if (flag==2)
					that.showChart1(res.data)
				else if (flag==3)
					that.showChart2(res.data)
			})
		}
	}
})