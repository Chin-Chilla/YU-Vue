var app = new Vue({
    el:"#vue",
    data: {
        slOption: '对象类模板',
        index:0,
        count:0,
simpleData:{
    enable:true,
        idKey:"node_id",
        pIdKey:"pnode_id",
        rootPId:"0"
},
key: {
    name: "node_name"
},
tableData2:[{
    yyfile: '', //文件
    yystart: '',//起始行
    bookbuytime:"",//操作
}],
},

// check:{
//         enable:true,
//         chkStyle: "checkbox",
//         chkboxType: { "Y": "ps", "N": "ps" }
//         },
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
    // addone: function (index) {
    //     console.log("addone调用了");
    //     var txtNumber = $("#txtNumber_"+index).val();
    //     $("#txtNumber_"+index).val(txtNumber+ 1) ;
    //    // var txtNumber = this.$refs.input.value;
    //    // this.$refs.input.value = parseInt(this.$refs.input.value) + 1;//解析字符串
    // },
    // removeone: function (index) {
    //     console.log("addone调用了");
    //     var txtNumber = document.getElementById("txtNumber_"+index);
    //    if (parseInt(txtNumber.value) > 1) {
    //        txtNumber.value = parseInt(txtNumber.value) - 1;
    //   }
    // },
    addfile:function(){
        getDataByPost("",formdata,res=>{

        })
        this.index++;
        this.count++;
        $("#fileTableBody").append("<tr id=\"row_"+this.index+"\">" +
            "<td><form method=\"POST\" id=\"upload_"+this.index+"\" role=\"form-horizontal\" style=\"overflow: auto\" enctype=\"multipart/form-data\">" +
            "<input type=\"file\"  id=\"showfilename_"+this.index+"\" name=\"showfilename_"+this.index+"\" style=\"float:left;width: 300px;height: 30px;\">" +
            "</form></td>"+
            "<td><dl style=\"float: left;margin:0 0 0 1px\">\n" +
            "<dt><input type=\"text\" id=\"txtNumber_"+this.index+"\" value=\"6\"  style=\"height:30px;width:30px;margin-left: 10px;\"/></dt></dl>\n" +
            // "<dl>\n" +
            // "<button  @click=\"addone("+this.index+")\" style=\"width: 30px;height: 30px;margin-bottom: 3px;margin-left: 7px;\">+</button>\n" +
            // "<button  @click=\"removeone("+this.index+")\" style=\"width: 30px;height: 30px;margin-bottom: 3px;margin-left: 7px;\">-</button>\n" +
            // "</dl>"+
            "</td>"+
            "<td><button onclick=\"app.deleteTaRow("+this.index+")\" style=\"width: 50px;height: 30px;margin-bottom: 6px;margin-left: 10px;\">删除</button></td>"+
            "</tr>");
    },
    // showFilename: function (elem,index) {
    // //对于非windows环境下的路径的解析
    //     console.log("showFilename调用了");
    //     var pos = Math.max(elem.value.lastIndexOf('/'), elem.value.lastIndexOf('\\'));
    //     if (pos < 0)
    //         document.getElementById("showfilename_"+index).value = elem.value;
    //     else
    //         document.getElementById("showfilename_"+index).value = elem.value.substring(pos + 1);
    // },
    deleteTaRow:function (del_index) {
        console.log("删除了吗");
        this.count--;
        $("#row_"+del_index).remove();

    },
    search(event){
        console.log(event.currentTarget.value)
    },
    // upload: function (fileName,formId,flag) {
    //     var filename = document.getElementById(fileName);
    //     // var fileTrueName = $("#showfilename_"+index).val().substring(12);
    //     var form;
    //     try {
    //         console.log($("#"+formId)[0]);
    //         form = new FormData($("#"+formId)[0]);
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     if (filename.value=="") {
    //         toastr.warning("请选择文件");
    //         throw 'stop';
    //     }
    //     else{
    //         node_str = $("#txtNumber_"+this.index).val() + ",1000,1001,9592,9595";
    //         node_code = "0000000000101";
    //         $("#loading").css('display', 'block');
    //         getDataByPost('/matadata_import_fixed/batchRegisterResourceMetadata',{
    //             node_str:node_str,
    //             node_code:node_code,
    //             flag:this.index
    //         },res=>{
    //             if (JSON.parse(msg).state == 'exceed') {
    //                     toastr.warning("起始行超出行数！");
    //                 }
    //                 if (JSON.parse(msg).state == 'Permission denied') {
    //                     toastr.warning(" 当前用户不能在该节点下进行文件上传！");
    //                 }
    //                 if (JSON.parse(msg).state == 'inconsistent') {
    //                     toastr.warning("Excel中的部门与选择结点不一致！");
    //                 }
    //                 $("#loading").css('display', 'none'); //取消 loading 界面
    //                 if (JSON.parse(msg).state == 'ok') {
    //                     toastr.success("导入成功");
    //                 }

    //         },err => {
    //                 load_res = 'false';
    //                 toastr.error("导入错误！");
    //                 $("#loading").css('display', 'none');
    //         }) ;
    //     }
    // },
    upload(){
        // var tab = document.getElementById("fileTableBody");
        var files = $("#fileTableBody").find("input");
        var fm = new FormData();
        int i = 0;
        while (this.count >0 )
        {
            fm.append("file1",file[i].files[i]);
            i++;
        }

        $.ajax({
            url: '/matadata_import_fixed/batchRegisterResourceMetadata' ,
            type: 'POST',
            data: fm,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (JSON.parse(msg).state == 'exceed') {
                    toastr.warning("起始行超出行数！");
                }
                if (JSON.parse(msg).state == 'Permission denied') {
                    toastr.warning(" 当前用户不能在该节点下进行文件上传！");
                }
                if (JSON.parse(msg).state == 'inconsistent') {
                    toastr.warning("Excel中的部门与选择结点不一致！");
                }
                $("#loading").css('display', 'none'); //取消 loading 界面
                if (JSON.parse(msg).state == 'ok') {
                    toastr.success("导入成功");
                }

            },
            error: function (returndata) {
                load_res = 'false';
                toastr.error("导入错误！");
                $("#loading").css('display', 'none');
            }
        });

        // var rows=tab.rows;
        // for(var i=0;i<rows.length;i++){ //遍历表格的行j=1
        //     var rowContent= new String(""+rows[i].cells[0].innerHTML);
        //     var fileName=rowContent.substr(120,14);
        //     var flag = rowContent.substr(133,1);
        //     var formId=rowContent.substr(10,8);
        //     console.log(rowContent);
        //     console.log(fileName,formId);
        //     console.log(this.index);
        //     upload(fileName,formId,flag);
    },
}
})



