require(["config"], function(){
	 require(["jquery", "cookie"], function($){
        //表单焦点事件改变placeholder值
        $("form input").focus(function(){
            $(this).siblings("p").show();
            $(this).data("pla", $(this).attr("placeholder"));
            $(this).attr("placeholder", "");
        }).blur(function(){
            $(this).attr("placeholder",  $(this).data("pla"));
        })
        $(".code").css({cursor: "pointer"}).click(function(){
            let code = generateValidateCode(6);
            $(".code").text(code);
        })
        //图片验证码验证
        let _code = false;
        let code = generateValidateCode(6);
        $(".code").text(code);
        $(".check input").blur(function(){
            if($(this).val() === ""){
                _code = false;
                $(".code").next("p").show().text("请输入验证码！");
            }else if($(this).val() === code){
                _code = true;
                $(".code").next("p").hide();
            }else{
                _code = false;
                code = generateValidateCode(6);
                $(".code").text(code).next("p").show().text("验证码输入有误！(区分大小写)");
            }
        })
        //手机号格式验证
        let _phone = false;
        $(".phone input").blur(function(){
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(reg.test($(this).val())){
                _phone = true;
                $(this).siblings("p").hide().text("请填写真实的手机号，并进行验证").css({color:"#999"});
            }else{
                _phone = false;
                $(this).siblings("p").show().text("请输入有效的手机号！").css({color:"#a10000"});
            }
        })
        //手机验证码验证
        $(".sjcode input").val("手机验证码功能未完善").attr("disabled", true)
        //第一次密码验证
        let _one = false;
        $(".one input").blur(function(){
            let reg = /^.{6,16}$/;
           if(reg.test($(this).val())){
                _one = true;
                $(this).siblings("p").hide().text("6-16位字符，可使用字母、数字或符号的组合").css({color:"#999"});
            }else{
                _one = false;
                $(this).siblings("p").show().text("密码不符合规范！(6-16位字符，可使用字母、数字或符号的组合)").css({color:"#a10000"});
            }
        });
        //第二次密码验证
        let _two = false;
        $(".two input").blur(function(){
            if($(this).val() !== $(".one input").val()){
                _two = false;
                $(this).siblings("p").text("两次输入密码不一致，请从新输入！").css({color: "#a10000"});
            }else{
                _two = true;
                 $(this).siblings("p").hide().text("请再次输入登录密码，两次输入必须一致").css({color: "#999"});
            }
        })
        //checkbox已阅读
        $("form :checkbox").click(function(){
            if($(this).is(":checked"))
                 $(".sbt").css({background: "#b52024"});
            else
                 $(".sbt").css({background: "#9a9a9a"});
        })

	 	let isPhoneExist = true;
       $(".phone input").blur(function(){
       		$.get("http://localhost/phpvancl/check.php", "phone="+$(this).val(), function(data){
       			if(data.res_body.status === 0){//可用
       				isPhoneExist = false;
       			}else if(data.res_body.status === 1){
                     $(".phone p").show().text("手机号已被注册！").css({color:"#a10000"})
       				isPhoneExist = true;
       			}
       		}, "json")
       });

       $("form .sbt").click(function(){
       		if(!isPhoneExist && _code && _phone && _one && _two){
       			$.post("http://localhost/phpvancl/register.php", $("form").serialize(),(data)=>{
       				if(data.res_code === 0){
       					let t = 5000;
						$.cookie.json = true;
						$.cookie("userInfo", data.res_body, {path: "/"});
						$(this).next().text("注册成功!"+ t/1000 +"秒后跳转至首页。。。");
						setInterval(()=>{
							t += -1000;
							$(this).next().text("注册成功!"+ t/1000 +"秒后跳转至首页。。。");
							if(t === 0){
								location.assign("/index.html");
							}
						}, 1000)
       				}else{
       					$(this).next().text("注册失败！");
       				}
       			}, "json")
       		}
       		return false;
       })

        //获取随机验证码
        function generateValidateCode(length){
            if (typeof length === "undefined")
                length = 4;
            var arr = new String();
            for(var i = 0; i < length; i++){
                var randomA = Math.floor(Math.random()*(91-65)+65),
                    randoma = Math.floor(Math.random()*(123-97)+97),
                    number = String(Math.floor(Math.random()*10)),
                    ABC = String.fromCharCode(String(randomA)),
                    abc = String.fromCharCode(String(randoma));
                var newArr = [abc,ABC,number];
                var j = Math.floor(Math.random()*3);
                arr += newArr[j];
            }
            return arr;
        }
    });  
})