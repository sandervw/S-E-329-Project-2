//Function to Start the writing Game
function start_WritingGame(){
	//  hide_Banner_And_Nav();
	$('#mainPage').hide();
	$('body').css({height: "100%"});
	$('html').css({height: "100%"});
	$("#game").show();
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating
	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	writingGame.init();

	new Audio('sounds/writingIsFun.mp3').play()
	
	console.log(writingGame);
	window.addEventListener('resize', writingGame.resize, false);
}

var writingGame = {
	WIDTH: 0,
	HEIGHT: 0,
	offset: {top: 0, left: 0},
	currentWidth: null,
	currentHeight: null,
	canvas: null,
	ctx: null,
	ua:  null,
	android: null,
	ios:  null,
	init: function(){
		writingGame.canvas = document.getElementsByTagName('canvas')[0];
		var background = new Image();
		background.src = 'images/writinggamebackground.jpg';
		writingGame.WIDTH = $(window).width();
		writingGame.HEIGHT = $(window).height();
		writingGame.canvas.width = writingGame.WIDTH;
		writingGame.canvas.height = writingGame.HEIGHT;
		writingGame.currentHeight = writingGame.HEIGHT;
		writingGame.currentWidth = writingGame.WIDTH;
		writingGame.ctx = writingGame.canvas.getContext('2d');
		//writingGame.ctx.drawImage(background,0,0);
		background.onload = function(){
			writingGame.ctx.drawImage(background,0,0);   
		}
		writingGame.ua = navigator.userAgent.toLowerCase();
		writingGame.android = writingGame.ua.indexOf('android') > -1 ? true : false;
		writingGame.ios = ( writingGame.ua.indexOf('iphone') > -1 || writingGame.ua.indexOf('ipad') > -1  ) ? true : false;
		
		//Event Listeners, click and touch.
		window.addEventListener('click', function(e) {
			e.preventDefault();
			writingGame.Input.set(e);
		}, false);
		window.addEventListener('touchstart', function(e) {
			e.preventDefault();
			writingGame.Input.set(e.touches[0]);
		}, false);
		window.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);
		window.addEventListener('touchend', function(e) {
			e.preventDefault();
		}, false);
		
		writingGame.resize();
		writingGame.loop();
	},
		
	update: function() {
	},

	render: function() {
	},

	loop: function() {
		requestAnimFrame(writingGame.loop);
		writingGame.update();
		writingGame.render();
	},

	resize: function(){
		if (writingGame.android || writingGame.ios) {
		document.body.style.height = (window.innerHeight + 50) + 'px';
		}
		writingGame.canvas.style.width = writingGame.currentWidth + 'px';
		writingGame.canvas.style.height = writingGame.currentHeight + 'px';
		writingGame.offset.top = writingGame.canvas.offsetTop;
		writingGame.offset.left = writingGame.canvas.offsetLeft;
		window.setTimeout(function() {
			window.scrollTo(0,1);
		}, 1);
	}
}

writingGame.Draw = {
	clear: function() {
		writingGame.ctx.clearRect(0, 0, writingGame.WIDTH, writingGame.HEIGHT);
	},
	rect: function(x, y, w, h, col) {
		writingGame.ctx.fillStyle = col;
		writingGame.ctx.fillRect(x, y, w, h);
	},
	circle: function(x, y, r, col) {
		writingGame.ctx.fillStyle = col;
		writingGame.ctx.beginPath();
		writingGame.ctx.arc(x + 5, y + 5, r, 0,  writing.PI * 2, true);
		writingGame.ctx.closePath();
		writingGame.ctx.fill();
	},
	text: function(string, x, y, size, col) {
		writingGame.ctx.font = 'bold '+size+'px Monospace';
		writingGame.ctx.fillStyle = col;
		writingGame.ctx.fillText(string, x, y);
	}
};

writingGame.Input = {
	x: 0,
	y: 0,
	tapped :false,
	set: function(data) {
		this.x = (data.pageX - writingGame.offset.left);
		this.y = (data.pageY - writingGame.offset.top);
		this.tapped = true;
		writingGame.Draw.circle(this.x, this.y, 10, 'red');
	}
};