function slide5(config){
	this.imgContainer    = config.imgContainer || 'H-slide1';
	this.leftButton      = config.leftButton || 'H-slide2';
	this.rightButton     = config.rightButton || 'H-slide3';
	this.linkButton      = config.linkButton || 'none';
	this.linkButtonclass = config.linkButtonclass || 'act';
	this.textContainer   = config.textContainer || 'none';
	this.speed           = config.speed || 5;
	this.isPause         = false;
	this.tt              = null;
	this.width           = config.width || 400;
	this.direction       = config.direction || 'horizontal';
	this.speed           *= 1000;
	this.t               = this.b = this.c = this.target = 0;
	this.env             = config.env || 'pc';
	this.linkButtonArr   = '';
	this.finish          = 1;
	var that             = this;
	var scroll           = true;
	if(config.autoscroll != undefined) scroll = config.autoscroll;
	if(this.linkButton != 'none'){
		this.linkButtonArr = this.$(this.linkButton, 'li');
	}
	if(config.picNum){
		this.picNum = config.picNum;
	}else{
		this.picNum = this.$(this.imgContainer, 'li').length;
	}
	this.init();
	if(scroll) this.timer = setTimeout(function(){that.auto();}, this.speed);
}
slide5.prototype = {
	$: function(o,e){
		var r;
		if(e){
			r = document.getElementById(o).getElementsByTagName(e);
		}else{
			r = document.getElementById(o);
		}
		return r;
	},
	addEvent: function(elm,evType,fn,useCapture){
		if(elm.addEventListener){
			elm.addEventListener(evType, fn, useCapture);
		}else if(elm.attachEvent){
			elm.attachEvent('on' + evType, fn);
		}else{
			elm['on' + evType] = fn;
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

	CurrentStyle: function(element){
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	},
	Each: function(list,fun){
		for(var i=0,len=list.length;i<len;i++){
			fun(list[i],i);
		}
	},
	init: function(){
		this.$(this.imgContainer).style.width = this.picNum * this.width + 'px';
		var that = this;
		if(this.leftButton != 'none'){
			this.addEvent(this.$(this.leftButton), 'click', function(){
				that.play('right');
			});

			this.addEvent(this.$(this.leftButton), 'mouseover', function(){
				that.isPause = true;
			});
			this.addEvent(this.$(this.leftButton), 'mouseout', function(){
				that.isPause = false;
			});
		}
		if(this.rightButton != 'none'){
			this.addEvent(this.$(this.rightButton), 'click', function(){
				that.play('left');
			});

			this.addEvent(this.$(this.rightButton), 'mouseover', function(){
				that.isPause = true;
			});
			this.addEvent(this.$(this.rightButton), 'mouseout', function(){
				that.isPause = false;
			});
		}
		if(this.env == 'pc'){
			this.bindPC();
		}else if(this.env == 'mob'){
			this.bindMobile();
		}else if(this.env == 'all'){
			this.bindPC();
			this.bindMobile();
		}
	},
	play: function(dir){
		if (this.finish) {
			this.finish = 0;
		}else{
			return;
		}
		if(this.picNum > 1){
			if(document.hasFocus()){
				dir == undefined && (dir = 'left');
				this.b = parseInt(this.CurrentStyle(this.$(this.imgContainer))['left']);
				var index = parseInt(Math.abs(this.b)/this.width);
				if(++index >= this.picNum){
					index = 0;
				}
				if(this.textContainer != 'none'){
					var titleList = this.$(this.textContainer, 'li');
					this.Each(titleList,function(e,f){
						if(f == index){
							e.style.display = 'block';
						}else{
							e.style.display = 'none';
						}
					});
				}
				if(this.linkButton != 'none'){
					var lb = this.$(this.linkButton, 'li');
					this.Each(lb, function(g, h){
						if(h == index){
							g.className = 'action';
						}else{
							g.className = '';
						}
					});
				}
				if(dir == 'left'){
					this.target = this.b - this.width;
					if(this.target <= -this.width * this.picNum){
						this.$(this.imgContainer, 'li')[0].style.cssText = 'position:relative;left:'+(this.picNum * this.width)+'px';
					}
				}else if(dir == 'right'){
					this.target = this.b + this.width;
					if(this.target > 0){
						this.$(this.imgContainer, 'li')[this.picNum - 1].style.cssText = 'position:relative;left:'+(-this.width * this.picNum)+'px';
					}
				}
				this.t = 0;
				this.c = this.target - this.b;
				this.move();
			}
		}
	},
	auto: function(){
		var _this = this;
		if(!this.isPause){
			if(this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(function(){_this.auto();}, this.speed);
			this.play('left');
		}else{
			this.timer = setTimeout(function(){_this.auto();}, this.speed);
		}
	},
	easeInOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	move: function(){
		clearTimeout(this.tt);
		var that = this;
		if(this.t < 50){
			this.moveTo(Math.round(this.easeInOut(this.t++, this.b, this.c, 50)));
			this.tt = setTimeout(function(){that.move()}, 10);
		}else{
			this.finish = 1;
			this.moveTo(this.target);
			if(this.target <= -this.width * this.picNum){
				this.$(this.imgContainer).style.left = 0 + 'px';
				this.$(this.imgContainer, 'li')[0].style.cssText = '';
			}else if(this.target > 0){
				this.$(this.imgContainer).style.left = -(this.picNum - 1) * this.width + 'px';
				this.$(this.imgContainer, 'li')[this.picNum - 1].style.cssText = '';
			}
		}
	},
	moveTo: function(i){
		this.$(this.imgContainer).style.left = i + 'px';
	},
	bindPC: function(){
		var that = this;
		this.addEvent(this.$(this.imgContainer), 'mouseover', function(){
			that.isPause = true;
		});
		this.addEvent(this.$(this.imgContainer), 'mouseout', function(){
			that.isPause = false;
		});
	},
	bindMobile: function(){
		var that = this,
			direction,
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
			direction = delta.x > 0 ? 'right' : 'left';
		});
		that.addEvent(this.$(this.imgContainer), 'touchend', function(e){
			if (Math.abs(delta.x) > 50) {
     		that.play(direction);
				that.isPause = false;
     	}
     	that.removeEvent(this.$(this.imgContainer), 'touchmove');
		});
	}
};