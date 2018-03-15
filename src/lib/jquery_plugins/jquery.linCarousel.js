/**
 * @param img: 数组，包含图片对象信息,例:[
	 					{url: "a.jpg", href: "***.com"},
	 					{url: "b.jpg", href: "***.com"},
	 					{url: "d.jpg", href: "***.com"}
 					]
 * @param width: 设置容器/图片宽度
 * @param height：设置容器/图片高度
 * @param [type]: 可选，设置轮播图类型，"fade"淡入淡出/"slid"左右滑动，默认"slid" 
 *
 * Copyright 2018 LuckLin520
 * Date: 2018-03-05 Completed in Chengdu.
 */
;
(function($){
	function Carousel(img, width, height, type){
		this.img = img;
		this.width = width;
		this.height = height;
		this.type = type || "slid";
		this.len = img.length;
		this.c = 1;
		this.n = 2;
		this.container = null;
		this.imgbox = null;
		this.dotbox = null;
		this.tabbox = null;
		this.timer = null;
	}
	Carousel.prototype = {
		constructor: Carousel,
		init: function(container){
			this.container = container;
			let html = `<ul class="imgbox"></ul>
						<ul class="dotbox"></ul>
						<ul class="tabbox">
							<li class="lt"></li><li class="gt"></li>
						</ul>`;
			this.container.html(html);
			this.imgbox = this.container.children(".imgbox");
			this.dotbox = this.container.children(".dotbox");
			this.tabbox = this.container.children(".tabbox");
			this.img.forEach((v)=>{//添加图片及点击的链接
				let liImg = `<li><a href="${v.href}"><img src="${v.url}"></a></li>`;
				this.imgbox.append(liImg);
				this.dotbox.append("<li></li>");
			})
			if(this.type === "fade"){
				this.imgbox.children("li").css({position: "absolute"}).eq(0).show().siblings().hide();
				this.imgbox.css({width: this.width,
								 height: this.height,
								 position: "absolute"});
			}else if(this.type === "slid"){
				this.imgbox.children("li").eq(0).clone(true).appendTo(this.imgbox);
				this.imgbox.children("li").eq(this.len - 1).clone(true).prependTo(this.imgbox);
				this.len += 2;
				this.imgbox.children("li").css({float: "left"});
				this.imgbox.css({width: this.width * this.len,
								 height: this.height,
								 position: "absolute",
								 left: -this.width});
			}
			this.container.css({userSelect: "none",
								position: "relative", 
								width: this.width, 
								height: this.height, 
								overflow: "hidden",
								display: "inline-block"});
			this.imgbox.children("li").find("a img").css({width: this.width, height: this.height});
			this.dotbox.css({position: "absolute",
							 width: (12 + 6) * this.len,
							 left: "calc(50% - " + (12 + 6) * this.len / 2 + "px)",
							 bottom: "15px"
							}).children("li").css({
							 	width: "12px",
							 	height: "12px",
							 	float: "left",
							 	margin:"0 3px",
							 	borderRadius: "50%",
							 	background: "#ccc",
							 	cursor: "pointer"
							}).eq(0).css({background: "#a10000"});
			this.tabbox.css({width: "100%", 
							height: "15%", 
							position: "absolute",
							top: "calc(50% - 20px)",
							display: "none"
						}).children("li").css({
							position: "absolute",
							lineHeight: "50px",
							textAlign: "center",
							cursor: "pointer",
							opacity: 0.8
						}).eq(1).css({
							right: "-21px",
							border: "25px solid transparent",
							borderLeft: "15px solid #ccc"
						}).hover(function(){
							$(this).css({borderLeftColor: "#a10000"});
						}, function(){
							$(this).css({borderLeftColor: "#ccc"});
						}).prev(".lt").css({
							left: "-21px",
							border: "25px solid transparent",
							borderRight: "15px solid #ccc"
						}).hover(function(){
							$(this).css({borderRightColor: "#a10000"});
						}, function(){
							$(this).css({borderRightColor: "#ccc"});
						});
			this.container.children("ul").css({margin: 0, padding: 0, listStyle: "none"});
			this.eventListener();
		},
		move: function(){
			let lis = this.imgbox.children("li"),
				dots = this.dotbox.children("li");
			if(this.type === "fade"){
				this.n = this.n === this.len ? 0 : this.n === -1 ? this.len - 1 : this.n;
				lis.eq(this.n).finish().fadeIn(500).siblings("li").finish().fadeOut(500);
				dots.eq(this.n).css({background: "#a10000"}).siblings("li").css({background: "#ccc"});
			}else if(this.type === "slid"){
				this.imgbox.finish().animate({left: -this.width * this.n}, 400, ()=>{
									if(this.n === 1){
										this.n = this.len - 1;
										this.c = this.len - 2;
										this.imgbox.css({left: -this.width * this.c});
									}
									if(this.n === this.len){
										this.n = 2;
										this.c = 1;
										this.imgbox.css({left: -this.width});
									}
				});
				let dotIdx = this.n - 1;
				dotIdx = dotIdx === -1 ? this.len - 3 : dotIdx === this.len - 2 ? 0 : dotIdx;
				dots.eq(dotIdx).css({background: "#a10000"}).siblings("li").css({background: "#ccc"});
			};
			this.c = this.n++;
		},
		autoPlay: function(){
			this.timer = setInterval(()=>{
				this.move();
			}, 3000)
		},
		eventListener: function(){
			let that = this;
			this.container.hover(function(){
				clearInterval(that.timer);
				that.tabbox.fadeIn();
			}, function(){
				that.autoPlay();
				that.tabbox.fadeOut();
			});
			this.dotbox.on("mouseover", "li", function(){
				if(that.type === "slid"){
					that.n = $(this).index() + 1;
					that.move();
				}else if(that.type === "fade"){
					that.n = $(this).index();
					that.move();
				}
			})
			let tf = true, timeout;
			this.tabbox.on("click", "li", function(){
				clearTimeout(timeout);
				if(tf){
					tf = false;
					if($(this).is(".lt"))
						that.n = --that.c;
					that.move();
				}
				timeout = setTimeout(function(){
					tf = true;
				}, 400)
			});
		}
	}
	$.fn.extend({
		carousel: function(img, width, height, type){
			this.each(function(i, v){
				let obj = new Carousel(img, width, height, type);
				obj.init($(v));
				obj.autoPlay();
			})
			return this;
		}
	})
})(jQuery)