var LogDetail = new Vue({
    el: "#vue",
    data: {
        content:'',
        path:''
    },
    mounted() {
        this.path = sessionStorage.getItem("path");
        getDataByGet("/log/get_detail?path="+this.path,{},res=>{
            if(res.code==200){
                 LogDetail.content = res.data;
            }
        })
    },
    methods:{
        back(){
            MainPage.setContent('system/browselog/log_list.html','LogList')
        }
    }
})