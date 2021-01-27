
/**
 * Created by ZJ 2016/6/23
 *主要用编写前台通用的js方法
 */

const BASE_URL = "http://localhost:8080",LOCATION = "hohai";
const RES_CODE = {
"UNAUTHENTICATED": 4002,//未登录

"UNAUTHORIZED": 4003//没有权限
};
//根据名称获取url中的参数值
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if (r != null)
		return decodeURI(r[2]);
	return null; //返回参数值
};

function getDataByGet(aURl,aJson,aCallback,errorCallback){
      $.ajax({
      		xhrFields: {
                withCredentials: true
            },
			url:BASE_URL+aURl,           //该路径在route中定义
			contentType: "application/json",
			data:aJson,
			dataType:"JSON",
            async : true,
			type:"GET",                     //必须是get类型，POST类型不行
			success:function(res){
				if(res.code ==RES_CODE.UNAUTHENTICATED){
					toastr.error(res.msg);
					setTimeout(function(){
						window.location.href="/"
					},1500)
				}else if(res.code ==RES_CODE.UNAUTHORIZED){
					toastr.error(res.msg);
				}else{
					aCallback(res)
				}
			},
			error:function(res){
			    errorCallback(res);
			}
	  })
}

function getDataByGet(aURl,aJson,aCallback){
      $.ajax({
      		xhrFields: {
                withCredentials: true
            },
			url:BASE_URL+aURl,           //该路径在route中定义
			contentType: "application/json",
			data:aJson,
			dataType:"JSON",
            async : true,
			type:"GET",                     //必须是get类型，POST类型不行
			success:function(res){
				if(res.code ==RES_CODE.UNAUTHENTICATED){
					toastr.error(res.msg);
					setTimeout(function(){
						window.location.href="/"
					},1500)
				}else if(res.code ==RES_CODE.UNAUTHORIZED){
					toastr.error(res.msg);
				}else{
					aCallback(res)
				}
			},
			error:function(res){
			    toastr.error(res.msg)
			}
	  })
}


function getDataByGet1(aURl,aJson,aCallback,errorCallback){
      $.ajax({
      		xhrFields: {
                withCredentials: true
            },
			url:BASE_URL+aURl,           //该路径在route中定义
			contentType: "application/json",
			data:aJson,
			dataType:"JSON",
            async : false,
			type:"GET",                     //必须是get类型，POST类型不行
			success:function(res){
				if(res.code ==RES_CODE.UNAUTHENTICATED){
					toastr.error(res.msg);
					setTimeout(function(){
						window.location.href="/"
					},1500)
				}else if(res.code ==RES_CODE.UNAUTHORIZED){
					toastr.error(res.msg);
				}else{
					aCallback(res)
				}
			},
			error:function(res){
			    errorCallback(res);
			}
	  })
}

//同步get
function getDataByGet1(aURl,aJson,aCallback){
      $.ajax({
      		xhrFields: {
                withCredentials: true
            },
			url:BASE_URL+aURl,           //该路径在route中定义
			contentType: "application/json",
			data:aJson,
			dataType:"JSON",
            async : false,
			type:"GET",                     //必须是get类型，POST类型不行
			success:function(res){
				if(res.code ==RES_CODE.UNAUTHENTICATED){
					toastr.error(res.msg);
					setTimeout(function(){
						window.location.href="/"
					},1500)
				}else if(res.code ==RES_CODE.UNAUTHORIZED){
					toastr.error(res.msg);
				}else{
					aCallback(res)
				}
			},
			error:function(res){
			    toastr.error(res.msg)
			}
	  })
}



//post方式
function getDataByPost(aURl,aJson,aCallback,errorCallback){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		url:BASE_URL+aURl,           //该路径在route中定义
		contentType: "application/json",
		data:JSON.stringify(aJson),
		dataType:"JSON",
        async : true,
		type:"POST",                     //必须是get类型，POST类型不行
		success:function(res){
			if(res.code ==RES_CODE.UNAUTHENTICATED){
				toastr.error(res.msg);
				setTimeout(function(){
					window.location.href="/"
				},1500)
			}else if(res.code ==RES_CODE.UNAUTHORIZED){
				toastr.error(res.msg);
			}else{
				aCallback(res)
			}
		},
		error:function(res){
		    errorCallback(res);
		}
  })
}

function getDataByPost(aURl,aJson,aCallback){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		url:BASE_URL+aURl,           //该路径在route中定义
		contentType: "application/json",
		data:JSON.stringify(aJson),
		dataType:"JSON",
        async : true,
		type:"POST",                     //必须是get类型，POST类型不行
		success:function(res){
			if(res.code ==RES_CODE.UNAUTHENTICATED){
				toastr.error(res.msg);
				setTimeout(function(){
					window.location.href="/"
				},1500)
			}else if(res.code ==RES_CODE.UNAUTHORIZED){
				toastr.error(res.msg);
			}else{
				aCallback(res)
			}
		},
		error:function(res){
		    toastr.error(res.msg)
		}
  })
}

