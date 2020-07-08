layui.config({
	base: "{/}/chenyou/lib/layui-v2.5.4/lay/my_modules/"
}).extend({
	layuimini: 'layuimini',
	formSelects: 'formSelects/formSelects-v4',
}).use(['laypage', 'layer', 'form', 'table', 'laydate', 'element', 'layuimini', 'carousel'], function() {
	var laypage = layui.laypage,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		element = layui.element,
		laydate = layui.laydate,
		layuimini = layui.layuimini,
		carousel = layui.carousel;


	 laydate.render({
	    elem: '#date1'
	  });
	  laydate.render({
	    elem: '#date2'
	  });
	
	
	var pageIndex = C.find("pageIndex");	
	var user = C.getCache('admin');
	
	/*if(user.id==1){
		$("legend b").html("是");
	}else{
		$("legend b").html("否");
	}*/
	
	var userName = $('[name="userName"]').val();
	var address = $('[name="address"]').val();
	var identity = $('[name="identity"]').val();
	var phone = $('[name="phone"]').val();
	var sex = $('[name="sex"]').val();
	var isStatus = $('[name="isStatus"]').val();
	var creDate = $('[name="creDate"]').val();
	var updDate = $('[name="updDate"]').val();
	
	var findAjax = function(url, data, success) {
		$.ajax({
			type: "POST",
			url: baseURL + url,
			data: JSON.stringify(data),
			dataType: "JSON",
			contentType:"application/json",
			/*xhrFields: {
				withCredentials: true
			},*/
			async: false,
			beforeSend:function(xhr){
            	xhr.setRequestHeader("X-Token",C.find("X-Token"));
            },
			success: function(result) {
				if (result.errorCode + "" === "0") {
					success(result);
					layer.closeAll('loading');
				} else {
					success(result.msg);
					layer.closeAll('loading');
				}
			},
			error: function(e) {
				layer.msg("系统错误");
				layer.closeAll('loading');
			}
		});
	};
	
	function initTable(data, limit) {
		table.render({
			elem: '#table1',
			height: 'full-160' //高度最大化减去差值
				,
			limit: limit,
			data: data,
			page: false //开启分页
				,
			cols: [
				[{
						field: 'xh',
						title: '序号',
						width: 100,
						align: 'center',
						type: 'numbers',
						templet: function(d) {
							return d.xh;
						}
					},
					{
						field: 'head',
						title: '用户头像',
						width: 150,
						align: 'center',
						templet: function(d) {
							if(d.headImage==null){
								return "<img src='../../images/logo.png'/>";
							}else{
								return "<img src='" + baseURL + d.headImage + "'/>";
							}
							
						}
					},
					{
						field: 'userName',
						title: '登录名',
						width: 100,
						align: 'center',
						templet: function(d) {
							return d.userName;
						}
					},
					{
						field: 'phone',
						title: '用户手机号',
						width: 120,
						align: 'center',
						templet: function(d) {
							return d.phone;
						}
					},/*
					{
						field: 'sex',
						title: '性别',
						width: 200,
						align: 'center',
						templet: function(d) {
							if (d.sex == 0) {
								return "男";
							} else {
								return "女";
							}
						}
					},*/
					{
						field: 'address',
						title: '住址',
						width: 200,
						align: 'center',
						templet: function(d) {
							if (d.address == null) {
								return "略";
							} else {
								return d.address;
							}
						}
					},
					{
						field: 'sex',
						title: '性别',
						width: 120,
						align: 'center',
						templet: function(d) {
							if (d.sex == 0) {
								return "男";
							} else {
								return "女";
							}
						}
					},
					{
						title: '当前状态',
						width: 120,
						align: 'center',
						templet: function(d) {
							if (d.isStatus == 0) {
								return "正常";
							} else {
								return "冻结";
							}
						}
					},
					{
						field: 'identity',
						title: '身份证',
						width: 200,
						align: 'center',
						templet: function(d) {
							if (d.identity == null) {
								return "--";
							} else {
								return d.identity;
							}
						}
					},/*
					{
						field: 'vxCode',
						title: '微信号',
						width: 200,
						align: 'center',
						templet: function(d) {
							if (d.vxCode == null) {
								return "--";
							} else {
								return d.vxCode;
							}
						}
					},*/
					/*{
						field: 'dongJie',
						title: '状态',
						align: 'center',
						templet: function(d) {
							if (d.dongJie == 0) {
								return "<span style='color:green;'>正常</span>";
							} else if (d.dongJie == 1) {
								return "<span style='color:red;'>冻结</span>";
							}
						}
					},*/
					
					{
						field: 'creDate',
						title: '创建时间',
						width: 200,
						align: 'center',
						templet: function(d) {
							return d.creDate;
						}
					},
					{
						field: 'updDate',
						title: '修改时间',
						width: 200,
						align: 'center',
						templet: function(d) {
							if (d.updDate == null) {
								return "--";
							} else {
								return d.updDate;
							}
						}
					},
					{
						field: 'id',
						title: '权限',
						width: 150,
						align: 'center',
						fixed: 'right',
						templet: function(d) {
							if(d.isAdmin == 1){
								if(d.isStatus == 0){
									return "<button class='layui-btn layui-btn-xs layui-btn-normal' lay-event='qx'>权限设置</button>"+
									       "<button class='layui-btn layui-btn-xs layui-btn-danger' lay-event='del'>冻结</button>";
								}else{
									return "<button class='layui-btn layui-btn-xs layui-btn-normal' lay-event='qx'>权限设置</button>"+
									       "<button class='layui-btn layui-btn-xs ' lay-event='recovery'>恢复</button>";
								}
								
							}else if(d.id == user.id){
								return "--";
							}else{
								return "--";
							}
						}
					},
					{
						field: 'dongJie',
						title: '操作',
						width: 280,
						fixed: 'right',
						align: 'center',
						templet: function(d) {
								return "<button class='layui-btn layui-btn-xs layui-btn-normal' lay-event='updateinfo'>编辑</button>"+
								      	"<button class='layui-btn layui-btn-xs layui-btn-normal' lay-event='xiangqing'>查看详情</button>"+
								       "<button class='layui-btn layui-btn-xs layui-btn-warm' lay-event='chushi'>恢复初始密码</button>";
							
							
						}
					}
					
				]
			]
		});
	}
	
	
	function initPage(total, limit, curr) {
		//执行一个laypage实例
		laypage.render({
			elem: 'page',
			count: total,
			limit: limit,
			curr: curr,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh'],
			jump: function(obj, first) {
				//首次不执行
				if (!first) {
					pageIndex = curr;
					var userName = $('[name="userName"]').val();
					var address = $('[name="address"]').val();
					var identity = $('[name="identity"]').val();
					var phone = $('[name="phone"]').val();
					var sex = $('[name="sex"]').val();
					var isStatus = $('[name="isStatus"]').val();
					var creDate = $('[name="creDate"]').val();
					var updDate = $('[name="updDate"]').val();
					show(userName,address,identity,phone,sex,isStatus,creDate,updDate,obj.curr, obj.limit);
				}
				
				
			}
		});
	}
	
	
	
	function show(userName,address,identity,phone,sex,isStatus,creDate,updDate,pageIndex,pageSize) {
		C.save("pageIndex",pageIndex);
		findAjax("manager/pageAdmins", {
			"address": address,
		    "creDate": creDate,
		    "identity": identity,
		    "isStatus": isStatus,
		    "pageIndex": pageIndex,
		    "pageSize": pageSize,
		    "phone": phone,
		    "sex": sex,
		    "updDate": updDate,
		    "userName": userName
		}, function(res) {
			if (res) {
				initTable(res.body.records, pageSize);
				initPage(res.body.total, pageSize, pageIndex);
				$(".topcon b").html('当前一共有<b style=color:#ff5722>'+res.body.total+'</b>位管理员');
			}
		});
	}
	
	$('[lay-filter="search"]').on('click', function(obj) {
		var userName = $('[name="userName"]').val();
		var address = $('[name="address"]').val();
		var identity = $('[name="identity"]').val();
		var phone = $('[name="phone"]').val();
		var sex = $('[name="sex"]').val();
		var isStatus = $('[name="isStatus"]').val();
		var creDate = $('[name="creDate"]').val();
		var updDate = $('[name="updDate"]').val();
		show(userName,address,identity,phone,sex,isStatus,creDate,updDate,pageIndex,10);
		//console.log(userName+"--"+address+"--"+identity+"--"+phone+"--"+sex+"--"+isStatus+"--"+creDate+"--"+updDate+"--")
		//show(creDate, delDate, phone, adminName, dongJie, sex, pageSize, pageIndex, guanwangId);
	});
	
	show(userName,address,identity,phone,sex,isStatus,creDate,updDate,pageIndex,10);
	
	
	
	table.on('tool(table1)',function(obj){
		var data = obj.data; //获得当前行数据
		var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
		var tr = obj.tr; //获得当前行 tr 的DOM对象
		
		if(layEvent === 'qx'){
			layuimini.goPage("pages/adminsManage/quanxian.html?userid="+data.id+"", "设置用户权限");
		}else if(layEvent === 'del'){
			//冻结
			if(user.id == data.id){
				layer.msg("不能冻结自己!");
				return;
			}else{
				layer.confirm("是否确认冻结",function(){
					findAjax("manager/updateManagerInfo",{
						id : data.id,
						isStatus: 1
					},function(res){
						layer.msg("冻结成功",function(obj){
							var userName = $('[name="userName"]').val();
							var address = $('[name="address"]').val();
							var identity = $('[name="identity"]').val();
							var phone = $('[name="phone"]').val();
							var sex = $('[name="sex"]').val();
							var isStatus = $('[name="isStatus"]').val();
							var creDate = $('[name="creDate"]').val();
							var updDate = $('[name="updDate"]').val();
							show(userName,address,identity,phone,sex,isStatus,creDate,updDate,pageIndex,10);
						});
					});
				});
			}
			
		}else if(layEvent === 'recovery'){
			layer.confirm("是否确认解除",function(){
				findAjax("manager/updateManagerInfo",{
					id : data.id,
				    isStatus: 0
				},function(res){
					layer.msg("解除成功",function(obj){
						var userName = $('[name="userName"]').val();
						var address = $('[name="address"]').val();
						var identity = $('[name="identity"]').val();
						var phone = $('[name="phone"]').val();
						var sex = $('[name="sex"]').val();
						var isStatus = $('[name="isStatus"]').val();
						var creDate = $('[name="creDate"]').val();
						var updDate = $('[name="updDate"]').val();
						show(userName,address,identity,phone,sex,isStatus,creDate,updDate,pageIndex,10);
					});
				});
			});
		}else if(layEvent === 'xiangqing'){
			layuimini.goPage("pages/adminsManage/detail.html?userId=" + data.id, "查看用户详情");
		}else if(layEvent === 'chushi'){
			layer.confirm("是否恢复初始密码",function(){
				findAjax("manager/updatePassWord",{
					 "chushiorUpdatePassWord": 1,
  					 "id": data.id,
				},function(res){
					layer.msg("恢复成功",function(obj){
						var userName = $('[name="userName"]').val();
						var address = $('[name="address"]').val();
						var identity = $('[name="identity"]').val();
						var phone = $('[name="phone"]').val();
						var sex = $('[name="sex"]').val();
						var isStatus = $('[name="isStatus"]').val();
						var creDate = $('[name="creDate"]').val();
						var updDate = $('[name="updDate"]').val();
						show(userName,address,identity,phone,sex,isStatus,creDate,updDate,pageIndex,10);
					});
				});
			});
		}else if(layEvent === 'updateinfo'){
			layuimini.goPage("pages/adminsManage/update.html?userId=" + data.id, "修改信息");
		}
		
	
	});
	
	$('[lay-filter="addAdmin"]').on('click', function (obj) {
		location.replace("add.html");
	});
	
	

});