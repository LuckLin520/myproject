<?php 
	header("Access-Control-Allow-Origin:*");
	// 获取注册的用户名、密码、电话、地址
	// $email = $_POST["email"];
	$password = $_POST["password"];
	$phone = $_POST["phone"];
	// $firstname = $_POST["firstname"];
	// $lastname = $_POST["lastname"];

	/* 向数据库中保存注册的用户信息 */
	// 连接服务器
	mysql_connect("localhost:3306", "root", "");

	// 设置读写库编码
	mysql_query("set character set 'utf8'");
	mysql_query("set names 'utf8'");

	// 选择数据库
	mysql_select_db("vancl");
	// 创建插入语句
	$sql = "INSERT INTO mall_users (password, phone) VALUES('$password', '$phone')";
	// 执行SQL语句，返回执行结果，true表示执行成功，false表示执行失败
	$result = mysql_query($sql);

	// 判断是否注册成功
	if ($result) {
		$sql = "SELECT uid, phone, score, level, createtime FROM mall_users WHERE phone='$phone'";
		$result = mysql_query($sql);
		if ($row = mysql_fetch_array($result, MYSQL_ASSOC)) { //MYSQL_NUM的话结果就是数组
			echo '{"res_code":0, "res_error":"", "res_body":'. json_encode($row) .'}';
		} else {
			echo '{"res_code":-1, "res_error":"注册用户信息查询失败", "res_body":{}}';
		}
	} else {
		echo '{"res_code":-2, "res_error":"用户注册失败，请重新注册", "res_body":{}}';
	}

	// 关闭数据库连接
	mysql_close();
 ?>