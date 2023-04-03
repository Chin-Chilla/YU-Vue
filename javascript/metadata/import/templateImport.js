var app = new Vue({
    el:"#vue",
    data: {
        slOption: '对象类模板',
        exlContent:[],
        exlTitle:[],
        index:0,
        count:0,
        indexJson:0,
        countJson:0,
        indexJsonObj:0,
        countJsonObj:0,
        simpleData:{
            enable:true,
            idKey:"node_id",
            pIdKey:"pnode_id",
            rootPId:"0"
        },
    },
    key: {
        name: "node_name"
    },
    mounted(){
    },
    methods:{
        download(){
            window.open(BASE_URL+'/matadata_import/downloadFile/'+this.slOption);
        },

        downloadZip(){
            window.open(BASE_URL+'/matadata_import/downloadZip');
        },
        loadManage(){

        },
        addfile(){
            this.index++;
            this.count++;
            $("#fileTableBody").append("<tr id=\"row_"+this.index+"\">" +
                "<td><form method=\"post\" id=\"upload_"+this.index+"\" enctype=\"multipart/form-data\" action=\"/matadata_import_fixed/batchRegisterResourceMetadata\">" +
                // "<input type=\"file\" name=\"showfilename_"+this.index+"\" style=\"float:left;width: 300px;height: 30px;\">" +
                "<input type=\"file\" id=\"showfilename"+this.index+"\"  name=\"showfilename\" style=\"float:left;width: 300px;height: 30px;\">" +
                "</form></td>"+
                "<td><dl style=\"float: left;margin:0 0 0 1px\">\n" +
                "<dt><input type=\"text\" id=\"txtNumber_"+this.index+"\" value=\"6\"  style=\"height:30px;width:30px;margin-left: 10px;\"/></dt></dl>\n" +
                "</td>"+
                "<td><button onclick=\"app.deleteTaRow("+this.index+")\" style=\"width: 50px;height: 30px;margin-bottom: 6px;margin-left: 10px;\">删除</button></td>"+
                "</tr>");
            $("#showfilename"+this.index).change(function (){
                node_code = "0000000000101";
                file = this.files;
                console.log("file"+file.length);
                var formdata = new FormData();
                file_num = file.length;
                i = 0;
                while( i < file_num){
                    formdata.append("file",file[i]);
                    node_str = "6,1000,1001,9592,9595";
                    console.log("node_str==="+node_str);
                    $.ajax({
                        xhrFields:{
                            withCredentials:true
                        },
                        // "url":BASE_URL+"/matadata_import_fixed/upload",
                        "url":BASE_URL+"/matadata_import/loadexl"+ "?node_strs=" + node_str + "&node_code=" + node_code,
                        "data":formdata,
                        "type":"POST",
                        "processData":false,
                        "contentType":false,
                        "success": function (msgJson) {
                            if (msgJson.data.state == 'exceed') {
                                alert(file_name+"起始行超出行数！");
                            }
                            if (msgJson.data.state == 'Permission denied') {
                                alert(file_name+"当前用户不能在该节点下进行文件上传！");
                            }
                            if (msgJson.data.state == 'inconsistent') {
                                alert(file_name+"Excel中的部门与选择结点不一致！");
                            }
                            if (msgJson.data.state == 'ok') {
                                $("#modelthead1").empty();
                                $("#modaltbody1").empty();
                                $("#label1").show();
                                $("#label2").show();
                                exlContent=msgJson.data.data;
                                exlTitle=msgJson.data.title;
                                $("#modelthead1").append("<tr>");
                                for (var i=0;i<exlTitle.Cname.length;i++){
                                    $("#modelthead1").append("<td>" + exlTitle.Cname[i] + "</td>");
                                }
                                $("#modelthead1").append("</tr>");
                                for (var o in exlContent) {
                                    $("#modaltbody1").append("<tr>");
                                    for(var i=0;i<exlTitle.Ename.length;i++){
                                        if(exlTitle.Ename[i] in exlContent[o].serviceMeta){
                                            $("#modaltbody1").append("<td height='40px' style='background-color: #5cb85c'></td>");
                                        }else {
                                            $("#modaltbody1").append("<td style='background-color: #9f191f'></td>");
                                        }
                                    }
                                    $("#modaltbody1").append("</tr>");
                                }
                            }
                        },
                        "error": function (msgJson) {
                            alert("导入错误！");
                            $("#loading").css('display', 'none');
                        }
                    })
                    i++;i++;
                    formdata.delete("file");
                }
            })
            $('input[type=radio][name=isShow]').click(function() {
                var $radio = $(this);
                if ($radio.data('waschecked') == false){
                    $radio.data('waschecked', true);
                    $radio.prop('checked',true);
                    $("#modaltbody1").empty();
                    for (var o in exlContent) {
                        $("#modaltbody1").append("<tr>");
                        for (var i = 0; i < exlTitle.Ename.length; i++) {
                            if (exlTitle.Ename[i] in exlContent[o].serviceMeta) {
                                $("#modaltbody1").append("<td>" + exlContent[o].serviceMeta[exlTitle.Ename[i]] + "</td>");
                            } else {
                                $("#modaltbody1").append("<td></td>");
                            }
                        }
                        $("#modaltbody1").append("</tr>");
                    }
                }
                else {
                    $radio.prop('checked', false);
                    $radio.data('waschecked', false);
                    $("#modaltbody1").empty();
                    for (var o in exlContent) {
                        $("#modaltbody1").append("<tr>");
                        for(var i=0;i<exlTitle.Ename.length;i++){
                            if(exlTitle.Ename[i] in exlContent[o].serviceMeta){
                                $("#modaltbody1").append("<td height='40px' style='background-color: #5cb85c'></td>");
                            }else {
                                $("#modaltbody1").append("<td style='background-color: #9f191f'></td>");
                            }
                        }
                        $("#modaltbody1").append("</tr>");
                    }
                }
            })
        },

        deleteTaRow:function (del_index) {
            console.log("删除了吗");
            this.count--;
            $("#modelthead1").empty();
            $("#modaltbody1").empty();
            $("#label1").hide();
            $("#label2").hide();
            $("#row_"+del_index).remove();

        },

        // loadexl(){
        //     node_code = "0000000000101";
        //     file = $("#fileTableBody").find("input");
        //     console.log("file"+file.length);
        //     // files = file[0].files[0];
        //     var formdata = new FormData();
        //     file_num = file.length;
        //     i = 0;
        //     while( i < file_num){
        //         formdata.append("file",file[i].files[0]);
        //         node_str = file[i+1].value + ",1000,1001,9592,9595";
        //         console.log("node_str==="+node_str);
        //
        //         $.ajax({
        //             xhrFields:{
        //                 withCredentials:true
        //             },
        //             // "url":BASE_URL+"/matadata_import_fixed/upload",
        //             "url":BASE_URL+"/matadata_import/loadexl"+ "?node_strs=" + node_str + "&node_code=" + node_code,
        //             "data":formdata,
        //             "type":"POST",
        //             "processData":false,
        //             "contentType":false,
        //             // "dataType":"json",
        //             "success": function (msgJson) {
        //                 if (msgJson.data.state == 'exceed') {
        //                     alert(file_name+"起始行超出行数！");
        //                 }
        //                 if (msgJson.data.state == 'Permission denied') {
        //                     alert(file_name+"当前用户不能在该节点下进行文件上传！");
        //                 }
        //                 if (msgJson.data.state == 'inconsistent') {
        //                     alert(file_name+"Excel中的部门与选择结点不一致！");
        //                 }
        //                 // $("#loading").css('display', 'none'); //取消 loading 界面
        //                 if (msgJson.data.state == 'ok') {
        //                     exlContent=msgJson.data.data;
        //                     exlTitle=msgJson.data.title;
        //                     $("#modelthead1").append("<tr>");
        //                     for (var i=0;i<exlTitle.Cname.length;i++){
        //                              $("#modelthead1").append("<td>" + exlTitle.Cname[i] + "</td>");
        //                     }
        //                     $("#modelthead1").append("</tr>");
        //                     for (var o in exlContent) {
        //                         $("#modaltbody1").append("<tr><td> " + exlContent[o].serviceMeta.DATABASE_NAME +"</td><td>" + exlContent[o].serviceMeta.ABS+"</td><td>" + exlContent[o].serviceMeta.KEY+"</td><td>" + exlContent[o].serviceMeta.FEATURE_CLASSIFY+"</td><td>" + exlContent[o].serviceMeta.OBJ_CATEGORY1+"</td><td>" + exlContent[o].serviceMeta.OBJ_CATEGORY2+"</td><td>" + exlContent[o].serviceMeta.BUSINESS_CATEGORY1+"</td><td>" + exlContent[o].serviceMeta.BUSINESS_CATEGORY2+"</td><td>" + exlContent[o].serviceMeta.ADMINISTRATION_CATEGORY1
        //                             +"</td><td>" + exlContent[o].serviceMeta.ADMINISTRATION_CATEGORY2+"</td><td>" + exlContent[o].serviceMeta.STAGE_CATEGORY1+"</td><td>" + exlContent[o].serviceMeta.STAGE_CATEGORY2+"</td><td>" + exlContent[o].serviceMeta.PR_NAME+"</td><td>" + exlContent[o].serviceMeta.PR_INNERD+"</td><td>" + exlContent[o].serviceMeta.MNG_NAME+"</td><td>" + exlContent[o].serviceMeta.MNG_INNERD+"</td><td>" + exlContent[o].serviceMeta.FORMAT+"</td><td>" + exlContent[o].serviceMeta.PROPERTIES +"</td><td>" + exlContent[o].serviceMeta.UPDATE_FRQC
        //                             +"</td><td>" + exlContent[o].serviceMeta.SHARE_TYPE+"</td><td>" + exlContent[o].serviceMeta.SHARE_CONDITION+"</td><td>" + exlContent[o].serviceMeta.SHARE_WAY+"</td><td>" + exlContent[o].serviceMeta.RELEASE_DATE+"</td><td>" + exlContent[o].serviceMeta.SOURCE_DPT+"</td><td>" + exlContent[o].serviceMeta.FILE_SIZE+"</td><td>" + exlContent[o].serviceMeta.ADDRESS+"</td><td>" + exlContent[o].serviceMeta.TABLE_NUM +"</td><td>" + exlContent[o].serviceMeta.INITIAL_DATE +"</td><td>" + exlContent[o].serviceMeta.LATEST_DATE+
        //                             "</td></tr>");
        //                     }
        //                     console.log(exlContent);
        //                //     console.log(msgJson.data.data[0].serviceMeta);
        //                 }
        //                 console.log(msgJson);
        //             },
        //             "error": function (msgJson) {
        //                 alert("导入错误！");
        //                 $("#loading").css('display', 'none');
        //             }
        //         })
        //         i++;i++;
        //         formdata.delete("file");
        //     }
        // },
        upload(){
            console.log("upload调用了");
            // node_str = $("#txtNumber_"+this.index).val() + ",1000,1001,9592,9595";
            node_code = "0000000000101";
            file = $("#fileTableBody").find("input");
            // files = file[0].files[0];
            var formdata = new FormData();
            file_num = file.length;
            i = 0;
            while( i < file_num){
                formdata.append("file",file[i].files[0]);
                node_str = file[i+1].value + ",1000,1001,9592,9595";
                $.ajax({
                    xhrFields:{
                        withCredentials:true
                    },
                    // "url":BASE_URL+"/matadata_import_fixed/upload",
                    "url":BASE_URL+"/matadata_import/upload"+ "?node_strs=" + node_str + "&node_code=" + node_code,
                    "data":formdata,
                    "type":"POST",
                    "processData":false,
                    "contentType":false,
                    // "dataType":"json",
                    "success": function (msgJson) {
                        if (msgJson.data.state == 'exceed') {
                            alert(file_name+"起始行超出行数！");
                        }
                        if (msgJson.data.state == 'Permission denied') {
                            alert(file_name+"当前用户不能在该节点下进行文件上传！");
                        }
                        if (msgJson.data.state == 'inconsistent') {
                            alert(file_name+"Excel中的部门与选择结点不一致！");
                        }
                        // $("#loading").css('display', 'none'); //取消 loading 界面
                        if (msgJson.data.state == 'ok') {
                            toastr.success("导入成功！");
                        }
                    },
                    "error": function (msgJson) {
                        alert("导入错误！");
                        $("#loading").css('display', 'none');
                    }
                })
                i++;i++;
                formdata.delete("file");
            }
            // formdata.append("file",file[0].files[0]);
            // $.ajax({
            //     xhrFields:{
            //         withCredentials:true
            //     },
            //     // "url":BASE_URL+"/matadata_import_fixed/upload",
            //     "url":BASE_URL+"/matadata_import/upload"+ "?node_strs=" + node_str + "&node_code=" + node_code,
            //     "data":formdata,
            //     "type":"POST",
            //     "processData":false,
            //     "contentType":false,
            //     // "dataType":"json",
            //     "success": function (msgJson) {
            //         if (msgJson.data.state == 'exceed') {
            //             alert("起始行超出行数！");
            //         }
            //         if (msgJson.data.state == 'Permission denied') {
            //             alert("当前用户不能在该节点下进行文件上传！");
            //         }
            //         if (msgJson.data.state == 'inconsistent') {
            //             alert("Excel中的部门与选择结点不一致！");
            //         }
            //         // $("#loading").css('display', 'none'); //取消 loading 界面
            //         if (msgJson.data.state == 'ok') {
            //             alert("导入成功！");
            //         }
            //     },
            //    "error": function (msgJson) {
            //        alert("导入错误！");
            //         $("#loading").css('display', 'none');
            //     }
            // })
        },
        uploadJson(){
            file = $("#fileTableBodyJson").find("input");
            var formdata = new FormData();
            file_num = file.length;
            i = 0;
            console.log("in uploadJson")
            console.log(file_num)
            while( i < file_num){
                formdata.append("file",file[i].files[0]);
                node_list = file[i+1].value;
                $.ajax({
                    xhrFields:{
                        withCredentials:true
                    },
                    // "url":BASE_URL+"/matadata_import_fixed/upload",
                    "url":BASE_URL+"/matadata_import/uploadJson"+ "?node_list=" + node_list,
                    "data":formdata,
                    "type":"POST",
                    "processData":false,
                    "contentType":false,
                    // "dataType":"json",
                    "success": function (msgJson) {
                        if (msgJson.data.state == 'exceed') {
                            alert(file_name+"起始行超出行数！");
                        }
                        if (msgJson.data.state == 'Permission denied') {
                            alert(file_name+"当前用户不能在该节点下进行文件上传！");
                        }
                        if (msgJson.data.state == 'inconsistent') {
                            alert(file_name+"Excel中的部门与选择结点不一致！");
                        }
                        // $("#loading").css('display', 'none'); //取消 loading 界面
                        if (msgJson.data.state == 'ok') {
                            toastr.success("导入成功！");
                        }
                    },
                    "error": function (msgJson) {
                        alert("导入错误！");
                        $("#loading").css('display', 'none');
                    }
                })
                i++;i++;
                formdata.delete("file");
            }
        },
        addfileJson(){
            this.indexJson++;
            this.countJson++;
            $("#fileTableBodyJson").append("<tr id=\"row_"+this.indexJson+"\">" +
                "<td><form method=\"post\" id=\"upload_"+this.indexJson+"\" enctype=\"multipart/form-data\" action=\"/matadata_import_fixed/batchRegisterResourceMetadata\">" +
                // "<input type=\"file\" name=\"showfilename_"+this.index+"\" style=\"float:left;width: 300px;height: 30px;\">" +
                "<input type=\"file\" id=\"showfilename"+this.indexJson+"\"  name=\"showfilename\" style=\"float:left;width: 230px;height: 30px;\">" +
                "</form></td>"+
                "<td><dl style=\"float: left;margin:0 0 0 1px\">\n" +
                "<dt><input type=\"text\" id=\"txtNumber_"+this.indexJson+"\" value=\"0,0,0,0\"  style=\"height:30px;width:270px;margin-left: 10px;\"/></dt></dl>\n" +
                "</td>"+
                "<td><button onclick=\"app.deleteTaRow("+this.indexJson+")\" style=\"width: 50px;height: 30px;margin-bottom: 6px;margin-left: 10px;\">删除</button></td>"+
                "</tr>");
        },



        uploadJsonObj(){
            file = $("#fileTableBodyJsonObj").find("input");
            var formdata = new FormData();
            file_num = file.length;
            i = 0;
            // console.log("in uploadJson")
            // console.log(file_num)
            while( i < file_num){
                formdata.append("file",file[i].files[0]);
                node_list = file[i+1].value;
                $.ajax({
                    xhrFields:{
                        withCredentials:true
                    },
                    // "url":BASE_URL+"/matadata_import_fixed/upload",
                    "url":BASE_URL+"/matadata_import/uploadJson"+ "?node_list=" + node_list + "&node_type=objNode",
                    "data":formdata,
                    "type":"POST",
                    "processData":false,
                    "contentType":false,
                    // "dataType":"json",
                    "success": function (msgJson) {
                        if (msgJson.data.state == 'exceed') {
                            alert(file_name+"起始行超出行数！");
                        }
                        if (msgJson.data.state == 'Permission denied') {
                            alert(file_name+"当前用户不能在该节点下进行文件上传！");
                        }
                        if (msgJson.data.state == 'inconsistent') {
                            alert(file_name+"Excel中的部门与选择结点不一致！");
                        }
                        // $("#loading").css('display', 'none'); //取消 loading 界面
                        if (msgJson.data.state == 'ok') {
                            toastr.success("导入成功！");
                        }
                    },
                    "error": function (msgJson) {
                        alert("导入错误！");
                        $("#loading").css('display', 'none');
                    }
                })
                i++;i++;
                formdata.delete("file");
            }
        },
        addfileJsonObj(){
            this.indexJsonObj++;
            this.countJsonObj++;
            $("#fileTableBodyJsonObj").append("<tr id=\"row_"+this.indexJsonObj+"\">" +
                "<td><form method=\"post\" id=\"upload_"+this.indexJsonObj+"\" enctype=\"multipart/form-data\" action=\"/matadata_import_fixed/batchRegisterResourceMetadata\">" +
                // "<input type=\"file\" name=\"showfilename_"+this.index+"\" style=\"float:left;width: 300px;height: 30px;\">" +
                "<input type=\"file\" id=\"showfilename"+this.indexJsonObj+"\"  name=\"showfilename\" style=\"float:left;width: 230px;height: 30px;\">" +
                "</form></td>"+
                "<td><dl style=\"float: left;margin:0 0 0 1px\">\n" +
                "<dt><input type=\"text\" id=\"txtNumber_"+this.indexJsonObj+"\" value=\"0,0,0,0\"  style=\"height:30px;width:270px;margin-left: 10px;\"/></dt></dl>\n" +
                "</td>"+
                "<td><button onclick=\"app.deleteTaRow("+this.indexJsonObj+")\" style=\"width: 50px;height: 30px;margin-bottom: 6px;margin-left: 10px;\">删除</button></td>"+
                "</tr>");
        },
    }
})