//post方式
function getDataByPost1(aURl,aJson,aCallback,errorCallback){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		url:BASE_URL+aURl,           //该路径在route中定义
		contentType: "application/json",
		data:JSON.stringify(aJson),
		dataType:"JSON",
        async : false,
		type:"POST",                     //必须是get类型，POST类型不行
		success:function(res){
			if(res.code ==RES_CODE.UNAUTHENTICATED){
				toastr.error(res.msg);
				setTimeout(function(){
					window.location.href="/"
				},1500)
			}else if(res.code ==RES_CODE.UNAUTHORIZED){
				toastr.error(res.msg);
			}else{
				aCallback(res)
			}
		},
		error:function(res){
		    errorCallback(res);
		}
  })
}

function getDataByPost1(aURl,aJson,aCallback){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		url:BASE_URL+aURl,           //该路径在route中定义
		contentType: "application/json",
		data:JSON.stringify(aJson),
		dataType:"JSON",
        async : false,
		type:"POST",                     //必须是get类型，POST类型不行
		success:function(res){
			if(res.code ==RES_CODE.UNAUTHENTICATED){
				toastr.error(res.msg);
				setTimeout(function(){
					window.location.href="/"
				},1500)
			}else if(res.code ==RES_CODE.UNAUTHORIZED){
				toastr.error(res.msg);
			}else{
				aCallback(res)
			}
		},
		error:function(res){
		    toastr.error(res.msg)
		}
  })
}




//post方式
function getDataByPostWithToken(aURl,aJson,csrf,aCallback){
	console.log("aurl: "+aURl);
	console.log("aJson: "+JSON.stringify(aJson));
	console.log("aCallback: "+aCallback);
	console.log("csrfToken: "+csrf)
	// var data = { "dataJson":aJson, };
	$.ajax({
		url:aURl,           //该路径在route中定义
		data:aJson,
		async : true,
		type:"POST",
		dataType :"json",
		// contentType :"application/json,charset=utf-8",
		contentType: "application/x-www-form-urlencoded",
		beforeSend:function(request){
			request.setRequestHeader("X-CSRF-TOKEN",csrf)
		},
		success:function(msg){
			aCallback(msg);
		},
		error:function(msg){
			aCallback(msg);
		}
	});
}

dataPagination={
	pageNo:1,//页号由参数指定
	pageSize:5,//每页的大小由各自指定 dataPagination.pageSize=?
	totalPage:2//总页数
	// !!important总页数是从后台获取的,所以第一次加载完数据后反过来把总页数赋值给dataPagination.totalPage
	//dataPagination.changePage(number)
	//number=-1代表上一页,-999代表下一页
	//在页面第一次调用该函数的时候集的初始化dataPagination.pageNo=1
	,changePage:function (pageNo,aCallback) {
		if(pageNo==-1){
			if(dataPagination.pageNo<=1){
				alert("这已经是第一页了");
				aCallback("error");
			}else{
				dataPagination.pageNo--;
				$("#pagination li").removeClass("active");//取出active类
				$("#pagination").children().eq(dataPagination.pageNo).addClass("active");//重新添加active类
				aCallback("success");
			}
		}else if(pageNo==-999){
			if(dataPagination.pageNo>=dataPagination.totalPage){
				alert("这已经是最后一页了");
				aCallback("error");
			}
			else{
				dataPagination.pageNo++;
				$("#pagination li").removeClass("active");
				$("#pagination").children().eq(dataPagination.pageNo).addClass("active");
				aCallback("success");
			}
		}else{
			dataPagination.pageNo=pageNo;
			$("#pagination li").removeClass("active");
			$("#pagination").children().eq(dataPagination.pageNo).addClass("active");
			aCallback("success");
		}
	}
}

function setRelationByFun(aMasArr, aDtlArr, aItemPropertyName, aFun){
	try {
		for (var i = 0; i < aMasArr.length; i++) {
			var aMasItem = aMasArr[i];
			aMasItem[aItemPropertyName] = [];
			try {
				for (var k = 0; k < aDtlArr.length; k++) {
					var aDtlItem = aDtlArr[k];
					var aFlag = false;
					try {
						aFlag = aFun(aMasItem, aDtlItem);
					}
					catch (cer) {; }
					if (aFlag) {
						aMasItem[aItemPropertyName].push(aDtlItem);
					}
				}
			}
			catch (cer) {; }
		}
	}
	catch (cer) {; }

}
//设置两个数组间的关系
// setRelationByProperty( mainItem , subItem , "para" ,"mainID" , "subID");
function setRelationByProperty(aMasArr, aDtlArr, aItemPropertyName, aMasProperty, aDtlProperty){
	try {
		setRelationByFun(aMasArr, aDtlArr, aItemPropertyName, function (aMasItem, aDtlItem) {
			var aFlag = false;
			try {
				aFlag = aMasItem[aMasProperty] == aDtlItem[aDtlProperty];
			}
			catch (cer) { aFlag = false; }
			return aFlag;
		});
	}
	catch (cer) {; }

}

