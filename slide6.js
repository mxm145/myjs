function slide6(config){
	this.container  = config.imgContainer;
	this.width      = config.width;
	this.height     = config.height;
	this.imgArr     = config.imgArr;
	this.urlArr     = config.urlArr;
	this.textArr    = config.textArr || [];
	this.textId     = config.textId || 'none';
	this.clickLeft  = config.clickLeft || 'none';
	this.clickRight = config.clickRight || 'none';
	this.sign       = config.sign || 'none';
	this.flat       = config.flat || 'none';
	this.zoom       = config.zoom || 0.7;
	this.ldistance  = config.ldistance || 0.72;
	if(this.imgArr.length < 4){
		return;
	}
	this.nowIndex   = 0;
	this.preIndex   = (this.nowIndex - 1) >= 0 ? (this.nowIndex - 1) : (this.imgArr.length - 1);
	this.nexIndex   = (this.nowIndex + 1) <= (this.imgArr.length - 1) ? (this.nowIndex + 1) : 0;
	this.disIndex   = 0;
	this.zoomWidth  = Math.ceil(this.width * this.zoom);
	this.zoomHeight = Math.ceil(this.height * this.zoom);
	if(this.flat == 1){
		this.h_top  = 0
	}else{
		this.h_top  = Math.ceil(this.height * (1 - this.zoom) / 2);
	}
	this.h_left_n   = Math.ceil(this.width * (this.zoom + this.ldistance - 1) / 2);//left now
	this.h_left_ne  = Math.ceil(this.width * this.ldistance);//left next
	this.h_left_d   = Math.ceil(this.width * (this.ldistance / 2));//left disable
	this.isPause    = false;
	this.autoplay   = config.autoplay || false;
	this.speed      = config.speed || 5;
	this.timer      = null;
	this.speed      *= 1000;
	this.init();
	var that = this;
	if(this.autoplay){
		setTimeout(function(){that.auto();}, this.speed);
	}
}
slide6.prototype = {
	init: function(){
		if(this.imgArr.length != this.urlArr.length){
			return;
		}
		var str = '';
		var that = this;
		for(var i = 0; i < this.imgArr.length; i++){
			if(i == this.nowIndex){
				var h_top = 0;
				str += '<div class="H-slide1" id="H-slides'+i+'" style="width:'+this.width+'px;height:'+this.height+'px;bottom:'+h_top+'px;left:'+this.h_left_n+'px;"><a href="'+this.urlArr[i]+'" target="_blank"><img src="'+this.imgArr[i]+'" width="100%" height="100%" /></a></div>';
			}else{
				var cn = 'H-slide2';
				if(i == this.preIndex){
					var h_left = 0;
				}else if(i == this.nexIndex){
					var h_left = Math.ceil(this.width * this.ldistance);
				}else{
					var h_left = Math.ceil(this.width * (this.ldistance / 2));
					cn = 'H-slide3';
				}
				if(this.flat == 1){
					var h_top = 0;
				}else{
					var h_top = Math.ceil(this.height * (1 - this.zoom) / 2);
				}
				str += '<div class="'+cn+'" id="H-slides'+i+'" style="width:'+this.zoomWidth+'px;height:'+this.zoomHeight+'px;bottom:'+h_top+'px;left:'+h_left+'px;"><a href="'+this.urlArr[i]+'" target="_blank"><img src="'+this.imgArr[i]+'" width="100%" height="100%" /></a></div>';
			}
		}
		this.$(this.container).innerHTML = str;
		for(var j = 0; j < this.imgArr.length; j++){
			this.$('H-slides' + j).onmouseover = function(){
				that.isPause = true;
			};
			this.$('H-slides' + j).onmouseout = function(){
				that.isPause = false;
			};
		}
		this.$('H-slides' + this.preIndex).onclick = function(){
			that.play('right');
			return false;
		};
		this.$('H-slides' + this.nexIndex).onclick = function(){
			that.play('left');
			return false;
		};
		if(this.textId != 'none'){
			if(this.textArr.length == this.imgArr.length){
				this.$(this.textId).innerHTML = this.textArr[0];
			}
		}
		if(this.clickLeft != 'none'){
			this.$(this.clickLeft).onclick = function(){
				that.play('right');
				return false;
			}
		}
		if(this.clickRight != 'none'){
			this.$(this.clickRight).onclick = function(){
				that.play('left');
				return false;
			}
		}
	},
	play: function(dir){
		this.$('H-slides' + this.preIndex).onclick = function(){
			return false;
		};
		this.$('H-slides' + this.nexIndex).onclick = function(){
			return false;
		};

		var that = this;
		if(dir == 'left'){
			this.disIndex = this.preIndex;
			this.preIndex = this.nowIndex;
			this.nowIndex = this.nexIndex;
			this.nexIndex = (this.nowIndex + 1) <= (this.imgArr.length - 1) ? (this.nowIndex + 1) : 0;
		}else if(dir == 'right'){
			this.disIndex = this.nexIndex;
			this.nexIndex = this.nowIndex;
			this.nowIndex = this.preIndex;
			this.preIndex = (this.nowIndex - 1) >= 0 ? (this.nowIndex - 1) : (this.imgArr.length - 1);
		}

		this.$('H-slides' + this.preIndex).onclick = function(){
			that.play('right');
			return false;
		};
		this.$('H-slides' + this.nexIndex).onclick = function(){
			that.play('left');
			return false;
		};

		var a = new H_animate(this.preIndex,{width:this.zoomWidth,height:this.zoomHeight,left:0,bottom:this.h_top,zIndex:6},function(){
			that.$('H-slides' + that.preIndex).className = 'H-slide2';
		});
		var b = new H_animate(this.nowIndex,{width:this.width,height:this.height,left:this.h_left_n,bottom:0,zIndex:8},function(){
			that.$('H-slides' + that.nowIndex).className = 'H-slide1';
			that.$('H-slides' + that.nowIndex).onclick = function(){return true;}
		});
		var c = new H_animate(this.nexIndex,{width:this.zoomWidth,height:this.zoomHeight,left:this.h_left_ne,bottom:this.h_top,zIndex:6},function(){
			that.$('H-slides' + that.nexIndex).className = 'H-slide2';
		});
		var d = new H_animate(this.disIndex,{width:this.zoomWidth,height:this.zoomHeight,left:this.h_left_d,bottom:this.h_top,zIndex:4},function(){
			that.$('H-slides' + that.disIndex).className = 'H-slide3';
		});

		if(this.sign != 'none'){
			var m = this.$(this.sign, 'span');
			for(var i = 0; i < m.length; i++){
				m[i].className = i == this.nowIndex ? 'act' : '';
			}
		}
		if(this.textId != 'none'){
			this.$(this.textId).innerHTML = this.textArr[this.nowIndex];
		}
	},
	$: function(o,e){
		if(e){
			return document.getElementById(o).getElementsByTagName(e);
		}else{
			return document.getElementById(o);
		}
	},
	auto : function(){
		var that = this;
		if(!this.isPause){
			if(this.timer) clearTimeout(this.timer);
			this.play('right');
		}
		this.timer = setTimeout(function(){that.auto();}, this.speed);
	}
};
function H_animate(index,property,callback){
	this.$ = function(o){
		return document.getElementById(o);
	};
	this.CurrentStyle = function(element){
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	};
	var w = property.width;
	var h = property.height;
	var t = property.bottom;
	var l = property.left;
	this.z = property.zIndex;
	this.callback = callback;
	this.obj = this.$('H-slides' + index);
	var cssobj = this.CurrentStyle(this.obj);
	this.t1 = 0;
	this.b1 = parseInt(cssobj['width']);
	this.b2 = parseInt(cssobj['height']);
	this.b3 = parseInt(cssobj['bottom']);
	this.b4 = parseInt(cssobj['left']);
	this.c1 = w - this.b1;
	this.c2 = h - this.b2;
	this.c3 = t - this.b3;
	this.c4 = l - this.b4;
	this.d1 = 20;
	this.easeInOut = function(t,b,c,d){
		if((t /= d / 2) < 1){
			return c / 2 * t * t + b;
		}else{
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	};
	this.move = function(){
		var that = this;
		this.obj.style.width = Math.ceil(this.easeInOut(this.t1, this.b1, this.c1, this.d1)) + 'px';
		this.obj.style.height = Math.ceil(this.easeInOut(this.t1, this.b2, this.c2, this.d1)) + 'px';
		this.obj.style.bottom = Math.ceil(this.easeInOut(this.t1, this.b3, this.c3, this.d1)) + 'px';
		this.obj.style.left = Math.ceil(this.easeInOut(this.t1, this.b4, this.c4, this.d1)) + 'px';
		if(this.t1 < this.d1){
			this.t1++;
			setTimeout(function(){that.move()}, 5);
		}else{
			this.obj.style.zIndex = this.z;
			this.callback();
		}
	};
	this.move();
}
