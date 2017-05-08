function slide2(config){
	this.imgContainer   = config.imgContainer || 'H-slide';
	this.thumbContainer = config.thumbContainer || 'H-slide3';
	this.textContainer  = config.textContainer || 'H-slide2';
	this.speed          = config.speed || 5000;
	this.imgIndex       = 0;
	this.isPause        = false;
	this.picNum         = config.picNum || 4;
	this.env            = config.env || 'pc';
	this.timer          = null;
	this.divList        = this.$$(this.imgContainer, 'div');
	this.imgList        = this.$$(this.thumbContainer, 'li');
	this.titleList      = this.$$(this.textContainer, 'li');
	this.titleArray     = new Array();
	var titleArr       = new Array();
	this.Each(this.titleList, function(x){
		titleArr.push(x.innerHTML);
	});
	this.titleArray = titleArr;
	this.init();
	this.auto();
}
slide2.prototype = {
	$: function(o){
		return document.getElementById(o);
	},
	$$: function (o, tag){
		return this.$(o).getElementsByTagName(tag);
	},
	init: function(){
		var that = this;
		if(this.thumbContainer != 'none'){
			this.imgs = this.$$(this.thumbContainer, 'li');
			this.Each(this.imgs,function(g,h){
				that.addEvent(g, 'mouseover', function(){
					that.play(h);
					that.isPause = true;
				});
				that.addEvent(g, 'mouseout', function(){
					that.isPause = false;
				});
			});
			if(this.env == 'pc'){
				this.bindPC();
			}else if(this.env == 'mob'){
				this.bindMobile();
			}else if(this.env == 'all'){
				this.bindPC();
				this.bindMobile();
			}
		}
	},
	isIE: function(ver){
    	var b = document.createElement('b');
    	b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    	return b.getElementsByTagName('i').length === 1;
	},
	fade: function(o){
		var that = this;
		if(this.isIE()){
			var f = o.currentStyle.filter ? o.currentStyle.filter : o.style.filter;
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
			var f = o.style.opacity || window.getComputedStyle(o,null).getPropertyValue('opacity');
			var ff = Math.round(f * 100) + 10;
			if(ff <= 90){
				o.style.opacity = ff/100;
				setTimeout(function(){that.fade(o);}, 60);
			}else{
				return;
			}
		}
	},
	scroll: function (o){
		var po = o.style.bottom == '' ? -30 :  o.style.bottom;
		var ppo = parseInt(po) + 5;
		var that = this;
		if(ppo >= 5){
			return;
		}else{
			o.style.bottom = ppo + 'px';
			setTimeout(function(){that.scroll(o);}, 60);
		}
	},
	addEvent: function(elm,evType,fn,useCapture){
		if(elm.addEventListener){
			elm.addEventListener(evType, fn, useCapture);
			return true;
		}else if(elm.attachEvent){
			var r = elm.attachEvent('on' + evType, fn);
			return r;
		}else{
			elm['on' + evtype] = fn;
		}
	},
	removeEvent: function(obj, type, fn){
	  if ( obj.detachEvent ) {
	    obj.detachEvent( 'on'+type, obj[type+fn] );
	    obj[type+fn] = null;
	  } else{
	    obj.removeEventListener( type, fn, false );
	  }
	},
	Each: function(list,fun){
		for(var i=0,len=list.length;i<len;i++){
			fun(list[i],i);
		}
	},
	play : function(l){
		var that = this;
		if(this.imgIndex > (this.picNum - 1)) this.imgIndex = 0;
		if(arguments[0] == undefined){
			var j = this.imgIndex;
		}else{
			var j = l;
			this.imgIndex = l;
		}
		this.$(this.textContainer).style.bottom = '-30px';

		this.Each(this.divList,function(a,b){
			if(b == j){
				a.style.display = 'block';
				that.fade(a);
			}else{
				a.style.opacity = 0;
				a.style.filter = 'alpha(opacity=0)';
				a.style.display = 'none';
			}
		});
		this.Each(this.imgList,function(c,d){
			if(d == j){
				c.className = 'action';
			}else{
				c.className = '';
			}
		});
		this.$(this.textContainer).innerHTML = '<li>' + this.titleArray[j] + '</li>';
		this.scroll(this.$(this.textContainer));
		this.imgIndex ++;
	},
	auto : function(){
		var _this = this;
		if(!this.isPause){
			if(this.timer) clearTimeout(this.timer);
			this.play();
			this.timer = setTimeout(function(){_this.auto();}, this.speed);
		}else{
			this.timer = setTimeout(function(){_this.auto();}, 500);
		}
	},
	bindPC: function(){
		var that = this;
		this.addEvent(this.$(this.imgContainer), 'mouseover', function(){
			that.isPause = true;
		});
		this.addEvent(this.$(this.imgContainer), 'mouseout', function(){
			that.isPause = false;
		});
		that.play();
	},
	bindMobile: function(){
		var that = this,
			startPosition,
			delta;
		that.addEvent(this.$(this.imgContainer), 'touchstart', function(e){
			that.isPause = true;
			var touch = e.touches[0];
			startPosition = {
        x: touch.pageX,
        y: touch.pageY
      }
		});
		that.addEvent(this.$(this.imgContainer), 'touchmove', function(e){
			e.preventDefault();
			var touch = e.touches[0];
			delta = {
        x: touch.pageX - startPosition.x,
        y: touch.pageY - startPosition.y
     	};
		});
		that.addEvent(this.$(this.imgContainer), 'touchend', function(e){
     	if (Math.abs(delta.x) > 50) {
     		that.play();
     		that.isPause = false;
     	}
     	that.removeEvent(this.$(this.imgContainer), 'touchmove');
		});
	}
}