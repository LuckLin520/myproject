require(["config"], function(){
	require(["jquery", "template", "cookie"], function($, template){
		$.cookie.json = true;
		let user = $.cookie("userInfo");
		
		if(user){
			$(".user .name span").text(user.phone).css({color: "#333"}).parent().next().children("a").text("退出登录").click(function(){
				$.removeCookie("userInfo",{path: "/"});
				location.reload();
				return false;
			}).parent().next().children("a").text("更换用户").click(function(){
				$.removeCookie("userInfo",{path: "/"});
				location.assign("/html/login.html");
				return false;
			});
		}

		let car = $.cookie("cart_list");
		if(car && car.length > 0){
			let carlist = {pro: car};
			let html = template("cart_list", carlist);
			$("table tbody").html(html);
			//用jq的data方法映射商品数据
			$("table tbody tr").each(function(i, v){
				$(v).data("proInfo", car[i]);
			})

			//数量+、-及按钮效果
			$("tbody .count input").each(function(i, v){
				if($(v).val() === "1")
					$(v).prev(".sub").css({backgroundPosition: "-85px 0"});
				else if($(v).val() > 1)
					$(v).prev(".sub").css({backgroundPosition: "-51px 0"});
			});
			$("tbody .count i").hover(function(){
				let val =  $(this).siblings("input").val();
				if($(this).is(".sub") && val > 1){
					$(this).css({backgroundPosition: "-68px 0", cursor: "pointer"});
				}else if($(this).is(".add")){
					$(this).css({backgroundPosition: "-17px 0", cursor: "pointer"});
				}
			}, function(){
				let val =  $(this).siblings("input").val();
				if($(this).is(".sub") && val > 1){
					$(this).css({backgroundPosition: "-51px 0"});
				}else if($(this).is(".add")){
					$(this).css({backgroundPosition: "0 0"});
				}
			});
			$("tbody .count i").click(function(){
				let val =  $(this).siblings("input").val();
				let index = $.inArray($(this).parents("tr").data("proInfo"), car);
				if($(this).is(".sub") && val > 1){
					car[index].count--;
					if(car[index].count === 1){
						$(this).css({backgroundPosition: "-85px 0", cursor: "initial"});
					}
				}else if($(this).is(".add")){
					car[index].count++;
					$(this).siblings(".sub").css({backgroundPosition: "-51px 0"});
				}
				$(this).siblings("input").val(car[index].count);
				//改变小计
				let re = car[index].count * car[index].price;
				$(this).parents("td").siblings(".prices").find("span").text(re.toFixed(2));
				//改变cookie
				$.cookie("cart_list", car, {path: "/"});
				calcs();//调用下方IIFE
			});
			//删除
			$("tbody .de a").click(function(){
				$(this).next(".hid").show().click((e)=>{
					if($(e.target).is(".yes")){
						$(this).parents("tr").remove();
						let index = $.inArray($(this).parents("tr").data("proInfo"), car);
						car.splice(index, 1);
						$.cookie("cart_list", car, {path: "/"});
						calcs();//调用下方IIFE
					}else if($(e.target).is(".no")){
						$(this).next(".hid").hide();
					}
				});

			})
			//单选、多选
			$("thead :checkbox").click(function(){
				$("tbody :checkbox").prop("checked", $(this).prop("checked"));
				changeBg();
			})
			$("tbody :checkbox").click(function(){
				let isAll =  $("tbody :checkbox:checked").length === car.length;
				$("thead :checkbox").prop("checked", isAll);
				changeBg();
			})
			function changeBg(){
				$("tbody :checkbox:checked").parents("tr").css({background: "#f8f8f8"});
				$("tbody :checkbox").not(":checked").parents("tr").css({background: "#fff"});
			};
			//删除选中商品
			$("div.calc .bar .de").click(function(){
				$("tbody :checkbox:checked").parents("tr").each(function(i, v){
					let index = $.inArray($(v).data("proInfo"), car);
					car.splice(index, 1);
					$.cookie("cart_list", car, {path: "/"});
					calcs();//调用下方IIFE
					$(v).remove();
				})
			})

			
			//改变合计价格、数量（复用代码）
			var calcs = (function calc(){
				let counts = 0, prices = 0;
				car.forEach(function(v, i){
					counts += Number(v.count);
					prices += v.count * v.price;
				})
				$("div.calc .price i").text(prices.toFixed(2));
				$("div.calc .bar .total span").text(counts);
				if(car.length === 0){
					$("main table").hide().next(".calc").hide().next("p.no_product").show();
				}
				return calc;
			})();
		}else{
			$("main table").hide().next(".calc").hide().next("p.no_product").show();
		}
	})
})