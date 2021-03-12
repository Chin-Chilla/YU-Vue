var LogList = new Vue({
    el: "#vue",
    data: {
        type:sessionStorage.getItem("logType")||"info",
        list:[]
    },
    mounted() {
        this.getData();
    },
    methods:{
        getData(){
            getDataByGet("/log/list_log?type="+this.type, {}, function(res) {
                if(res.code==200){
                    LogList.list = res.data;
                }else{
                    toastr.error(res.msg);
                }
            })  
        },
        changeType(){
            sessionStorage.setItem("logType",this.type);
            this.getData();
        },
        goDetail(path){
            sessionStorage.setItem("path",path);
            MainPage.setContent('system/browselog/log_detail.html','LogList')
        }
    }
})