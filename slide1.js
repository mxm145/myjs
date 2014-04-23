function slide1(config){
	this.imgContainer   = config.imgContainer || 'H-slide1';
	this.thumbContainer = config.thumbContainer || 'H-slide2';
	this.textContainer  = config.textContainer || 'H-slide3';
	this.speed          = config.speed || 5000;
	this.imgIndex       = 0;
	this.isPause        = false;
	this.picNum         = config.picNum || 4;
	this.timer          = null;
	this.init();
	this.auto();
}
slide1.prototype = {
	$ : function(o){
		return document.getElementById(o);
	},
	$$ : function(o, tag){
		return $(o).getElementsByTagName(tag);
	},
	addEvent : function(elm,evType,fn,useCapture){
		if(elm.addEventListener){
			elm.addEventListener(evType, fn, useCapture);
		}else if(elm.attachEvent){
			elm.attachEvent('on' + evType, fn);
		}else{
			elm['on' + evtype] = fn;
		}
	},
	Each : function(list,fun){
		for(var i=0,len=list.length;i<len;i++){
			fun(list[i],i);
		}
	},
	init : function(){
		var that = this;
		var imgs = this.$$(this.thumbContainer, 'li');
		this.Each(imgs,function(g,h){
			this.addEvent(g, 'mouseover', function(){
				that.play(h);
				that.isPause = true;
			});
			this.addEvent(g, 'mouseout', function(){
				that.isPause = false;
				that.timer = setTimeout(function(){that.auto();}, that.speed);
			});
		});
	},
	fade : function(o){
		if(!-[-1,]){
			var that = this;
			var f = o.currentStyle.filter || o.style.filter;
			var f1 = f.indexOf('=') + 1;
			var f2 = f.indexOf(')');
			var ff = f.substr(f1, (f2 - f1));
			ff = parseInt(ff);
			if(ff <= 90){
				o.style.filter = 'alpha(opacity='+(ff + 10)+')';
				setTimeout(function(){that.fade(o);}, 60);
			}else{
				return;
			}
		}else{
			var f = window.getComputedStyle(o,null).getPropertyValue('opacity') || o.style.opacity;
			var ff = Math.round(f * 100) + 10;
			if(ff <= 90){
				o.style.opacity = ff/100;
				setTimeout(function(){that.fade(o);}, 60);
			}else{
				return;
			}
		}
	},
	scroll : function(o){
		var that = this;
		var po = o.style.bottom == '' ? -30 :  o.style.bottom;
		var ppo = parseInt(po) + 5;
		if(ppo >= 5){
			return;
		}else{
			o.style.bottom = ppo + 'px';
			setTimeout(function(){that.scroll(o);}, 60);
		}
	},
	play : function(l){
		imgIndex == undefined && (imgIndex = this.imgIndex);
		imgIndex < 0 && (imgIndex = this.picNum - 1) || imgIndex >= this.picNum && (imgIndex = 0);

		$(this.textContainer).style.bottom = '-30px';
		var divList = this.$$(this.imgContainer, 'div');
		var imgList = this.$$(this.thumbContainer, 'li');
		var titleList = this.$$(this.textContainer, 'li');
		this.Each(divList,function(a,b){
			if(b == j){
				a.style.display = 'block';
				fade(a);
			}else{
				a.style.opacity = 0;
				a.style.filter = 'alpha(opacity=0)';
				a.style.display = 'none';
			}
		});
		this.Each(imgList,function(c,d){
			if(d == j){
				c.className = 'action';
			}else{
				c.className = '';
			}
		});
		this.Each(titleList,function(e,f){
			if(f == j){
				e.style.display = 'block';
			}else{
				e.style.display = 'none';
			}
		});
		this.scroll(this.$(this.textContainer));
		this.imgIndex ++;
	},
	auto : function(){
		var that = this;
		if(!this.isPause){
			if(this.timer) clearTimeout(this.timer);
			this.play();
			this.timer = setTimeout(function(){that.auto();}, this.speed);
		}
	}
}
