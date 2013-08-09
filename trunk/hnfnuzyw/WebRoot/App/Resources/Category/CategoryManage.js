var categoryGrid = null;// 类别表格
var categoryFrom = null;// 类别表单
var categoryWin = null;// 类别窗口

// 增加类别的函数
function add_catecory() {
    formInit();
    categoryWin = $.ligerDialog.open({
        width : 400,
        height : 200,
        title : '新增类别',
        target : categoryFrom,
        buttons : [ {
            text : '提交',
            width : 80,
            onclick : add_save
        }, {
            text : '取消',
            width : 80,
            onclick : add_cancel
        } ]
    });
}
// 增加类别的保存按钮事件
function add_save() {
    if (categoryFrom.valid()) {
        var row_data = Form.parseJSON(categoryFrom);
        // 发往服务器，返回成功后再添加到表格中
        $.ajax({
            url : '/hnfnuzyw/resources/addCategory.action',
            data : row_data,
            type : 'post',
            success : function(data) {
                if (data.success) {
                    categoryGrid.addRow(data.model);
                    $.ligerDialog.tip({
                        title : '提示信息',
                        content : data.message
                    });
                    categoryWin.close();
                } else {
                    $.ligerDialog.error(data.message);
                }
            }
        });
    }
}
// 增加类别的取消按钮事件
function add_cancel() {
    categoryWin.close();
}
// 修改类别的函数
function edit_category() {
        formInit();
    if (!categoryGrid.getSelected()) {
        $.ligerDialog.warn('请选择您要修改的行.');
        return;
    }
    Form.loadForm(categoryFrom, categoryGrid.getSelected());
    categoryWin = $.ligerDialog.open({
        width : 400,
        height : 200,
        title : '编辑类别',
        target : categoryFrom,
        buttons : [ {
            text : '提交',
            width : 80,
            onclick : edit_save
        }, {
            text : '取消',
            width : 80,
            onclick : edit_cancel
        } ]
    });
}
// 修改类别的保存按钮事件
function edit_save() {
    if (categoryFrom.valid()) {
        var row_data = Form.parseJSON(categoryFrom);
        // todo 需要发往服务器，返回成功后再修改到表格中
        $ .ajax({
                url : '/hnfnuzyw/resources/updateCategory.action',
                data : row_data,
                type : 'post',
                success : function(data) {
                    if (data.success) {
                        categoryGrid.update(categoryGrid.getSelected(),
                            data.model);
                        $.ligerDialog.tip({
                            title : '提示信息',
                            content : data.message
                        });
                        categoryWin.close();
                    } else {
                        $.ligerDialog.error(data.message);
                    }
                }
            });
    }
}
// 修改类别的取消按钮事件
function edit_cancel() {
    categoryWin.close();
}

// 删除类别的函数
function delete_category() {
    if (!categoryGrid.getSelected()) {
        $.ligerDialog.warn('请选择您要删除的行.');
        return;
    }
    var row_data = categoryGrid.getSelected();
    $.ligerDialog.confirm('确认删除' + row_data.name + '？', '删除类别', function(r) {
        if (r) {
            $.ajax({
                url : '/hnfnuzyw/resources/deleteCategory.action',
                data : row_data,
                type : 'post',
                success : function(data) {
                    if (data.success) {
                        $.ligerDialog.tip({
                            title : '提示信息',
                            content : data.message
                        });
                        categoryGrid.deleteSelectedRow();
                        categoryWin.close();
                    } else {
                        $.ligerDialog.error(data.message);
                    }
                }
            });
        }
    });
}
// 初始化表单，生成form标签
function formInit() {
    categoryFrom = $('<form></form>');
    categoryFrom.ligerForm({
        inputWidth : 280,
        fields : [ {
            name : 'id',
            type : "hidden"
        }, {
            display : '类别名称',
            name : 'name',
            type : 'text',
            space : 30,
            labelWidth : 100,
            width : 220,
            newline : true,
            validate : {
                required : true,
                maxlength : 22
            }
        }, {
            display : '备注',
            name : 'remark',
            type : 'text',
            space : 30,
            labelWidth : 100,
            width : 220,
            newline : true
        } ]
    });
    $.metadata.setType("attr", "validate");
    categoryFrom.validate({
        debug : true,
        onkeyup : false,
        errorPlacement : function(error) {
            $.ligerDialog.error(error[0].innerHTML);
        }
    });
}
// 初始化表格
$(function() {
    var toolbarItems = [ {
        text : '新增类别',
        click : add_catecory,
        icon : 'add',
        key : 'add'
    }, {
        text : '修改类别',
        click : edit_category,
        icon : 'modify',
        key : 'modify'
    }, {
        text : '删除类别',
        click : delete_category,
        icon : 'delete',
        key : 'delete'
    } ];
    // todo 以后这个ajaxToolbar要通过ajax取过来
    var ajaxToolbar = [ {
        name : 'add'
    }, {
        name : 'delete'
    }, {
        name : 'modify'
    } ];
    toolbarItems = Toolbar.confirmToolbar(toolbarItems, ajaxToolbar);

    $.ajax({
        url : '/hnfnuzyw/resources/listCategory.action',
        type : 'post',
        success : function(data) {
            categoryGrid = $('#categoryGrid').ligerGrid({
                columns : [
                    // { display:'ID', name:'id', align:'left', width:100 },
                    {
                        display : '类别名称',
                        name : 'name',
                        width : 200
                    }, {
                        display : '备注',
                        name : 'remark',
                        align : 'left',
                        width : 800
                    } ],
                width : '99%',
                height : '98%',
                pageSize : 30,
                data : data.categoryList,
                toolbar : {
                    items : toolbarItems
                }
            });
            $("#pageloading").hide();
        }
    });
});