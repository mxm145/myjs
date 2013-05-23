
Scroll = function(){
	function $(o){
		return document.getElementById(o);
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
	function Scroll(conf){
		var that = this;

		that.id       = conf.id;
		that.inner    = conf.inner;
		that.dir      = conf.dir || 'left';
		that.speed    = conf.speed || 20;
		that.distance = conf.distance || 180;
		that.leftdir  = conf.left || 'left';
		that.rightdir = conf.right || 'right';

		that.obj         = $(that.id);
		that.innerObj    = $(that.inner);
		that.leftbutton  = $(that.leftdir);
		that.rightbutton = $(that.rightdir);
		that.tt          = null;


		that.right = function(){
			if(that.innerObj.offsetWidth - that.obj.scrollLeft > that.obj.offsetWidth){
				var l1 = Math.ceil(that.obj.scrollLeft / that.distance);
				var l2 = (l1 + 1) * that.distance;
				that.moveTo(l2);
			}
		}

		that.left = function(){
			if(that.obj.scrollLeft > 0){
				var l1 = Math.ceil(that.obj.scrollLeft / that.distance);
				var l2 = (l1 - 1) * that.distance;
				that.moveTo(l2);
			}
		}

		that.moveTo = function(targetDistance){
			clearTimeout(that.tt);
			var moves;
			var length1 = targetDistance - that.obj.scrollLeft;
			var length2 = Math.abs(targetDistance - that.obj.scrollLeft);
			var length3 = that.innerObj.offsetWidth - that.obj.scrollLeft -that.obj.offsetWidth;
			if(length2 >= 5){
				moves = Math.round(length2 / 5);
			}else{
				moves = length2;
			}
			if(length1 > 0){
				if(moves >= length3) moves = length3;
				that.obj.scrollLeft += moves;
				that.tt = setTimeout(function(){that.moveTo(targetDistance);}, 10);
			}else if(length1 < 0){
				that.obj.scrollLeft -= moves;
				that.tt = setTimeout(function(){that.moveTo(targetDistance);}, 10);
			}else{
				return;
			}
		}
		
		addEvent(that.leftbutton, 'click', that.left);
		addEvent(that.rightbutton, 'click', that.right);
	}
	return Scroll;
}();