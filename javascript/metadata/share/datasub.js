//# sourceURL=request.js

var that;
var app = new Vue({
    el:"#vue",
    data:{
        allListDataReq:[],
        isCheckedId:[],
        pageSize:5,//分页数目
        pageNum:1,
        totalNum:0,
        status_show:"",
        req_loc:"",
        isReq:'1',
        mdid:[],//存放多个数据的mdFileId
        FileId:"",
        name:"",
        list0:[],//未申请数据
        list1:[],//已申请数据
        forStart:true,//判断是否是第一次进行当前页的加载，来决定是否清空tbody的子元素
        newListNumReq:0,
        isAllChecked:false,//判断是否点击过全选按钮，防止先全选然后进行局部取消的操作，这样会使伪全选失效

    },
    mounted(){
        that = this;
        //第一次请求获取当前页并且展示
        getDataByPost('/user/getSubListByStatus',{
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            status:that.isReq
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
            if(that.forStart || isCilcked){
                //第一次加载进行tbody子元素的清空,并且初始化
                $("#tbody").empty();
                //console.log("走了empty")

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
                }

                var onlyId = ''+that.pageNum+list[i].mdFileId;//tr的id
                var checkboxId = 'checkbox'+list[i].status+list[i].mdFileId+list[i].mdName;
                //var checkboxName='checkbox'+list[i].mdName;//checkbox的id，方便后台获取批量处理的dom
                //顺序是元数据名称 订阅时间 状态
                $("#tbody").append("" + "<tr>" + "<td>" + "<input type='checkbox' name='single' onclick=app.single('"+list[i].mdName+"')>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+list[i].mdName+ "</td>" +
                    "<td>" + "<a style='cursor: pointer;'' onclick=\"keySearch.detail('"+list[i].mdName+ "','"+list[i].loc+"')\">"+app.renderTime(list[i].createTime)+ "</a>" + "</td>" +
                    "<td><el-button type=\"success\" size=\"mini\">"+that.status_show+"</el-button></td>" +
                    "<td><input type='button' value='取消'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.unsubscribe('"+list[i].mdFileId+"')\"></td>"+
                    "<td><input type='button' value='申请'' class='btn btn-primary col-lg-2' style='width:80px;height: 35px;margin: 0px 5px 0px 5px' onclick=\"app.showModal('"+list[i].status+","+list[i].mdFileId+","+list[i].mdName+"')\"></td></tr>"
                )
                $(":checkbox[name='single']")[that.newListNumReq-1].checked=that.isAllChecked;
                $(":checkbox[name='single']")[that.newListNumReq-1].id=checkboxId;
                $("#tbody").children("tr")[that.newListNumReq-1].id=onlyId;
                that.isCheckedId[i]=onlyId;
            }

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
        //申请信息模态框
        showModal: function(mdId){
            //console.log(mdId.substr(0,1));
            if(mdId.substr(0,1)==2)
            {
                toastr.error("该数据已申请！")
            }
            else{
                $("#ReqModal").modal("show");

                getDataByGet1("/user/getCurrentUserInfo", "", function (res) {
                    var id = res.data;
                    getDataByGet1("/user/getUserInfo/" + id, "", function (res) {
                        $("#proposer").val(res.data.loginName);
                        $("#org").val(res.data.orgname);
                        $("#contact").val(res.data.mobileNumber);

                    })
                })
                console.log(mdId);
                this.FileId = mdId.substr(2, 32);
                this.name = mdId.substr(35);
            }

        },
        //申请信息模态框
        showCheckedModal: function(){
            var j=0;
            for(var i=0;i<($(":checkbox:checked").length);i++){
                //console.log($(":checkbox:checked")[i].id.substr(8,1));
                if($(":checkbox:checked")[i].id.substr(8,1)==2){
                    //toastr.error("存在已申请数据，请勿重复申请！")
                    j=1;
                }
            }
            if(j==1){
                toastr.error("存在已申请数据，请勿重复申请！")
            }else{
            $("#ReqCheckedModal").modal("show");
            getDataByGet1("/user/getCurrentUserInfo","",function (res){
                var id=res.data;
                getDataByGet1("/user/getUserInfo/" + id, "", function(res) {
                    $("#proposer1").val(res.data.loginName);
                    $("#org1").val(res.data.orgname);
                    $("#contact1").val(res.data.mobileNumber);

                })
            })}
        },
        changeStatus(id){
                    //console.log(id)
                    getDataByPost('/user/passSubMeta', {
                        id: id
                    }, res => {
                         app.backMessage(res);
                    });
                },

        orderChecked(orderId){
            if($(":checkbox:checked").length){
                    if($(":checkbox[name='allChecked']")[0].checked){
                        $.each($(that.allListData),function (index,element) {
                            app.order(element.mdFileID,element.mdName,orderId);
                        })

                    }else{
                        $.each($(":checkbox:checked"),function (index,element) {
                            // console.log(element.id);
                            //  console.log(element.id.substr(9,32));
                            //  console.log(element.id.substr(41));
                            app.order(element.id.substr(9,32),element.id.substr(41),orderId);


                        })
                }
            }else{
                swal("无选中数据！", "", "error");
            }
        },
        order(id,name,orderId){
             //console.log(id);
             //console.log(name);
                getDataByPost('/user/order',{
                    mdFileId:id,
                    mdName:name,
                    orderId:orderId
                },res=>{
                    if(res.code==200)
                    app.changeStatus(id);
                })

        },
        //申请数据
        requestChecked: function() {
            var proposer = $("#proposer1").val();
            var org = $("#org1").val();
            var contact = $("#contact1").val();
            var description = $("#description1").val();
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
                    mdFileId=this.FileId;
                    mdName=this.name;
                    app.order(mdFileId,mdName,res.data);
                } else {
                    toastr.error(res.msg);
                }
            })
        },
        allChecked(){
            that.isAllChecked = $(":checkbox[name='allChecked']")[0].checked;//点击时同步状态，克表示取消了全选和全选，不用按钮来实现这个操作的原因时，这个复选框的状态可以表示是否被全选
            for(i=0;i<$(":checkbox[name='single']").length;i++){
                $(":checkbox[name='single']")[i].checked=$(":checkbox[name='allChecked']")[0].checked;
            }
        },
        single(){
            // var singleStatus = Number($(":checkbox[name='single']").id.substr(8,1));
            this.mdid=[];

            //绑定单击事件，进行check数量统计
            singleCount=0;
            for(i=0;i<$(":checkbox[name='single']").length;i++){
                // mdid[i]=that.allListDataReq[i].mdFileID;
                if($(":checkbox[name='single']")[i].checked){
                    singleCount++;
                    //this.mdid.push(id);
                    this.mdid.push(that.isCheckedId[i]);
                }
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
                    closeOnConfirm: true
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
                getDataByPost('/user/getSubListByStatus',{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
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
        renderTime(date) {
            var dates = new Date(date).toJSON();
            return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }

    }
})