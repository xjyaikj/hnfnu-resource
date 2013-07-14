var sourceForm = null;//表单
var sourceGrid = null;//右侧表格
var sourceTree = null;//左侧树
var sourceWin = null;//显示的窗口

//增加课程
function add_source(){
    formInit();
    sourceForm.prepend('<input type="file" id="file_upload" name="fileName">');
    sourceWin = $.ligerDialog.open( {
        width : 400,
        height : 550,
        title : "上传资源",
        target : sourceForm,
        buttons : [ {
            text : "提交",
            width : 80,
            onclick : add_save
        }, {
            text : "取消",
            width : 80,
            onclick : add_cancel
        } ]
    });
    $("#file_upload").uploadify({
        debug:false,
        auto:true,//是否自动上传
        height: 30,
        buttonText:'上传资源',
        button_image_url: "/hnfnuzyw/App/Lib/Uploadify/blank.jsp",
        cancelImage:'/hnfnuzyw/App/Lib/Uploadify/uploadify-cancel.png',
        swf : '/hnfnuzyw/App/Lib/Uploadify/uploadify.swf',
        // expressInstall:'App/Lib/Uploadify/expressInstall.swf',
        uploader : '/hnfnuzyw/upload/fileUpload.action', //后台处理上传文件的action
        width : 120 ,
        multi : false,//是否允许多个文件上传
        queueID : 'uploadfileQueue',
        fileObjName : 'fileName', //与后台Action中file属性一样
        //formData : { },//附带值
        successTimeout : 99999,//上传超时时间
        overrideEvents : [ 'onDialogClose' ],
        // fileTypeDesc : '上传文件支持的文件格式:jpg,jpge,gif,png',
        // fileTypeExts : '*.*',//*.jpg;*.jpge;*.gif;*.png
        //queueSizeLimit : 3,//
        simUploadLimit:1,//一次可以上传1个文件
        fileSizeLimit : '2048MB',//上传文件最大值
        //返回一个错误，选择文件的时候触发
        onSelectError : function(file, errorCode, errorMsg) {
            switch (errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"
                        + $('#file_upload').uploadify(
                        'settings',
                        'queueSizeLimit') + "个文件！");
                    break;
                case -110:
                    alert("文件 ["
                        + file.name
                        + "] 大小超出系统限制的"
                        + $('#file_upload')
                        .uploadify('settings',
                        'fileSizeLimit')
                        + "大小！");
                    break;
                case -120:
                    alert("文件 [" + file.name + "] 大小异常！");
                    break;
                case -130:
                    alert("文件 [" + file.name + "] 类型不正确！");
                    break;
            }
        },
        //每次更新上载的文件的进展
        onUploadProgress : function(file, bytesUploaded,
                                    bytesTotal, totalBytesUploaded,
                                    totalBytesTotal) {
            //alert(bytesUploaded);
            //有时候上传进度什么想自己个性化控制，可以利用这个方法
            //使用方法见官方说明
        },
        //检测FLASH失败调用
        onFallback : function() {
            alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
        },
        //上传到服务器，服务器返回相应信息到data里
        onUploadSuccess : function(file, data, response) {
            var fileNameAndPath = data.split(",");
            var path = fileNameAndPath[i];
            path = path.replaceAll(/\\/g,'\\\\');
            $("#url",sourceForm).val(path);
        },
        onSelect : function(file) {
            alert(file.name);
        },
        removeCompleted : true,//上传的文件进度条是否消失
        requeueErrors : false,
        removeTimeout : 2,//进度条消失的时间，默认为3
        progressData : "percentage",//显示上传的百分比
        onUploadError : function(file, errorCode, errorMsg,
                                 errorString, swfuploadifyQueue) {
            $("#dialog-message").html(errorString);
        },
        onError : function(event, queueID, fileObj) {
            alert("文件:" + fileObj.name + " 上传失败");
        }
    });
    //删除文件
    function delFile(obj) {
        $(obj).parent().remove();
    }
}
// 增加课程的保存按钮事件
function add_save() {
    // 把表单转化为数组
    if (sourceForm.valid()) {
        var row_data = Form.parseJSON(sourceForm);
        console.log(row_data);
        // 发往服务器，返回成功后再添加到表格中
        $.ajax( {
            url : '/hnfnuzyw/resources/addSource.action',
            data : row_data,
            type : 'post',
            success : function(data) {
                console.log(data);
                if (data.success) {
                    //courseGrid.addRow(data.model);
                    $.ligerDialog.tip( {
                        title : '提示信息',
                        content : data.message
                    });
                    sourceWin.close();
                } else {
                    $.ligerDialog.error(data.message);
                }
            }
        });
    }
}
// 增加课程的取消按钮事件
function add_cancel() {
    var dlg = $.ligerDialog.waitting('正在撤销已经上传的文件...');
    $.ajax({
        url:'/hnfnuzyw/resources/deleteSource.action',
        data:{url:$("#url",sourceForm).val()},
        type:'post',
        success:function (data) {
            dlg.close();
            if (data.success) {
                sourceWin.close();
            } else {
                $.ligerDialog.error(data.message);
            }
        }
    });
}
//删除课程
function delete_source(){
    if (!sourceGrid.getSelected()) {
        $.ligerDialog.warn("请选择您要删除的行！");
        return;
    }
    var row_data = sourceGrid.getSelected();
    $.ligerDialog.confirm('确认删除' + row_data.name + '?', '删除功能', function(r) {
        if (r) {
            $.ajax( {
                url : '/hnfnuzyw/resources/deleteSource.action',
                data : row_data,
                type : 'post',
                success : function(data) {
                    if (data.success) {
                        $.ligerDialog.tip( {
                            title : '提示信息',
                            content : data.message
                        });
                        sourceGrid.deleteSelectedRow();
                        sourceWin.close();
                    } else {
                        $.ligerDialog.error(data.message);
                    }
                }
            })
        }
    });
}
//编辑课程
function edit_source(){
    formInit();
    if (!sourceGrid.getSelected()) {
        $.ligerDialog.warn("请选择您要修改的行！");
        return;
    }
    // 这个函数的参数为：form，data，作用就是把data放到from
    var sourceGridData = sourceGrid.getSelected();
    Form.loadForm(sourceForm, sourceGridData);
    courseWin = $.ligerDialog.open( {
        width : 400,
        height : 400,
        title : "修改课程",
        target : sourceForm,
        buttons : [ {
            text : "提交",
            width : 80,
            onclick : edit_save
        }, {
            text : "取消",
            width : 80,
            onclick : edit_cancel
        } ]
    });
}
//编辑完成课程后进行保存
function edit_save() {

    if (sourceForm.valid()) {
        var row_data = Form.parseJSON(sourceForm);
        // 发往服务器，返回成功后再修改到表格中
        $.ajax( {
            url : '/hnfnuzyw/resources/updateSource.action',
            data : row_data,
            type : 'post',
            success : function(data) {
                console.log(data);
                if (data.success) {
                    sourceGrid.update(sourceGrid.getSelected(), data.model);
                    $.ligerDialog.tip( {
                        title : '提示信息',
                        content : data.message
                    });
                    sourceWin.close();
                } else {
                    $.ligerDialog.error(data.message);
                }
            }
        });
    }
}
//取消编辑
function edit_cancel() {
    sourceWin.close();
}
//查看资源全部的信息
function all_info(){
    if (!sourceGrid.getSelected()) {
        $.ligerDialog.warn("请选择您要查看的数据。");
        return;
    }
    var sourceGridData = sourceGrid.getSelected();
    $.ligerDialog.open({
        title: '查看全部信息',
        name:'winSelector',
        width: 500,
        height: 550,
        url: 'SourceInfo.jsp?id='+sourceGridData.id
    });
}
//打开一个选择课程的树形结构的对话框
function openTreeDialog(){
    $.ligerDialog.open({
        title: '选择联系人',
        name:'winSelector',
        width: 500,
        height: 500,
        url: 'SelectCourse.html',
        isHidden:false,
        buttons: [
            { text: '确定', onclick: selectOK },
            { text: '取消', onclick: selectCancel }
        ]
    });
    return false;
}
//选择了课程后进行数据处理的函数
function selectOK(item, dialog){
    var fn = dialog.frame.selectCourse || dialog.frame.window.selectCourse;
    var data = fn();
    if (!data){
        alert('请选择行。');
        return;
    }
    if(isCourse(data)){
        $("#courseId",sourceForm).val(data.data.id);
        $("#course",sourceForm).val(data.data.name);
    } else {
        alert('请选择课程。');
        return;
    }

    dialog.close();
}
//取消选择
function selectCancel(item, dialog){
    dialog.close();
}
//判断选择的是否是课程
function isCourse(obj){
    return sourceTree.getParent(sourceTree.getParent(sourceTree.getParent(obj.target)))==null &&
           sourceTree.getParent(sourceTree.getParent(obj.target))!=null;
}
//判断选择的是否是类别
function isCategory(obj){
    return !isCourse(obj) &&
        sourceTree.getParent(sourceTree.getParent(sourceTree.getParent(obj.target)))!=null;
}
//初始化表单
function formInit() {
    var groupicon = "../../../App/Lib/ligerUI/skins/icons/communication.gif";
    sourceForm = $('<form></form>');

    sourceForm.ligerForm( {
        inputWidth : 200,
        labelWidth : 120,
        space : 40,
        fields : [ {
            name : "id",
            type : "hidden"
        }, {
            name : "url",
            type : "hidden"
        }, {
            display : "资源名字",
            name : "name",
            newline : true,
            type : "text",
            group : "必填信息",
            groupicon : groupicon,
            validate : {
                required : true,
                maxlength : 30
            }
        }, {
            display : "所属课程",
            name : "courseId",
            type : "select",
            comboboxName : "course",
            options : {
                textField : "name",
                valueField : "id",
                hideOnLoseFocus : true,
                valueFieldID : "courseId",
                //todo 课程列表要后面获取
                onBeforeOpen:openTreeDialog
            },
            validate : {
                required : true
            }
        }, {
            // todo 这个最后要搞成下拉框的形式，从后台取数据
            display : "所属分类",
            name : "categoryIdList",
            type : "select",
            comboboxName : "category",
            options : {
                textField : "name",
                valueField : "id",
                hideOnLoseFocus:true,
                isMultiSelect : true,
                isShowCheckBox : true,
                valueFieldID : "categoryIdList",
                data : [
                    {"id":"1","name":"文章朗读"},
                    {"id":"2","name":"动画演示"}
                ]
            }
        }, {
            name : 'keyWords',
            display : '关键字(用;分割)',
            type : 'text',
            group : "选填信息",
            groupicon : groupicon,
            newline : true,
            width : 200
        }, {
            name : 'mediaType',
            display : '媒体类型',
            type : 'text',
            newline : true,
            width : 200
        }, {
            name : 'mediaFormat',
            display : '媒体格式',
            type : 'text',
            newline : true,
            width : 200
        }, {
            name : 'playTime',
            display : '播放时间',
            type : 'text',
            newline : true,
            width : 200,
            validate : {
                maxlength : 20
            }
        }, {
            name : 'fileSize',
            display : '文件大小',
            type : 'number',
            newline : true,
            width : 200,
            validate : {
                maxlength : 50
            }
        }, {
            name : 'author',
            display : '作者',
            type : 'text',
            newline : true,
            width : 200,
            validate : {
                maxlength : 100
            }
        }, {
            name : 'publisher',
            display : '出版社',
            type : 'text',
            newline : true,
            width : 200
        }, {
            name : 'description',
            display : '描述',
            type : 'text',
            newline : true,
            width : 200
        }, {
            name : 'price',
            display : '价格',
            type : 'number',
            newline : true,
            width : 200
        }]
    });
    $.metadata.setType("attr", "validate");
    sourceForm.validate( {
        debug : true,
        onkeyup : false,
        errorPlacement : function(error) {
            console.log("error:");
            console.log(error);
            console.log("form:");
            console.log(sourceForm);
            $.ligerDialog.error(error[0].innerHTML);
        }
    });
}
// 页面加载完成后就开始调用
$(function() {
    $("#sourceLayout").ligerLayout({leftWidth:250});
	var toolbarItems = [ {
		text : '上传资源',
		click : add_source,
		icon : 'add',
		key : 'add'
	}, {
		line : true
	}, {
		text : '删除资源',
		click : delete_source,
		icon : 'delete',
		key : 'delete'
	}, {
		line : true
	}, {
		text : '修改资源',
		click : edit_source,
		icon : 'modify',
		key : 'modify'
	}, {
		line : true
	}, {
		text : '详细信息',
		click : all_info,
		icon : 'attibutes',
		key : 'info'
	} ];

	// todo 以后这个ajaxToolbar要通过ajax取过来
	var ajaxToolbar = [ {
		name : 'add'
	}, {
		name : 'modify'
	}, {
		name : 'delete'
	}, {
		name : 'info'
	} ];
	toolbarItems = Toolbar.confirmToolbar(toolbarItems, ajaxToolbar);
    $("#sourceToolBar").ligerToolBar({items:toolbarItems});

    //todo treeJson后台取数据
    var treeJson = [
        {
            "id":"1",
            "name":"一年级",
            "children":[
                {
                    "id":"1",
                    "name":"语文",
                    "children":[
                        {
                            "id":"1",
                            "name":"第一课 小妈妈找蝌蚪",
                            "children":[
                                {
                                    "id":"1",
                                    "name":"文章朗读"
                                },
                                {
                                    "id":"2",
                                    "name":"动画演示"
                                }
                            ]
                        },
                        {"id":"2","name":"第二课 静夜上厕所思"}
                    ]
                },
                {
                    "id":"2",
                    "name":"数学",
                    "children":[
                        {"id":"1","name":"0+0"}
                    ]
                },
                {"id":"3","name":"英语","type":"subject"},
                {"id":"4","name":"政治","type":"subject"},
                {
                    "id":"5",
                    "name":"生物",
                    "children":[
                        {"id":"2","name":"人的进化"}
                    ]
                }
            ]
        },
        {
            "id":"2",
            "name":"二年级",
            "children":[
                {
                    "id":"1",
                    "name":"语文",
                    "children":[
                        {"id":"1","name":"第一课 狂人日志"},
                        {"id":"2","name":"第二课 清明下河图"}
                    ]
                },
                {
                    "id":"2",
                    "name":"数学",
                    "children":[
                        {"id":"1","name":"1+1"}
                    ]
                },
                {"id":"3","name":"英语","type":"subject"},
                {"id":"4","name":"政治","type":"subject"},
                {
                    "id":"5",
                    "name":"生物",
                    "children":[
                        {"id":"2","name":"细胞的故事"}
                    ]
                }
            ]
        }
    ];
    sourceTree = $("#sourceTree").ligerTree({
        nodeWidth:200,
        textFieldName : 'name',
        idFieldName : 'id',
        parentIDFieldName : 'pid',
        checkbox:false,
        data : treeJson,
        onSelect:function(data){
            //todo 通过判断数据的不同，从不同的函数取数据过来，然后更新grid里的数据
            if(isCourse(data)){
                console.log("course");
            } else if(isCategory(data)){
                console.log("category");
            }
        }
    });
    //todo 没有取数据。取数据函数要在上面的sourceTree的点击事件中定义
    var gridJson = {
        "Rows":[
                {"id":"1","name":"课文","keyWords":"","courseId":"1","courseName":"第一课 小妈妈找蝌蚪",
                    "categoryIdList":"1;2","categoryNameList":"文章朗读;动画演示","mediaType":"ppt",
                    "mediaFormat":"ppt","playTime":"00:00:00","fileSize":"1,234KB","author":"吴老师",
                    "publisher":"","description":"小蝌蚪找妈妈的另外一个版本","createDate":"2013-01-22",
                    "approvalStatus":"通过","quality":"高","price":"0","viewTimes":"203","useTimes":"13"}
            ]
        };
    sourceGrid = $("#sourceGrid").ligerGrid( {
        columns : [ {
            display : '资源名',
            name : 'name',
            align : 'left',
            minWidth : 120
        }, {
            display : '关键字',
            name : 'keyWords',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '所属课程ID',
            name : 'courseId',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '所属课程名',
            name : 'courseName',
            align : 'left',
            minWidth : 150
        }, {
            display : '所属类别ID',
            name : 'categoryIdList',
            align : 'left',
            hide : true,
            minWidth : 100
        },  {
            display : '所属类别',
            name : 'categoryNameList',
            align : 'left',
            minWidth : 150
        }, {
            display : '媒体类型',
            name : 'mediaType',
            align : 'left',
            minWidth : 60
        }, {
            display : '媒体格式',
            name : 'mediaFormat',
            align : 'left',
            minWidth : 60
        }, {
            display : '播放时间',
            name : 'playTime',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '文件大小',
            name : 'fileSize',
            align : 'left',
            minWidth : 60
        }, {
            display : '作者',
            name : 'author',
            align : 'left',
            minWidth : 60
        }, {
            display : '出版社',
            name : 'publisher',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '描述',
            name : 'description',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '创建时间',
            name : 'createDate',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '审核状态',
            name : 'approvalStatus',
            align : 'left',
            minWidth : 60
        }, {
            display : '质量等级',
            name : 'quality',
            align : 'left',
            minWidth : 60
        }, {
            display : '价格',
            name : 'price',
            align : 'left',
            hide : true,
            minWidth : 100
        }, {
            display : '访问次数',
            name : 'viewTimes',
            align : 'left',
            minWidth : 60
        }, {
            display : '使用次数',
            name : 'useTimes',
            align : 'left',
            minWidth : 60
        } ],
        data:gridJson,
        height : '98%',
        width : '100%'
    });
	$("#pageloading").hide();
});