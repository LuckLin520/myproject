define(["jquery", "template", "cookie"], function($, template) {
	$("header").load("/html/include/idxHeader.html", function(){
		$.cookie.json = true;
		//判断是否登录
		let user = $.cookie("userInfo");
		if(user){
			$(".bar ul").css({color: "#808080"})
			$(".hello span").text(user.phone).css({color: "#333", fontFamily: "宋体"});
			$(".login a").text("退出登录").css({color: "#a10000"}).click(function(){
				$.removeCookie("userInfo");
				location.reload();
				return false;
			});
			$(".register a").text("更换用户").css({color: "#a10000"}).click(function(){
				$.removeCookie("userInfo");
				location.assign("/html/login.html");
				return false;
			});
		}


		//渲染头部购物车信息
		let car = $.cookie("cart_list");
		if(car && car.length > 0){
			let proObj = {list: car};
			let html = template("hid", proObj);
			let _html = $(".car .hid").html();
			$(".car .hid").html(_html + html);
			$(".car .hid .con").show().prev("p").hide();
			calc();
			//映射数据
			$(".car .hid .rows").each(function(i, v){
				$(v).data("pro", car[i]);
			})
			//删除
			$(".hid .rows .de").click(function(){
				let index = $.inArray($(this).parent(".rows").data("pro"), car);
				car.splice(index, 1);
				$.cookie("cart_list", car, {path: "/"});
				$(this).parent(".rows").css({opacity: 0.6}).slideUp(900, function(){
					calc();
				});

			})
			//公用函数
			function calc(){
				let counts = 0, prices = 0;
				car.forEach(function(v, i){
					counts += Number(v.count);
					prices += v.count * v.price;
				})
				$("div.car em.count").text(counts);//总件数
				//.foot的总价格、总件数
				$(".car .hid .foot .left em").text(prices.toFixed(2));
				$(".car .hid .foot .right em").text(counts);
			}

		}else{
			$(".car .hid p").show();
		}

		$.get("/mock/nav.json", function(data){
			$(".hdbox ul.daohang li").on("mouseenter", function(){
				$(this).find(".spacer").css({display: "block"});
				for(let attr in data.res_body){
					if($(this).text() === attr){
						let html = "", arr = data.res_body[attr];
						arr.forEach(function(v){
							html += `<div><a href="#">${v}</a></div>`;
						})
						$(this).find(".sub").html(html);
					}
				};
				$(this).find(".sub").finish().slideDown();
			})
			$(".hdbox ul.daohang li").on("mouseleave", function(){
				$(this).find(".sub").finish().slideUp(function(){
					$(this).siblings(".spacer").css({display: "none"});
				});
			})
		}, "json")
	});

	$("footer").load("/html/include/idxFooter.html");
});