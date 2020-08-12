var keyword = '';
/**
 * synInfo : 待传输给后台的数据结构
 *      - mdfileidList   选择部分结果时，记录的元数据 mdfileid;
 *      - sourceNode     源系统目录的选择节点
 *      - syncTo         目标系统的名称
 *      - ifSync         是否筛选同步状态
 */
var synInfo = {};

var node_id = 1000;
MenuSyncPage={
    load:function () {
        CatalogPage.pageLeave();
        $(".sidebar-menu .treeview-menu li").removeClass("active");
        $(".sidebar-menu .menuSync").addClass("active");
        $("#count").empty();
        $("#pagination").empty();

        var data={};
        getStringData('/indexManager/sync',data,function (msg) {
            $(".content-wrapper").html(msg);
            // $.ajax({
            //     //url:'/ReSourceDir/initialReSourceDirTree',
            //     url:'/ReSourceDir/initialRevokeReSourceDirTree',
            //     dataType:"JSON",
            //     async : false,
            //     type:"GET",
            //     success:function(dataStr){
            //         //成功时初始化这棵树
            //         try{
            //             $.fn.zTree.init($("#serviceTree"), setting, dataStr);
            //         }catch(cer){
            //             console.log(cer);
            //         }},
            //     error:function(msg){
            //        alert("初始化目录树错误！");
            //     }
            // });   //这里是ajax的结尾
        });
    }
}



