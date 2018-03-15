require(["config"], function(){
	require(["jquery", "cookie"], function($){
		$("form .sbt").click(function(){
			$.post("http://localhost/phpvancl/login.php",$("form").serialize(), (data)=>{
				if(data.res_code === 0){
					console.log(data.res_body)
					let t = 5000;
					$.cookie.json = true;
					$.cookie("userInfo", data.res_body, {path: "/"});
					$(this).next().text("登录成功!"+ t/1000 +"秒后跳转至首页。。。");
					setInterval(()=>{
						t += -1000;
						$(this).next().text("登录成功!"+ t/1000 +"秒后跳转至首页。。。");
						if(t === 0){
							location.assign("/index.html");
						}
					}, 1000)
				}else{
					$(this).next().text("手机或密码错误！");
				}
			}, "json");
			return false;
		})
	})
})