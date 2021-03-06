require(["config"], function(){
	require(["jquery", "template", "carousel", "load", "cookie"], function($, template){
		let imgObj = [
				{url: "/images/carousel/1.jpg", href: "http://www.vancl.com"},
				{url: "/images/carousel/2.jpg", href: "http://www.vancl.com"},
				{url: "/images/carousel/3.jpg", href: "http://www.vancl.com"},
				{url: "/images/carousel/4.jpg", href: "http://www.vancl.com"},
				{url: "/images/carousel/5.jpg", href: "http://www.vancl.com"}
		];
		$("main .banner").carousel(imgObj, 1200, 535, "fade");
		//渲染每日秒杀
		$.cookie.json = true;
		$.get("/mock/miaosha.json", function(data){
			let html = template("miaosha", data.res_body);
			$(".miaosha .pro_miaosha").html(html).on("click", "a", function(){//点击商品进入详情页
				let cook = {
					pid: $(this).children(".color").attr("pid"),
					img: $(this).children("img").attr("src"),
					price: $(this).find(".price span").text(),
					title: $(this).children(".title").text(),
					color: $(this).children(".color").text(),
					count: 1
				}
				$.cookie("click_pro", cook);
				location.assign("/html/detail.html");
				return false;
			});
		}, "json");
		//倒计时
		function MSchange(ms){//毫秒转换日、时、分、秒、毫秒
			var day = Math.floor(ms / (24 * 60 * 60 * 1000));
			var houer = ("0" + Math.floor(ms % (24 * 60 * 60 * 1000) / (60 * 60 *1000))).slice(-2);
			var minute = ("0" + Math.floor(ms % (24 * 60 * 60 * 1000) % (60 * 60 *1000) / (60 * 1000))).slice(-2);
			var second = ("0" + Math.floor(ms % (24 * 60 * 60 * 1000) % (60 * 60 *1000) % (60 * 1000) / 1000)).slice(-2);
			var millisecond = ("00" + ms % (24 * 60 * 60 * 1000) % (60 * 60 *1000) % (60 * 1000) % 1000).slice(-3);
			return [day,houer,minute,second,millisecond];
		};
		function countDown(toDate){
			var toTime = Date.parse(toDate);
			var now = new Date();
			var short = toTime - now.getTime();
			return MSchange(short);
		};
		let date = new Date(), m = date.getMonth() + 1, d = date.getDate(), h = date.getHours(), f = date.getMinutes();
		setInterval(function(){
			let re = countDown("2018/"+m+"/"+d+"/"+(h+1)+":"+f+":00");
			$(".miaosha .top p em").eq(0).text(re[1]).next().text(re[2]).next().text(re[3]);
		}, 1000);
		
		//渲染flex商品
		$.get("/mock/moreLike.json", function(data){
			let html = template("more", data.res_body);
			$(".moreLike .temBox").html(html);
		}, "json");


	});
});