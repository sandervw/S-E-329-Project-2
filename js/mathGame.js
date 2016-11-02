//Function to Start the Math Game
function start_MathGame(){
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
	mathGame.init();
	
	console.log(mathGame);
	window.addEventListener('resize', mathGame.resize, false);
}

var mathGame = {
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
		mathGame.highScore = 0;
		
		mathGame.ResourcePack = 'ArcadeClassic';
		mathGame.menuAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/MenuMusic.mp3');
		mathGame.gameAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/FightMusic.mp3');
		mathGame.attackAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/Attack.mp3');
		mathGame.menuBackground = new Image();
		mathGame.menuBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/MenuBackground.png';
		mathGame.gameBackground = new Image();
		mathGame.gameBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/GameBackground.png';
		mathGame.playerImage = new Image();
		mathGame.playerImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Player.png';
		mathGame.enemy1Image = new Image();
		mathGame.enemy1Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy1.png';
		mathGame.enemy1Name = 'a  goblin';
		mathGame.enemy2Image = new Image();
		mathGame.enemy2Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy2.png';
		mathGame.enemy2Name = 'a  frost  giant';
		mathGame.enemy3Image = new Image();
		mathGame.enemy3Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy3.png';
		mathGame.enemy3Name = 'a  dragon';
		mathGame.squareImage = new Image();
		mathGame.squareImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Square.png';
		mathGame.attackImage = new Image();
		mathGame.attackImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Attack.png';
		mathGame.gameFont = 'arcadeClassic';
		
		mathGame.menuAudio.play();
		mathGame.canvas = document.getElementsByTagName('canvas')[0];
		InputManager.connect(document, mathGame.canvas);
		mathGame.mainMenu = new Menu(["Start Game","Main Menu", "Change Theme"],375, 50, 400, 0);
		mathGame.mainGame = new Game(0, 1, 0, 0, '+', 0, 40);
		mathGame.state = 0;
		mathGame.shouldRender = 0;
		mathGame.shouldUpdate = 1;
		mathGame.WIDTH = $(window).width();
		mathGame.HEIGHT = $(window).height();
		mathGame.canvas.width = mathGame.WIDTH;
		mathGame.canvas.height = mathGame.HEIGHT;
		mathGame.currentHeight = mathGame.HEIGHT;
		mathGame.currentWidth = mathGame.WIDTH;
		mathGame.ctx = mathGame.canvas.getContext('2d');
		mathGame.menuBackground.onload = function(){
			mathGame.ctx.drawImage(mathGame.menuBackground,0,0);  
			mathGame.mainMenu.Render();
		}
		mathGame.gameBackground.onload = function(){
			mathGame.ctx.drawImage(mathGame.gameBackground,0,0, mathGame.gameBackground.width, mathGame.gameBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT);  
			mathGame.mainGame.Render();
		}
		mathGame.ua = navigator.userAgent.toLowerCase();
		mathGame.android = mathGame.ua.indexOf('android') > -1 ? true : false;
		mathGame.ios = ( mathGame.ua.indexOf('iphone') > -1 || mathGame.ua.indexOf('ipad') > -1  ) ? true : false;

		//Event Listeners, click and touch.
		window.addEventListener('click', function(e) {
			e.preventDefault();
			mathGame.shouldUpdate = 1;
			mathGame.Input.set(e);
		}, false);
		window.addEventListener('touchstart', function(e) {
			e.preventDefault();
			mathGame.shouldUpdate = 1;
			mathGame.Input.set(e.touches[0]);
		}, false);
		window.addEventListener('touchmove', function(e) {
			mathGame.shouldUpdate = 1;
			e.preventDefault();
		}, false);
		window.addEventListener('touchend', function(e) {
			mathGame.shouldUpdate = 1;
			e.preventDefault();
		}, false);
		InputManager.reset();
		mathGame.resize();
		mathGame.loop();
	},
		
	update: function() {
		if(mathGame.state == 0 || mathGame.state == 1 || mathGame.state == 3 || mathGame.state == 4 || mathGame.state == 5) mathGame.mainMenu.Update();
		else if(mathGame.state == 2) mathGame.mainGame.Update();
	},

	render: function() {
		if(mathGame.state == 0 || mathGame.state == 1 || mathGame.state == 5){
			mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
			mathGame.ctx.drawImage(mathGame.menuBackground,0,0, mathGame.menuBackground.width, mathGame.menuBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT); 
			mathGame.mainMenu.Render();
			mathGame.shouldRender = 0;
		}
		else if(mathGame.state == 2){
			mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
			mathGame.ctx.drawImage(mathGame.gameBackground,0,0, mathGame.gameBackground.width, mathGame.gameBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT); 
			mathGame.mainGame.Render();
			mathGame.shouldRender = 0;
		}
		else if(mathGame.state == 3 || mathGame.state == 4){
			mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
			mathGame.ctx.drawImage(mathGame.gameBackground,0,0, mathGame.gameBackground.width, mathGame.gameBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT); 
			mathGame.mainMenu.Render();
			mathGame.shouldRender = 0;
		}
	},

	loop: function() {
		mathGame.update();
		if(mathGame.shouldRender) mathGame.render();
		requestAnimFrame(mathGame.loop);
	},

	resize: function(){
		if (mathGame.android || mathGame.ios) {
		document.body.style.height = (window.innerHeight + 50) + 'px';
		}
		mathGame.canvas.style.width = mathGame.currentWidth + 'px';
		mathGame.canvas.style.height = mathGame.currentHeight + 'px';
		mathGame.offset.top = mathGame.canvas.offsetTop;
		mathGame.offset.left = mathGame.canvas.offsetLeft;
		window.setTimeout(function() {
			window.scrollTo(0,1);
		}, 1);
	}
}

