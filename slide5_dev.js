function $(o){
	return document.getElementById(o);
}
function $$(o, tag){
	return $(o).getElementsByTagName(tag);
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
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else if(obj.detachEvent){
		obj.detachEvent("on"+type,obj[type+fn]);
		obj[type+fn]=null;
		obj["e"+type+fn]=null;
	}
}
function Each(list,fun){
	for(var i=0,len=list.length;i<len;i++){
		fun(list[i],i);
	}
}
slide5 = function(){
	function slide5(config){
		this.imgContainer   = config.imgContainer || 'H-slide1';
		this.leftButton     = config.leftButton || 'H-slide2';
		this.rightButton    = config.rightButton || 'H-slide3';
		this.speed          = config.speed || 5000;
		this.imgIndex       = 0;
		this.isPause        = false;
		this.tt             = null;
		this.picNum         = config.picNum || 4;
		this.width          = config.width || 400;
		var that = this;
		var scroll = true;
		if(config.autoscroll != undefined) scroll = config.autoscroll;
		addEvent($(this.leftButton), 'click', function(){
			that.play('left');
		});
		addEvent($(this.rightButton), 'click', function(){
			that.play('right');
		});
		addEvent($(this.imgContainer), 'mouseover', function(){
			that.isPause = true;
		});
		addEvent($(this.imgContainer), 'mouseout', function(){
			that.isPause = false;
		});
		if(scroll) this.auto();
	}
	slide5.prototype = {
		play : function(){
			if(this.picNum > 1){
				if(arguments[0] == undefined){
					if(this.imgIndex > (this.picNum - 1)) this.imgIndex = 0;
					var j = this.imgIndex;
					this.imgIndex++;
				}else{
					if(arguments[0] == 'left'){
						if(this.imgIndex >= (this.picNum - 1)) this.imgIndex = -1;
						this.imgIndex ++;
						var j = this.imgIndex;
					}else if(arguments[0] == 'right'){
						if(this.imgIndex <= 0) this.imgIndex = this.picNum;
						this.imgIndex --;
						var j = this.imgIndex;
					}
				}
				var k = (j * this.width);
				this.move(-k);
			}
		},
		auto : function(){
			var _this = this;
			if(!this.isPause){
				if(timer) clearTimeout(timer);
				this.play('left');
				var timer = setTimeout(function(){_this.auto();}, this.speed);
			}else{
				var timer = setTimeout(function(){_this.auto();}, 500);
			}
		},
		move : function(distance){
			clearTimeout(this.tt);
			var dis = $(this.imgContainer).style.left == '' ? 0 : $(this.imgContainer).style.left;
			var _this = this;
			dis = parseInt(dis, 10);
			var m = Math.abs(Math.round(Math.abs(distance) - Math.abs(dis)));
			if(m > 5) m = m / 5;
			if(dis > distance){
				$(this.imgContainer).style.left = (dis - m) + 'px';
				this.tt = setTimeout(function(){_this.move(distance);}, 10);
			}else if(dis < distance){
				$(this.imgContainer).style.left = (dis + m) + 'px';
				this.tt = setTimeout(function(){_this.move(distance);}, 10);
			}else{
				return;
			}
		}
	};
	return slide5;
}();