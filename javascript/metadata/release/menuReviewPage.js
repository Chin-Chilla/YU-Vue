/**
 * Created by wuwei on 2020/6/6.
 */

var pagesize = 0;
var md_file_id = '';
var rt = '';
var mt = '';
var state = '';
var ids = 450;
var name = '';

MenuReviewPage={
    //加载页面
    load:function(){
        //判断资源目录树上是否有未保存的节点信息
        CatalogPage.pageLeave();
        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .menuReview").addClass("active");
        var data={};
        getStringData('/reviewManager/reviewIndex',data,function (msg) {
            $(".content-wrapper").html(msg);
        })
        console.log("load....");
    }

    //前台查询
    ,search:function () {
        $("#loading").css('display', 'block');
        pagesize = $("#pagesize").val();//展示 10 20 50 100 条数据
        md_file_id = $("#filename").val();//元数据id md_file_id
        rt = $("#regtime").val();
        mt = $("#to").val();
        state = $("#state").val();
        //var ids = $("#hideText").val();
        name = $("#objectName").val();
        var dataStr = {
            "md_file_id": md_file_id,
            "register": "",
            "verifier": "",
            "regtime": rt,
            "to": mt,
            "state": state,
            "ids": ids,
            "name": name
        };
        let _csrf = $("[name='_csrf']").val();
        getDataByPostWithToken("/reviewManager/getRecordsNumber",dataStr,_csrf,function(msg){
            console.log(msg);
            $("#text1").text("结果数量:  "+msg);
            $("#pagination").empty();
            $("#pagination").Paging({pagesize:pagesize,count:msg,toolbar:true,callback:function(page,size,count){
                    alert('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    //console.log('当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页');
                    MenuReviewPage.changePage(page,pagesize);
            }});
            MenuReviewPage.changePage(1,pagesize);
        });
        return;
    }

    //根据显示表格页面
    ,changePage:function (nowPage,size) {
        $("#loading").css('display', 'none');
        $("#loading").css('display', 'block');
        p = nowPage;
        $("#modaltbody1").empty();
        var dataStr = {
            "page": nowPage,
            "size": size,
            "md_file_id": md_file_id,
            "register": "",
            "verifier": "",
            "regtime": rt,
            "to": mt,
            "state": state,
            "ids": ids,
            "name": name
        };
        let _csrf = $("[name='_csrf']").val();
        getDataByPostWithToken("/reviewManager/getRecords",dataStr,_csrf,function(msg){
            console.log(msg);
            $("#modaltbody1").empty();
            $("#sample_1").append("<tbody id='modaltbody1'>");
            for (var o in msg) {
                var id = msg[o].md_file_id;
                var date=new Date(msg[o].reg_time.time);
                var regtime=date.Format("yyyy-MM-dd");
                var state = msg[o].md_state;
                var str = msg[o].node_path.split("&emsp;");//全角空格
                var s = "";
                for(i = 0;i<str.length-1;i++){
                    s = s +str[i]+"&#13;";//回车符，换行
                }
                s = s + str[str.length-1];
                //审核状态
                var metastate1;
                if(state == "1"){
                    metastate1 = "审核通过";
                }else if(state == "0") {
                    metastate1 = "未审核";
                }else{
                    metastate1 = "审核未通过";
                }
                //显示在表格中
                $("#modaltbody1").append(" <tr><td><input type='checkbox' class='checkboxes' value='1' name='isChecked'/></td><td title='"+id+"' style='width:150px'><div title='"+id+"' style='width:150px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>"+id+"</div></td><td style='width:150px'>"+msg[o].md_name+"</td><td style='width:100px'>"+regtime+"</td><td style='width:200px'>"+metastate1+"</td><td title='"+s+"'><div title='"+s+"' style='width:400px;height:30px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;'>"+s+"</div></td><td style='width:100px'><button id='export' type='button' class='btn-xs btn-default' style='margin: 0px 5px 0px 5px' value='"+id+"'onclick='MenuReviewPage.out(this)'>导出</button></td></tr>");
                //全选所有内容按钮
                var icheck1 = document.getElementById("allpage");
                if (icheck1.checked == true) {
                    $("input[name='isChecked']").each( function() {
                        if(!($(this).prop('checked'))){
                            $(this).prop('checked',true );
                        }
                    });
                }
            }
            $("#sample_1").append("</tbody>");
            $("#loading").css('display', 'none');
        });
    }

}