mathGame.Draw = {
	clear: function() {
		mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
	},
	rect: function(x, y, w, h, col) {
		mathGame.ctx.fillStyle = col;
		mathGame.ctx.fillRect(x, y, w, h);
	},
	circle: function(x, y, r, col) {
		mathGame.ctx.fillStyle = col;
		mathGame.ctx.beginPath();
		mathGame.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
		mathGame.ctx.closePath();
		mathGame.ctx.fill();
	},
	text: function(string, x, y, size, col) {
		mathGame.ctx.font = 'bold '+size+'px Monospace';
		mathGame.ctx.fillStyle = col;
		mathGame.ctx.fillText(string, x, y);
	}
};

mathGame.Input = {
	x: 0,
	y: 0,
	tapped :false,
	set: function(data) {
		this.x = (data.pageX - mathGame.offset.left);
		this.y = (data.pageY - mathGame.offset.top);
		this.tapped = true;
	}
};

Menu = function (items, y, fontSize, width, selected){
	
	this.items = items;
	this.y = y;
	this.fontSize = fontSize;
	this.width = width;
	this.selected = selected;
	
}

Menu.prototype.constructor = Menu;

Menu.prototype.Render = function()
{

	mathGame.ctx.textAlign = "center";
	mathGame.ctx.fillStyle = "Green";
	mathGame.ctx.font = 70 + "px " + mathGame.gameFont;
	mathGame.ctx.fillText('Math4Fun', mathGame.WIDTH/2, 100);
	mathGame.ctx.font = 60 + "px " + mathGame.gameFont;
	mathGame.ctx.fillText('The  Wacky  New  Math  Game!', mathGame.WIDTH/2, 160);
	mathGame.ctx.fillStyle = "White";

	var y = this.y;

	for (var i = 0; i < this.items.length; ++i)
	{
		var size = Math.floor(this.fontSize*0.8);
		if (i == this.selected)
		{
			mathGame.ctx.fillStyle = "Green";
			size = this.fontSize;
		}
		mathGame.ctx.font = size.toString() + "px " + mathGame.gameFont;
		y += this.fontSize;
		mathGame.ctx.fillText(this.items[i], mathGame.WIDTH/2, y);
		mathGame.ctx.fillStyle = "White";
	}
}