function parseXML(data) {
	var xml, tmp;
	if (window.DOMParser) { // Standard
		tmp = new DOMParser();
		xml = tmp.parseFromString(data, "text/xml");
	} else { // IE
		xml = new ActiveXObject("Microsoft.XMLDOM");
		xml.async = "false";
		xml.loadXML(data);
	}
	tmp = xml.documentElement;
	if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
		return null;
	}
	return xml;
}

//将 IXMLDOMDocument2 转换为JSON，参数为IXMLDOMDocument2对象　　
function toJson(obj) {
	if (this == null) return null;
	var retObj = new Object;
	buildObjectNode(retObj,
		/*jQuery*/
		obj);
	return retObj;
	function buildObjectNode(cycleOBJ,
							 /*Element*/
							 elNode) {
		/*NamedNodeMap*/
		var nodeAttr = elNode.attributes;
		if (nodeAttr != null) {
			if (nodeAttr.length && cycleOBJ == null) cycleOBJ = new Object;
			for (var i = 0; i < nodeAttr.length; i++) {
				cycleOBJ[nodeAttr[i].name] = nodeAttr[i].value;
			}
		}
		var nodeText = "text";
		if (elNode.text == null) nodeText = "textContent";
		/*NodeList*/
		var nodeChilds = elNode.childNodes;
		if (nodeChilds != null) {
			if (nodeChilds.length && cycleOBJ == null) cycleOBJ = new Object;
			for (var i = 0; i < nodeChilds.length; i++) {
				if (nodeChilds[i].tagName != null) {
					if (nodeChilds[i].childNodes[0] != null && nodeChilds[i].childNodes.length <= 1 && (nodeChilds[i].childNodes[0].nodeType == 3 || nodeChilds[i].childNodes[0].nodeType == 4)) {
						if (cycleOBJ[nodeChilds[i].tagName] == null) {
							cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
						} else {
							if (typeof(cycleOBJ[nodeChilds[i].tagName]) == "object" && cycleOBJ[nodeChilds[i].tagName].length) {
								cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = nodeChilds[i][nodeText];
							} else {
								cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
								cycleOBJ[nodeChilds[i].tagName][1] = nodeChilds[i][nodeText];
							}
						}
					} else {
						if (nodeChilds[i].childNodes.length) {
							if (cycleOBJ[nodeChilds[i].tagName] == null) {
								cycleOBJ[nodeChilds[i].tagName] = new Object;
								buildObjectNode(cycleOBJ[nodeChilds[i].tagName], nodeChilds[i]);
							} else {
								if (cycleOBJ[nodeChilds[i].tagName].length) {
									cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = new Object;
									buildObjectNode(cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length - 1], nodeChilds[i]);
								} else {
									cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
									cycleOBJ[nodeChilds[i].tagName][1] = new Object;
									buildObjectNode(cycleOBJ[nodeChilds[i].tagName][1], nodeChilds[i]);
								}
							}
						} else {
							cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
						}
					}
				}
			}
		}
	}
}


Permission={
	//获得当前页面所有需要权限控制的按钮 按钮的必须有的属性为:<input class="PER_BTN" permission="roleCode1,roleCode2,.....">
	// 标签必须是input,class必须包含PER_BTN不符合的按钮不会被控制,必须有permission属性
	ShieldButton:function () {
		var dataString={};
		var roleCode="";
		getDataByGet('/getRoleCode', dataString, function (msg) {
			roleCode=msg.roleCode;
			var objects=$("input.PER_BTN");
			for (var i=0;i<objects.length;i++){
				var str=$(objects[i]).attr("permission");
				if(!Permission.isInPerList(str,roleCode)){
					$(objects[i]).attr("disabled","disabled");
				}
			}
		});
	}
	,isInPerList:function (str,roleCode) {
		var pers=str.split(",");
		var roleList=roleCode.split("-");
		for(var i=0;i<pers.length;i++){
			for(var j=0;j<roleList.length;j++){
				if(pers[i]==roleList[j]){
					return true;
				}
			}

		}
		return false;
	}
}



//获得前n-1个,并且将最后一个合并为其他
function getN(array,number,callback,CB2) {
	arraySort(array,function (a,b) {
		return callback(a,b);
	});
	var a=new Array();
	for(var i=0;i<number-1;i++){
		a.push(array[i]);
	}
	return CB2(a,array);
}

//数组排序
function arraySort(array,callback) {
	array.sort(function (a,b) {
		return callback(a,b);
	});
}





