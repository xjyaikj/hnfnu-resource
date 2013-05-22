var grid = null;
var addMenuForm = null;
var menuFormWin = null;
// 按钮的click事件
function update_menu(item) {
	$.ligerDialog.alert(item.text);
}
// 增加菜单的函数
function add_menu() {

	formInit();

	menuFormWin = $.ligerDialog.open({
		width : 400,
		height : 400,
		title : "新增菜单",
		target : addMenuForm,
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
}
// 增加菜单的保存按钮事件
function add_save() {
	// 把表单转化为数组
	var row_data = Form.parseJSON(addMenuForm);
	console.log(row_data);
	// 发往服务器，返回成功后再添加到表格中
	$.ajax({
		url : '/hnfnuzyw/system/addMenu.action',
		data : row_data,
		type : 'post',
		success : function(data) {
			console.log(data);
			if (data.success) {
				grid.addRow(data.model);
				menuFormWin.close();
			}
		}
	})

}
// 增加菜单的取消按钮事件
function add_cancel() {
	menuFormWin.close();
}

// 删除菜单的函数
function delete_menu() {
	if (!grid.getSelected()) {
		$.ligerDialog.warn("请选择您要删除的行！");
		return;
	}
	var row_data = grid.getSelected();
	$.ligerDialog.confirm('确认删除' + row_data.name + '?', '删除功能', function(r) {
		if (r) {
			// todo 进行ajax操作，成功后在回调函数里删除选择的行
			$.ajax({
				url : '/hnfnuzyw/system/deleteMenu.action',
				data : row_data,
				type : 'post',
				success : function(data) {
					console.log(data);
					if (data.success) {
						grid.deleteSelectedRow();
					}
				}
			})
		}
	});

}

// 修改菜单的函数
function edit_menu() {
	formInit();
	if (!grid.getSelected()) {
		$.ligerDialog.warn("请选择您要修改的行！");
		return;
	}
	// 这个函数的参数为：form，data，作用就是把data放到from
	Form.loadForm(addMenuForm, grid.getSelected());
	menuFormWin = $.ligerDialog.open({
		width : 400,
		height : 400,
		title : "修改菜单",
		target : addMenuForm,
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
function edit_save() {
	var row_data = Form.parseJSON(addMenuForm);
	// todo 需要发往服务器，返回成功后再修改到表格中
	$.ajax({
		url : '/hnfnuzyw/system/updateMenu.action',
		data : row_data,
		type : 'post',
		success : function(data) {
			console.log(data);
			if (data.success) {
				grid.update(grid.getSelected(), data.model);
				menuFormWin.close();
			}
		}
	})

}
function edit_cancel() {
	menuFormWin.close();
}
// 初始化表单，生成form标签
function formInit() {
	var groupicon = "../../../App/Lib/ligerUI/skins/icons/communication.gif";
	addMenuForm = $('<form></form>');
	addMenuForm.ligerForm({
		inputWidth : 200,
		labelWidth : 90,
		space : 40,
		fields : [ {
			name : "id",
			type : "hidden"
		}, {
			display : "菜单名字",
			name : "name",
			newline : true,
			type : "text",
			group : "必填信息",
			groupicon : groupicon
		}, {
			display : "菜单链接",
			name : "url",
			newline : true,
			type : "text"
		}, {
			display : "功能列表",
			name : "functionIdList",
			type : "select",
			comboboxName : "functionId",
			options : {
				textField : "remark",
				valueField : "name",
				isMultiSelect : true,
				isShowCheckBox : true,
				valueFieldID : "functionIdList",
				url : "../../../Json/Function.json"
			}
		}, {
			display : "图标链接",
			name : "icon",
			type : "text",
			group : "可选信息",
			groupicon : groupicon
		}, {
			display : "上级菜单",
			name : "parentId",
			type : "select",
			comboboxName : "parentIdList",
			options : {
				valueFieldID : "parentId",
				url : "../../../Json/ParentMenu.json"
			}
		} ]
	});
}

// 页面加载完成后就开始调用
$(function() {

	var toolbarItems = [ {
		text : '增加',
		click : add_menu,
		icon : 'add',
		key:'add'
	}, {
		line : true
	}, {
		text : '删除',
		click : delete_menu,
		icon : 'delete',
		key:'delete'
	}, {
		line : true
	}, {
		text : '修改',
		click : edit_menu,
		icon : 'modify',
		key:'modify'
	}, {
		line : true
	}, {
		text : '刷新',
		click : update_click,
		icon : 'refresh',
		key:'refresh'
	} ];
	
	
	//todo 以后这个ajaxToolbar要通过ajax取过来
    var ajaxToolbar = [
        {name:'add'},
        {name:'modify'},
        {name:'delete'},
        {name:'refresh'}
    ];
    toolbarItems = Toolbar.confirmToolbar(toolbarItems,ajaxToolbar);

    
    $.ajax({
        url:'/hnfnuzyw/system/listMenu.action',
        type:'post',
        success:function(data){
        	grid = $("#menuGrid").ligerGrid({
        		columns : [ {
        			display : '菜单id',
        			name : 'id',
        			align : 'left',
        			width : 120
        		}, {
        			display : '菜单名字',
        			name : 'name',
        			align : 'left',
        			minWidth : 80
        		}, {
        			display : '菜单链接',
        			name : 'url',
        			align : 'left',
        			minWidth : 120
        		}, {
        			display : '功能列表',
        			name : 'functionIdList',
        			align : 'left',
        			minWidth : 100
        		}, {
        			display : '图标链接',
        			name : 'icon',
        			align : 'left',
        			minWidth : 120
        		}, {
        			display : '上级菜单',
        			name : 'parentId',
        			align : 'left',
        			minWidth : 100
        		} ],
        		data:data.menuList,
        		height : '98%',
        		width : '100%',
        		toolbar : {
        			 items:toolbarItems
        		}
        	});
        }
	});
	$("#pageloading").hide();
});