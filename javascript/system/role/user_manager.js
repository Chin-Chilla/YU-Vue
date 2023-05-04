var that;
var UserPage = new Vue({
    el: "#vue",
    data: {
        pageSize: 10, //分页大小
        totalCount: '', //用户总数
        userList: [], //用户列表
        usernameValid: '', //用户名是否存在
        checkedUserId: '', //选中的用户ID
        roleList:[],//角色列表
        //选中的角色
        checkedUserId: '', //ID
        checkedUsername:'',//姓名
        checkedLoginname:'',//用户名
        checkedRole:'',//角色
        //编辑角色信息
        key:'',
        editRoleId:'',
        editRoleCode:'',
        editRoleName:'',
        editRoleDesc:'',
        editRoleWork:''
    },
    mounted() {
        that = this;
        this.initPage();
        //点击某行任意位置触发check
        $("#sample_1").on("click", "tr", function () {
            var input = $(this).find("input");
            //toastr.warning($(input).prop("checked"));
            if (!$(input).prop("checked")) {
                $(input).prop("checked",true);
            }else{
                $(input).prop("checked",false);
            }
        });
        //点击某行任意位置触发check
        $("#modaltbody2").on("click", "tr", function () {
            var input = $(this).find("input");
            //toastr.warning($(input).prop("checked"));
            if (!$(input).prop("checked")) {
                $(input).prop("checked",true);
            }else{
                $(input).prop("checked",false);
            }
        });
         //点击某行任意位置触发check
        $("#sample_3").on("click", "tr", function () {
            var input = $(this).find("input");
            //toastr.warning($(input).prop("checked"));
            if (!$(input).prop("checked")) {
                $(input).prop("checked",true);
            }else{
                $(input).prop("checked",false);
            }
        });
    },
    methods: {
    	initPage(){
    		getDataByPost("/user/getUserList", {
                pageSize: that.pageSize,
                pageNum: 1
            }, function(res) {
                that.totalCount = res.data.total;
                that.userList = res.data.list;
                that.renderPagination();
            })  
    	},
        //渲染分页
        renderPagination() {
            $("#pagination").empty();
            $("#pagination").Paging({
                pagesize: that.pageSize,
                count: that.totalCount,
                toolbar: true,
                callback: function(page, size, count) {
                    that.changePage(page, size);
                }
            });
        },
        //翻页
        changePage(nowPage, size) {
            getDataByPost("/user/getUserList", {
                pageSize: size,
                pageNum: nowPage
            }, function(res) {
                that.totalCount = res.data.total;
                that.userList = res.data.list;
            })
        }
        /*******************新增用户*****************/
        ,
        addUser: function() {
                if (UserPage.checkrealname("typeahead_example_modal_2", "mydivusername") && UserPage.usernameValid && UserPage.checkpersCode("typeahead_example_modal_3", "mydivpersCode") &&
                    UserPage.checkorgName("typeahead_example_modal_4", "mydivorgName") && UserPage.checkorgCode("typeahead_example_modal_5", "mydivorgCode") && UserPage.checkdepName("typeahead_example_modal_6", "mydivdepName") &&
                    UserPage.checkdepCode("typeahead_example_modal_7", "mydivdepCode") && UserPage.checktelephone("typeahead_example_modal_8", "mydivtelephone") && UserPage.checkuserpassword("typeahead_example_modal_9", "mydivuserpassword") &&
                    UserPage.checkpwdagin("typeahead_example_modal_10", "mydivpwdagin", "typeahead_example_modal_9")) {

                    var tm1 = $("#typeahead_example_modal_1").val(); //获取新增模态框输入框的值
                    var tm2 = $("#typeahead_example_modal_2").val();
                    var tm3 = $("#typeahead_example_modal_3").val();
                    var tm4 = $("#typeahead_example_modal_4").val();
                    var tm5 = $("#typeahead_example_modal_5").val();
                    var tm6 = $("#typeahead_example_modal_6").val();
                    var tm7 = $("#typeahead_example_modal_7").val();
                    var tm8 = $("#typeahead_example_modal_8").val();
                    var tm9 = hex_md5($("#typeahead_example_modal_9").val());

                    getDataByPost("/user/addUser", {
                        loginName: tm1,
                        username: tm2,
                        perscode: tm3,
                        orgname: tm4,
                        orgcode: tm5,
                        depname: tm6,
                        depcode: tm7,
                        mobileNumber: tm8,
                        password: tm9
                    }, function(res) {
                        if (res.msg == "SUCCESS") {
                            $("#exampleModal").modal('hide');
                            toastr.success("新增用户成功！")
                            that.initPage();
                        } else {
                            toastr.error(res.msg)
                        }

                    }, function(err) {
                        toastr.error("新增用户失败！请重试")
                    })
                }

            }
            /***********判断是否选中用户信息*****************/
            ,
        checkUserId: function(tableId) {
                var table = document.getElementById(tableId);
                var ischeck = $("#" + tableId + " input[name='isChecked']")
                var a = 0;
                for (i = 0; i < ischeck.length; i++) {
                    if (ischeck[i].checked == true) {
                        a = a + 1;
                        var node = ischeck[i].parentNode.nextElementSibling;
                        that.checkedUserId = node.innerHTML;
                        var loginNameCode = node.nextElementSibling
                        that.checkedLoginname = loginNameCode.innerHTML;
                        that.checkedUsername = loginNameCode.nextElementSibling.innerHTML;
                        that.checkedRole = node.parentNode.lastChild.innerHTML;
                    }
                }
                if (a == 0) {
                    toastr.warning("请选择要操作的用户！");
                    return false;
                }else{
					return true;
                }
            }
            /***********判断是否选中被修改用户对象并显示被选中用户信息*****************/
            ,
        alertCheckbox: function() {
                if(that.checkUserId("sample_1")){
                	getDataByGet1("/user/getUserInfo/" + that.checkedUserId, "", function(res) {
	                    $("#example_modal_1").val(res.data.loginName);
	                    $("#example_modal_2").val(res.data.username);
	                    $("#example_modal_3").val(res.data.perscode);
	                    $("#example_modal_4").val(res.data.orgname);
	                    $("#example_modal_5").val(res.data.orgcode);
	                    $("#example_modal_6").val(res.data.depname);
	                    $("#example_modal_7").val(res.data.depcode);
	                    $("#example_modal_8").val(res.data.mobileNumber);
	                    that.key = res.data.key
	                    $("#exampleModal1").modal('show');
	                }, function(err) {
	                    toastr.error("获取用户信息失败！")
	                })
                }
            }
            /***************删除用户信息****************/
            ,
        deleteUser() {
            if(that.checkUserId("sample_1")){
            	swal({
                    title: "确定删除选中的记录?",
                    text: "删除之后无法恢复该数据!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false
                },
                function() {
                	getDataByGet1("/user/deleteUser/" + that.checkedUserId, "", function(res) {
		                swal("提示信息", "删除成功！", "success");
		                that.initPage();
		            }, function(err) {
		            	swal("提示信息", "删除用户失败！请重试","error");
		            })
                }
            )
            }
        }
        /***********权限设置初始化*****************/
	    , setRoleCheckbox: function () {
	    	if(that.checkUserId("sample_1")){
	    		getDataByGet('/user/getRoleList','',function(res){
		    		if(res.msg=="SUCCESS"){
		    			that.roleList = res.data;
		    			$("#exampleModal2").modal('show');
		    		}else{
		    			toastr.error(res.msg);
		    		}
		    	})
	    	}

	    }
         /***********显示角色管理框*****************/
	    , manageRole: function () {
	    	getDataByGet('/user/getRoleList','',function(res){
	    		if(res.msg=="SUCCESS"){
	    			that.roleList = res.data;
					$("#exampleModal3").modal('show');
	    		}else{
	    			toastr.error(res.msg);
	    		}
	    	})
            
        }
        /***************修改用户信息****************/
        ,
        editUser: function() {
                var table = document.getElementById("sample_1");
                var ischeck = document.getElementsByName("isChecked");
                if (UserPage.checkrealname("example_modal_2", "editrealname") &&
                    UserPage.checkpersCode("example_modal_3", "editpersCode") &&
                    UserPage.checkorgName("example_modal_4", "editorgName") &&
                    UserPage.checkdepCode("example_modal_5", "editdepCode") &&
                    UserPage.checkdepName("example_modal_6", "editdepName") &&
                    UserPage.checkdepCode("example_modal_7", "editdepCode") &&
                    UserPage.checktelephone("example_modal_8", "edittelephone")) {
					var mypassword = document.getElementById("example_modal_9").value;
                	if(mypassword !=""){
                		if(!UserPage.checkuserpassword("example_modal_9", "eidtpassword")&&!UserPage.checkpwdagin("example_modal_10", "editpwdagin", "example_modal_9")){
                			return;
                		}
                	}
                    for (i = 0; i < ischeck.length; i++) {
                        if (ischeck[i].checked == true) {
                            a = true;
                            var node = ischeck[i].parentNode.nextElementSibling;
                            var id = node.innerHTML;
                            var tm1 = $("#example_modal_1").val();
                            var tm2 = $("#example_modal_2").val();
                            var tm3 = $("#example_modal_3").val();
                            var tm4 = $("#example_modal_4").val();
                            var tm5 = $("#example_modal_5").val();
                            var tm6 = $("#example_modal_6").val();
                            var tm7 = $("#example_modal_7").val();
                            var tm8 = $("#example_modal_8").val();
                            var tm9 = $("#example_modal_9").val();
                            getDataByPost("/user/updateUser", {
                                loginName: tm1,
                                username: tm2,
                                perscode: tm3,
                                orgname: tm4,
                                orgcode: tm5,
                                depname: tm6,
                                depcode: tm7,
                                mobileNumber: tm8,
                                password: hex_md5(tm9),
                                key:that.key,
                                id: id
                            }, function(res) {
                                if (res.msg == "SUCCESS") {
                                    $("#exampleModal1").modal('hide');
                                    toastr.success("修改成功！")
                                } else {
                                    toastr.error("编辑用户失败！请重试")
                                }
                            }, function(err) {
                                toastr.error("编辑用户失败！请重试")
                            })
                        }
                    }
                }
            }
            /***************检查真实姓名*****************/
            ,
        checkrealname: function(username, mydivusername) {
                var myrealname = document.getElementById(username).value;
                var myDivrealname = document.getElementById(mydivusername);
                reg = /^[\u4E00-\u9FA5]{2,4}$/;
                isok = reg.test(myrealname);
                if (myrealname == "") {
                    myDivrealname.innerHTML = "<p style='color: red'>×真实姓名不能为空！</p>";
                    return false;
                } else if (!isok) {
                    myDivrealname.innerHTML = "<p style='color: red'>×请输入正确姓名格式！</p>";
                    return false;
                } else {
                    myDivrealname.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /***************检查编辑用户名***************/
            ,
        checkeditname: function(user_name, myDiv_username) {
                var myname = document.getElementById(user_name).value;
                //  toastr.warning(myname+name);
                var myDivname = document.getElementById(myDiv_username);
                UserPage.findname(user_name, myDiv_username);
            }
            /*****************检查用户名*****************/
            ,
        checkname: function(login_name, mydivlogin_name) {
                var myname = document.getElementById(login_name).value;
                var myDivname = document.getElementById(mydivlogin_name);
                UserPage.findname(login_name, mydivlogin_name);
            }
            /**********判断用户名是否已被注册************/
            ,
        findname: function(login_name, mydivlogin_name) {
                var myname = document.getElementById(login_name).value;
                var myDivname = document.getElementById(mydivlogin_name);
                getDataByGet("/user/checkUsername/" + myname, {}, function(res) {
                    if (res.msg == "SUCCESS") {
                        UserPage.usernameValid = res.data; //取出aa中的value
                        if (UserPage.usernameValid == false) {
                            myDivname.innerHTML = "<p style='color: red' >×该用户名已被使用!</p>";
                        } else {
                            if (myname == "") {
                                myDivname.innerHTML = "<p style='color: red'>×用户名不能为空!</p>";
                                return false;
                            }
                            for (var i = 0; i < myname.length; i++) {
                                var text = myname.charAt(i);
                                if (!(text <= 9 && text >= 0) && !(text >= 'a' && text <= 'z') && !(text >= 'A' && text <= 'Z') && text != "_") {
                                    myDivname.innerHTML = "<p style='color: red'>×用户名的格式不正确！</p>";
                                    break;
                                }
                            }
                            if (i >= myname.length) {
                                myDivname.innerHTML = "<p style='color: green'>√</p>";
                            }
                        }
                    }
                })
            }
            /*****************检查用户身份编码*****************/
            ,
        checkpersCode: function(persCode, mydivpersCode) {
                var mypersCode = document.getElementById(persCode).value;
                var myDivpersCode = document.getElementById(mydivpersCode);
                if (mypersCode == "") {
                    myDivpersCode.innerHTML = "<p style='color: red'>×身份编码不能为空!</p>";
                    return false;
                }
                for (var i = 0; i < mypersCode.length; i++) {
                    var text = mypersCode.charAt(i);
                    if (!(text <= 9 && text >= 0)) {
                        myDivpersCode.innerHTML = "<p style='color: red'>×身份编码格式不正确！</p>";
                        break;
                    }
                }
                if (i >= mypersCode.length) {
                    myDivpersCode.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /*****************检查机构编码*****************/
            ,
        checkorgCode: function(orgCode, mydivorgCode) {
                var myorgCode = document.getElementById(orgCode).value;
                var myDivorgCode = document.getElementById(mydivorgCode)
                if (myorgCode == "") {
                    myDivorgCode.innerHTML = "<p style='color: red'>×机构编码不能为空!</p>";
                    return false;
                }
                for (var i = 0; i < myorgCode.length; i++) {
                    var text = myorgCode.charAt(i);
                    if (!(text <= 15 && text >= 0)) {
                        myDivorgCode.innerHTML = "<p style='color: red'>×机构编码格式不正确！</p>";
                        break;
                    }
                }
                if (i >= myorgCode.length) {
                    myDivorgCode.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /***************检查机构名称*****************/
            ,
        checkorgName: function(orgName, divorgName) {
                var myorgName = document.getElementById(orgName).value;
                var myDivorgName = document.getElementById(divorgName);
                reg = /^[\u4E00-\u9FA5]{2,4}$/;
                isok = reg.test(myorgName);
                if (myorgName == "") {
                    myDivorgName.innerHTML = "<p style='color: red'>× 用户单位不能为空！</p>";
                    return false;
                } else {
                    myDivorgName.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /******************检查单位******************/
            //create by chen
            ,
        checkdepartment: function(department, divdepartment) {
                var mydepartment = document.getElementById(department, divdepartment).value;
                var myDivdepartment = document.getElementById(divdepartment);
                if (mydepartment == "") {
                    myDivdepartment.innerHTML = "<p style='color: red'>× 单位名称不能为空！</p>";
                    return false;
                } else {
                    myDivdepartment.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /******************检查地址******************/
            ,
        checkaddress: function(address, divaddress) {
                var myaddress = document.getElementById(address, divaddress).value;
                var myDivaddress = document.getElementById(divaddress);
                if (myaddress == "") {
                    myDivaddress.innerHTML = "<p style='color: red'>× 联系地址不能为空！</p>";
                    return false;
                } else {
                    myDivaddress.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }

            /*****************检查部门编码*****************/
            ,
        checkdepCode: function(depCode, mydivdepCode) {
                var mydepCode = document.getElementById(depCode).value;
                var myDivdepCode = document.getElementById(mydivdepCode);
                if (mydepCode == "") {
                    myDivdepCode.innerHTML = "<p style='color: red'>×机构编码不能为空!</p>";
                    return false;
                }
                for (var i = 0; i < mydepCode.length; i++) {
                    var text = mydepCode.charAt(i);
                    if (!(text <= 9 && text >= 0)) {
                        myDivdepCode.innerHTML = "<p style='color: red'>×机构编码格式不正确！</p>";
                        break;
                    }
                }
                if (i >= mydepCode.length) {
                    myDivdepCode.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /***************检查部门名称*****************/
            ,
        checkdepName: function(depName, mydivdepName) {
                var mydepName = document.getElementById(depName).value;
                var myDivdepName = document.getElementById(mydivdepName);
                reg = /^[\u4E00-\u9FA5]{2,4}$/;
                isok = reg.test(mydepName);
                if (mydepName == "") {
                    myDivdepName.innerHTML = "<p style='color: red'>× 用户单位不能为空！</p>";
                    return false;
                } else {
                    myDivdepName.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }

            /****************检查电话********************/
            ,
        checktelephone: function(telephone, mydivtelephone) {
                var mytelephone = document.getElementById(telephone).value;
                var myDivtelephone = document.getElementById(mydivtelephone);
                // reg = /^0?1[3|4|5|8][0-9]\d{8}$/; //\d表示数字,*表示匹配多个数字
                // isok = reg.test(mytelephone);
                // reg1 = /^0[\d]{2,3}-[\d]{7,8}$/; //\d表示数字,*表示匹配多个数字
                // isok1 = reg1.test(mytelephone);
                if (mytelephone == "") {
                    myDivtelephone.innerHTML = "<p style='color: red'>× 联系方式不能为空！</p>";
                    return false;
                }
                // else if (!(isok || isok1)) {
                //     myDivtelephone.innerHTML = "<font color='red'>× 请输入正确的电话格式！</font>";
                //     return false;
                // }

                // else {
                //     myDivtelephone.innerHTML = "<font color='green'>√</font>";
                //     return true;
                // }
                for (var i = 0; i < mytelephone.length; i++) {
                    var text = mytelephone.charAt(i);
                    if (!(text <= 9 && text >= 0)) {
                        myDivtelephone.innerHTML = "<p style='color: red'>×联系方式格式不正确！</p>";
                        break;
                    }
                }
                if (i >= mytelephone.length) {
                    myDivtelephone.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /****************检查传真*******************/
            ,
        checkfixedtelephone: function(fixedtelephone, divfixedtelephone) {
                var myfixedtelephone = document.getElementById(fixedtelephone).value;
                var myDivfixedtelephone = document.getElementById(divfixedtelephone);
                reg = /^0[\d]{2,3}-[\d]{7,8}$/; //\d表示数字,*表示匹配多个数字
                isok = reg.test(myfixedtelephone);
                if (myfixedtelephone == "") {
                    myDivfixedtelephone.innerHTML = "<p style='color: red'>× 传真不能为空！</p>";
                    return false;
                } else if (!isok) {
                    myDivfixedtelephone.innerHTML = "<p style='color: red'>× 请输入正确传真格式！</p>";
                    return false;
                } else {
                    myDivfixedtelephone.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /**************检查邮箱**********************/
            ,
        checkemail: function(email, divemail) {
                var myemail = document.getElementById(email).value;
                var myDivemail = document.getElementById(divemail);
                var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                var isok = reg.test(myemail);
                if (myemail == "") {
                    myDivemail.innerHTML = "<p style='color: red'>× 邮箱不能为空！</p>";
                    return false;
                } else if (!isok) {
                    myDivemail.innerHTML = "<p style='color: red'>× 请输入正确邮箱格式！</p>";
                    return false;
                } else {
                    myDivemail.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /***************检查密码*********************/
            ,
        checkuserpassword: function(userpassword, mydivuserpassword) {
                var mypassword = document.getElementById(userpassword).value;
                var myDivpassword = document.getElementById(mydivuserpassword);
                if (mypassword == "") {
                    myDivpassword.innerHTML = "<p style='color: red'>× 密码不能为空!</p>";
                    return false;
                } else if (mypassword.length < 6) {
                    myDivpassword.innerHTML = "<p style='color: red'>× 密码至少应为六位!</p>";
                    return false;
                } else {
                    myDivpassword.innerHTML = "<p style='color: green'>√</p>";
                    return true;
                }
            }
            /****************检查确认密码****************/
            ,
        checkpwdagin: function(pwdagin, mydivpwdagin, password) {
            var myispassword = document.getElementById(pwdagin).value;
            var mypassword = document.getElementById(password).value;
            var myDivispassword = document.getElementById(mydivpwdagin);
            if (myispassword == "") {
                myDivispassword.innerHTML = "<p style='color: red'>× 确认密码不能为空!</p>";
                return false;
            } else if (document.getElementById(pwdagin).value != document.getElementById(password).value) {
                myDivispassword.innerHTML = "<p style='color: red'>× 确认密码与密码不一致!</p>";
                return false;
            } else {
                myDivispassword.innerHTML = "<p style='color: green'>√</p>";
                return true;
            }
        }
        /* 
        *===============角色================
        */
        /*******************新增角色*****************/
	    , addRole: function () {
	        var tm1 = $("#role_id_modal_1").val();
	        var tm2 = $("#role_name_modal_1").val();
	        var tm3 = $("#role_chinesename_modal_1").val();
            var tm4 = $("#role_work_modal_1").val();
	        var dataStr = "{\"roleid\":\"" + tm1 + "\"," + "\"rolename\":\"" + tm2 + "\"," + "\"rolechinesename\":\"" + tm3 + "\"," + "\"rolework\":\"" + tm4;
            getDataByPost("/user/addRole",{
	        	roleCode:tm1,
	        	roleName:tm2,
	        	roleDesc:tm3,
                note:tm4
	        },function(res){
	        	if(res.msg=="SUCCESS"){
	        		toastr.success("增加成功！")
					$("#myModal").modal('hide');
					that.manageRole();
	        	}
	        })
	    }
	    /***********判断是否选中角色*****************/
	    , isCheckRole(){
	    	var table = document.getElementById("sample_2");
	        var ischeck = document.getElementsByName("isChecked2");
	        var a = 0;
	        for (i = 0; i < ischeck.length; i++) {
	            if (ischeck[i].checked == true) {
	                a = a + 1;
	                var node = ischeck[i].parentNode.nextElementSibling;
	                that.checkedUserId= node.innerHTML;
	            }
	        }
	        if(a == 0){
	        	toastr.warning("请选择要操作的角色！")
	        	return false;
	        }else{
	        	return true;
	        }
	    }
	    /***********显示选中角色信息*****************/
	    , showEditRole: function () {
	        if(that.isCheckRole()){
	        	getDataByGet("/user/getRoleInfo/"+that.checkedUserId,{},function(res){
	        		if(res.msg=="SUCCESS"){
	        			that.editRoleId = res.data.roleGuid;
	        			that.editRoleCode = res.data.roleCode;
		                that.editRoleName = res.data.roleName;
		                that.editRoleDesc = res.data.roleDesc;
                        that.editRoleWork = res.data.note;
		                $("#exampleModal7").modal('show');
	        		}
            	})
	        }
	    }
	    /***************修改被选中角色信息****************/
	    , editRole: function () {
	    	if(that.isCheckRole()){
	    		getDataByPost("/user/updateRole",{
	    			roleGuid:that.editRoleId,
	    			roleName:that.editRoleName,
	    			roleCode:that.editRoleCode,
	    			roleDesc:that.editRoleDesc,
                    note:that.editRoleWork
	    		},function(res){
	    			if(res.msg=="SUCCESS"){
	    				toastr.success("修改成功！")
	                	$("#exampleModal7").modal('hide');
	                	that.manageRole();
	    			}else{
	    				toastr.error(res.msg);
	    			}
	    		})
	    	}
	    }
	    /***************删除角色****************/
	    , delateRole: function () {
	    	if(that.isCheckRole()){
	    		swal({
                    title: "确定删除选中的记录?",
                    text: "删除之后无法恢复该数据!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false
                },
                function() {
                	getDataByGet("/user/deleteRole/"+that.checkedUserId,"",function(res){
		    			if(res.msg=="SUCCESS"){
		    				swal("提示信息", "删除成功！", "success");
		                	$("#exampleModal7").modal('hide');
		                	that.manageRole();
		    			}else{
		    				swal("提示信息",res.msg,"error");
		    			}
		    		})
                })
	    		
	    	}
	    }
	    /**************保存角色*****************/
	    , saveUserRole: function () {
	        var table = document.getElementById("sample_3");
	        var ischeck = document.getElementsByName("isChecked3");
	        var rolename = "";
	        for (i = 0; i < ischeck.length; i++) {
	            if (ischeck[i].checked == true) {
	                rolename += ischeck[i].value;
	                rolename += ",";
	            }
	        }
	        rolename = rolename.substring(0,rolename.length-1);

	        getDataByPost("/user/setUserRole",{
	        	roleCode:rolename,
	        	userId:that.checkedUserId
	        },function(res){
	        	if(res.msg=="SUCCESS"){
	        		toastr.success("设置成功！")
	        		that.initPage();
	        		$("#exampleModal2").modal('hide');
	        	}else{
	        		toastr.error(res.msg);
	        	}
	        })
	    }
    }
})