Menu.prototype.Update = function()
{
	InputManager.padUpdate();
	if (InputManager.padPressed & InputManager.PAD.OK)
	{
		setMenuState(this.selected);
		this.selected = 0;
		this.shouldRender = 1;
		return;
	}
	var prevSelected = this.selectedItem;
	if (InputManager.padPressed & InputManager.PAD.UP)
		this.selected = (this.selected + this.items.length - 1) % this.items.length;
		mathGame.shouldRender = 1;
	if (InputManager.padPressed & InputManager.PAD.DOWN)
		this.selected = (this.selected + 1) % this.items.length;
		mathGame.shouldRender = 1;

	var leftx = (mathGame.canvas.width - this.width)/2;
	if (InputManager.lastMouseX >= leftx && InputManager.lastMouseX < leftx+this.width)
	{
		var y = this.y + this.size*0.2; // Adjust for baseline
		if (InputManager.lastMouseY >= y && InputManager.lastMouseY < (y + this.size*this.items.length))
			this.selected = Math.floor((InputManager.lastMouseY - y)/this.size);
			mathGame.shouldRender = 1;
	}
}

function setMenuState(newState){
	if (mathGame.state == 0){
		if(newState == 0){
			mathGame.mainMenu.items = ['Easy', 'Medium', 'Hard', 'Nightmare', 'Back'];
			mathGame.state = 1;
		}
		else if(newState == 1){
			window.location.reload();
		}
		else if(newState == 2){
			mathGame.mainMenu.items = ['Arcade  Classic', 'Matrix', 'Underwater', 'Back'];
			mathGame.state = 5;
		}
	}
	else if (mathGame.state == 1){
		if(newState == 0){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 1){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.mainGame.difficulty = 2;
			mathGame.mainGame.message = 'Oh  no,  ' + mathGame.enemy2Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 2){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.mainGame.difficulty = 3;
			mathGame.mainGame.message = 'Oh  no,  ' + mathGame.enemy3Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 3){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.mainGame.difficulty = 4;
			mathGame.mainGame.message = 'Oh  no,  ' + mathGame.enemy3Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 4){
			mathGame.mainMenu.items = ['Start Game', 'Main Menu', 'Change Theme'];
			mathGame.state = 0;
		}
	}
	else if (mathGame.state == 3){
		if(newState == 0){
			mathGame.gameAudio.pause();
			mathGame.gameAudio.currentTime = 0;
			mathGame.gameAudio.play();
			if(mathGame.mainGame.difficulty == 1){
				mathGame.mainGame.message = 'Oh  no,  ' + mathGame.enemy1Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
			}
			else if(mathGame.mainGame.difficulty == 2){
				mathGame.mainGame.message = 'Oh  no,  ' + mathGame.enemy2Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
			} 
			else if(mathGame.mainGame.difficulty == 3){
				mathGame.mainGame.message = 'Oh  no,  ' + mathGame.enemy3Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
			}
			mathGame.mainGame.gameState = 0;
			mathGame.mainGame.monsterHP = 7;
			mathGame.mainGame.playerHP = 7;
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 1){
			//submit high score;
		}
		else if(newState == 2){
			mathGame.gameAudio.pause();
			mathGame.gameAudio.currentTime = 0;
			mathGame.init();
		}
		else if(newState == 3){
			window.location.reload();
		}
	}
	else if (mathGame.state == 4){
		if(newState == 0){
			//submit high score;
		}
		else if(newState == 1){
			mathGame.gameAudio.pause();
			mathGame.gameAudio.currentTime = 0;
			mathGame.init();
		}
		else if(newState == 2){
			window.location.reload();
		}
	}
	else if (mathGame.state == 5){
		if(newState == 0){
			mathGame.ResourcePack = 'ArcadeClassic';
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameFont = 'arcadeClassic';
			mathGame.menuAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/MenuMusic.mp3');
			mathGame.gameAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/FightMusic.mp3');
			mathGame.attackAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/Attack.mp3');
			mathGame.menuBackground = new Image();
			mathGame.menuBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/MenuBackground.png';
			mathGame.gameBackground = new Image();
			mathGame.gameBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/GameBackground.png';
			mathGame.playerImage = new Image();
			mathGame.playerImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Player.png';
			mathGame.enemy1Image = new Image();
			mathGame.enemy1Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy1.png';
			mathGame.enemy1Name = 'a  goblin';
			mathGame.enemy2Image = new Image();
			mathGame.enemy2Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy2.png';
			mathGame.enemy2Name = 'a  frost  giant';
			mathGame.enemy3Image = new Image();
			mathGame.enemy3Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy3.png';
			mathGame.enemy3Name = 'a  dragon';
			mathGame.squareImage = new Image();
			mathGame.squareImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Square.png';
			mathGame.attackImage = new Image();
			mathGame.attackImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Attack.png';
			mathGame.mainMenu.items = ['Start Game', 'Main Menu', 'Change Theme'];
			mathGame.mainGame = new Game(0, 1, 0, 0, '+', 0, 40);
			mathGame.menuAudio.play();
			mathGame.state = 0;
		}
		else if(newState == 1){
			mathGame.ResourcePack = 'Matrix';
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameFont = 'matrixFont';
			mathGame.menuAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/MenuMusic.mp3');
			mathGame.gameAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/FightMusic.mp3');
			mathGame.attackAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/Attack.mp3');
			mathGame.menuBackground = new Image();
			mathGame.menuBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/MenuBackground.png';
			mathGame.gameBackground = new Image();
			mathGame.gameBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/GameBackground.png';
			mathGame.playerImage = new Image();
			mathGame.playerImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Player.png';
			mathGame.enemy1Image = new Image();
			mathGame.enemy1Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy1.png';
			mathGame.enemy1Name = 'an  agent';
			mathGame.enemy2Image = new Image();
			mathGame.enemy2Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy2.png';
			mathGame.enemy2Name = 'a  group  of  agents';
			mathGame.enemy3Image = new Image();
			mathGame.enemy3Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy3.png';
			mathGame.enemy3Name = 'a  sentinel';
			mathGame.squareImage = new Image();
			mathGame.squareImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Square.png';
			mathGame.attackImage = new Image();
			mathGame.attackImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Attack.png';
			mathGame.mainMenu.items = ['Start Game', 'Main Menu', 'Change Theme'];
			mathGame.mainGame = new Game(0, 1, 0, 0, '+', 0, 26);
			mathGame.menuAudio.play();
			mathGame.state = 0;
		}
		else if (newState == 2)
		{
			mathGame.ResourcePack = 'Water';
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameFont = 'waterFont';
			mathGame.menuAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/MenuMusic.mp3');
			mathGame.gameAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/FightMusic.mp3');
			mathGame.attackAudio = new Audio('MathGameResources/' + mathGame.ResourcePack + '/Attack.mp3');
			mathGame.menuBackground = new Image();
			mathGame.menuBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/MenuBackground.png';
			mathGame.gameBackground = new Image();
			mathGame.gameBackground.src = 'MathGameResources/' + mathGame.ResourcePack + '/GameBackground.png';
			mathGame.playerImage = new Image();
			mathGame.playerImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Player.png';
			mathGame.enemy1Image = new Image();
			mathGame.enemy1Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy1.png';
			mathGame.enemy1Name = 'a  fish';
			mathGame.enemy2Image = new Image();
			mathGame.enemy2Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy2.png';
			mathGame.enemy2Name = 'a  crab';
			mathGame.enemy3Image = new Image();
			mathGame.enemy3Image.src = 'MathGameResources/' + mathGame.ResourcePack + '/Enemy3.png';
			mathGame.enemy3Name = 'a  shark';
			mathGame.squareImage = new Image();
			mathGame.squareImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Square.png';
			mathGame.attackImage = new Image();
			mathGame.attackImage.src = 'MathGameResources/' + mathGame.ResourcePack + '/Attack.png';
			mathGame.mainMenu.items = ['Start Game', 'Main Menu', 'Change Theme'];
			mathGame.mainGame = new Game(0, 1, 0, 0, '+', 0, 36);
			mathGame.menuAudio.play();
			mathGame.state = 0;
		}
		else if (newState == 3){
			mathGame.mainMenu.items = ['Start Game', 'Main Menu', 'Change Theme'];
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.menuAudio.play();
			mathGame.state = 0;
		}
	}
}

