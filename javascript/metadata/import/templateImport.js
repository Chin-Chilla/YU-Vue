var app = new Vue({
    el:"#vue",
    data: {
        slOption: '数据库（表格集）类模板',
        prOption:'水利信息资源名称',
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
                                $("#modaltbody1").append("<td style='vertical-align: middle'><div style='height: 150px;overflow: hidden;text-overflow: ellipsis;-moz-text-overflow: ellipsis;'>" + exlContent[o].serviceMeta[exlTitle.Ename[i]] + "</div></td>");
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
            $('input[type=radio][name=isMust]').click(function() {
                var $radio = $(this);
                if ($radio.data('waschecked') == false){
                    $radio.data('waschecked', true);
                    $radio.prop('checked',true);

                }
                else {
                    $radio.prop('checked', false);
                    $radio.data('waschecked', false);
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
            $("#tablescorll").hide();
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
        help(){
            $("#Modal").modal('show');
            if(this.slOption=='数据库（表格集）类模板'){
                $("#propOption").empty();
                $("#def").val('缩略描述水利信息资源内容的文字。');
                $("#dataType").val('字符型。');
                $("#jingdu").val('自由文本。');
                $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                $("#propOption").change(function (){
                    var index=this.selectedIndex;
                    if (this.options[index].value=='水利信息资源名称'){
                        $("#def").val('缩略描述水利信息资源内容的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                    }
                    else if(this.options[index].value=='摘要'){
                        $("#def").val('对水利信息资源内容（或关键字段）进行概要说明的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('不超过256个字。');
                    }
                    else if(this.options[index].value=='关键字'){
                        $("#def").val('用于水利信息资源检索的一个或多个有意义的字词。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='特征分类'){
                        $("#def").val('');
                        $("#dataType").val('');
                        $("#jingdu").val('');
                        $("#req").val('“跨不同水利业务和政务的综合数据”属于“综合类”，“从其他单位交换而来的其他数据”属于“其他类”');
                    }
                    else if(this.options[index].value=='类别'){
                        $("#def").val('水利信息资源所属的类别。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('5.1水利信息资源分类规定的类目名称。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='提供方：提供方名称'){
                        $("#def").val('水利信息资源提供单位的名称。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('提供方应为独立单位。');
                    }
                    else if(this.options[index].value=='提供方：提供方内部部门'){
                        $("#def").val('提供方的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室；2）如无相关内部部门，则填写“无相关内部部门”。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位名称'){
                        $("#def").val('维护水利信息资源的单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('资源维护单位应为独立单位。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位内部部门'){
                        $("#def").val('资源维护单位的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室。');
                    }
                    else if(this.options[index].value=='格式'){
                        $("#def").val('水利信息资源的数据格式（可多选）。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('数据库类的存储格式为GaussDB、POLARDB、HIGH GO、Dm、KingbaseES、access、dbf、K-DB、dbase、sysbase、oracle、sql server、db2等；数据表类的存储格式为et、xls、xlsx等；矢量类的存储格式为MAPGIS、MIF、TAB、SHP、KML、KMZ、ENC、DWG、DXF、TEMSBuildingVector、TEMSVector等；栅格类的存储格式为TIF、IMG、RAW、SIT、JPG、PNG、TEMSClutter等；电子文件的存储格式为OFD、wps、xml、txt、doc、docx、html、pdf、ppt等；流媒体类的存储格式为swf、rm、mpg等；自描述格式，由提供方提出其特殊行业领域的通用格式，如气象部门采用的“表格驱动码”格式；以其他格式存储的，应对所采用的格式类型做具体说明。"');
                    }
                    else if(this.options[index].value=='属性'){
                        $("#def").val('描述结构化水利信息资源中具体属性名称及其数据类型的文字。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）属于结构化数据的，应标明数据类型，包括：字符型C、数值型N、货币型Y、日期型D、日期时间型T、 逻辑型L、备注型M、通用型G、双精度型B、整型I、浮点型F等；2）属性名称与其数据类型之间用“/”隔开；具有多个属性的，应逐一描述，各属性之间用“、”隔开；涉及多组属性的，可用“；”分组，并在各组属性之前注明本组名称，组名与本组属性名称之间用“：”隔开。');
                    }
                    else if(this.options[index].value=='更新频率'){
                        $("#def").val('水利信息资源更新的频度。分为实时、每日、每周、每旬、每月、每季度、每年等。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('属于结构化数据资源的，按更新频度较快的信息项进行描述；属于非结构化数据资源的，则对水利信息资源整体进行描述。');
                    }
                    else if(this.options[index].value=='共享类型'){
                        $("#def").val('水利信息资源的共享类型。包括：无条件共享、有条件共享、不予共享三类。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('');
                        $("#req").val('“无条件共享、有条件共享、不予共享”中的某一类。');
                    }
                    else if(this.options[index].value=='共享条件'){
                        $("#def").val('不同共享类型的水利信息资源的共享条件。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('无条件共享类的水利信息资源，应注明“无条件”；有条件共享类的水利信息资源，应注明具体的共享条件；不予共享类的水利信息资源，应注明相关法律法规或党中央、国务院政策等依据。');
                    }
                    else if(this.options[index].value=='共享方式'){
                        $("#def").val('获取水利信息资源的方式。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“系统对接、联机查询、在线浏览、调用在线服务、下载、拷贝、其他”中的某一类。');
                        $("#req").val('1）应通过水信息基础平台，采用系统对接、联机查询、在线浏览或调用在线服务等4种方式实现水利信息资源共享，前述方式能满足应用需求的，不得采用下载、拷贝等方式获取所需水利信息资源；2）采用其他方式共享的，应对所采用的共享方式做具体说明。');
                    }
                    else if(this.options[index].value=='发布日期'){
                        $("#def").val('提供方发布共享水利信息资源的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='获取途径'){
                        $("#def").val('提供方获取水利信息资源的途径。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“观测、调查、实验、交换、其他”中的某一类。自由文本，不超过10个字。');
                        $("#req").val('1）“观测”是指对自然现象进行观察或测定获取的数据；“调查”是指为某种需要而进行的野外查勘获取的数据；“实验”是指在野外或者室内以实验方式获取的数据）；“专题”是指针对某一科研专题项目在实施过程中产生的数据；“交换”是指从外单位获取的数据。2）获取途径为“其他”，应对“获取途径”做具体说明。');
                    }
                    else if(this.options[index].value=='文件大小'){
                        $("#def").val('水利信息资源实际占用存储空间的大小。');
                        $("#dataType").val('数值型。');
                        $("#jingdu").val('大于0。');
                        $("#req").val('计量单位：MB。');
                    }
                    else if(this.options[index].value=='数据库网址地址'){
                        $("#def").val('使用URL地址或类似地址模式进行在线访问的地址。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('URL。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='数据表数量'){
                        $("#def").val('数据库（表格集）类水利信息资源的数据库（表格集）中包含的表格的数量。');
                        $("#dataType").val('整型。');
                        $("#jingdu").val('大于0。');
                        $("#req").val('计量单位：张。');
                    }
                    else if(this.options[index].value=='初始日期'){
                        $("#def").val('水利信息资源初始创建的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='最新日期'){
                        $("#def").val('水利信息资源的最后一次更新的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                });
                $("#propOption").append("<option value=\"水利信息资源名称\">水利信息资源名称</option> " + "<option value=\"摘要\"\>摘要</option> <option value=\"关键字\">关键字</option> " + "<option value=\"特征分类\">特征分类</option> " +
                    "<option value=\"类别\">类别</option> " + "<option value=\"提供方：提供方名称\">提供方：提供方名称</option> " + "<option value=\"提供方：提供方内部部门\">提供方：提供方内部部门</option> " + "<option value=\"资源维护单位：资源维护单位名称\">资源维护单位：资源维护单位名称</option> " +
                    "<option value=\"资源维护单位：资源维护单位内部部门\">资源维护单位：资源维护单位内部部门</option> " + "<option value=\"格式\">格式</option> " + "<option value=\"属性\">属性</option> " + "<option value=\"共享类型\">共享类型</option> " + "<option value=\"共享条件\">共享条件</option> " +
                    "<option value=\"共享方式\">共享方式</option> " + "<option value=\"发布日期\">发布日期</option> " + "<option value=\"获取途径\">获取途径</option> " + "<option value=\"文件大小\">文件大小</option> " + "<option value=\"数据库网址地址\">数据库网址地址</option>" +
                    "<option value=\"数据表数量\">数据表数量</option> " + "<option value=\"初始日期\">初始日期</option> " + "<option value=\"最新日期\">最新日期</option>");
                    }
            else if(this.slOption=='对象类模板'){
                $("#propOption").empty();
                $("#def").val('缩略描述水利信息资源内容的文字。');
                $("#dataType").val('字符型。');
                $("#jingdu").val('自由文本。');
                $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                $("#propOption").change(function (){
                    var index=this.selectedIndex;
                    if (this.options[index].value=='水利信息资源名称'){
                        $("#def").val('缩略描述水利信息资源内容的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                    }
                    else if(this.options[index].value=='摘要'){
                        $("#def").val('对水利信息资源内容（或关键字段）进行概要说明的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('不超过256个字。');
                    }
                    else if(this.options[index].value=='关键字'){
                        $("#def").val('用于水利信息资源检索的一个或多个有意义的字词。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='特征分类'){
                        $("#def").val('');
                        $("#dataType").val('');
                        $("#jingdu").val('');
                        $("#req").val('“跨不同水利业务和政务的综合数据”属于“综合类”，“从其他单位交换而来的其他数据”属于“其他类”');
                    }
                    else if(this.options[index].value=='类别'){
                        $("#def").val('水利信息资源所属的类别。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('5.1水利信息资源分类规定的类目名称。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='提供方：提供方名称'){
                        $("#def").val('水利信息资源提供单位的名称。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('提供方应为独立单位。');
                    }
                    else if(this.options[index].value=='提供方：提供方内部部门'){
                        $("#def").val('提供方的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室；2）如无相关内部部门，则填写“无相关内部部门”。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位名称'){
                        $("#def").val('维护水利信息资源的单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('资源维护单位应为独立单位。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位内部部门'){
                        $("#def").val('资源维护单位的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室。');
                    }
                    else if(this.options[index].value=='格式'){
                        $("#def").val('水利信息资源的数据格式（可多选）。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('数据库类的存储格式为GaussDB、POLARDB、HIGH GO、Dm、KingbaseES、access、dbf、K-DB、dbase、sysbase、oracle、sql server、db2等；数据表类的存储格式为et、xls、xlsx等；矢量类的存储格式为MAPGIS、MIF、TAB、SHP、KML、KMZ、ENC、DWG、DXF、TEMSBuildingVector、TEMSVector等；栅格类的存储格式为TIF、IMG、RAW、SIT、JPG、PNG、TEMSClutter等；电子文件的存储格式为OFD、wps、xml、txt、doc、docx、html、pdf、ppt等；流媒体类的存储格式为swf、rm、mpg等；自描述格式，由提供方提出其特殊行业领域的通用格式，如气象部门采用的“表格驱动码”格式；以其他格式存储的，应对所采用的格式类型做具体说明。"');
                    }
                    else if(this.options[index].value=='属性'){
                        $("#def").val('描述结构化水利信息资源中具体属性名称及其数据类型的文字。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）属于结构化数据的，应标明数据类型，包括：字符型C、数值型N、货币型Y、日期型D、日期时间型T、 逻辑型L、备注型M、通用型G、双精度型B、整型I、浮点型F等；2）属性名称与其数据类型之间用“/”隔开；具有多个属性的，应逐一描述，各属性之间用“、”隔开；涉及多组属性的，可用“；”分组，并在各组属性之前注明本组名称，组名与本组属性名称之间用“：”隔开。');
                    }
                    else if(this.options[index].value=='更新频率'){
                        $("#def").val('水利信息资源更新的频度。分为实时、每日、每周、每旬、每月、每季度、每年等。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('属于结构化数据资源的，按更新频度较快的信息项进行描述；属于非结构化数据资源的，则对水利信息资源整体进行描述。');
                    }
                    else if(this.options[index].value=='共享类型'){
                        $("#def").val('水利信息资源的共享类型。包括：无条件共享、有条件共享、不予共享三类。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('');
                        $("#req").val('“无条件共享、有条件共享、不予共享”中的某一类。');
                    }
                    else if(this.options[index].value=='共享条件'){
                        $("#def").val('不同共享类型的水利信息资源的共享条件。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('无条件共享类的水利信息资源，应注明“无条件”；有条件共享类的水利信息资源，应注明具体的共享条件；不予共享类的水利信息资源，应注明相关法律法规或党中央、国务院政策等依据。');
                    }
                    else if(this.options[index].value=='共享方式'){
                        $("#def").val('获取水利信息资源的方式。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“系统对接、联机查询、在线浏览、调用在线服务、下载、拷贝、其他”中的某一类。');
                        $("#req").val('1）应通过水信息基础平台，采用系统对接、联机查询、在线浏览或调用在线服务等4种方式实现水利信息资源共享，前述方式能满足应用需求的，不得采用下载、拷贝等方式获取所需水利信息资源；2）采用其他方式共享的，应对所采用的共享方式做具体说明。');
                    }
                    else if(this.options[index].value=='发布日期'){
                        $("#def").val('提供方发布共享水利信息资源的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='对象代码'){
                        $("#def").val('按照《水利对象分类与编码总则》（SL 213-2020）定义的编码规则，编制形成的在信息化领域内唯一的对象标识。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }

                });
                $("#propOption").append("<option value=\"水利信息资源名称\">水利信息资源名称</option> " + "<option value=\"摘要\"\>摘要</option> <option value=\"关键字\">关键字</option> " + "<option value=\"特征分类\">特征分类</option> " +
                    "<option value=\"类别\">类别</option> " + "<option value=\"提供方：提供方名称\">提供方：提供方名称</option> " + "<option value=\"提供方：提供方内部部门\">提供方：提供方内部部门</option> " + "<option value=\"资源维护单位：资源维护单位名称\">资源维护单位：资源维护单位名称</option> " +
                    "<option value=\"资源维护单位：资源维护单位内部部门\">资源维护单位：资源维护单位内部部门</option> " + "<option value=\"格式\">格式</option> " + "<option value=\"属性\">属性</option> " + "<option value=\"共享类型\">共享类型</option> " + "<option value=\"共享条件\">共享条件</option> " +
                    "<option value=\"共享方式\">共享方式</option> " + "<option value=\"发布日期\">发布日期</option> " + "<option value=\"对象代码\">对象代码</option> ");
            }
            else if(this.slOption=='其他类模板'){
                $("#propOption").empty();
                $("#def").val('缩略描述水利信息资源内容的文字。');
                $("#dataType").val('字符型。');
                $("#jingdu").val('自由文本。');
                $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                $("#propOption").change(function (){
                    var index=this.selectedIndex;
                    if (this.options[index].value=='水利信息资源名称'){
                        $("#def").val('缩略描述水利信息资源内容的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                    }
                    else if(this.options[index].value=='摘要'){
                        $("#def").val('对水利信息资源内容（或关键字段）进行概要说明的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('不超过256个字。');
                    }
                    else if(this.options[index].value=='关键字'){
                        $("#def").val('用于水利信息资源检索的一个或多个有意义的字词。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='特征分类'){
                        $("#def").val('');
                        $("#dataType").val('');
                        $("#jingdu").val('');
                        $("#req").val('“跨不同水利业务和政务的综合数据”属于“综合类”，“从其他单位交换而来的其他数据”属于“其他类”');
                    }
                    else if(this.options[index].value=='类别'){
                        $("#def").val('水利信息资源所属的类别。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('5.1水利信息资源分类规定的类目名称。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='提供方：提供方名称'){
                        $("#def").val('水利信息资源提供单位的名称。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('提供方应为独立单位。');
                    }
                    else if(this.options[index].value=='提供方：提供方内部部门'){
                        $("#def").val('提供方的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室；2）如无相关内部部门，则填写“无相关内部部门”。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位名称'){
                        $("#def").val('维护水利信息资源的单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('资源维护单位应为独立单位。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位内部部门'){
                        $("#def").val('资源维护单位的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室。');
                    }
                    else if(this.options[index].value=='格式'){
                        $("#def").val('水利信息资源的数据格式（可多选）。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('数据库类的存储格式为GaussDB、POLARDB、HIGH GO、Dm、KingbaseES、access、dbf、K-DB、dbase、sysbase、oracle、sql server、db2等；数据表类的存储格式为et、xls、xlsx等；矢量类的存储格式为MAPGIS、MIF、TAB、SHP、KML、KMZ、ENC、DWG、DXF、TEMSBuildingVector、TEMSVector等；栅格类的存储格式为TIF、IMG、RAW、SIT、JPG、PNG、TEMSClutter等；电子文件的存储格式为OFD、wps、xml、txt、doc、docx、html、pdf、ppt等；流媒体类的存储格式为swf、rm、mpg等；自描述格式，由提供方提出其特殊行业领域的通用格式，如气象部门采用的“表格驱动码”格式；以其他格式存储的，应对所采用的格式类型做具体说明。"');
                    }
                    else if(this.options[index].value=='属性'){
                        $("#def").val('描述结构化水利信息资源中具体属性名称及其数据类型的文字。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）属于结构化数据的，应标明数据类型，包括：字符型C、数值型N、货币型Y、日期型D、日期时间型T、 逻辑型L、备注型M、通用型G、双精度型B、整型I、浮点型F等；2）属性名称与其数据类型之间用“/”隔开；具有多个属性的，应逐一描述，各属性之间用“、”隔开；涉及多组属性的，可用“；”分组，并在各组属性之前注明本组名称，组名与本组属性名称之间用“：”隔开。');
                    }
                    else if(this.options[index].value=='更新频率'){
                        $("#def").val('水利信息资源更新的频度。分为实时、每日、每周、每旬、每月、每季度、每年等。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('属于结构化数据资源的，按更新频度较快的信息项进行描述；属于非结构化数据资源的，则对水利信息资源整体进行描述。');
                    }
                    else if(this.options[index].value=='共享类型'){
                        $("#def").val('水利信息资源的共享类型。包括：无条件共享、有条件共享、不予共享三类。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('');
                        $("#req").val('“无条件共享、有条件共享、不予共享”中的某一类。');
                    }
                    else if(this.options[index].value=='共享条件'){
                        $("#def").val('不同共享类型的水利信息资源的共享条件。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('无条件共享类的水利信息资源，应注明“无条件”；有条件共享类的水利信息资源，应注明具体的共享条件；不予共享类的水利信息资源，应注明相关法律法规或党中央、国务院政策等依据。');
                    }
                    else if(this.options[index].value=='共享方式'){
                        $("#def").val('获取水利信息资源的方式。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“系统对接、联机查询、在线浏览、调用在线服务、下载、拷贝、其他”中的某一类。');
                        $("#req").val('1）应通过水信息基础平台，采用系统对接、联机查询、在线浏览或调用在线服务等4种方式实现水利信息资源共享，前述方式能满足应用需求的，不得采用下载、拷贝等方式获取所需水利信息资源；2）采用其他方式共享的，应对所采用的共享方式做具体说明。');
                    }
                    else if(this.options[index].value=='发布日期'){
                        $("#def").val('提供方发布共享水利信息资源的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='获取途径'){
                        $("#def").val('提供方获取水利信息资源的途径。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“观测、调查、实验、交换、其他”中的某一类。自由文本，不超过10个字。');
                        $("#req").val('1）“观测”是指对自然现象进行观察或测定获取的数据；“调查”是指为某种需要而进行的野外查勘获取的数据；“实验”是指在野外或者室内以实验方式获取的数据）；“专题”是指针对某一科研专题项目在实施过程中产生的数据；“交换”是指从外单位获取的数据。2）获取途径为“其他”，应对“获取途径”做具体说明。');
                    }
                    else if(this.options[index].value=='文件大小'){
                        $("#def").val('水利信息资源实际占用存储空间的大小。');
                        $("#dataType").val('数值型。');
                        $("#jingdu").val('大于0。');
                        $("#req").val('计量单位：MB。');
                    }
                    else if(this.options[index].value=='初始日期'){
                        $("#def").val('水利信息资源初始创建的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='最新日期'){
                        $("#def").val('水利信息资源的最后一次更新的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }

                });
                $("#propOption").append("<option value=\"水利信息资源名称\">水利信息资源名称</option> " + "<option value=\"摘要\"\>摘要</option> <option value=\"关键字\">关键字</option> " + "<option value=\"特征分类\">特征分类</option> " +
                    "<option value=\"类别\">类别</option> " + "<option value=\"提供方：提供方名称\">提供方：提供方名称</option> " + "<option value=\"提供方：提供方内部部门\">提供方：提供方内部部门</option> " + "<option value=\"资源维护单位：资源维护单位名称\">资源维护单位：资源维护单位名称</option> " +
                    "<option value=\"资源维护单位：资源维护单位内部部门\">资源维护单位：资源维护单位内部部门</option> " + "<option value=\"格式\">格式</option> " + "<option value=\"属性\">属性</option> " + "<option value=\"共享类型\">共享类型</option> " + "<option value=\"共享条件\">共享条件</option> " +
                    "<option value=\"共享方式\">共享方式</option> " + "<option value=\"发布日期\">发布日期</option> " + "<option value=\"获取途径\">获取途径</option>"+ "<option value=\"文件大小\">文件大小</option> " + "<option value=\"初始日期\">初始日期</option> " + "<option value=\"最新日期\">最新日期</option> ");
            }
            else if(this.slOption=='数据表（表格）类模板'){
                $("#propOption").empty();
                $("#def").val('缩略描述水利信息资源内容的文字。');
                $("#dataType").val('字符型。');
                $("#jingdu").val('自由文本。');
                $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                $("#propOption").change(function (){
                    var index=this.selectedIndex;
                    if (this.options[index].value=='水利信息资源名称'){
                        $("#def").val('缩略描述水利信息资源内容的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                    }
                    else if(this.options[index].value=='摘要'){
                        $("#def").val('对水利信息资源内容（或关键字段）进行概要说明的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('不超过256个字。');
                    }
                    else if(this.options[index].value=='关键字'){
                        $("#def").val('用于水利信息资源检索的一个或多个有意义的字词。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='特征分类'){
                        $("#def").val('');
                        $("#dataType").val('');
                        $("#jingdu").val('');
                        $("#req").val('“跨不同水利业务和政务的综合数据”属于“综合类”，“从其他单位交换而来的其他数据”属于“其他类”');
                    }
                    else if(this.options[index].value=='类别'){
                        $("#def").val('水利信息资源所属的类别。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('5.1水利信息资源分类规定的类目名称。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='提供方：提供方名称'){
                        $("#def").val('水利信息资源提供单位的名称。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('提供方应为独立单位。');
                    }
                    else if(this.options[index].value=='提供方：提供方内部部门'){
                        $("#def").val('提供方的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室；2）如无相关内部部门，则填写“无相关内部部门”。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位名称'){
                        $("#def").val('维护水利信息资源的单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('资源维护单位应为独立单位。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位内部部门'){
                        $("#def").val('资源维护单位的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室。');
                    }
                    else if(this.options[index].value=='格式'){
                        $("#def").val('水利信息资源的数据格式（可多选）。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('数据库类的存储格式为GaussDB、POLARDB、HIGH GO、Dm、KingbaseES、access、dbf、K-DB、dbase、sysbase、oracle、sql server、db2等；数据表类的存储格式为et、xls、xlsx等；矢量类的存储格式为MAPGIS、MIF、TAB、SHP、KML、KMZ、ENC、DWG、DXF、TEMSBuildingVector、TEMSVector等；栅格类的存储格式为TIF、IMG、RAW、SIT、JPG、PNG、TEMSClutter等；电子文件的存储格式为OFD、wps、xml、txt、doc、docx、html、pdf、ppt等；流媒体类的存储格式为swf、rm、mpg等；自描述格式，由提供方提出其特殊行业领域的通用格式，如气象部门采用的“表格驱动码”格式；以其他格式存储的，应对所采用的格式类型做具体说明。"');
                    }
                    else if(this.options[index].value=='属性'){
                        $("#def").val('描述结构化水利信息资源中具体属性名称及其数据类型的文字。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）属于结构化数据的，应标明数据类型，包括：字符型C、数值型N、货币型Y、日期型D、日期时间型T、 逻辑型L、备注型M、通用型G、双精度型B、整型I、浮点型F等；2）属性名称与其数据类型之间用“/”隔开；具有多个属性的，应逐一描述，各属性之间用“、”隔开；涉及多组属性的，可用“；”分组，并在各组属性之前注明本组名称，组名与本组属性名称之间用“：”隔开。');
                    }
                    else if(this.options[index].value=='更新频率'){
                        $("#def").val('水利信息资源更新的频度。分为实时、每日、每周、每旬、每月、每季度、每年等。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('属于结构化数据资源的，按更新频度较快的信息项进行描述；属于非结构化数据资源的，则对水利信息资源整体进行描述。');
                    }
                    else if(this.options[index].value=='共享类型'){
                        $("#def").val('水利信息资源的共享类型。包括：无条件共享、有条件共享、不予共享三类。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('');
                        $("#req").val('“无条件共享、有条件共享、不予共享”中的某一类。');
                    }
                    else if(this.options[index].value=='共享条件'){
                        $("#def").val('不同共享类型的水利信息资源的共享条件。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('无条件共享类的水利信息资源，应注明“无条件”；有条件共享类的水利信息资源，应注明具体的共享条件；不予共享类的水利信息资源，应注明相关法律法规或党中央、国务院政策等依据。');
                    }
                    else if(this.options[index].value=='共享方式'){
                        $("#def").val('获取水利信息资源的方式。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“系统对接、联机查询、在线浏览、调用在线服务、下载、拷贝、其他”中的某一类。');
                        $("#req").val('1）应通过水信息基础平台，采用系统对接、联机查询、在线浏览或调用在线服务等4种方式实现水利信息资源共享，前述方式能满足应用需求的，不得采用下载、拷贝等方式获取所需水利信息资源；2）采用其他方式共享的，应对所采用的共享方式做具体说明。');
                    }
                    else if(this.options[index].value=='发布日期'){
                        $("#def").val('提供方发布共享水利信息资源的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='获取途径'){
                        $("#def").val('提供方获取水利信息资源的途径。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“观测、调查、实验、交换、其他”中的某一类。自由文本，不超过10个字。');
                        $("#req").val('1）“观测”是指对自然现象进行观察或测定获取的数据；“调查”是指为某种需要而进行的野外查勘获取的数据；“实验”是指在野外或者室内以实验方式获取的数据）；“专题”是指针对某一科研专题项目在实施过程中产生的数据；“交换”是指从外单位获取的数据。2）获取途径为“其他”，应对“获取途径”做具体说明。');
                    }
                    else if(this.options[index].value=='数据记录数量'){
                        $("#def").val('数据表（表格）类水利信息资源的数据表（表格）中包含的数据记录的数量。');
                        $("#dataType").val('整型。');
                        $("#jingdu").val('大于0。');
                        $("#req").val('计量单位：条。');
                    }
                    else if(this.options[index].value=='初始日期'){
                        $("#def").val('水利信息资源初始创建的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='最新日期'){
                        $("#def").val('水利信息资源的最后一次更新的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                });
                $("#propOption").append("<option value=\"水利信息资源名称\">水利信息资源名称</option> " + "<option value=\"摘要\"\>摘要</option> <option value=\"关键字\">关键字</option> " + "<option value=\"特征分类\">特征分类</option> " +
                    "<option value=\"类别\">类别</option> " + "<option value=\"提供方：提供方名称\">提供方：提供方名称</option> " + "<option value=\"提供方：提供方内部部门\">提供方：提供方内部部门</option> " + "<option value=\"资源维护单位：资源维护单位名称\">资源维护单位：资源维护单位名称</option> " +
                    "<option value=\"资源维护单位：资源维护单位内部部门\">资源维护单位：资源维护单位内部部门</option> " + "<option value=\"格式\">格式</option> " + "<option value=\"属性\">属性</option> " + "<option value=\"共享类型\">共享类型</option> " + "<option value=\"共享条件\">共享条件</option> " +
                    "<option value=\"共享方式\">共享方式</option> " + "<option value=\"发布日期\">发布日期</option> " + "<option value=\"获取途径\">获取途径</option> "+"<option value=\"数据记录数量\">数据记录数量</option> " + "<option value=\"初始日期\">初始日期</option> " + "<option value=\"最新日期\">最新日期</option>");
            }
            else if(this.slOption=='矢量类模板'){
                $("#propOption").empty();
                $("#def").val('缩略描述水利信息资源内容的文字。');
                $("#dataType").val('字符型。');
                $("#jingdu").val('自由文本。');
                $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                $("#propOption").change(function (){
                    var index=this.selectedIndex;
                    if (this.options[index].value=='水利信息资源名称'){
                        $("#def").val('缩略描述水利信息资源内容的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                    }
                    else if(this.options[index].value=='摘要'){
                        $("#def").val('对水利信息资源内容（或关键字段）进行概要说明的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('不超过256个字。');
                    }
                    else if(this.options[index].value=='关键字'){
                        $("#def").val('用于水利信息资源检索的一个或多个有意义的字词。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='特征分类'){
                        $("#def").val('');
                        $("#dataType").val('');
                        $("#jingdu").val('');
                        $("#req").val('“跨不同水利业务和政务的综合数据”属于“综合类”，“从其他单位交换而来的其他数据”属于“其他类”');
                    }
                    else if(this.options[index].value=='类别'){
                        $("#def").val('水利信息资源所属的类别。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('5.1水利信息资源分类规定的类目名称。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='提供方：提供方名称'){
                        $("#def").val('水利信息资源提供单位的名称。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('提供方应为独立单位。');
                    }
                    else if(this.options[index].value=='提供方：提供方内部部门'){
                        $("#def").val('提供方的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室；2）如无相关内部部门，则填写“无相关内部部门”。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位名称'){
                        $("#def").val('维护水利信息资源的单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('资源维护单位应为独立单位。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位内部部门'){
                        $("#def").val('资源维护单位的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室。');
                    }
                    else if(this.options[index].value=='格式'){
                        $("#def").val('水利信息资源的数据格式（可多选）。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('数据库类的存储格式为GaussDB、POLARDB、HIGH GO、Dm、KingbaseES、access、dbf、K-DB、dbase、sysbase、oracle、sql server、db2等；数据表类的存储格式为et、xls、xlsx等；矢量类的存储格式为MAPGIS、MIF、TAB、SHP、KML、KMZ、ENC、DWG、DXF、TEMSBuildingVector、TEMSVector等；栅格类的存储格式为TIF、IMG、RAW、SIT、JPG、PNG、TEMSClutter等；电子文件的存储格式为OFD、wps、xml、txt、doc、docx、html、pdf、ppt等；流媒体类的存储格式为swf、rm、mpg等；自描述格式，由提供方提出其特殊行业领域的通用格式，如气象部门采用的“表格驱动码”格式；以其他格式存储的，应对所采用的格式类型做具体说明。"');
                    }
                    else if(this.options[index].value=='属性'){
                        $("#def").val('描述结构化水利信息资源中具体属性名称及其数据类型的文字。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）属于结构化数据的，应标明数据类型，包括：字符型C、数值型N、货币型Y、日期型D、日期时间型T、 逻辑型L、备注型M、通用型G、双精度型B、整型I、浮点型F等；2）属性名称与其数据类型之间用“/”隔开；具有多个属性的，应逐一描述，各属性之间用“、”隔开；涉及多组属性的，可用“；”分组，并在各组属性之前注明本组名称，组名与本组属性名称之间用“：”隔开。');
                    }
                    else if(this.options[index].value=='更新频率'){
                        $("#def").val('水利信息资源更新的频度。分为实时、每日、每周、每旬、每月、每季度、每年等。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('属于结构化数据资源的，按更新频度较快的信息项进行描述；属于非结构化数据资源的，则对水利信息资源整体进行描述。');
                    }
                    else if(this.options[index].value=='共享类型'){
                        $("#def").val('水利信息资源的共享类型。包括：无条件共享、有条件共享、不予共享三类。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('');
                        $("#req").val('“无条件共享、有条件共享、不予共享”中的某一类。');
                    }
                    else if(this.options[index].value=='共享条件'){
                        $("#def").val('不同共享类型的水利信息资源的共享条件。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('无条件共享类的水利信息资源，应注明“无条件”；有条件共享类的水利信息资源，应注明具体的共享条件；不予共享类的水利信息资源，应注明相关法律法规或党中央、国务院政策等依据。');
                    }
                    else if(this.options[index].value=='共享方式'){
                        $("#def").val('获取水利信息资源的方式。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“系统对接、联机查询、在线浏览、调用在线服务、下载、拷贝、其他”中的某一类。');
                        $("#req").val('1）应通过水信息基础平台，采用系统对接、联机查询、在线浏览或调用在线服务等4种方式实现水利信息资源共享，前述方式能满足应用需求的，不得采用下载、拷贝等方式获取所需水利信息资源；2）采用其他方式共享的，应对所采用的共享方式做具体说明。');
                    }
                    else if(this.options[index].value=='发布日期'){
                        $("#def").val('提供方发布共享水利信息资源的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='获取途径'){
                        $("#def").val('提供方获取水利信息资源的途径。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“观测、调查、实验、交换、其他”中的某一类。自由文本，不超过10个字。');
                        $("#req").val('1）“观测”是指对自然现象进行观察或测定获取的数据；“调查”是指为某种需要而进行的野外查勘获取的数据；“实验”是指在野外或者室内以实验方式获取的数据）；“专题”是指针对某一科研专题项目在实施过程中产生的数据；“交换”是指从外单位获取的数据。2）获取途径为“其他”，应对“获取途径”做具体说明。');
                    }
                    else if(this.options[index].value=='要素类型'){
                        $("#def").val('矢量类水利信息资源中包含的要素类型。包括点、线、面及其组合体。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('对于具有多种要素类型的，相关的要素类型均应予以注明（相邻要素类型间以“、”隔开）。');
                    }
                    else if(this.options[index].value=='空间坐标系'){
                        $("#def").val('矢量类水利信息资源的空间参照系。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='比例尺'){
                        $("#def").val('矢量类水利信息资源在图上一条线段的长度与地面相应线段的实际长度之比，主要用于表征该资源在空间上的详略程度。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='空间覆盖范围'){
                        $("#def").val('矢量类或栅格类水利信息资源覆盖的地域范围。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='初始日期'){
                        $("#def").val('水利信息资源初始创建的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='最新日期'){
                        $("#def").val('水利信息资源的最后一次更新的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                });
                $("#propOption").append("<option value=\"水利信息资源名称\">水利信息资源名称</option> " + "<option value=\"摘要\"\>摘要</option> <option value=\"关键字\">关键字</option> " + "<option value=\"特征分类\">特征分类</option> " +
                    "<option value=\"类别\">类别</option> " + "<option value=\"提供方：提供方名称\">提供方：提供方名称</option> " + "<option value=\"提供方：提供方内部部门\">提供方：提供方内部部门</option> " + "<option value=\"资源维护单位：资源维护单位名称\">资源维护单位：资源维护单位名称</option> " +
                    "<option value=\"资源维护单位：资源维护单位内部部门\">资源维护单位：资源维护单位内部部门</option> " + "<option value=\"格式\">格式</option> " + "<option value=\"属性\">属性</option> " + "<option value=\"共享类型\">共享类型</option> " + "<option value=\"共享条件\">共享条件</option> " +
                    "<option value=\"共享方式\">共享方式</option> " + "<option value=\"发布日期\">发布日期</option> " + "<option value=\"获取途径\">获取途径</option> " + "<option value=\"要素类型\">要素类型</option> " + "<option value=\"空间坐标系\">空间坐标系</option>" +
                    "<option value=\"比例尺\">比例尺</option> " + "<option value=\"空间覆盖范围\">空间覆盖范围</option> "+ "<option value=\"初始日期\">初始日期</option> " + "<option value=\"最新日期\">最新日期</option>");
            }
            else if(this.slOption=='栅格类模板'){
                $("#propOption").empty();
                $("#def").val('缩略描述水利信息资源内容的文字。');
                $("#dataType").val('字符型。');
                $("#jingdu").val('自由文本。');
                $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                $("#propOption").change(function (){
                    var index=this.selectedIndex;
                    if (this.options[index].value=='水利信息资源名称'){
                        $("#def").val('缩略描述水利信息资源内容的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）不超过50个字；2）应能体现水利信息资源分类的类目特征，并尽量避免水利信息资源名称出现重复。');
                    }
                    else if(this.options[index].value=='摘要'){
                        $("#def").val('对水利信息资源内容（或关键字段）进行概要说明的文字。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('不超过256个字。');
                    }
                    else if(this.options[index].value=='关键字'){
                        $("#def").val('用于水利信息资源检索的一个或多个有意义的字词。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='特征分类'){
                        $("#def").val('');
                        $("#dataType").val('');
                        $("#jingdu").val('');
                        $("#req").val('“跨不同水利业务和政务的综合数据”属于“综合类”，“从其他单位交换而来的其他数据”属于“其他类”');
                    }
                    else if(this.options[index].value=='类别'){
                        $("#def").val('水利信息资源所属的类别。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('5.1水利信息资源分类规定的类目名称。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='提供方：提供方名称'){
                        $("#def").val('水利信息资源提供单位的名称。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('提供方应为独立单位。');
                    }
                    else if(this.options[index].value=='提供方：提供方内部部门'){
                        $("#def").val('提供方的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室；2）如无相关内部部门，则填写“无相关内部部门”。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位名称'){
                        $("#def").val('维护水利信息资源的单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('资源维护单位应为独立单位。');
                    }
                    else if(this.options[index].value=='资源维护单位：资源维护单位内部部门'){
                        $("#def").val('资源维护单位的内部部门，包括部门所属行政事业单位。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('部机关细化到内部司局、部直属单位细化到处室，省级单位细化到省厅处室。');
                    }
                    else if(this.options[index].value=='格式'){
                        $("#def").val('水利信息资源的数据格式（可多选）。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('数据库类的存储格式为GaussDB、POLARDB、HIGH GO、Dm、KingbaseES、access、dbf、K-DB、dbase、sysbase、oracle、sql server、db2等；数据表类的存储格式为et、xls、xlsx等；矢量类的存储格式为MAPGIS、MIF、TAB、SHP、KML、KMZ、ENC、DWG、DXF、TEMSBuildingVector、TEMSVector等；栅格类的存储格式为TIF、IMG、RAW、SIT、JPG、PNG、TEMSClutter等；电子文件的存储格式为OFD、wps、xml、txt、doc、docx、html、pdf、ppt等；流媒体类的存储格式为swf、rm、mpg等；自描述格式，由提供方提出其特殊行业领域的通用格式，如气象部门采用的“表格驱动码”格式；以其他格式存储的，应对所采用的格式类型做具体说明。"');
                    }
                    else if(this.options[index].value=='属性'){
                        $("#def").val('描述结构化水利信息资源中具体属性名称及其数据类型的文字。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('1）属于结构化数据的，应标明数据类型，包括：字符型C、数值型N、货币型Y、日期型D、日期时间型T、 逻辑型L、备注型M、通用型G、双精度型B、整型I、浮点型F等；2）属性名称与其数据类型之间用“/”隔开；具有多个属性的，应逐一描述，各属性之间用“、”隔开；涉及多组属性的，可用“；”分组，并在各组属性之前注明本组名称，组名与本组属性名称之间用“：”隔开。');
                    }
                    else if(this.options[index].value=='更新频率'){
                        $("#def").val('水利信息资源更新的频度。分为实时、每日、每周、每旬、每月、每季度、每年等。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('属于结构化数据资源的，按更新频度较快的信息项进行描述；属于非结构化数据资源的，则对水利信息资源整体进行描述。');
                    }
                    else if(this.options[index].value=='共享类型'){
                        $("#def").val('水利信息资源的共享类型。包括：无条件共享、有条件共享、不予共享三类。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('');
                        $("#req").val('“无条件共享、有条件共享、不予共享”中的某一类。');
                    }
                    else if(this.options[index].value=='共享条件'){
                        $("#def").val('不同共享类型的水利信息资源的共享条件。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('无条件共享类的水利信息资源，应注明“无条件”；有条件共享类的水利信息资源，应注明具体的共享条件；不予共享类的水利信息资源，应注明相关法律法规或党中央、国务院政策等依据。');
                    }
                    else if(this.options[index].value=='共享方式'){
                        $("#def").val('获取水利信息资源的方式。 ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“系统对接、联机查询、在线浏览、调用在线服务、下载、拷贝、其他”中的某一类。');
                        $("#req").val('1）应通过水信息基础平台，采用系统对接、联机查询、在线浏览或调用在线服务等4种方式实现水利信息资源共享，前述方式能满足应用需求的，不得采用下载、拷贝等方式获取所需水利信息资源；2）采用其他方式共享的，应对所采用的共享方式做具体说明。');
                    }
                    else if(this.options[index].value=='发布日期'){
                        $("#def").val('提供方发布共享水利信息资源的日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='获取途径'){
                        $("#def").val('提供方获取水利信息资源的途径。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('“观测、调查、实验、交换、其他”中的某一类。自由文本，不超过10个字。');
                        $("#req").val('1）“观测”是指对自然现象进行观察或测定获取的数据；“调查”是指为某种需要而进行的野外查勘获取的数据；“实验”是指在野外或者室内以实验方式获取的数据）；“专题”是指针对某一科研专题项目在实施过程中产生的数据；“交换”是指从外单位获取的数据。2）获取途径为“其他”，应对“获取途径”做具体说明。');
                    }
                    else if(this.options[index].value=='栅格影像类型'){
                                               $("#def").val('按照遥感平台（星载，如GF-1、GF-3等；机载如航天飞机、无人机等）、遥感探测波段（全色、多光谱、红外、高光谱、激光雷达、微波、SAR等）等划分的栅格类水利信息资源的影像类型。');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='栅格分辨率'){
                        $("#def").val('与栅格影像上栅格单元边长对应的地面实际距离。');
                        $("#dataType").val('浮点型。');
                        $("#jingdu").val('1）至少精确到小数点后1位；2）大于0。');
                        $("#req").val('计量单位：米。');
                    }
                    else if(this.options[index].value=='成像日期'){
                        $("#def").val('栅格类水利信息资源的影像成像日期。 ');
                        $("#dataType").val('日期型。');
                        $("#jingdu").val('YYYY-MM-DD。');
                        $("#req").val('含有多景影像且各影像成像日期不一致的，应描述影像的成像日期范围。');
                    }
                    else if(this.options[index].value=='空间覆盖范围'){
                        $("#def").val('矢量类或栅格类水利信息资源覆盖的地域范围。  ');
                        $("#dataType").val('字符型。');
                        $("#jingdu").val('自由文本。');
                        $("#req").val('');
                    }
                    else if(this.options[index].value=='影像景数'){
                        $("#def").val('栅格类水利信息资源中涉及的影像数量。 ');
                        $("#dataType").val('整型。');
                        $("#jingdu").val('大于0。');
                        $("#req").val('计量单位：景。');
                    }
                });
                $("#propOption").append("<option value=\"水利信息资源名称\">水利信息资源名称</option> " + "<option value=\"摘要\"\>摘要</option> <option value=\"关键字\">关键字</option> " + "<option value=\"特征分类\">特征分类</option> " +
                    "<option value=\"类别\">类别</option> " + "<option value=\"提供方：提供方名称\">提供方：提供方名称</option> " + "<option value=\"提供方：提供方内部部门\">提供方：提供方内部部门</option> " + "<option value=\"资源维护单位：资源维护单位名称\">资源维护单位：资源维护单位名称</option> " +
                    "<option value=\"资源维护单位：资源维护单位内部部门\">资源维护单位：资源维护单位内部部门</option> " + "<option value=\"格式\">格式</option> " + "<option value=\"属性\">属性</option> " + "<option value=\"共享类型\">共享类型</option> " + "<option value=\"共享条件\">共享条件</option> " +
                    "<option value=\"共享方式\">共享方式</option> " + "<option value=\"发布日期\">发布日期</option> " + "<option value=\"获取途径\">获取途径</option> " + "<option value=\"栅格影像类型\">栅格影像类型</option> " + "<option value=\"栅格分辨率\">栅格分辨率</option>" +
                    "<option value=\"成像日期\">成像日期</option> " + "<option value=\"空间覆盖范围\">空间覆盖范围</option> " + "<option value=\"影像景数\">影像景数</option>");
            }
        },
        dataCheck(){
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
                                $("#tablescorll").show();
                                exlContent=msgJson.data.data;
                                exlTitle=msgJson.data.title;
                                $("#modelthead1").append("<tr>");
                                for (var i=0;i<exlTitle.Cname.length;i++){
                                    $("#modelthead1").append("<td width=3%>" + exlTitle.Cname[i] + "</td>");
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



