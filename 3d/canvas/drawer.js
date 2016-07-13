void function(ns, document, Array) {
	var NO_INIT = ns.NO_INIT = "__no_init";
	var dpr = Math.PI / 180;
	ns.Stage = Stage;
	ns.Scene = Scene;
	ns.Drawable = Drawable;
	ns.Sprite = Sprite;
	ns.Image = Image;
	ns.Loader = Loader;
	ns.Text = Text;
	EventDispatcher = {
		bind : function(names, fun) {
			var listeners = this.listeners || (this.listeners = {});
			names.split(/\s+/).forEach(function(name) {
				if (!name)
					return;
				var arr = listeners[name] || (listeners[name] = []);
				for ( var i = 0, L = arr.length; i < L; i++) {
					if (arr[i] === fun)
						return;
				}
				arr.push(fun);
			});
			return this;
		},
		unbind : function(names, fun) {
			var listeners = this.listeners;
			if (!listeners)
				return;
			names.split(/\s+/).forEach(function(name) {
				if (!listeners[name])
					return;
				if (!fun) {
					delete listeners[name];
				} else {
					for ( var i = 0, L = arr.length; i < L; i++) {
						if (arr[i] === fun) {
							arr.splice(i, 1);
							return;
						}
					}
				}
			});
			return this;
		},
		trigger : function(type) {
			var listeners = this.listeners && this.listeners[type];
			if (!listeners || !listeners.length)
				return;
			var args = Array.prototype.slice.call(arguments, 1);
			for ( var i = 0, L = listeners.length; i < L; i++) {
				listeners[i].apply(this, args);
			}
		}
	};
	function Stage(canvas) {
		typeof canvas === "string" && (canvas = document.querySelector(canvas));
		if (!canvas) {
			return;
		}
		this[1] = (this[0] = canvas).getContext("2d");
		this.scenes = {};
		this.scenes[this.scene = "default"] = new Scene();
	}
	Stage.prototype = {
		lastRendered : -1,
		render : function() {
			this.lastRendered = new Date().getTime();
			this[1].clearRect(0, 0, this[0].width, this[0].height);
			this.getSprite().drawTo(this[1]);
		},
		trigger : function(fun) {
			var self = this;
			return fun ? function() {
				var ret = fun.call(this, self, self.getSprite());
				(ret || typeof ret === "undefined") && self.render();
			} : function() {
				self.render();
			};
		},
		getSprite : function() {
			return this.scenes[this.scene].sprite;
		},
		autoRefresh : function(rate) {
			this.timer && clearTimeout(this.timer);
			if (!rate)
				return;
			var self = this;
			rate = 1000 / rate << 0;
			sched();
			function sched() {
				self.timer = setTimeout(sched, rate);
				self.render();
			}
		},
		scenes : null
	};
	function Scene() {
		this.sprite = new Sprite();
	}
	Scene.prototype = {};
	function Drawable(arg0) {
		arg0 === NO_INIT || this.init();
	}
	Drawable.prototype = {
		init : function() {
			var canvas = this[0] = document.createElement("canvas");
			canvas.width = canvas.height = 2048;
			var ctx = this[1] = (canvas).getContext("2d");
			ctx.translate(1024, 1024);
		},
		x : 0,
		y : 0,
		z : 0,// preserved
		scaleX : 1,
		scaleY : 1,
		scaleZ : 1,// preserved
		angel : 0,
		width : accessor("width", 0),
		height : accessor("height", 0),
		lineStyle : function(color, width, cap) {
			var ctx = this[1];
			switch (arguments.length) {
			default:
				ctx.lineCap = cap;
			case 2:
				ctx.lineWidth = width;
			case 1:
				ctx.strokeStyle = color;
			case 0:
			}
			return this;
		},
		circle : function(x, y, radius) {
			var ctx = this[1];
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2, false);
			ctx.stroke();
			return this;
		},
		line : function(x0, y0, x1, y1) {
			var ctx = this[1];
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
			ctx.stroke();
			return this;
		},
		__preDraw__ : function(ctx) {
			this.trigger("redraw");
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angel * dpr);
			ctx.scale(this.scaleX, this.scaleY);
		},
		drawTo : function(ctx) {
			this.__preDraw__(ctx);
			ctx.drawImage(this[0], -1024, -1024);
			this.drawExtra && this.drawExtra(ctx);
			this.__postDraw__(ctx);
			return this;
		},
		__postDraw__ : function(ctx) {
			ctx.restore();
		},
		drawExtra : null,
		getContext : function() {
			return this[0];
		}
	};
	probe(Drawable.prototype, EventDispatcher);
	[ "scale", "rotate", "translate", "transform", "setTransform", "drawImage" ].forEach(function(s) {
		Drawable.prototype[s] = applier(s, 1);
	});
	function Sprite(arg0) {
		arg0 === NO_INIT || this.init();
		this.children = [];
	}
	Sprite.prototype = new Drawable(NO_INIT);
	Sprite.prototype.sortChildren = function() {
		var arr = this.children;
		arr.sort(function(a, b) {
			return a.zIndex - b.zIndex;
		});
		for ( var min = 0, max = arr.length - 1; min < max;) {
			var mid = min + max >> 1;
			if (arr[mid]) {
				min = mid + 1;
			} else {
				max = mid - 1;
			}
		}
		arr.length = arr[min] ? min + 1 : min;
		return this;
	};
	Sprite.prototype.drawExtra = function(ctx) {
		this.sortChildren();
		this.children.forEach(function(drawable) {
			drawable.drawTo(ctx);
		});
	};
	Sprite.prototype.addChild = function(child) {
		this.children.push(child);
	};
	Sprite.prototype.removeChild = function(child) {
		var i = this.children.indexOf(child);
		i != -1 && this.children.splice(i, 0);
	};
	function Image(img) {
		this[0] = img;
	}
	Image.prototype = new Drawable(NO_INIT);
	function Loader(src) {
		var self = this, img = this[0] = document.createElement("IMG");
		img.src = src;
		img.onload = function() {
			self.image = new Image(img);
			self.trigger("load");
		};
	}
	Loader.prototype = {};
	probe(Loader.prototype, EventDispatcher);
	function Text(str) {
		str && (this.text = str);
	}
	Text.ALIGN = {
		START : "start",
		END : "end",
		LEFT : "left",
		RIGHT : "right"
	};
	Text.BASELINE = {
		TOP : "top",
		HANGING : "hanging",
		MIDDLE : "middle",
		ALPHABETIC : "alphabetic",
		IDEOGRAPHIC : "ideographic",
		BOTTOM : "bottom"
	};
	Text.prototype = new Drawable(NO_INIT);
	probe(Text.prototype, {
		text : '',
		color : "black",
		borderColor : "transparent",
		borderWidth : 1,
		fontSize : "10px",
		fontFamily : "sans-serif",
		align : "start",
		baseLine : "alphabetic",
	});
	Text.prototype.drawTo = function(ctx) {
		this.__preDraw__(ctx);
		var fill = !this.hasOwnProperty("color") || (this.color && this.color !== "transparent"), stroke = !this
		.hasOwnProperty("borderColor")
		|| (this.borderColor && this.borderColor != "transparent");
		fill && (ctx.fillStyle = this.color);
		stroke && (ctx.strokeStyle = this.borderColor);
		(this.hasOwnProperty("fontSize") || this.hasOwnProperty("fontFamily"))
		&& (ctx.font = this.fontSize + " " + this.fontFamily);
		this.hasOwnProperty("align") && (ctx.textAlign = this.align);
		this.hasOwnProperty("baseLine") && (ctx.textBaseLine = this.baseLine);
		fill && ctx.fillText(this.text, 0, 0);
		stroke && ctx.strokeText(this.text, 0, 0);
		this.__postDraw__(ctx);
	};
	function accessor(name, ref) {
		return arguments.length > 1 ? function(val) {
			if (arguments.length) {
				this[ref][name] = val;
				return this;
			} else {
				return this[ref][name];
			}
		} : function() {
			if (arguments.length) {
				this[name] = val;
				return this;
			} else {
				return this[name];
			}
		};
	}
	function applier(name, ref) {
		return function() {
			var o = this[ref];
			o[name].apply(o, Array.prototype.slice.call(arguments));
			return this;
		};
	}
	function probe(target) {
		target || (target = {});
		for ( var i = 1, L = arguments.length; i < L; i++) {
			var obj = arguments[i];
			for ( var k in obj) {
				if (!target.hasOwnProperty(k)) {
					target[k] = obj[k];
				}
			}
		}
		return target;
	}
}(window.Drawer || window, document, Array);