Game = function (gameState, difficulty, x, y, operation, answer, fontSize){

	this.highScore = 0;
	this.gameState = gameState;
	this.playerHP = 7;
	this.monsterHP = 7;
	this.difficulty = difficulty;
	this.x = x;
	this.y = y;
	this.z = 0;
	this.operation = operation;
	this.answer = answer;
	this.answer2 = 0;
	this.input = 'Hit  Space  to  Continue...';
	this.fontSize = fontSize;
	
	if(difficulty == 1){
		this.message = 'Oh  no,  ' + mathGame.enemy1Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	else if(difficulty == 2){
		this.message = 'Oh  no,  ' + mathGame.enemy2Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	else if(difficulty == 3){
		this.message = 'Oh  no,  ' + mathGame.enemy3Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	else if(difficulty == 4){
		this.message = 'Oh  no,  ' + mathGame.enemy3Name + '  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	
}

Game.prototype.constructor = Game;

Game.prototype.Render = function(){
	
	this.RenderEntities();
	
	mathGame.ctx.textAlign = "center";
	mathGame.ctx.fillStyle = "Black";
	
	mathGame.ctx.font = this.fontSize + "px " + mathGame.gameFont;
	
	if(this.gameState == 0){
		mathGame.ctx.fillText(this.message, mathGame.WIDTH/2, mathGame.HEIGHT-140);
		mathGame.ctx.fillStyle = "Green";
		mathGame.ctx.fillText(this.input, mathGame.WIDTH/2, mathGame.HEIGHT-70);
		mathGame.ctx.fillText('Player  HP:  ' + this.playerHP + '/7', 170, mathGame.HEIGHT-190);
		mathGame.ctx.fillText('Monster  HP:  ' + this.monsterHP + '/7', mathGame.WIDTH-170, mathGame.HEIGHT-190);
	}
	else{
		mathGame.ctx.fillText(this.message, mathGame.WIDTH/2, mathGame.HEIGHT-140);
		mathGame.ctx.fillStyle = "Green";
		mathGame.ctx.fillText(this.input, mathGame.WIDTH/2, mathGame.HEIGHT-70);
		mathGame.ctx.fillText('Player  HP:  ' + this.playerHP + '/7', 170, mathGame.HEIGHT-190);
		mathGame.ctx.fillText('Monster  HP:  ' + this.monsterHP + '/7', mathGame.WIDTH-170, mathGame.HEIGHT-190);
	}
	
}

Game.prototype.RenderEntities = function() {
	if(this.difficulty == 1){
		mathGame.ctx.drawImage(mathGame.enemy1Image,0,0, mathGame.enemy1Image.width, mathGame.enemy1Image.height, mathGame.WIDTH-350, 100, 250, 250);
		mathGame.ctx.drawImage(mathGame.playerImage,0,0, mathGame.playerImage.width, mathGame.playerImage.height, 0, mathGame.HEIGHT-500, 500, 600);
		mathGame.ctx.drawImage(mathGame.squareImage,0,0, mathGame.squareImage.width, mathGame.squareImage.height, 0, mathGame.HEIGHT-230, mathGame.WIDTH, 250);
	}
	else if(this.difficulty == 2){
		mathGame.ctx.drawImage(mathGame.enemy2Image,0,0, mathGame.enemy2Image.width, mathGame.enemy2Image.height, mathGame.WIDTH-375, 100, 300, 300);
		mathGame.ctx.drawImage(mathGame.playerImage,0,0, mathGame.playerImage.width, mathGame.playerImage.height, 0, mathGame.HEIGHT-500, 500, 600);
		mathGame.ctx.drawImage(mathGame.squareImage,0,0, mathGame.squareImage.width, mathGame.squareImage.height, 0, mathGame.HEIGHT-230, mathGame.WIDTH, 250);
	}
	else if(this.difficulty == 3){
		mathGame.ctx.drawImage(mathGame.enemy3Image,0,0, mathGame.enemy3Image.width, mathGame.enemy3Image.height, mathGame.WIDTH-450, 50, 400, 400);
		mathGame.ctx.drawImage(mathGame.playerImage,0,0, mathGame.playerImage.width, mathGame.playerImage.height, 0, mathGame.HEIGHT-500, 500, 600);
		mathGame.ctx.drawImage(mathGame.squareImage,0,0, mathGame.squareImage.width, mathGame.squareImage.height, 0, mathGame.HEIGHT-230, mathGame.WIDTH, 250);
	}
	else if(this.difficulty == 4){
		mathGame.ctx.drawImage(mathGame.enemy3Image,0,0, mathGame.enemy3Image.width, mathGame.enemy3Image.height, mathGame.WIDTH-450, 50, 400, 400);
		mathGame.ctx.drawImage(mathGame.playerImage,0,0, mathGame.playerImage.width, mathGame.playerImage.height, 0, mathGame.HEIGHT-500, 500, 600);
		mathGame.ctx.drawImage(mathGame.squareImage,0,0, mathGame.squareImage.width, mathGame.squareImage.height, 0, mathGame.HEIGHT-230, mathGame.WIDTH, 250);
	}
}

Game.prototype.Update = function(){
	
	InputManager.padUpdate();
	if(this.gameState == 0 || this.gameState == 2){
		if (InputManager.padPressed & InputManager.PAD.OK){
			this.setNewEquation();
			this.gameState = 1;
			mathGame.shouldRender = 1;
		}
	}
	else if(this.gameState == 1){
		if(InputManager.padPressed & InputManager.PAD.NUMBER){
			this.input+= InputManager.number;
			mathGame.shouldRender = 1;
		}
		else if(InputManager.padPressed & InputManager.PAD.BACKSPACE){
			this.input = this.input.substring(0, this.input.length - 1);
			mathGame.shouldRender = 1;
		}
		else if(InputManager.padPressed & InputManager.PAD.OK){
			if(this.difficulty != 4) var temp = parseInt(this.input);
			else if (this.difficulty == 4) var temp = parseFloat(this.input);
			if(temp == this.answer && this.difficulty != 4){
				this.monsterHP-=1;
				mathGame.attackAudio.play();
				if(this.monsterHP != 0 && this.difficulty == 1){
					this.message = 'The  monster  has  been  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0 && this.difficulty == 1){
					this.message = 'The  monster  has  been  slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 10;
				}
				if(this.monsterHP != 0 && this.difficulty == 2){
					this.message = 'The  monster  has  been  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0 && this.difficulty == 2){
					this.message = 'The  monster  has  been  slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 30;
				}
				if(this.monsterHP != 0 && this.difficulty == 3){
					this.message = 'The  monster  has  been  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0 && this.difficulty == 3){
					this.message = 'The  monster  has  been  slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 50;
				}
			}
			else if (((temp < this.answer + 0.01 && temp > this.answer - 0.01) || (temp < this.answer2 + 0.01 && temp > this.answer2 - 0.01)) && this.difficulty == 4){
				this.monsterHP-=1;
				mathGame.attackAudio.play();
				if(this.monsterHP != 0){
					this.message = 'You  should  just  give  up.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0){
					this.message = 'You  probably  cheated.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 100;
				}
			}
			else{
				this.playerHP-=1;
				mathGame.attackAudio.play();
				if(this.playerHP>0){
					this.message = 'The monster has struck you. Do not surrender!';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				else{
					this.message = 'You have been slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
				}
			}
			mathGame.shouldRender = 1;
		}
	}
	else if(this.gameState == 3){
		if (InputManager.padPressed & InputManager.PAD.OK){
			if(this.playerHP > 0){
				mathGame.state = 3;
				mathGame.mainMenu.items = ['Continue Fighting', 'Submit High Score', 'Return to Main Menu', 'Exit Game'];
			}
			else{
				mathGame.state = 4;
				mathGame.mainMenu.items = ['Submit High Score', 'Return to Main Menu', 'Exit Game'];
			}
		}
	}
}

Game.prototype.setNewEquation = function(){
	
	if(this.difficulty == 1){
		this.x = Math.floor(Math.random() * 10);
		this.y = Math.floor(Math.random() * 10);
		var temp = Math.floor(Math.random() * 2);
		if(temp == 0){
			this.operation = '+';
			this.answer = this.x + this.y;
		}
		if(temp == 1){
			this.operation = '-';
			this.answer = this.x - this.y;
		}
		this.message = 'The  result  of  ' + this.x + '  ' + this.operation + '  ' + this.y + '  is:';
		this.input = '';
	}
	
	if(this.difficulty == 2){
		this.x = Math.floor(Math.random() * 10) + 5;
		this.y = Math.floor(Math.random() * 10) + 5;
		var temp = Math.floor(Math.random() * 4);
		if(temp == 0){
			this.operation = '+';
			this.answer = this.x + this.y;
		}
		if(temp == 1){
			this.operation = '-';
			this.answer = this.x - this.y;
		}
		if(temp == 2){
			this.operation = '*';
			this.answer = this.x * this.y;
		}
		if(temp == 3){
			this.operation = '/';
			this.answer = this.x;
			this.x = this.x * this.y;
		}
		this.message = 'The  result  of  ' + this.x + '  ' + this.operation + '  ' + this.y + '  is:';
		this.input = '';
	}
	
	if(this.difficulty == 3){
		this.x = Math.floor(Math.random() * 10) + 5;
		this.y = Math.floor(Math.random() * 10) + 5;
		this.z = Math.floor(Math.random() * 10) + 5;
		var temp = Math.floor(Math.random() * 4);
		if(temp == 0){
			this.operation = '+';
			this.operation2 = '/';
			this.y = this.y * this.z;
			this.answer = this.x + (this.y / this.z);
		}
		if(temp == 1){
			this.operation = '-';
			this.operation2 = '*';
			this.answer = this.x - (this.y * this.z);
		}
		if(temp == 2){
			this.operation = '*';
			this.operation2 = '+';
			this.answer = (this.x * this.y) + this.z;
		}
		if(temp == 3){
			this.operation = '/';
			this.operation2 = '-';
			this.x = this.x * this.y;
			this.answer = (this.x / this.y) - this.z;
		}
		this.message = 'The  result  of  ' + this.x + '  ' + this.operation + '  ' + this.y + '  ' + this.operation2 + '  ' + this.z + '  is:';
		this.input = '';
	}
	
	if(this.difficulty == 4){
		//God help you
		var a = Math.floor(Math.random() * 4) + 1;
		var b = Math.floor(Math.random() * 4) + 9;
		var c = Math.floor(Math.random() * 4) + 1;
		var d = Math.floor(Math.random() * 4) + 5;
		var derivativeX = Math.floor(Math.random() * 4) + 1;
		var temp = Math.floor(Math.random()*2);
		if(temp == 0){
			this.answer = (-b + Math.sqrt((b*b) - (4*a*c)))/(2*a);
			this.answer2 = (-b - Math.sqrt((b*b) - (4*a*c)))/(2*a);
			console.log(this.answer);
			console.log(this.answer2);
			this.message = 'Find  a  root  of  the  polynomial:  ' + a + ' (x^2) + ' + b + ' (x) + ' + c + ':';
			this.input = '';
		}
		if(temp == 1){
			this.answer = (3*a*derivativeX*derivativeX + 2*b*derivativeX + c);
			this.answer2 = 100000;
			console.log(this.answer);
			this.message = 'Find  the  value  of  the  derivative  at  x = ' + derivativeX + ':  ' + a + ' (x^3) + ' + b + ' (x^2) + ' + c + ' (x) - ' + d + ':' ;
			this.input = '';
		}
	}
	
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}