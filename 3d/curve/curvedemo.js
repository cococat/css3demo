void function(window, document, $) {
	var controls = $(".ball"), G = $("canvas")[0].getContext("2d");
	G.lineCap = "round";
	var width = 480, height = 320;
	var positions = null, savedPos = null;
	controls.bind('mousedown', function(e) {
		var i = this.getAttribute("data-i");
		savedPos = {
			i : i,
			x : e.clientX - positions[i].left,
			y : e.clientY - positions[i].top
		};
		$(document.body).bind('mousemove', mMove).bind('mouseup mouseleave', mUp);
	});
	initPos();
	redraw();
	function redraw() {
		G.clearRect(0, 0, width, height);
		G.strokeStyle = "red";
		// draw line
		G.beginPath();
		G.moveTo(positions[0].left, positions[0].top);
		G.lineTo(positions[1].left, positions[1].top);
		G.stroke();
		// draw another line
		G.beginPath();
		G.moveTo(positions[2].left, positions[2].top);
		G.lineTo(positions[3].left, positions[3].top);
		G.stroke();
		G.strokeStyle = "black";
		G.beginPath();
		G.moveTo(positions[0].left, positions[0].top);
		G.bezierCurveTo(positions[1].left, positions[1].top, positions[2].left, positions[2].top, positions[3].left,
		positions[3].top);
		G.stroke();
	}
	function initPos() {
		var initial_positions = [ {
			left : 20,
			top : 240
		}, {
			left : 80,
			top : 140
		}, {
			left : 160,
			top : 240
		}, {
			left : 240,
			top : 140
		} ];
		for ( var i = 0; i < 4; i++) {
			controls.eq(i).css(initial_positions[i]);
		}
		positions = initial_positions;
	}
	function mMove(e) {
		var i = savedPos.i, position = positions[i];
		position.left = Math.max(Math.min(e.clientX - savedPos.x, width), 0);
		position.top = Math.max(Math.min(e.clientY - savedPos.y, height), 0);
		controls.eq(i).css(position);
		redraw();
	}
	function mUp(e) {
		$(this).unbind('mousemove mouseup mouseleave');
	}
}(this, this.document, jQuery);