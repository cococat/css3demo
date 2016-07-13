
var Tilla =$.extend({},{
	initdata : {},
	ui : {},
	unique:{},
	run : function(type,main,obj){
		if(Tilla[type]){
			if(!Tilla.unique[type]){Tilla.unique[type]="esun"+parseInt(Math.random()*1000000)}
			if(!obj.id){ console.error(type+":noid");return;}
			if(Tilla.initdata[obj.id]){console.error(obj.id+":this id is already exist");return;};
			Tilla.initdata[obj.id] = obj;
			obj.uitype = type;
			$(main).addClass(Tilla.unique[type]);
			Tilla.ui[obj.id]=new Tilla[type](main,obj);
			return Tilla.ui[obj.id];
		}
	},
	loadScript : function(type,callback){
		var script = document.createElement("script");
		script.src = config+type+".js";
		script.onload = callback;
		$("head").append(script);
	},
	use : function(type,select,obj,callback){
		var script = document.createElement("script");
		script.src = Tilla.config.url+type+".js";
		script.onload = function(){
			var ui = Tilla.run(type,select,obj);
			if(callback)callback(ui);
		};
		$("head").append(script);
	},
	config : {
		url:""
	},
	isString:function(str){
		return Object.prototype.toString.call(str) === "[object String]";
	},
	_addUnigue : function(str,obj){
		var _classSign = obj._classSign,uitype=obj.config.uitype;
		var exp = new RegExp('[\}\,]([^\{\,0-9\s]*)([\,\{])','g');
		str = "."+Tilla.unique[uitype]+" "+str;
		return str.replace(exp,function(a,b,c){return "}."+Tilla.unique[uitype]+" "+b+c;});
	},
	formatNum:function(num){
		num = "00"+num;
		return num.slice(-2);
	},
	addStyle : function(css,obj,id){
		console.log(obj)
		var el = $("body"),uitype=obj.config.uitype;
		if(!id)id="";
		if(!$("#"+uitype+id+"-style").length){
			css = Tilla._addUnigue(css,obj);
			var style = document.createElement("style");
			style.setAttribute("type", "text/css");
			style.id = uitype+id+"-style";
			
			style.appendChild(document.createTextNode(css));
			el.append(style);
		}
	},
	tplConnect : function(tpl,obj){//模板拼装函数
		var rel='';
		rel = tpl.replace(/\{([\w|\[|\]]+)\}/gi,function(word,key){
			if(obj[key] != undefined){ //若obj含有这个属性，则返回obj的属性值
				return obj[key];
			}else if(Tilla.config[key] != undefined){ //若obj没有这个属性，则返回全局config中的属性值
					return Tilla.config[key];
			}else{
				var oldWord = word;
				word = word.replace(/\{(\w+)\[(\w+)\]\}/gi,function(a,b,c,d){
					if(obj[b] != undefined&&obj[b][c] !=undefined){
						return  obj[b][c];
					}else{
						return c;
					}
				})
				return word;
			}
		});
		return rel;
	},
	random: function(num,min,max){
		var obj={},_arr = [];
		for(var i=0;i<num;i++){
			var ran = Math.ceil(Math.random()*(max-min+1));
			if(obj[ran]!=undefined){
				i--;
			}else{
				obj[ran]=ran;
				_arr.push(ran);
			}
		}
		return _arr;
	},
	arrange:function(arr,num,type){
		var data = {},n=m=n_m= 1,l=arr.length;
		for(var i=1;i<=l;i++){
			n = n*i;
			if(i<=num){
				m = m*i;
			}
			if(i<=l-num){
				n_m = n_m*i;
			}
		}
	}
},Tilla);
var T  = Tilla;
$(function(){
	$(".tilla-auto").each(function(){
		var data = new Function("return {"+ this.getAttribute("tilla")+"}")();
		for(var key in data){
			if(data[key].id && key){
				if(!Tilla[key]){
					Tilla.use(key,this,data[key]);
				}else{
					Tilla.run(key,this, data[key]);
				}
			}
		}
	});
});