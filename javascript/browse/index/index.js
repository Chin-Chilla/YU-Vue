
var that;
//快速排序
function quickSort(nums,l,h){
    if(l<h){
        var i=l, j=h, x=nums[l];
        while(i<j){
            while( i<j && nums[j].value<=x.value ){
                j--;
            }
            if (i<j){
                nums[i++] = nums[j];
            }
            while( i<j && nums[i].value>x.value){
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
var index = new Vue({
    el: "#vue", //绑定之前html写的ID
    data: { //相当于成员变量
        updateData:[],
        totalData:[],
        resZtree: '',
        objZtree: '',
        leftoption: {
            title: {
                text: '水利信息目录资源分布图',
                x: 'center',
                bottom: '0%',
                textStyle: {
                    fontSize: 14
                }

            },
            color: ['#19B7CF', '#668B8B', '#54FF9F', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            legend: {
                orient: 'vertical',
                left: 'left',
                data: []
            },
            grid: {
                top: '4%',
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [{
                name: '元数据分布',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: [],
                hoverAnimation: true,
                minAngle: 5,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
            }]
        },
        midoption: {
            title: {
                text: '水利信息目录资源雷达分布图',
                x: 'center',
                bottom: '0%',
                textStyle: {
                    fontSize: 14
                }
            },
            color: ['rgb(25, 183, 207)'],
            tooltip: {},
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['水利信息数据']
            },
            radar: {
                indicator: [
                    { name: '业务', max: 30000 },
                    { name: '行政', max: 30000 },
                    { name: '综合', max: 30000 },
                    { name: '其他', max: 30000 }
                ],
                nameGap: 10,
                radius: '70%'
            },
            series: [{
                name: '',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [{
                    value: [30000, 30000, 30000, 30000],
                    name: '水利信息数据'
                }]
            }]
        },
        rightoption: {
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
        AllDataoption: {
            color: ['rgb(25, 183, 207)', '#e5323e'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['资源目录数据', '基础对象数据']
            },
            grid: {
                x: 100,
                y: 100,
                bottom: 100
            },
            xAxis: {
                type: 'category',
                data: ['水利部', '长江委', '西藏自治区水利厅'
                    // , '淮委', '海委', '珠江委', '松辽委', '太湖局',
                    // '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽',
                    // '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
                    // '云南', '黄河水利委员会', '陕西', '甘肃', '青海', '宁夏', '新疆自治', '新疆兵团'
                ],
                axisLabel: {
                    interval: 0,
                    formatter: function(value) {
                        return value;
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'log',
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                logBase: 10,
                min: 1,
                axisLabel: {
                    formatter: function(value) {
                        texts = [];
                        if (value == 1) {
                            texts.push("10⁰")
                        }
                        if (value == 10) {
                            texts.push("10¹")
                        }
                        if (value == 100) {
                            texts.push("10²")
                        }
                        if (value == 1000) {
                            texts.push("10³")
                        }
                        if (value == 10000) {
                            texts.push("10⁴")
                        }
                        if (value == 100000) {
                            texts.push("10⁵")
                        }
                        if (value == 1000000) {
                            texts.push("10⁶")
                        }
                        if (value == 10000000) {
                            texts.push("10⁷")
                        }
                        if (value == 100000000) {
                            texts.push("10⁸")
                        }
                        return texts;
                    }
                }

            },
            series: [{
                name: '资源目录数据',
                type: 'bar',
                data: []
            }, {
                name: '基础对象数据',
                type: 'bar',
                data: []
            }]
        },
        rightBaroption: {
            color: ['rgb(25, 183, 207)', '#e5323e'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['资源目录数据', '基础对象数据']
            },
            grid: {
                x: 100,
                y: 100,
                bottom: 200
            },
            xAxis: {
                type: 'category',
                data: ['水利部', '综合事业局', '信息中心', '南水北调规划设计管理局', '机关服务局', '水利水电规划设计总院', '中国水利水电科学研究院', '宣传教育中心',
                    '中国水利报社', '中国水利水电出版社', '发展研究中心', '中国灌溉排水发展中心', '建设管理与质量安全中心', '预算执行中心', '水资源管理中心', '节约用水促进中心',
                    '河湖保护中心', '南水北调工程设计管理中心', '南水北调中线干线工程建设管理局', '南水北调东线总公司', '中国水利学会', '南京水利科学研究院', '国际小水电中心', '小浪底水利枢纽管理中心',
                    '三门峡温泉疗养院', '中国水利博物馆', '移民管理咨询中心', '中国水利水电出版传媒集团有限公司'
                ],
                axisLabel: {
                    interval: 0,
                    formatter: function(value) {
                        return value.split("").join("\n");
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'log',
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                logBase: 10,
                min: 1,
                axisLabel: {
                    formatter: function(value) {
                        texts = [];
                        if (value == 1) {
                            texts.push("10⁰")
                        }
                        if (value == 10) {
                            texts.push("10¹")
                        }
                        if (value == 100) {
                            texts.push("10²")
                        }
                        if (value == 1000) {
                            texts.push("10³")
                        }
                        if (value == 10000) {
                            texts.push("10⁴")
                        }
                        if (value == 100000) {
                            texts.push("10⁵")
                        }
                        if (value == 1000000) {
                            texts.push("10⁶")
                        }
                        if (value == 10000000) {
                            texts.push("10⁷")
                        }
                        if (value == 100000000) {
                            texts.push("10⁸")
                        }
                        return texts;
                    }
                }

            },
            series: [{
                name: '资源目录数据',
                type: 'bar',
                // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                //     22, 23, 24, 25, 26, 27, 28
                // ]
                data: []
            }, {
                name: '基础对象数据',
                type: 'bar',
                // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                //     22, 23, 24, 25, 26, 27, 28
                // ]
                data: []
            }]
        },
        leftdownoption: {
            title: {
                text: '',
                x: 'center',
                bottom: '0%',
                textStyle: {
                    fontSize: 14
                }
            },
            color: ['#19B7CF', '#668B8B', '#54FF9F', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [],
                top: 40
            },
            grid: {
                top: '4%',
                left: '3%',
                right: '4%',
                bottom: '%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [{
                name: '元数据分布',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: [],
                hoverAnimation: true,
                minAngle: 5,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
            }]
        },
        rightdownoption: {
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
                type: 'log',
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                logBase: 10,
                min: 1,
                axisLabel: {
                    formatter: function(value) {
                        texts = [];
                        if (value == 1) {
                            texts.push("10⁰")
                        }
                        if (value == 10) {
                            texts.push("10¹")
                        }
                        if (value == 100) {
                            texts.push("10²")
                        }
                        if (value == 1000) {
                            texts.push("10³")
                        }
                        if (value == 10000) {
                            texts.push("10⁴")
                        }
                        if (value == 100000) {
                            texts.push("10⁵")
                        }
                        if (value == 1000000) {
                            texts.push("10⁶")
                        }
                        if (value == 10000000) {
                            texts.push("10⁷")
                        }
                        if (value == 100000000) {
                            texts.push("10⁸")
                        }
                        return texts;
                    }
                }
            },
            series: [{
                name: '基础对象数据',
                type: 'bar',
                data: [],
                barWidth: 40,
            }]
        },
        rightdownoptionall: {
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
                orient: 'vertical',
                left: 'left',
                data: ['基础对象数据']
            },
            grid: {
                x: 80,
                y: 80,
                bottom: 130
            },
            xAxis: {
                data: [],
                axisLabel: {
                    inside: false,
                    formatter: function(value) {
                        return value.split("").join("\n");
                    }
                },
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: 'log',
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                logBase: 10,
                min: 1,
                axisLabel: {
                    formatter: function(value) {
                        texts = [];
                        if (value == 1) {
                            texts.push("10⁰")
                        }
                        if (value == 10) {
                            texts.push("10¹")
                        }
                        if (value == 100) {
                            texts.push("10²")
                        }
                        if (value == 1000) {
                            texts.push("10³")
                        }
                        if (value == 10000) {
                            texts.push("10⁴")
                        }
                        if (value == 100000) {
                            texts.push("10⁵")
                        }
                        if (value == 1000000) {
                            texts.push("10⁶")
                        }
                        if (value == 10000000) {
                            texts.push("10⁷")
                        }
                        if (value == 100000000) {
                            texts.push("10⁸")
                        }
                        return texts;
                    }
                }
            },
            series: [{
                name: '基础对象数据',
                type: 'bar',
                // barWidth: 10,
                data: [2, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                    2, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                    2, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                    2, 2, 3, 4, 5
                ],
                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function(params) {

                            colorList = [];
                            for (i = 0; i < 4; i++) {
                                colorList.push('rgb(25, 183, 207)');
                            }
                            for (i = 0; i < 22; i++) {
                                colorList.push('#00CCCC');
                            }
                            for (i = 0; i < 6; i++) {
                                colorList.push('#CC99CC');
                            }
                            for (i = 0; i < 3; i++) {
                                colorList.push('#FF9999');
                            }

                            return colorList[params.dataIndex];
                        }
                    },
                }
            }]
        },
        //存储图表需要用到的资源目录树的数据
        catalogTreeData: [],
        leftUpCatalogTreeData: {},
        leftDownCatalogTreeData: {},
        objectTreeData: [],
        departTreeData: [],
        firstPieTreeData: [],
        firstPieTreeLegend: [],
        //水利信息结点下
        firstPieTreeDataAll: [],
        firstPieTreeLegendAll: [],
        firstPieTreeSecondData: [],
        firstPieTreeSecondLegend: [],
        secondPieTreeData: [],
        secondPieTreeLegend: [],
        secondPieTreeSecondData: [],
        secondPieTreeSecondLegend: [],
        max: 0,
        radarData: [],

        downmax: [],
        //pnodeId为1000的nodeId
        arrayNodeId: [],
        //pnodeId为1001的nodeId
        arrayNodeId1: [],
        arrayData: [],
        arrayLegend: [],
        arrayRader: [],
        //各单位部门各自含有的各种对象类的数量，是一个45*29的二维数组。
        arrayObjData: [],
        arrayObjLegend: [],
        //所有机构部门的目录资源总数（size为45的一位数组）
        arrayAllData: [],
        //所有机构部门的对象数据总数（size为45的一位数组）
        arrayAllObjData: [],
        //存储“水利部汇交情况图”中水利部本级以及各个直属单位的数据量
        arrayRightBar: [],
        arrayRightBarObj: [],
        //水利部目录资源分布图echarts对象
        myChartleft: '',
        myChartmid: '',
        myChartright: '',
        //全国汇交情况
        myChartAllData: '',
        //水利部汇交情况
        myChartRightData: '',
        //流域、省级目录资源分布图echarts对象 （左、右）
        myChartleftDown: '',
        myChartrightDown: '',
        //第2行条形图
        arrayBar: [],
        //雷达图 行政、业务、综合、其他数据总量
        arrayRaderTotal: [],
        //对象分布图 各类对象数据总量
        arrayObjTotal: [],
        arrayObjlegendAll: [],
        //存储对象分类数据
        arrayDepObjName: [],        //每个对象类的名称
        arrayDepObj: [],            //每个对象类的统计数
        arrayDepObjTotal: [],       //每个抽象类的统计数
        //对象树结点名称和class_code
        Obj_Code_Name: [],
        //用于存放两张柱状图的对象类数据量
        allDataObj: [],
        rightBarObj: [],
        //用于测试
        test: [],
        img_src:'/YU/statics/imgs/BJlogo.png',

    },
    mounted() { //页面一加载就会触发，可以用于初始化页面，相当于window.onload
        that = this;
        var authCode = getUrlKey("authCode");
        var role = getUrlKey("role");
        if(authCode!=null&&authCode!=''&&authCode!=undefined){
            sessionStorage.setItem("authCode",authCode);
            sessionStorage.setItem("role",role);
        }
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "progressBar": false,
            "positionClass": "toast-top-center",
            "onclick": null,
            "showDuration": "200",
            "hideDuration": "200",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        //更新榜
        getDataByGet('/index_manager/getUpdateRankData', {}, function(res) {
        	var msg= res.data;
            //index.updateData = msg.slice(0,16);
           // console.log("ok",msg,"ok");
            index.updateData = msg.slice(0,10);
        })

        // var aJson;
        // aJson={"nodeId":'1034'};
        // getDataByGet('/index_manager/getObjById', aJson, dataStr=>{
        //     that.objectTreeData = dataStr;
        //     console.log("getObjById的值是",dataStr)
        //     for (var i = 0; i < dataStr.length; i++) {
        //         if (dataStr[i].pnodeId == 1034) {
        //             var str = dataStr[i].nodeName + "";
        //             var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
        //             var name = str.substr(0, str.indexOf("("));
        //             var data = {
        //                 value: num,
        //                 name: name,
        //             }
        //             // xizangObjOrResDep.push(data);
        //         }
        //     }
        // })

        //替换LOGO
        getDataByGet('/index_manager/getLogoName',{}, function (res){
            index.img_src = '/YU/statics/imgs/' + res.data;
        })

        window.onresize = function loadChart() {
            that.pictureShow();
        }
       
        // $(document).ready(function() {
        //     window.history.replaceState({}, "", 'http://' + window.location.host + '/getPage/?content=');
        // });

        // 初始化页面
        that.load();
    },
    methods: { //相当于成员方法
        load() {
            //45个部门结点
            for (var i = 0; i < 45; i++) {
                that.arrayData.push(new Array());
                that.arrayLegend.push(new Array());
                that.arrayRader.push(new Array());
                that.arrayObjData.push(new Array());
                that.arrayObjLegend.push(new Array());
                that.downmax.push(0);
                that.arrayBar.push(new Array());
            }
            //34类数据对象
            for (i = 0; i < 34; i++) {
                that.arrayObjTotal.push(new Array());
                that.arrayObjlegendAll.push(new Array());
            }
            that.myChartleft = echarts.init(document.getElementById('left'));
            that.myChartmid = echarts.init(document.getElementById('mid'));
            that.myChartright = echarts.init(document.getElementById('right'));
            that.myChartAllData = echarts.init(document.getElementById('all_data_pic'));
           // that.myChartRightData = echarts.init(document.getElementById('right_data_pic'));
          //  that.myChartleftDown = echarts.init(document.getElementById('left_down'));
            that.myChartrightDown = echarts.init(document.getElementById('right_down'));
            //加载动画
            that.showLoading(that.myChartleft);
            that.showLoading(that.myChartmid);
            that.showLoading(that.myChartright);
            that.showLoading(that.myChartAllData);
        //    that.showLoading(that.myChartRightData);
      //     that.showLoading(that.myChartleftDown);
            that.showLoading(that.myChartrightDown);

            that.showPictrue();


            // that.findusermessage();

            var aJson = {};
            var setting={
                async:  {
                    enable: true,
                    type: "GET",
                    dataType: 'json',
                    url: BASE_URL+"/index_manager/getResTreeByCode",
                    autoParam: ["nodeCode"],
                    otherParam: {"addCount":"true"}
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "nodeId",
                        pIdKey: "pnodeId",
                        rootPId: "0"
                    },
                    key: {
                        name: "nodeName"
                    }
                },
                callback: {
                    onClick: function zTreeOnClickSearch(event, treeId, treeNode) {
                        var nodeId = treeNode.nodeId;
                        keySearch.loadFromTree(nodeId,"ReSourceTree");
                    },
                    onAsyncSuccess:function zTreeOnAsyncSuccess(event, treeId, treeNode, dataStr) {
                        var cur = that.arrayNodeId.indexOf(treeNode.nodeId);
                        for (var i = 0; i < dataStr.length; i++) {
                            if (dataStr[i].pnodeId == treeNode.nodeId) {
                                var str = dataStr[i].nodeName + "";
                                var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
                                var name = str.substr(0, str.indexOf("("));
                                if (num != 0) {
                                    var data = {
                                        value: num,
                                        name: name,
                                        nodeid: dataStr[i].nodeId,
                                    }
                                    that.arrayData[cur].push(data);
                                    that.arrayLegend[cur].push(name);

                                }
                            }
                        }
                        that.catalogTreeData = that.catalogTreeData.concat(dataStr)
                    }
                }
            }
            //资源目录树的懒加载  加载所有一级节点和水利部子节点
            getDataByGet('/index_manager/getResById?nodeId=1000',aJson, dataStr =>{
            	that.catalogTreeData = dataStr
                    that.resZtree = $.fn.zTree.init($("#resTree"), setting, dataStr);
                    for (var i = 0; i < dataStr.length; i++) {
                        //父节点为水利信息资源目录结点
                        if (dataStr[i].pnodeId == 1001) {
                            that.arrayNodeId1.push(dataStr[i].nodeId);
                            //存所有一级结点信息
                            var str = dataStr[i].nodeName + "";
                            var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
                            that.arrayRightBar.push(num);
                        }
                        //父节点为水利信息资源目录结点
                        if (dataStr[i].pnodeId == 1000) {
                            that.arrayNodeId.push(dataStr[i].nodeId);
                            //存所有一级结点信息
                            var str = dataStr[i].nodeName + "";
                            var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
                            var name = str.substr(0, str.indexOf("("));
                            if (num != 0) {
                                var data = {
                                    value: num,
                                    name: name,
                                    nodeid: dataStr[i].nodeId,
                                }
                                that.firstPieTreeDataAll.push(data);
                                that.firstPieTreeLegendAll.push(name);
                            }
                        }
                    }
                    that.rightBaroption.series[0].data = that.arrayRightBar
                    that.leftPictureShow();
                    // that.midPictureShow();

                    for (var j = 0; j < that.arrayNodeId.length; j++) {
                        for (var i = 0; i < dataStr.length; i++) {
                            if (dataStr[i].pnodeId == that.arrayNodeId[j]) {
                                var str = dataStr[i].nodeName + "";
                                var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
                                var name = str.substr(0, str.indexOf("("));
                                if (num != 0) {
                                    var data = {
                                        value: num,
                                        name: name,
                                        nodeid: dataStr[i].nodeId,
                                    }
                                    that.arrayData[j].push(data);
                                    that.arrayLegend[j].push(name);
                                }
                            }
                        }
                    }
                    that.getChartNum();
            })

            var settingObject = {
                async: {
                    enable: true,
                    type: "GET",
                    dataType: 'json',
                    url: BASE_URL+"/object_manage/getObjTreeByCode",
                    autoParam: ["nodeCode"],
                    otherParam: {"addCount":"true", "withUncheck":"false"}
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "nodeId",
                        pIdKey: "pnodeId",
                        rootPId: "0",
                        isHidden: "isHidden",
                        isBlack: "isBlack"
                    },
                    key: {
                        name: "nodeName"
                    }
                },
                callback: {
                    onClick:function objectTreeClickSearch(event, treeId, treeNode) {
                        var nodeId = treeNode.nodeId;
                        keySearch.loadFromTree(nodeId,"ObjectTree");
                    },

                    onAsyncSuccess: function objectTreeOnAsyncSuccess(event, treeId, treeNode, dataStr) {
                        that.hide0Nodes(that.objZtree,treeNode)
                    }
                }
            }
         
            //对象树的懒加载
            getDataByGet('/object_manage/getObjTreeByCode?nodeCode=1000&addCount=true',aJson, dataStr=>{
            	that.objectTreeData = dataStr;
                    for (var i = 0; i < dataStr.length; i++) {
                        if (dataStr[i].pnodeId == 1001) {
                            var str = dataStr[i].nodeName + "";
                            var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
                            that.arrayRightBarObj.push(num);
                        }
                    }
                    that.objZtree = $.fn.zTree.init($("#objTree"), settingObject, dataStr);
                    that.hide0Nodes(that.objZtree);
            })
            

            $('.str3-2').liMarquee();
            $('.str4').liMarquee();
            $("#keyWord").on('keypress', function(event) {
                if (event.keyCode == 13) {
                    keySearch.load(1);
                }
            });

            //窗口变化
            window.onresize = function() {
                that.myChartleft.resize();
                that.myChartmid.resize();
                that.myChartright.resize();
                that.myChartAllData.resize();
           //     that.myChartRightData.resize();
           //     that.myChartleftDown.resize();
                that.myChartrightDown.resize();
            }
            //tab栏绑定点击

            $('#myTab li a').on('shown.bs.tab', function(e) {
                //that.myChartRightData.setOption(that.rightBaroption);
                //that.myChartRightData.hideLoading();
                that.myChartAllData.resize();
              //  that.myChartRightData.resize();
            })

            //水利信息目录资源分布图点击事件绑定
            try {
                that.myChartleft.on('click', function(params) {
                    that.leftPictureClick(params, that.myChartleft);
                });
            } catch (cer) {
                console.log(cer);
            }
            //水利部/省级/流域资源目录分布图
          /*try {
                that.myChartleftDown.on('click', function(params) {
                    that.leftDownPictureClick(params, that.myChartleftDown);
                });
            } catch (cer) {
                console.log(cer);
            }
           */

        },
        search(flag){
            alert("hhh")
        },

        getChartNum(){
	        new Promise(function(resolve){
	            that.getReSourceNum(resolve);
	        }).then(function(){
	            that.getObjTreeNum();

	        })
    	},
	    getReSourceNum(resolve){
	        var aJson = {};
	        getDataByGet("/index_manager/queryReSourceNum",aJson, res=> {
	        	if (res.code==200) {
	        		var dataStr = res.data;
		            var i;
		            var arr = dataStr.substring(1, dataStr.length - 1).split(",");
		            var arr1 = new Array();
		            var indexequal;
		            for (i = 0; i < arr.length; i++) {
		                indexequal = arr[i].indexOf("=");
		                arr1[i] = arr[i].substring(indexequal+1, arr[i].length);
		            }
		            for (i = 0; i < that.arrayRader.length; i++) {
		                for (var j = 0; j < 4; j++) {
		                    that.arrayRader[i].push(arr1[i * 4 + j]);
		                    if (parseInt(that.arrayRader[i][j]) > parseInt(that.downmax[i])) {
		                        that.downmax[i] = that.arrayRader[i][j];
		                    }
		                }
		            }
		            //通过arrayRader计算水利信息业务、行政、综合、其他数据总量
		            var RaderAll = new Array();
		            for (j = 0; j < 4; j++) {
		                RaderAll[j] = 0;
		                for (i = 0; i < that.arrayRader.length; i++) {
		                    RaderAll[j] += Number(that.arrayRader[i][j]);
		                }
		            }
		            for (i = 0; i < 4; i++) {
		                that.arrayRaderTotal.push(RaderAll[i]);
		            }

		            //通过arrayRader计算流域、省级资源目录数据总量
		            var sum = new Array();
		            for (i = 0; i < that.arrayRader.length; i++) {
		                sum[i] = 0;
		                for (var j = 0; j < 4; j++) {
		                    sum[i] += Number(that.arrayRader[i][j]);
		                    that.arrayBar[i][j] = Number(that.arrayRader[i][j]);
		                }
		            }
		            for (i = 0; i < 45; i++) {
		                that.arrayAllData.push(sum[i]);
		            }
		            that.AllDataoption.series[0].data = that.arrayAllData.slice(0, 40)
		            //显示所有流域省份数据图
		            that.max = that.downmax[0];
		            that.radarData = that.arrayRader[0];
		            resolve();
	        	}else{
	        		toastr.warning(res.msg);
	        	}
	        	
	        })
	    },
	    getObjTreeNum(){
	        var aJson = {};
	        getDataByGet("/index_manager/queryObjTreeNum", aJson, res=> {
	        	if (res.code==200) {
	        		var dataStr = res.data;
		            var arr = dataStr.substring(1, dataStr.length - 1).split(",");
		            var arr1 = new Array();
		            for (var i = 0; i < arr.length; i++) {
		                var tmp = arr[i].trim();
		                arr1[i] = tmp.substring(tmp.indexOf("=")+1, arr[i].length);
		            }
		            var arr2 = new Array();
		            for (var i = 0; i < 45; i++) {
		                var temp = arr1.slice(i * 34, i * 34 + 34);
		                arr2.push(temp);

		            }
		            for (var i = 0; i < arr2.length; i++) {
		                var name;
		                for (var j = 0; j < 34; j++) {
		                    switch (j + 1) {
		                        case 1:
		                            name = "流域";
		                            break;
		                        case 2:
		                            name = "河流";
		                            break;
		                        case 3:
		                            name = "湖泊";
		                            break;
		                        case 4:
		                            name = "水库";
		                            break;
		                        case 5:
		                            name = "水库大坝";
		                            break;
		                        case 6:
		                            name = "水电站";
		                            break;
		                        case 7:
		                            name = "灌区";
		                            break;
		                        case 8:
		                            name = "渠（沟）道";
		                            break;
		                        case 9:
		                            name = "取水井";
		                            break;
		                        case 10:
		                            name = "水闸";
		                            break;
		                        case 11:
		                            name = "渡槽";
		                            break;
		                        case 12:
		                            name = "倒虹吸";
		                            break;
		                        case 13:
		                            name = "泵站";
		                            break;
		                        case 14:
		                            name = "涵洞";
		                            break;
		                        case 15:
		                            name = "引调水工程";
		                            break;
		                        case 16:
		                            name = "农村供水工程";
		                            break;
		                        case 17:
		                            name = "窖池";
		                            break;
		                        case 18:
		                            name = "塘坝";
		                            break;
		                        case 19:
		                            name = "蓄滞洪区";
		                            break;
		                        case 20:
		                            name = "堤防";
		                            break;
		                        case 21:
		                            name = "圩垸";
		                            break;
		                        case 22:
		                            name = "治河工程";
		                            break;
		                        case 23:
		                            name = "淤地坝";
		                            break;
		                        case 24:
		                            name = "橡胶坝";
		                            break;
		                        case 25:
		                            name = "水文监测站";
		                            break;
		                        case 26:
		                            name = "水土保持监测站";
		                            break;
		                        case 27:
		                            name = "水工程安全检测站";
		                            break;
		                        case 28:
		                            name = "供（取）水量监测点";
		                            break;
		                        case 29:
		                            name = "水事影像监测点";
		                            break;
		                        case 30:
		                            name = "其他";
		                            break;
		                        case 31:
		                            name = "其他管理对象";
		                            break;
		                        case 32:
		                            name = "管道";
		                            break;
		                        case 33:
		                            name = "功能区";
		                            break;
		                        case 34:
		                            name = "桥梁";
		                            break;
		                    }
		                    if (arr2[i][j] != 0) {
		                        var data = {
		                            value: parseInt(arr2[i][j]),
		                            name: name,
		                        }
		                        that.arrayObjData[i].push(data);
		                        that.arrayObjLegend[i].push(name);
		                    }
		                }
		            }
		            //通过arr2计算资源目录对象总数
		            var ObjAll = new Array();
		            var data = new Array();
		            that.arrayObjTotal.length = 0;
		            that.arrayObjlegendAll.length = 0;
		            for (j = 0; j < 34; j++) {
		                ObjAll[j] = 0;
		                switch (j + 1) {
		                    case 1:
		                        name = "流域";
		                        break;
		                    case 2:
		                        name = "河流";
		                        break;
		                    case 3:
		                        name = "湖泊";
		                        break;
		                    case 4:
		                        name = "水库";
		                        break;
		                    case 5:
		                        name = "水库大坝";
		                        break;
		                    case 6:
		                        name = "水电站";
		                        break;
		                    case 7:
		                        name = "灌区";
		                        break;
		                    case 8:
		                        name = "渠（沟）道";
		                        break;
		                    case 9:
		                        name = "取水井";
		                        break;
		                    case 10:
		                        name = "水闸";
		                        break;
		                    case 11:
		                        name = "渡槽";
		                        break;
		                    case 12:
		                        name = "倒虹吸";
		                        break;
		                    case 13:
		                        name = "泵站";
		                        break;
		                    case 14:
		                        name = "涵洞";
		                        break;
		                    case 15:
		                        name = "引调水工程";
		                        break;
		                    case 16:
		                        name = "农村供水工程";
		                        break;
		                    case 17:
		                        name = "窖池";
		                        break;
		                    case 18:
		                        name = "塘坝";
		                        break;
		                    case 19:
		                        name = "蓄滞洪区";
		                        break;
		                    case 20:
		                        name = "堤防";
		                        break;
		                    case 21:
		                        name = "圩垸";
		                        break;
		                    case 22:
		                        name = "治河工程";
		                        break;
		                    case 23:
		                        name = "淤地坝";
		                        break;
		                    case 24:
		                        name = "橡胶坝";
		                        break;
		                    case 25:
		                        name = "水文监测站";
		                        break;
		                    case 26:
		                        name = "水土保持监测站";
		                        break;
		                    case 27:
		                        name = "水工程安全检测站";
		                        break;
		                    case 28:
		                        name = "供（取）水量监测点";
		                        break;
		                    case 29:
		                        name = "水事影像监测点";
		                        break;
		                    case 30:
		                        name = "其他";
		                        break;
		                    case 31:
		                        name = "其他管理对象";
		                        break;
		                    case 32:
		                        name = "管道";
		                        break;
		                    case 33:
		                        name = "功能区";
		                        break;
		                    case 34:
		                        name = "桥梁";
		                        break;
		                }
		                for (i = 0; i < 45; i++) {
		                    ObjAll[j] += Number(arr2[i][j]);
		                }
		                data.push({
		                    value: ObjAll[j],
		                    name: name,
		                });
		                if (ObjAll[j] != 0) {
		                    that.arrayObjTotal.push(data[j]);
		                    that.arrayObjlegendAll.push(data[j].name);
		                }
		            }

		            that.rightPictureShow();
		            var sum;
		            for (var i = 0; i < that.arrayObjData.length; i++) {
		                sum = 0;
		                for (var j = 0; j < that.arrayObjData[i].length; j++) {
		                    sum += Number(that.arrayObjData[i][j].value);
		                }
		                //记录所有机构（45个）的对象数据总数
		                that.arrayAllObjData.push(sum);
		            }
		            that.rightPictureShow();
		            that.getObjNum();
		            that.midPictureShow();
		      //      that.showLevel2();
                    that.setRankListData();
	        	}else{
	        		toastr.warning(res.msg);
	        	}
	        	
	        })
	    },
        setRankListData(){
            var totalArr = [];  //排序使用
            //动态获取部门名称以及数量放到申请榜等上面
            let listChoseObjDep = [];
            let listChoseResDep = [];
            const nodeId = 1002;
            getDataByGet('/object_manage/getObjTreeByCode?nodeCode=1000&addCount=true', {}, dataStr=>{
                listChoseObjDep=that.getListChoseDep(dataStr,nodeId);
                getDataByGet('/index_manager/getResById?nodeId='+nodeId, {}, dataStr=>{
                    listChoseResDep=that.getListChoseDep(dataStr,nodeId);
                    for (var i = 0; i < listChoseResDep.length; i++) {
                        var tmp = { 'name': '', value: '' }
                        tmp.name = listChoseResDep[i].name;
                        // tmp.value = that.arrayAllData[i] + that.arrayAllObjData[i];
                        tmp.value = listChoseResDep[i].value+listChoseObjDep[i].value;
                        totalArr.push(tmp)
                    }
                    totalArr.sort(function(a, b) {
                        return b.value - a.value
                    })
                    index.totalData = totalArr.slice(0,10);
                })
            })
        },
	    getObjTree(objdep_id){
	        getDataByPost("/index_manager/queryObjTree", {
	            "dep": objdep_id,
	        }, res=> {
	        	var dataStr = res.data;
                var arr = dataStr.substring(1, dataStr.length - 1).split(",");
	            var arr1 = new Array();
                var objCountMap = new Map();
	            for (var i = 0; i < arr.length; i++) {
	                var tmp = arr[i].trim();
                    var objCode = tmp.substring(tmp.lastIndexOf("_") + 1, tmp.indexOf("="));
                    var objCount = tmp.substring(tmp.indexOf("=")+1, arr[i].length);
                    objCountMap.set(objCode, objCount);
	            }

                that.arrayDepObjName = [];
                that.arrayDepObj = [];
                getDataByGet1("/index_manager/queryLeafClasses", {}, dataStr=>{
                    var nameMap = dataStr.data[0];
                    objCountMap.forEach((value, key)=>{
                        var name = nameMap[key];
                        var count = Number(value);
                        if (count > 0){
                            that.arrayDepObjName.push(name);
                            that.arrayDepObj.push(count);
                        }
                    })
                })

                //一级对象分类：江河湖泊、水利工程、监测站点、其他管理对象
                that.arrayDepObjTotal = [];
                var sum1 = sum2 = sum3 = sum4 =0;
                objCountMap.forEach( (value, key)=>{
                        switch (key){
                            case "RL" + key.substring(2,key.length):
                                sum1 = Number(sum1) + Number(value);
                                break;
                            case "HP" + key.substring(2,key.length):
                                sum2 = Number(sum2) + Number(value);
                                break;
                            case "MS" + key.substring(2,key.length):
                                sum3 = Number(sum3) + Number(value);
                                break;
                            case "EX" + key.substring(2,key.length):
                                sum4 = Number(sum4) + Number(value);
                                break;
                            default: //非标准对象编码也统计入其他管理对象类中
                                sum4 = Number(sum4) + Number(value);
                                break;
                        }
                    }
                )
                that.arrayDepObjTotal.push(sum1);
                that.arrayDepObjTotal.push(sum2);
                that.arrayDepObjTotal.push(sum3);
                that.arrayDepObjTotal.push(sum4);

	        	that.rightDownPictureShowAll();  //初始化时，展示每个实体类的统计数量
	        });
	    },
	    getObjNum(){
	        // var data="";
	        var aJson = {};
	        getDataByGet("/index_manager/queryObjNum",aJson,res=>{
	        	var dataStr = res.data;

	            //全国汇交情况图""
	            for (var i = 0; i < that.arrayNodeId.length; i++) {
	                //that.allDataObj.push(dataStr[0][10]);
	                that.allDataObj.push(dataStr[0][that.arrayNodeId[i]]);
                   // that.allDataObj.push(1000);
	            }

	            //水利部汇交情况图
                /*
	            for (var i = 0; i < that.arrayNodeId1.length; i++) {
	                that.rightBarObj.push(dataStr[1][that.arrayNodeId1[i]]);
	            }*/
	            that.AllDataoption.series[1].data = that.allDataObj;
	         //  that.rightBaroption.series[1].data = that.rightBarObj;
	            that.myChartAllData.setOption(that.AllDataoption);
	          //  that.myChartRightData.setOption(that.rightBaroption);
	            that.myChartAllData.hideLoading();
	         //   that.myChartRightData.hideLoading();
	            that.myChartAllData.resize();
	         //   that.myChartRightData.resize();
	        })

	        //水利信息目录资源分布图点击事件绑定
	        try {
	            that.myChartleft.on('click', function(params) {
	                that.leftPictureClick(params, that.myChartleft);
	            });
	        } catch (cer) {
	            console.log(cer);
	        }
	     
	        //水利部/省级/流域资源目录分布图
	      /*  try {
	            that.myChartleftDown.on('click', function(params) {
	                that.leftDownPictureClick(params, that.myChartleftDown);
	            });
	        } catch (cer) {
	            console.log(cer);
	        }
	        */
	     
	    },
	    showLoading(echartObj){
	        echartObj.showLoading({
	            color: 'rgb(25, 183, 207)',
	            effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
	        });
	    },
        /*
	    showLevel2() {
	        $("#level2").empty();
	        var level1 = $("#level1").val();
	        if (level1 == "水利部"){
	            $("#level2").append("<option value='1001' objdep_id='00' selected>水利部业务网</option>");
	        }else if (level1 == "流域") {
	            $("#level2").append("<option value='1002' objdep_id='01' selected>长江水利委员会</option>");
	            $("#level2").append("<option value='1003' objdep_id='02'>黄河水利委员会</option>");
	            $("#level2").append("<option value='1004' objdep_id='03'>淮河水利委员会</option>");
	            $("#level2").append("<option value='1005' objdep_id='04'>海河水利委员会</option>");
	            $("#level2").append("<option value='1006' objdep_id='05'>珠江水利委员会</option>");
	            $("#level2").append("<option value='1007' objdep_id='06'>松辽水利委员会</option>");
	            $("#level2").append("<option value='1008' objdep_id='07'>太湖流域管理局</option>");
	        } else {
	            $("#level2").append("<option value='1009' objdep_id='11' selected>北京市水务局</option>");
	            $("#level2").append("<option value='1010' objdep_id='12'>天津市水务局</option>");
	            $("#level2").append("<option value='1011' objdep_id='13'>河北省水利厅局</option>");
	            $("#level2").append("<option value='1012' objdep_id='14'>山西省水利厅</option>");
	            $("#level2").append("<option value='1013' objdep_id='15'>内蒙古自治区水利厅</option>");
	            $("#level2").append("<option value='1014' objdep_id='21'>辽宁省水利厅</option>");
	            $("#level2").append("<option value='1015' objdep_id='22'>吉林省水利厅</option>");
	            $("#level2").append("<option value='1016' objdep_id='23'>黑龙江省水利厅</option>");
	            $("#level2").append("<option value='1017' objdep_id='31'>上海市水务局</option>");
	            $("#level2").append("<option value='1018' objdep_id='32'>江苏省水利厅</option>");
	            $("#level2").append("<option value='1019' objdep_id='33'>浙江省水利厅</option>");
	            $("#level2").append("<option value='1020' objdep_id='34'>安徽省水利厅</option>");
	            $("#level2").append("<option value='1021' objdep_id='35'>福建省水利厅</option>");
	            $("#level2").append("<option value='1022' objdep_id='36'>江西省水利厅</option>");
	            $("#level2").append("<option value='1023' objdep_id='37'>山东省水利厅</option>");
	            $("#level2").append("<option value='1024' objdep_id='41'>河南省水利厅</option>");
	            $("#level2").append("<option value='1025' objdep_id='42'>湖北省水利厅</option>");
	            $("#level2").append("<option value='1026' objdep_id='43'>湖南省水利厅</option>");
	            $("#level2").append("<option value='1027' objdep_id='44'>广东省水利厅</option>");
	            $("#level2").append("<option value='1028' objdep_id='45'>广西壮族自治区水利厅</option>");
	            $("#level2").append("<option value='1029' objdep_id='46'>海南省水利厅</option>");
	            $("#level2").append("<option value='1030' objdep_id='50'>重庆市水务局</option>");
	            $("#level2").append("<option value='1031' objdep_id='51'>四川省水利厅</option>");
	            $("#level2").append("<option value='1032' objdep_id='52'>贵州省水利厅</option>");
	            $("#level2").append("<option value='1033' objdep_id='53'>云南省水利厅</option>");
	            $("#level2").append("<option value='1034' objdep_id='54'>西藏自治区水利厅</option>");
	            $("#level2").append("<option value='1035' objdep_id='61'>陕西省水利厅</option>");
	            $("#level2").append("<option value='1036' objdep_id='62'>甘肃省水利厅</option>");
	            $("#level2").append("<option value='1037' objdep_id='63'>青海省水利厅</option>");
	            $("#level2").append("<option value='1038' objdep_id='64'>宁夏回族自治区水利厅</option>");
	            $("#level2").append("<option value='1039' objdep_id='65'>新疆维吾尔族自治区水利厅</option>");
	            $("#level2").append("<option value='1040' objdep_id='66'>新疆生产建设兵团水利局</option>");
	            $("#level2").append("<option value='83716' objdep_id='69'>大连</option>");
	            $("#level2").append("<option value='82073' objdep_id='70'>青岛</option>");
	            $("#level2").append("<option value='25316' objdep_id='71'>宁波</option>");
	            $("#level2").append("<option value='32541' objdep_id='72'>厦门</option>");
	            $("#level2").append("<option value='39251' objdep_id='73'>深圳</option>");
	        }
	        that.showPictrue();
	    },*/
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
	    showPictrue() {
	      //  that.showLoading(that.myChartleftDown);
	        that.showLoading(that.myChartrightDown);
	   //    that.leftDownPictureShow();

            // 根据当前的 LOCATION 来获取默认机构节点下的对象元数据统计情况
            var depobjId = getLocationId();
            // 根据筛选框中的选择项来获取特定对象类的统计情况
	        // var depobjId = $("#level2").find("option:selected").attr("objdep_id");

	        that.getObjTree(depobjId);
	    },

	    rightDownBtnClick(flag){
	        if(flag){
	            // 显示抽象对象的柱状图统计
	            that.rightDownPictureShow();
	        }else{
	            // 显示所有对象类的柱状图统计
	            that.rightDownPictureShowAll();
	        }
	    },
	    leftPictureShow() {
	        // var that.myChartleft = echarts.init(document.getElementById('left'));
	        that.leftoption.title.text = '水利信息目录资源分布图';
	        //that.leftoption.series[0].data = that.firstPieTreeData;
	        //that.leftoption.legend.data = that.firstPieTreeLegend;
            quickSort(that.firstPieTreeDataAll,0,that.firstPieTreeDataAll.length-1)
            var legend = [];
            var length = that.firstPieTreeDataAll.length<5?that.firstPieTreeDataAll.length:5;
            for (var i = 0; i < length; i++) {
                legend.push(that.firstPieTreeDataAll[i].name);
            }
	        that.leftoption.series[0].data = that.firstPieTreeDataAll;
	        that.leftoption.legend.data = legend;
	        that.myChartleft.setOption(that.leftoption);
	        that.myChartleft.hideLoading();
	    },
	    midPictureShow() {
	        //var that.myChartmid = echarts.init(document.getElementById('mid'));
	        var max = -1;
	        that.arrayRaderTotal.forEach(function(e){
	            if(e>max){
	                max = e;}
	        });
	        for (var i = 0; i < that.midoption.radar.indicator.length; i++) {
	            that.midoption.radar.indicator[i].max=max;
	            that.midoption.series[0].data[0].value = that.arrayRaderTotal;
	        }
	        that.myChartmid.setOption(that.midoption);
	        that.myChartmid.hideLoading();
	    },
	    rightPictureShow() {
	        //var that.myChartright = echarts.init(document.getElementById('right'));
	        that.rightoption.title.text = '水利信息目录资源对象分布图';
            quickSort(that.arrayObjTotal,0,that.arrayObjTotal.length-1);
	        var legend = [];
	        var length = that.arrayObjTotal.length<5?that.arrayObjTotal.length:5;
            for (var i = 0; i < length; i++) {
                legend.push(that.arrayObjTotal[i].name);
            }
            that.rightoption.series.data = that.arrayObjTotal;
	        that.rightoption.legend.data = legend;
	        that.myChartright.setOption(that.rightoption);
	        that.myChartright.hideLoading();
	    },
/*
	    leftDownPictureShow() {
	        // var that.myChartleftDown = echarts.init(document.getElementById('left_down'));
	        var options = $("#level2 option:selected");
	        var depart = options.text();
	        var nodeId = $("#level2").val();
	        var curIndex = that.arrayNodeId.indexOf(Number(nodeId));
	        that.leftdownoption.title.text = depart + '目录资源分布图';

	        if(that.arrayData[curIndex].length==0){
	            that.setPieData(nodeId,that.arrayData[curIndex],that.arrayLegend[curIndex])
	        }
	        if (that.arrayAllData[curIndex]==0){
	            $("#left_down").addClass("hidden");
	            $("#no_resdata").removeClass("hidden");
	        }else {
	            $("#left_down").removeClass("hidden");
	            $("#no_resdata").addClass("hidden");
	            that.leftdownoption.series[0].data = that.arrayData[curIndex];
	            that.leftdownoption.legend.data = that.arrayLegend[curIndex].slice(0,5);
	            that.myChartleftDown.setOption(that.leftdownoption);
	        }
	        that.myChartleftDown.hideLoading();
	    },

 */
	    rightDownPictureShow() {
	       // var options = $("#level2 option:selected");
	       // var depart = options.text();
	        that.rightdownoption.title.text = DEPTNAME + ' - 一级对象类分布图';
	        var dataString = that.arrayDepObjTotal.join('');

	        if (dataString=='0'*4){
                //如果各类的元数据统计项均为0，即没有发布对象数据，则隐藏相关统计数据
	            $("#right_down").addClass("hidden");
	            $("#right_downall").addClass("hidden");
	            $("#no_objdata").removeClass("hidden");
	        }else{
                //只要有统计项，则设置相关控件为可视
	            $("#right_down").removeClass("hidden");
	            $("#right_downall").addClass("hidden");
	            $("#no_objdata").addClass("hidden");
	            that.rightdownoption.series[0].data = that.arrayDepObjTotal;
	            that.myChartrightDown.clear();
	            that.myChartrightDown.setOption(that.rightdownoption);
	        }
	        that.myChartrightDown.hideLoading();
	    },

	    rightDownPictureShowAll() {
	        //var options = $("#level2 option:selected");
	        //var depart = options.text();
	        that.rightdownoptionall.title.text = DEPTNAME + ' - 二级对象类分布图';
	        var dataString = that.arrayDepObj.join('');
	        if (dataString=='0'*35){
	            $("#right_down").addClass("hidden");
	            $("#right_downall").addClass("hidden");
	            $("#no_objdata").removeClass("hidden");
	        }else{
                that.rightdownoptionall.series[0].data = that.arrayDepObj;
                that.rightdownoptionall.xAxis.data = that.arrayDepObjName;
	            // that.rightdownoption.legend.data = that.arrayObjLegend.slice(0,5);
	            that.myChartrightDown.clear();
	            that.myChartrightDown.setOption(that.rightdownoptionall);
	        }
	        that.myChartrightDown.hideLoading();
	    },
	    pictureShow() {
	        that.leftPictureShow();
	        that.rightPictureShow();
	    },
	    //加载主页饼图的子节点数据
	    setPieData(p_nodeId,data_collection,legend_collection){
	        var data;
	        if(that.leftDownCatalogTreeData[p_nodeId]==undefined){
	            //没有查询过，去查
	            var aJson = {};
	            getDataByGet1("/index_manager/getResById?nodeId="+p_nodeId,aJson,dataStr=>{
	        		data = dataStr;
	                that.leftDownCatalogTreeData[p_nodeId] = data;
	        	});

	        }else{
	            //查过了，直接赋值
	            data = that.leftDownCatalogTreeData[p_nodeId]
	        }

	        for (var i = 0; i < data.length; i++) {
	            if (data[i].pnodeId == p_nodeId) {
	                var str = data[i].nodeName + "";
	                var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
	                var name = str.substr(0, str.indexOf("("));
	                if (num != 0) {
	                    var tmp = {
	                        value: num,
	                        name: name,
	                        nodeid: data[i].nodeId,
	                    }
	                    data_collection.push(tmp);
	                    legend_collection.push(name);
	                }
	            }
	        }
	    },
	    leftPictureClick(params, myChartleft) {
	        if (params.componentType === 'series') {
	            that.showLoading(myChartleft);
	            var p_nodeId = that.leftoption.series[0].data[params.dataIndex].nodeid;
	            that.firstPieTreeSecondData = [];
	            that.firstPieTreeSecondLegend = [];
	            that.setPieData(p_nodeId,that.firstPieTreeSecondData,that.firstPieTreeSecondLegend);
	            //数据量不为0，可继续点击查看  否则返回第一个饼图
	            if (that.firstPieTreeSecondData.length > 0) {
	                that.leftoption.title.text = that.leftoption.series[0].data[params.dataIndex].name;
                    quickSort(that.firstPieTreeSecondData,0,that.firstPieTreeSecondData.length-1)
                    var legend = [];
                    var length = that.firstPieTreeSecondData.length<5?that.firstPieTreeSecondData.length:5;
                    for (var i = 0; i < length; i++) {
                        legend.push(that.firstPieTreeSecondData[i].name);
                    }
                    that.leftoption.series[0].data = that.firstPieTreeSecondData;
                    that.leftoption.legend.data = legend;
	                myChartleft.setOption(that.leftoption);
	            } else {
	                //that.leftoption.title.text = that.leftoption.series[0].data[params.dataIndex].name;
	                that.leftoption.title.text = '水利信息目录资源分布图';
	                that.leftoption.series[0].data = that.firstPieTreeDataAll;
	                that.leftoption.legend.data = that.firstPieTreeLegendAll.slice(0,5);
	                myChartleft.setOption(that.leftoption);
	            }
	            myChartleft.hideLoading();
	            params.stopPropagation();
	        }
	    },
	    leftDownPictureClick(params, myChartleftDown) {
	        if (params.componentType === 'series') {
	            that.showLoading(myChartleftDown);
	            var nodeId = $("#level2").val();
	            var options = $("#level2 option:selected");
	            var depart = options.text();
	            var curIndex = that.arrayNodeId.indexOf(Number(nodeId));
	            var p_nodeId = that.leftdownoption.series[0].data[params.dataIndex].nodeid;
	            that.firstPieTreeSecondDataDown = [];
	            that.firstPieTreeSecondLegendDown = [];
	            that.setPieData(p_nodeId,that.firstPieTreeSecondDataDown,that.firstPieTreeSecondLegendDown);

	            //数据量不为0，可继续点击查看  否则返回第一个饼图
	            if (that.firstPieTreeSecondDataDown.length > 0) {
	                that.leftdownoption.title.text = that.leftdownoption.series[0].data[params.dataIndex].name;
	                that.leftdownoption.series[0].data = that.firstPieTreeSecondDataDown;
	                that.leftdownoption.legend.data = that.firstPieTreeSecondLegendDown.slice(0,5);
	                // that.leftdownoption.series[0].data = that.secondPieTreeSecondData;
	                // that.leftdownoption.legend.data = that.secondPieTreeSecondLegend.slice(0,5);
	                myChartleftDown.setOption(that.leftdownoption);
	            } else {
	                that.leftdownoption.title.text = depart + '目录资源分布图';
	                that.leftdownoption.series[0].data = that.arrayData[curIndex];
	                that.leftdownoption.legend.data = that.arrayLegend[curIndex].slice(0,5)   ;
	                // that.leftdownoption.title.text = that.leftdownoption.series[0].data[params.dataIndex].name;
	                // that.leftdownoption.series[0].data = that.secondPieTreeData;
	                // that.leftdownoption.legend.data = that.secondPieTreeLegend.slice(0,5);
	                myChartleftDown.setOption(that.leftdownoption);
	            }
	            myChartleftDown.hideLoading();
	            params.stopPropagation();
	        }
	    },
	    findusermessage() {
	        $(function() {
	            var data = "{}";
	            var content = { "dataJson": data };
	            $.ajax({
	                type: "GET",
	                url: '/showUserMessage',
	                data: content,
	                // dataType:'json',
	                success: function(msg) {
	                    // toastr.warning(msg)
	                    $("#welcomeDocument").append(msg);
	                },
	                error: function(msg) {
	                    toastr.error("请求失败");
	                }
	            });
	        });
	    },


        //筛选条件刷新按钮
	    refreshChart(){
	        that.showLoading(that.myChartAllData);
	     //   that.showLoading(that.myChartRightData);
	        //datacat
	        var arr = $("#filter-box div label input")
	        var datacat = "";
	        $.each(arr,function(i,item){
	            if(item.checked){
	                datacat = datacat + item.value +",";
	            }
	        })
	        var re1 = $("#re-sel-1").val(); //业务类型
	        var re2 = $("#re-sel-2").val(); //行政类型
	        var obj = $("#obj-sel-lev2").val(); //对象类
	        if($("#obj-sel-lev1").val()=="*")obj="*";
	        // var data = {
	        //     "datacat":datacat.slice(0,datacat.length-1),
	        //     "re1":re1,
	        //     "re2":re2,
	        //     "obj":obj,
	        // }
	        getDataByPost("/index_manager/queryFilterNum",{
	            "datacat":datacat.slice(0,datacat.length-1),
	            "re1":re1,
	            "re2":re2,
	            "obj":obj,
	        },res =>{
	        	var dataStr = res.data
	            var data0 = [];
	            var data1 = [];
	            var data2 = [];
	            var data3 = [];
	            //全国汇交情况图
	            for (var i = 0; i < that.arrayNodeId.length; i++) {
	                data0.push(dataStr[0][that.arrayNodeId[i]]);
	            }
	            //水利部汇交情况图
	            for (var i = 0; i < that.arrayNodeId1.length; i++) {
	                data1.push(dataStr[1][that.arrayNodeId1[i]]);
	            }
	            for (var i = 0; i < that.arrayNodeId.length; i++) {
	                data2.push(dataStr[2][that.arrayNodeId[i]]);
	            }
	            //水利部汇交情况图
	            for (var i = 0; i < that.arrayNodeId1.length; i++) {
	                data3.push(dataStr[3][that.arrayNodeId1[i]]);
	            }
	            that.AllDataoption.series[0].data = data0;
	            that.rightBaroption.series[0].data = data1;
	            that.AllDataoption.series[1].data = data2;
	            that.rightBaroption.series[1].data = data3;
	            that.myChartAllData.setOption(that.AllDataoption);
	  //          that.myChartRightData.setOption(that.rightBaroption);
	            that.myChartAllData.hideLoading();
	   //         that.myChartRightData.hideLoading();
	        })
	    },

	    reSet(){
	        that.myChartAllData.showLoading();
	  //      that.myChartRightData.showLoading();
	        that.AllDataoption.series[0].data = that.arrayAllData.slice(0, 40);
	        that.AllDataoption.series[1].data = that.allDataObj;
	        that.rightBaroption.series[0].data = that.arrayRightBar;
	        that.rightBaroption.series[1].data = that.rightBarObj;
            that.myChartAllData.clear();
   //         that.myChartRightData.clear();
	        that.myChartAllData.setOption(that.AllDataoption);
	    //    that.myChartRightData.setOption(that.rightBaroption);
	        that.myChartAllData.hideLoading();
	 //       that.myChartRightData.hideLoading();
	    },
        hide0Nodes(zTree, zTreeNodeParent = null,depth=0) {
            if (zTreeNodeParent == null) {
                zTreeNodeParent = zTree.getNodes()[0]
            }
            that.hide0NodeByRecursion(zTree, zTreeNodeParent,depth)
        },
        hide0NodeByRecursion(zTree, zTreeNode,depth) {
            const nodeNum = that.getNodeNum(zTreeNode.nodeName)
            if (nodeNum === 0 && depth>1) {
                zTree.hideNode(zTreeNode)
                return;
            }
            if (zTreeNode.children !== undefined) {
                zTreeNode.children.forEach(child => {
                    that.hide0NodeByRecursion(zTree, child,depth+1)
                })
            }
        },
        getNodeNum(nodeName) {
            const st = nodeName.indexOf("(") + 1
            const len = nodeName.indexOf(")") - st
            return parseInt(nodeName.substr(st, len))
        },
        //获取西藏的部门以及数量，后面如果需要复用类似的函数，只要将这个请求的节点设置为变量即可
        getListChoseDep(dataStr, pnodeId){
	        var listChoseObjOrResDep=[];
            for (var i = 0; i < dataStr.length; i++) {
                if (dataStr[i].pnodeId == pnodeId) {
                    var str = dataStr[i].nodeName + "";
                    var num = parseInt(str.substr((str.indexOf("(") + 1), (str.indexOf(")") - 1)));
                    var name = str.substr(0, str.indexOf("("));
                    var data = {
                        value: num,
                        name: name,
                    }
                    listChoseObjOrResDep.push(data);
                }
            }
            return listChoseObjOrResDep;
        },

    },
})