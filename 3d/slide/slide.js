void function($) {
	var $dom = $('#slide'), imgs, L, curr = NaN;
	getImages(function(_imgs) {
		L = (imgs = _imgs).length;
		render();
		focus(0);
	});
	$(document).bind('keydown', function(e) {
		if (e.keyCode == 37) {
			focus(curr - 1);
		} else if (e.keyCode == 39) {
			focus(curr + 1);
		}
	});
	function getImages(callback) {
		callback([ 'imgs/1.jpg', 'imgs/2.jpg', 'imgs/3.jpg', 'imgs/4.jpg', 'imgs/5.jpg', 'imgs/6.jpg', 'imgs/7.jpg',
			'imgs/8.jpg', 'imgs/1.jpg', 'imgs/2.jpg', 'imgs/3.jpg', 'imgs/4.jpg', 'imgs/5.jpg', 'imgs/6.jpg', 'imgs/7.jpg',
			'imgs/8.jpg' ]);
	}
	function render() {
		for ( var i = 0, arr = []; i < L; i++) {
			arr.push('<li><img src="', imgs[i], '"/></li>');
		}
		$dom.html(arr.join(''));
		var $li = $dom.children();
		var factor = 360 / L;
		$li.each(function(i) {
			$(this).css({
				WebkitTransform : 'rotateY(' + i * factor + 'deg)'
			});
		});
	}
	/*function focus(i) {
		var factor = 360 / L;
		if (!isNaN(curr)) {
			curr = curr < 0 ? curr % L + L : curr % L;
			$dom.children().eq(curr).css({
				WebkitTransform : 'rotateY(' + curr * factor + 'deg)'
			});
		}
		curr = i;
		i = i < 0 ? i % L + L : i % L;
		$dom.css('WebkitTransform', 'translateZ(-500px) rotateY(' + (90 - curr * factor) + 'deg)').children().eq(i).css({
			'WebkitTransform' : 'rotateY(' + (-90 + i * 360 / L) + 'deg) translate3D(450px,0,600px)'
		});
	}*/
		function focus(i) {
		var factor = 360 / L;
		if (!isNaN(curr)) {
			curr = modal(curr);
			$dom.children().eq(curr).css({
				WebkitTransform : 'rotateY(' + curr * factor + 'deg)'
			});
		}
		curr = i;
		i = modal(i);
		$dom.css('WebkitTransform', 'translateZ(-500px) rotateY(' + (90 - curr * factor) + 'deg)').children().eq(i).css({
			'WebkitTransform' : 'rotateY(' + (-90 + i * 360 / L) + 'deg) translate3D(450px,0,600px)'
		});
	}
	function modal(i) {
		i %= L;
		return i < 0 ? i + L : i;
	}
}($);