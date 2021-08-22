var app = new Vue({
    el:"#vue",
    data: {
        slOption: '对象类模板',
        index:0,
        count:0,
        indexJson:0,
        countJson:0,
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
        addfile:function(){
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
        },
        deleteTaRow:function (del_index) {
            console.log("删除了吗");
            this.count--;
            $("#row_"+del_index).remove();

        },
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
    }
})



