//2012-7-13 by liuyutong
//图像变换3D
var sliderBar = {
	config: {
		left:0,
		width:300
	},
	eventTodo: function(e){
		if(e.offsetX == 0) return false;
		$("#bar1").css({left:e.offsetX});
	},
	event:function(){
		var me = this;
		$(".slider").click(function(e){
			$("#bar1").css({left:e.offsetX});
		})
		$(".slider").mousedown(function(e){
			$("body").bind("mousemove",me.eventTodo).mouseup(function(e){
				$("body").unbind("mousemove",me.eventTodo).unbind("mouseup",me.eventTodo);
			});
		});
	},
	init: function(){
		$(".slider").css({width:300});
		this.event();
	}
}
$(function(){
	sliderBar.init();
})