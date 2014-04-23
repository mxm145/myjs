function slide4(config){
	this.imgContainer   = config.imgContainer || 'H-slide1';
	this.thumbContainer = config.thumbContainer || 'H-slide3';
	this.textContainer  = config.textContainer || 'H-slide2';
	this.speed          = config.speed || 5000;
	this.imgIndex       = 0;
	this.isPause        = false;
	this.tt             = null;
	this.picNum         = config.picNum || 4;
	this.width          = config.width || 400;
	this.height         = config.height || 290;
	this.dir            = config.dir || 'horizontal';
	var scroll = true;
	if(config.autoscroll != undefined) scroll = config.autoscroll;
	this.t = this.b = this.c = this.target = 0;
	this.init();
	if(scroll) this.auto();
};
slide4.prototype = {
	$ : function(o){
		return document.getElementById(o);
	},
	$$ : function(o, tag){
		return this.$(o).getElementsByTagName(tag);
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
	CurrentStyle : function(element){
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	},
	init : function(){
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
		}
	},
	play : function(imgIndex){
		imgIndex == undefined && (imgIndex = this.imgIndex);
		imgIndex < 0 && (imgIndex = this.picNum) || imgIndex >= (this.picNum + 1) && (imgIndex = 1);

		this.target = imgIndex * (this.dir == 'horizontal' ? this.width : this.height);
		this.t = 0;
		this.b = this.dir == 'horizontal' ? parseInt(this.$(this.imgContainer).scrollLeft) : parseInt(this.$(this.imgContainer).scrollTop);
		this.c = this.target - this.b;

		if(imgIndex == 0 || imgIndex == this.picNum){
			var tempI = 1;
		}else{
			var tempI = imgIndex + 1;
		}

		if(this.thumbContainer != 'none'){
			var imgList = this.$$(this.thumbContainer, 'li');
			this.Each(imgList,function(c,d){
				if((d + 1) == tempI){
					c.className = 'action';
				}else{
					c.className = '';
				}
			});
		}

		if(this.textContainer != 'none'){
			var titleList = this.$$(this.textContainer, 'li');
			this.Each(titleList,function(e,f){
				if((f + 1) == tempI){
					e.style.display = 'block';
				}else{
					e.style.display = 'none';
				}
			});
		}

		this.imgIndex = ++imgIndex;
		
		this.move();
	},
	auto : function(){
		var that = this;
		if(!this.isPause){
			if(timer) clearTimeout(timer);
			this.play();
			var timer = setTimeout(function(){that.auto();}, this.speed);
		}else{
			var timer = setTimeout(function(){that.auto();}, 500);
		}
	},
	easeInOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	move : function(){
		clearTimeout(this.tt);
		var that = this;
		if(this.c && this.t < 50){
			this.moveTo(Math.round(this.easeInOut(this.t++, this.b, this.c, 50)));
			this.tt = setTimeout(function(){that.move()}, 10);
		}else{
			this.moveTo(this.target);
			if(this.imgIndex > this.picNum){
				this.dir == 'horizontal' ? this.$(this.imgContainer).scrollLeft = 0 : this.$(this.imgContainer).scrollTop = 0;
			}
		}
	},
	moveTo : function(i){
		this.dir == 'horizontal' ? this.$(this.imgContainer).scrollLeft = i : this.$(this.imgContainer).scrollTop = i;
	}
};
