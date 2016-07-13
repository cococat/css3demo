Tilla.pie = function(main, obj) {
    this.config = obj = $.extend({}, this.config, obj);
    this.config._r = this.config.diameter / 2;
    this.config.pie_id = "pie_" + obj.id;
    this.config.main = main;
    this.init(obj);
};
Tilla.pie.prototype = {
    config: {
        centerTpl: '', //中间区域的html片段
        diameter: 100,
        _r: 0,
        speed: 1000, //动画速度
        border: 2,
        cColor: "#fff",
        bdColor: "red",
        bkColor: "#eee",
        mark: 50,
        autoAni: true, //自动动画
        container: null //组件将要插入的父容器的id，如不传不自动插入
    },
    cssCode1: '.coco_pie_{id}{\
		width:{diameter}px;\
		height:{diameter}px;\
		margin:0px;\
		position:relative;\
		background:{bkColor};\
		border-radius:{_r}px;\
	}\
	.coco_pie_left_{id},.coco_pie_right_{id}{\
		width:{diameter}px;\
		height:{diameter}px;\
		position:absolute;\
		top:0;\
		right:0;\
		bottom:0;\
		left:0;\
	}\
	.coco_pie_left_{id}{\
		clip:rect(0px,{diameter}px,{diameter}px,{_r}px );\
	}\
	.coco_pie_right_{id}{\
		clip:rect(0px,{_r}px,{diameter}px,0px );\
	}\
	.coco_pie_leftin_{id}{\
		clip:rect(0px,{_r}px,{diameter}px,0px );\
		position:absolute;\
		background-color:{bdColor};\
		width:{diameter}px;\
		height:{diameter}px;\
		top:0px;\
		left:0px;\
		border-radius:{diameter}px;\
	}\
	.coco_pie_rightin_{id}{\
		position:absolute;\
		clip:rect(0px,{diameter}px,{diameter}px,{_r}px );\
		background-color:{bdColor};\
		width:{diameter}px;\
		height:{diameter}px;\
		top:0px;\
		right:0px;\
		border-radius:{diameter}px;\
	}\
	.coco_pie_center_{id}{\
		position:absolute;\
		top:{border}px;\
		bottom:{border}px;\
		left:{border}px;\
		right:{border}px;\
		background:{cColor};\
		border-radius:{diameter}px;\
	}',
    tpl: '<div class="coco_pie_{id}" id="{pie_id}">\
	<div class="coco_pie_left_{id}" >\
		<div class="coco_pie_leftin_{id} pie_0_50" ></div>\
	</div>\
	<div class="coco_pie_right_{id}" >\
		<div class="coco_pie_rightin_{id} pie_50_100" ></div>\
	</div>\
	<div class="coco_pie_center_{id}">{centerTpl}</div>\
</div>',
    getTpl: function() {
        return this.config.tpl;
    },
    addTpl: function(e) {
        $(e).html(this.config.tpl);
        if (this.config.autoAni) {
            this.getAni();
        } else {
            this.setPercent();
        }
    },
    setPercent: function(mark) {
        var me = this,
            config = me.config,
            mark = mark ? mark : config.mark;
        this.clear();
        setTimeout(function() {
            if (mark <= 50 && mark >= 0) {
                $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransform = "rotate(" + mark / 100 * 360 + "deg)";
            } else if (mark >= 50 && mark <= 100) {

                $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransform = "rotate(180deg)";
                $("#" + config.pie_id).find(".pie_50_100")[0].style.WebkitTransform = "rotate(" + (mark - 50) / 100 * 360 + "deg)";
            }
        }, 1);
    },
    getAni: function(mark, time) {
        var me = this,
            config = me.config,
            time = time ? time : config.speed,
            mark = mark ? mark : config.mark;
        this.clear();
        setTimeout(function() {
            if (mark <= 50 && mark >= 0) {
                $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransition = "-webkit-transform " + time / 1000 + "s linear";
                $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransform = "rotate(" + mark / 100 * 360 + "deg)";
            } else if (mark >= 50 && mark <= 100) {
                var pertime = time / mark;
                $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransition = "-webkit-transform " + pertime * 50 / 1000 + "s linear";
                $("#" + config.pie_id).find(".pie_50_100")[0].style.WebkitTransition = "-webkit-transform " + pertime * (mark - 50) / 1000 + "s linear";
                $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransform = "rotate(180deg)";
                setTimeout(function() {
                    $("#" + config.pie_id).find(".pie_50_100")[0].style.WebkitTransform = "rotate(" + (mark - 50) / 100 * 360 + "deg)";
                }, pertime * 50);
            }
        }, 1);
    },
    clear: function() {
        var config = this.config;
        $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransition = "";
        $("#" + config.pie_id).find(".pie_50_100")[0].style.WebkitTransition = "";
        $("#" + config.pie_id).find(".pie_0_50")[0].style.WebkitTransform = "";
        $("#" + config.pie_id).find(".pie_50_100")[0].style.WebkitTransform = "";
    },

    init: function() {
        var me = this,
        config = me.config;
        me.cssCode1 = Tilla.tplConnect(me.cssCode1, config);
        Tilla.addStyle(me.cssCode1, me);
        config.tpl = Tilla.tplConnect(me.tpl, config);
        me.addTpl(config.main);
        return me;
    }
}
