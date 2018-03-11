define(["jquery", "cookie"], function() {
	$("header").load("/html/include/idxHeader.html", function(){
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