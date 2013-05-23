slide1 = function(){
	function $(o){
		return document.getElementById(o);
	}
	function $$(o, tag){
		return $(o).getElementsByTagName(tag);
	}
	function fade(o){
		if(!-[-1,]){
			var f = o.currentStyle.filter || o.style.filter;
			var f1 = f.indexOf('=') + 1;
			var f2 = f.indexOf(')');
			var ff = f.substr(f1, (f2 - f1));
			ff = parseInt(ff);
			if(ff <= 90){
				o.style.filter = 'alpha(opacity='+(ff + 10)+')';
				setTimeout(function(){fade(o);}, 60);
			}else{
				return;
			}
		}else{
			var f = window.getComputedStyle(o,null).getPropertyValue('opacity') || o.style.opacity;
			var ff = Math.round(f * 100) + 10;
			if(ff <= 90){
				o.style.opacity = ff/100;
				setTimeout(function(){fade(o);}, 60);
			}else{
				return;
			}
		}
	}
	function scroll(o){
		var po = o.style.bottom == '' ? -30 :  o.style.bottom;
		var ppo = parseInt(po) + 5;
		if(ppo >= 5){
			return;
		}else{
			o.style.bottom = ppo + 'px';
			setTimeout(function(){scroll(o);}, 60);
		}
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
	function Each(list,fun){
		for(var i=0,len=list.length;i<len;i++){
			fun(list[i],i);
		}
	}
	function slide1(config){
		this.imgContainer   = config.imgContainer || 'H-slide1';
		this.thumbContainer = config.thumbContainer || 'H-slide2';
		this.textContainer  = config.textContainer || 'H-slide3';
		this.speed          = config.speed || 5000;
		this.imgs           = $$(this.thumbContainer, 'li');
		this.imgIndex       = 0;
		this.isPause        = false;
		this.picNum         = config.picNum || 4;
		var that = this;
		Each(this.imgs,function(g,h){
			addEvent(g, 'mouseover', function(){
				that.play(h);
				that.isPause = true;
			});
			addEvent(g, 'mouseout', function(){
				that.isPause = false;
			});
		});
		this.auto();
	}
	slide1.prototype = {
		play : function(l){
			if(this.imgIndex > (this.picNum - 1)) this.imgIndex = 0;
			if(arguments[0] == undefined){
				var j = this.imgIndex;
			}else{
				var j = l;
				this.imgIndex = l;
			}
			$(this.textContainer).style.bottom = '-30px';
			var divList = $$(this.imgContainer, 'div');
			var imgList = $$(this.thumbContainer, 'li');
			var titleList = $$(this.textContainer, 'li');
			Each(divList,function(a,b){
				if(b == j){
					a.style.display = 'block';
					fade(a);
				}else{
					a.style.opacity = 0;
					a.style.filter = 'alpha(opacity=0)';
					a.style.display = 'none';
				}
			});
			Each(imgList,function(c,d){
				if(d == j){
					c.className = 'action';
				}else{
					c.className = '';
				}
			});
			Each(titleList,function(e,f){
				if(f == j){
					e.style.display = 'block';
				}else{
					e.style.display = 'none';
				}
			});
			scroll($(this.textContainer));
			this.imgIndex ++;
		},
		auto : function(){
			var _this = this;
			if(!this.isPause){
				if(timer) clearTimeout(timer);
				this.play();
				var timer = setTimeout(function(){_this.auto();}, this.speed);
			}else{
				var timer = setTimeout(function(){_this.auto();}, this.speed);
			}
		}
	};
	return slide1;
}();