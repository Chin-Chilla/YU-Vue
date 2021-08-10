var that;
var login = new Vue({
    el: '#vue',
    data: {
        username:'',
        password:''
    },
    mounted() {
        that = this;
        $("#vue").bind('keydown',function(e){
            if(e.keyCode==13){
                login.login();
            }
        })
    },
    methods: {
        login(){
            //验证
            if(login.username == ""){
                toastr.warning("请填写账号！");
            }else if(login.password == ""){
                toastr.warning("请填写密码！");
            }
            else {
                var data = {
                    username: login.username,
                    password: hex_md5(login.password)
                };
                getDataByPost("/user/login",data,function(res){
                    if (res.msg == "SUCCESS") {
                        toastr.success("登录成功!");
                        console.log(res.data);
                        sessionStorage.setItem("authCode",res.data.authcode)
                        sessionStorage.setItem("role",res.data.roles.join(","));
                        sessionStorage.setItem("loginName",res.data.loginName)
                        sessionStorage.setItem("userName",res.data.username)
                        setTimeout(function(){
                            window.location.href="/YU/html/browse/index/index.html"
                        },1500)
                    }else{
                        toastr.warning(res.msg);
                    }
                })
            }
        }
    }
})