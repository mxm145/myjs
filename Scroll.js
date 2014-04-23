/**
vision : 2.1
new param : delay 
author    : mxm145@163.com
**/
function Scroll(config){
	this.id       = config.id;
	this.dir      = config.dir || 'left';
	this.speed    = config.speed || 80;
	this.delay    = config.delay || 'none';
	this.name1    = this.randStr(5);
	this.name2    = this.randStr(5);
	this.begin    = null;
	this.begin2   = null;
	this.obj      = this.$(this.id);
	this.target   = 0;
	this.distance = this.dir == 'left' ? this.obj.clientWidth : this.obj.clientHeight;
	this.length   = 0;
	this.init();
}
Scroll.prototype = {
	$ : function(o,e){
		if(e){
			return document.getElementById(o).getElementsByTagName(e);
		}else{
			return document.getElementById(o);
		}
	},
	randStr : function(n, u){
		var tmStr = "abcdefghijklmnopqrstuvwxyz0123456789";
		var Len = tmStr.length;
		var Str = "";
		for(i=1;i<n+1;i++){
			Str += tmStr.charAt(Math.random()*Len);
		}
		return (u ? Str.toUpperCase() : Str);
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
	init : function(){
		var s = this.obj.innerHTML;
		var that = this;
		this.obj.innerHTML = this.dir == 'left' ? '<table border="0" cellpadding="0" cellspace="0"><tbody><tr><td id="'+this.name1+'" style="white-space: nowrap;word-break:keep-all;">'+s+'</td><td id="'+this.name2+'" style="white-space: nowrap;word-break:keep-all;">'+s+'</td></tr></tbody></table>' : '<table border="0" cellpadding="0" cellspace="0"><tbody><tr><td id="'+this.name1+'">'+s+'</td></tr><tr><td id="'+this.name2+'" >'+s+'</td></tr></tbody></table>';
		this.length   = this.dir == 'left' ? this.$(this.name1).scrollWidth : this.$(this.name1).scrollHeight;
		this.addEvent(this.obj, 'mouseover', function(){
			clearInterval(that.begin);
		});
		this.addEvent(this.obj, 'mouseout', function(){
			that.start();
		});
		this.start();
	},
	delayTop : function(){
		var that = this;
		if(parseInt(this.obj.scrollTop) == this.target){
			clearTimeout(this.begin2);
			return;
		} 
		if(this.length - this.obj.scrollTop <= 0){
			this.obj.scrollTop = 0;
		}else{
			this.obj.scrollTop ++;
		}
		this.begin2 = setTimeout(function(){that.delayTop();}, 1);
	},
	top : function(){
		if(this.length - this.obj.scrollTop <= 0){
			this.obj.scrollTop = 0;
		}else{
			this.obj.scrollTop ++;
		}
	},
	bottom : function(){
		if(this.$(this.name1).offsetTop - this.obj.scrollTop >= 0){
			this.obj.scrollTop = this.length;
		}else{
			this.obj.scrollTop--;
		}
	},
	left : function(){
		if(this.length - this.obj.scrollLeft <= 0){
			this.obj.scrollLeft = 0;
		}else{
			this.obj.scrollLeft ++;
		} 
	},
	delayLeft : function(){
		var that = this;
		if(parseInt(this.obj.scrollLeft) == this.target){
			clearTimeout(this.begin2);
			return;
		} 
		if(this.length - this.obj.scrollLeft <= 0){
			this.obj.scrollLeft = 0;
		}else{
			this.obj.scrollLeft ++;
		}
		this.begin2 = setTimeout(function(){that.delayLeft();}, 1);
	},
	start : function(){
		var that = this;
		if(this.delay != 'none'){
			if(this.dir == 'top'){
				this.begin = setInterval(function(){
					if(that.length - that.obj.scrollTop <= 0){
						that.obj.scrollTop = 0;
					}else{
						that.obj.scrollTop ++;
					}
					that.target = (parseInt(parseInt(that.obj.scrollTop) / that.distance) + 1) * that.distance;
					if(that.target > that.length) that.target = 0;
					that.delayTop();
				}, that.delay);
			}else if(this.dir == 'left'){
				this.begin = setInterval(function(){
					if(that.length - that.obj.scrollLeft <= 0){
						that.obj.scrollLeft = 0;
					}else{
						that.obj.scrollLeft ++;
					}
					that.target = (parseInt(parseInt(that.obj.scrollLeft) / that.distance) + 1) * that.distance;
					if(that.target > that.length) that.target = 0;
					that.delayLeft();
				}, that.delay);
			}
		}else{
			if(this.dir == 'left'){
				this.begin = setInterval(function(){that.left();}, that.speed);
			}else if(this.dir == 'top'){
				this.begin = setInterval(function(){that.top();}, that.speed);
			}else if(this.dir == 'bottom'){
				this.begin = setInterval(function(){that.bottom();}, that.speed);
			}
		}
	},
	stop: function(){
		clearInterval(this.begin);
	}
};
