void function() {
	var root = new Stage("canvas"), sprite = root.getSprite();
	root.autoRefresh(12);
	// 画表盘
	sprite.lineStyle("cyan", 4).circle(60, 60, 42);
	// 表针
	var h = new Sprite(), m = new Sprite(), s = new Sprite();
	h.lineStyle("black", 3).line(0, 4, 0, -30);
	m.lineStyle("#AAA", 2).line(0, 4, 0, -34);
	s.lineStyle("red", 1).line(0, 8, 0, -38);
	h.x = h.y = m.x = m.y = s.x = s.y = 60;
	// 数字
	var text = new Text();
	text.x = 40;
	text.y = 85;
	text.fontSize = "14px";
	// 将表针、数字加入表盘
	sprite.children.push(text, h, m, s);
	sprite.bind('redraw', function() {
		var d = new Date(), hh = d.getHours(), mm = d.getMinutes(), ms = d.getTime() / 1000;
		h.angel = (ms + 28800) % 43200 / 120;
		m.angel = ms % 3600 / 10;
		s.angel = ms % 60 * 6;
		text.text = hh + ":" + mm;
		text.color = '#' + getColor(s.angel);
	});
	function getColor(hue) {
		var tmp = (Math.abs((hue + 60) % 120 - 60) / 60 * 255 << 0).toString(16).toUpperCase(), arr = [ 'FF',
			tmp.length < 2 ? '0' + tmp : tmp, '00' ], area = (hue / 60 << 0) % 6;
		return arr[area < 3 ? area : 5 - area] + arr[(area = (area + 4) % 6) < 3 ? area : 5 - area]
		+ arr[(area = (area + 4) % 6) < 3 ? area : 5 - area];
	}
}();