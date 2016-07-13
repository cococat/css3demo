var sliderBar = {
	config : {
		left : 0,
		width : 300
	},
	leftP: 0,
	dragging : false,
	eventTodo :function(e) {
		var me = sliderBar, left = e.clientX - me.leftP;
		// console.log(me.leftPosition,111,left.offset().left)
		if(left < 0){
			left = 0;
		}else if(left > me.config.width - 15){
			left = me.config.width -15;
		}
		$("#bar1").css({
			left :  left
		});
		$("img").css({
			WebkitTransform : "perspective(500px) rotateY("+left+"deg)"
		})
	},
	event : function() {
		var me = this;
		$(".slider").click(function(e) {
			if(e.currentTarget != e.target)
				return;
			$("#bar1").css({
				left : e.offsetX
			});
			$("img").css({
				WebkitTransform : "perspective(500px) rotateY("+e.offsetX+"deg)"
			})
		});
		$(".bar").mousedown(function(e) {
			if(me.dragging)
				return;
			me.dragging = true;
			me.leftP = e.clientX - (parseInt($(this).css('left')) || 0);
			$(document.body).bind("mousemove", me.eventTodo).bind("mouseup mouseleave", function(e) {
				me.dragging = false;
				$(this).unbind("mousemove", me.eventTodo).unbind("mouseup mouseleave", me.eventTodo);
			});
		});
		var i = 0;
		$(document).keydown(function(e){
			var keyCode = e.keyCode;
			switch(keyCode){
				case 39:
					if(i < 0){
						i++;
					}else{
						i = 0;
						var left = parseInt($(".bar").css("left")) || 0;
						if(left < me.config.width-15){
							$(".bar").css({
								left : left+=3
							});
						}
					}
					$("img").css({
						WebkitTransform : "perspective(500px) rotateY("+left+"deg)"
					})
					break;
				case 37:
					if(i < 0){
						i++;
					}else{
						i = 0;
						var left = parseInt($(".bar").css("left")) || 0;
						if(left > 0){
							$(".bar").css({
								left : left-=3
							});
						}
						$("img").css({
							WebkitTransform : "perspective(500px) rotateY("+left+"deg)"
						})
					}
					break;
				default:break;
			}
		})
	},
	init : function() {
		$(".slider").css({
			width : 300
		});
		this.event();
	}
};
$(function() {
	sliderBar.init();
});