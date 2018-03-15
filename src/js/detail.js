require(["config"], function(){
	require(["jquery", "template", "load", "cookie", "zoom"], function($, template){
		$.cookie.json = true;
		//渲染页面动态信息
		let pro = $.cookie("click_pro");
		$(".buyBox .top span").text(pro.title);
		$(".buyBox .title .fl h2").text(pro.title);
		$(".buyBox .con .bigs img").attr("src", pro.img).css({width: "100%", height: "100%"});
		$(".buyBox .con .mins div").css({background: `url(${pro.img}) center/100%`});
		$(".buy .color dl dt").css({background: `url(${pro.img}) center/100%`}).next().text(pro.color);
		$(".buy .already .co").text(pro.color);
		$(".buy .price span").text(Number(pro.price).toFixed(2));
		let size;
		$(".size ul li").click(function(){
			$(".buy .size .info").hide();
			size = $(this).text();
			$(this).css({borderColor: "#a10000"}).addClass("cur").siblings("li").css({borderColor: "#c8c8c8"}).removeClass();
		})
		//渲染.hid内的推荐商品
		$.get("/mock/miaoshaa.json", function(data){
			let introductory = {hidList: data.res_body.data};
			let html = template("introductory", introductory);
			$(".buy .hid .introductory").html(html);
		}, "json")

		//add to cart
		function add(){
			if(size){
				let count = $(".buy .count select option:selected").val();
				pro.size = size;
				pro.count = count;
				let	cart_list = $.cookie("cart_list") || [],
					pidIdx = exist(pro.pid, cart_list);
				if(pidIdx === -1){
					cart_list.push(pro);
				}else{
					let pidArr = existA(pro.pid, cart_list);
					let same = false;
					pidArr.forEach(function(v, i){//遍历所有同类商品判断尺寸是否一样，一样就count++，不然就push
						if(cart_list[v].size === size){
							cart_list[v].count = Number(cart_list[v].count) + Number(count);
							same = true;
						}
					})
					if(!same){
						cart_list.push(pro);
					}
				}
				//添加之后重新渲染头部的购物车信息
				let proObj = {list: cart_list};
				let html = template("hid", proObj);
				$(".car .hid").html(html);
				calc();
				//映射数据
				$(".car .hid .rows").each(function(i, v){
					$(v).data("pro", cart_list[i]);
				})
				//删除
				$(".hid .rows .de").click(function(){
					let index = $.inArray($(this).parent(".rows").data("pro"), cart_list);
					cart_list.splice(index, 1);
					$.cookie("cart_list",cart_list, {path: "/"});
					$(this).parent(".rows").css({opacity: 0.6}).slideUp(900, function(){
						calc();
					});
				})
				$.cookie("cart_list", cart_list, {path: "/"});
				//公用函数
				function calc(){
					let counts = 0, prices = 0;
					cart_list.forEach(function(v, i){
						counts += Number(v.count);
						prices += v.count * v.price;
					})
					$("div.car em.count").text(counts);//总件数
					//.foot的总价格、总件数
					$(".car .hid .foot .left em").text(prices.toFixed(2));
					$(".car .hid .foot .right em").text(counts);
				}

			}else
				$(".buy .size .info").show();
		}

		$(".buy .join .fr").click(function(){
			add();//调用上面函数执行添加
			if(size) $(".buy .hid").show();
			setTimeout(function(){
				$(".buy .hid .loading").hide();
			}, 600);
			//弹出层的购物车计数
			let cart = $.cookie("cart_list");
			let counts = 0, prices = 0;
			cart.forEach(function(v, i){
				counts += Number(v.count);
				prices += v.price * v.count;
			})
			$(".hid p.cou span").text(counts);
			$(".hid p.pri em").text(prices.toFixed(2));
		})
		$(".buy .join .fl").click(function(){
			add();
			if(size) location.assign("/html/cart.html");
		})
		$(".buy .hid .top i").click(function(){
			$(".buy .hid").hide();
			$(".buy .hid .loading").show();
		})
		


		// find a index of value exist in array
		function exist(v, arr){
			for(let i = 0, len = arr.length; i < len; i++){
				if(v === arr[i].pid)
					return i;
			}
			return -1;
		}
		// 将所有同类商品在cookie中的下标放进数组
		function existA(v, arr){
			let _arr = [];
			for(let i = 0, len = arr.length; i < len; i++){
				if(v === arr[i].pid)
					_arr.push(i);
			}
			return _arr;
		}
	})
})