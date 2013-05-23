/*
pop version 2.6
author mxm145@163.com
*/
pop = function(){
	var ie = (function(){
		var undef,
		v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);
		return v > 4 ? v : undef;
	}());
	function $(o){
		return document.getElementById(o);
	}
	function _(tag){
		return new _.prototype.init(tag);
	}
	function addEvent(elm,evType,fn,useCapture){
		if(elm.addEventListener){
			elm.addEventListener(evType, fn, useCapture);
			return true;
		}else if(elm.attachEvent){
			var r = elm.attachEvent('on' + evType, fn);
			return r;
		}else{
			elm['on' + evtype] = fn;
		}
	}
	_.prototype = {
		init : function(tag){
			this[0] = document.createElement(tag);
			return this;		
		},
		css : function(str){
			this[0].style.cssText = str;
			return this;
		},
		html : function(str){
			this[0].innerHTML = str;
			return this;
		}
	};
	_.prototype.init.prototype = _.prototype;
	function pop(p){
		this.width   = p.width || 300;//宽度
		this.height  = p.height || 300;//高度
		this.title   = p.title || 'test';//标题
		this.content = p.content || 'test';//内容（可包括html）
		this.hasbg   = p.hasbg || false;//是否使用背景（默认不使用）
		this.pos     = p.pos || 'mid';//位置（默认居中）
		this.bgColor = p.bgColor || 'E6E6E6';//背景颜色
		this.borColor= p.borColor || 'fff';//边框颜色
		this.borWidth= p.borWidth || 5;//边框宽度
		this.drag    = p.drag || false;//是否拖动
		this.closePos= p.closePos || 'right';//关闭按钮位置
		this.closeSty= p.closeSty || 'x';
		if($('H-pop')) return;
		if(this.hasbg) this.createBackGround();
		this.createPop();
		if(this.drag) this.drags();
	}
	pop.prototype = {
		createPop : function(){
			var _this = this;
			var posValue = 'fixed', bor = '', bagr = '', cposValue = 'right:10px;';
			if(this.borWidth != 'none') bor = 'border:'+this.borWidth+'px solid #'+this.borColor+'';
			if(this.bgColor != 'none') bagr = 'background:#'+this.bgColor;
			if(this.closePos == 'left') cposValue = 'left:10px;';
			if(ie == 6) posValue = 'absolute';
			if(this.pos == 'rb'){
				this.div2 = _("div").css('position:'+posValue+';bottom:0;right:0;'+bagr+';z-index:82;width:'+this.width+'px;height:'+this.height+'px;'+bor+'')[0];
			}else{
				this.div2 = _("div").css('position:'+posValue+';top:'+this.popHeight()+'px;left:'+this.popWidth()+'px;'+bagr+';z-index:82;width:'+this.width+'px;height:'+this.height+'px;'+bor+'')[0];
			}
			if(this.title == 'none'){
				this.div3 = _("div").css('width:100%;min-height:20px;_height:20px;position:relative;float:left')[0];
			}else{
				this.div3 = _("div").css('width:100%;min-height:20px;_height:20px;position:relative;border-bottom:1px solid black;float:left').html(this.title)[0];
			}
			this.div5 = _("span").css('position:absolute;'+cposValue+'top:0px;cursor:pointer').html(this.closeSty)[0];
			this.on(this.div5, 'click', function(){
				_this.onclose();
			});
			this.div6 = _("div").css('width:100%;float:left').html(this.content)[0];
			this.div2.id = 'H-pop';
			this.div3.id = 'H-title';
			this.div5.id = 'H-close';
			this.div6.id = 'H-content';
			this.div3.appendChild(this.div5);
			this.div2.appendChild(this.div3);
			this.div2.appendChild(this.div6);

			document.body.appendChild(this.div2);
			if(ie == 6){
				window.onscroll = function(){
					_this.stayWhere();
				}
			}
		},
		pageWidth : function(){
			return Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
		},
		pageHeight : function(){
			return Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
		},
		popWidth : function(){
			return Math.floor((this.pageWidth() - this.width)/2);
		},
		popHeight : function(){
			if(ie == 6){
				if(document.documentElement.scrollTop > 0 || document.body.scrollTop > 0){
					return Math.floor((document.documentElement.clientHeight - this.height)/2) + document.documentElement.scrollTop + document.body.scrollTop;
				}else{
					return Math.floor((document.documentElement.clientHeight - this.height)/2);
				}
			}else{
				return  Math.floor((document.documentElement.clientHeight - this.height)/2);
			}
		},
		popHeight2 : function(){
			if(document.documentElement.scrollTop > 0 || document.body.scrollTop > 0){
				var h1 = parseInt($('H-pop').offsetHeight, 10);
				var h2 = document.documentElement.clientHeight;
				var h3 = parseInt(document.documentElement.scrollTop, 10);
				return h2 - h1 + h3;
			}else{
				return Math.floor(document.documentElement.clientHeight - this.height);
			}
		},
		on : function(el, type, fn){
			el.addEventListener ? 
				el.addEventListener(type, fn, false) :
			el.attachEvent ?
				el.attachEvent("on" + type, fn) :
			el['on'+type] = fn;
		},
		createBackGround : function(){
			if($("H-bg") == null && $("H-bg2") == null){
				var div1 = _("div").css('position:absolute;top:0px;left:0px;background:#000;filter:Alpha(Opacity=60);opacity:0.6;z-index:81;width:'+this.pageWidth()+'px;height:'+this.pageHeight()+'px')[0];
				var ifr  = _("iframe").css('position:absolute;top:0px;left:0px;background:#000;filter:Alpha(Opacity=1);opacity:0.01;z-index:80;border:none;width:'+(this.pageWidth() - 4)+'px;height:'+this.pageHeight()+'px')[0];
				div1.id = 'H-bg';
				ifr.id = 'H-bg2';
				document.body.appendChild(div1);
				document.body.appendChild(ifr);
			}
		},
		drags : function(){
			var isDrag = false,dragId = $('H-pop'),_x,_y;
			dragId.onmousedown = function(e){
				isDrag = true;
				dragId.style.cursor = 'move';
				var e = e || window.event;
				_x = (e.x || e.clientX) - this.offsetLeft;
				_y = (e.y || e.clientY) - this.offsetTop;
			};
			document.onmousemove = function(e){
				var e = e || window.event;
				if(!isDrag) return;
				dragId.style.left = (e.x || e.clientX) - _x + "px";
				dragId.style.top = (e.y || e.clientY) - _y + "px";
			};
			document.onmouseup = function(){
				isDrag = false;
				dragId.style.cursor = 'default';
			}
		},
		onclose : function(){
			var bg = $("H-bg"), bg2 = $("H-bg2"),pop = $("H-pop"),title = $("H-title"),close = $("H-close"),content = $("H-content");
			if(content != null && close != null && title != null && pop != null){
				content.parentNode.removeChild(content);
				close.parentNode.removeChild(close);
				title.parentNode.removeChild(title);
				pop.parentNode.removeChild(pop);
				content.innerHTML = '';
				close = null;
				title = null;
				pop = null;
			}
			if(bg != null && bg2 != null){
				bg.parentNode.removeChild(bg2);
				bg.parentNode.removeChild(bg);
				bg2 = null;
				bg = null;
			}
			if(this['onbi']){
				this.onbi();
			}
		},
		stayWhere : function(){
			var p = $("H-pop");
			if(p){
				if(this.pos == 'rb'){
					p.style.top = this.popHeight2() + 'px';
				}else{
					p.style.top = this.popHeight() + 'px';
					p.style.left = this.popWidth() + 'px';
				}
			}else{
				return;
			}
		},
		resize : function(){
			var p = $("H-pop");
			if(p != null){
				p.style.left = this.popWidth();
			}
		}
	};
	return pop;
}();