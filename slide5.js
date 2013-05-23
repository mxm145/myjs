/**
vision : 2.2
new param : linkButton linkButtonclass direction
author    : mxm145@163.com
**/
function slide5(config){
	this.imgContainer   = config.imgContainer || 'H-slide1';
	this.leftButton     = config.leftButton || 'H-slide2';
	this.rightButton    = config.rightButton || 'H-slide3';
	this.linkButton     = config.linkButton || 'none';
	this.linkButtonclass= config.linkButtonclass || 'act';
	this.speed          = config.speed || 5000;
	this.imgIndex       = 0;
	this.isPause        = false;
	this.tt             = null;
	this.width          = config.width || 400;
	this.direction      = config.direction || 'horizontal';
	this.t = this.b = this.c = this.target = 0;
	this.linkButtonArr = '';
	var that = this;
	var scroll = true;
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
	if(scroll) var timer = setTimeout(function(){that.auto();}, this.speed);
}
slide5.prototype = {
	$ : function(o,e){
		if(e){
			return document.getElementById(o).getElementsByTagName(e);
		}else{
			return document.getElementById(o);
		}
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
	CurrentStyle : function(element){
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	},
	init : function(){
		var that = this;
		if(this.linkButton != 'none'){
			for(var i = 0; i < this.linkButtonArr.length; i++){
				this.linkButtonArr[i].i = i;
				this.linkButtonArr[i].onclick = function(){
					that.play(this.i);
				}
			}
		}
		this.addEvent(this.$(this.leftButton), 'click', function(){
			that.play('right');
		});
		this.addEvent(this.$(this.rightButton), 'click', function(){
			that.play('left');
		});
		this.addEvent(this.$(this.imgContainer), 'mouseover', function(){
			that.isPause = true;
		});
		this.addEvent(this.$(this.imgContainer), 'mouseout', function(){
			that.isPause = false;
		});
	},
	play : function(dir){
		if(this.picNum > 1){
			if(typeof(dir) == 'number'){
				this.imgIndex = dir;
			}else{
				dir == undefined && (dir = 'left');
				if(dir == 'left'){
					this.imgIndex <= 0 && (this.imgIndex = 0) || (this.imgIndex >= this.picNum -1) && (this.imgIndex = -1);
					this.imgIndex++;
				}else if(dir == 'right'){
					this.imgIndex <= 0 && (this.imgIndex = this.picNum) || this.imgIndex >= this.picNum && (this.imgIndex = this.picNum);
					this.imgIndex--;
				}
			}
			if(this.linkButton != 'none'){
				for(var i = 0; i < this.linkButtonArr.length; i++){
					this.linkButtonArr[i].className = this.imgIndex == i ? 'act' : '';
				}
			}
			if(this.direction == 'horizontal'){
				this.b = parseInt(this.CurrentStyle(this.$(this.imgContainer))['left']);
			}else{
				this.b = parseInt(this.CurrentStyle(this.$(this.imgContainer))['top']);
			}
			this.target = -this.imgIndex * this.width;
			this.t = 0;
			this.c = this.target - this.b;
			this.move();
		}
	},
	auto : function(){
		var _this = this;
		if(!this.isPause){
			if(timer) clearTimeout(timer);
			var timer = setTimeout(function(){_this.auto();}, this.speed);
			this.play('left');
		}else{
			var timer = setTimeout(function(){_this.auto();}, 500);
		}
	},
	easeInOut: function(t,b,c,d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	move : function(distance){
		clearTimeout(this.tt);
		var that = this;
		if(this.c && this.t < 50){
			this.moveTo(Math.round(this.easeInOut(this.t++, this.b, this.c, 50)));
			this.tt = setTimeout(function(){that.move()}, 10);
		}else{
			this.moveTo(this.target);
		}
	},
	moveTo : function(i){
		if(this.direction == 'horizontal'){
			this.$(this.imgContainer).style.left = i + 'px';
		}else{
			this.$(this.imgContainer).style.top = i + 'px';
		}
	}
};