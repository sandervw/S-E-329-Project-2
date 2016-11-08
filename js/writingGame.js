function joinLobby(socket,username){
//handle forced login
    if(username == null||username == ""){
        alert("You must be signed in to play this game");
        logIn_show();
        return;
    }
//handle lobbying
	$('#mainPage').hide();
    $('#postGame').hide();
    $('#multiplayerLobby').show();
    $('#difficulties').show();
    $('#waiting').hide();
    $('#exitLobby').click(function(){
        $('#mainPage').show();
        $('#multiplayerLobby').hide();
    });
    $('#difficulty3').click(function(){
        readyUp(socket,username,3);
    });
    $('#difficulty5').click(function(){
        readyUp(socket,username,5);
    });
    $('#difficulty7').click(function(){
        readyUp(socket,username,7);
    });
}
function readyUp(socket,username,difficulty){
    socket.on("startGame",function(player1,player2){
        console.log("start game received with:"+player1+", and "+player2);
        if(username==player1){
            start_WritingGame(socket,username,difficulty,player2);
        }
        else if(username==player2){
            start_WritingGame(socket,username,difficulty,player1);
        }
    });
    socket.emit("readyUp",difficulty,username);
    $('#difficulties').hide();
    $('#waiting').show();
    $('#exitLobby').click(function(){
        $('#mainPage').show();
        $('#multiplayerLobby').hide();
    });
}
//Function to Start the Writing Game
function start_WritingGame(socket,username,difficulty,oppname){
//declare game variables
    var ctx;
	var background;
	var life;
	var oppLife;
	var stringList 	 = new Array();
	var intervalList = new Array();
	var incorrect    = new Audio('sounds/incorrect.mp3');
	var correct 	 = new Audio('sounds/correct.mp3');
	var winGame		 = new Audio('sounds/win.mp3');
	var loseGame	 = new Audio('sounds/lose.mp3');
	var timerOffset  = 10000;
	var dead 		 = false;
	var c            = document.getElementById("writingCanvas");
	var textBox      = document.getElementById("entered");
    var score        = 0;

//declare functions
	//Make lines
    var text = function(str,isMyText,xPos) {
		var obj = {
			x: xPos,
			y: Math.max(Math.floor((Math.random()*c.height))/20*20,20),
			c: "#0000ff",
			txt: str,
			pixels: null,
            isMine:isMyText,
			draw: function() {
				ctx.fillStyle = this.c;
				ctx.font = "20px Arial";
				ctx.fillText(this.txt, this.x, this.y);
			},
			fall: function(){
                if(isMyText==true){
                    ctx.fillStyle = background;
                    ctx.fillRect(this.x-1, this.y - 15, this.pixels, 20);
                    this.x -= c.width/1000;
                }
                else{
                    ctx.fillStyle = background;
                    ctx.fillRect(this.x-1, this.y - 15, this.pixels, 20);
                    this.x += c.width/1000;
                }
				this.draw();
			},
			die: function(i){
				ctx.fillStyle = background;
				ctx.fillRect(this.x, this.y - 15, this.pixels, 20);
				clearInterval(intervalList[i]);
				remove(i);
			}
		};
        if(isMyText==false){
            obj.c="#ff0000";
        }
		//Set Pixel length
		ctx.font = "20px Arial";
		obj.pixels = ctx.measureText(obj.txt).width +2;
		
		//draw the object
		obj.draw();
		
		//create interval for this text.
		txtinterval(obj);
		
		//add text to array list.
		stringList.push(obj);
	};

    //make interval for strings
    var txtinterval = function(obj){
		var timer = setInterval(function(){
			if(obj.x >= 0&&obj.x <= c.width){
				obj.fall();
			}
			else{
				if(obj.isMine==true){
                    //user missed line, remove length of the line from their health.
                    console.log("lost "+obj.txt.length+" health to "+obj.txt);
                    
                    //request a new string
                    reqString(difficulty,.5,obj.isMine);
                    
                    //update life value for other player
                    socket.emit("changeLife",username,oppname,life.html() - obj.txt.length,oppLife.html());
                }

				clearInterval(timer)
				obj.die(stringList.indexOf(obj));
			}
		},obj.txt.length+5);
		intervalList.push(timer);
	}
    
    //check to see if strings are the same. if they are, remove string.
	var comp = function(str1, str2, index,isMine){
		if(str1.localeCompare(str2) == 0){
            if(isMine){
                if(str1.length==difficulty+2){
                    reqString(difficulty,stringList[index].x/c.width,true,str1);
                    reqString(difficulty,(c.width-stringList[index].x)/c.width,false,str1);
                }
                else{
                    reqString(str1.length+1,(c.width-stringList[index].x)/c.width,false,str1);
                }
            }
			stringList[index].die(index);
            console.log("string death:"+str1+", isMine: "+isMine)
			return true;
		}
		else{
			return false;
		}
	}
    
    //remove from arrays
	var remove  = function(index){
		if(index >= 0){
			stringList.splice(index, 1);
			intervalList.splice(index, 1);
			if(intervalList.length > 0){
				//console.log(stringList);
			}
		}
	}
    
    //color the user's life
	var userColor = function(){
		var lifePts = life.html();
		if(parseInt(lifePts)<80){
			life.css("color","#80007f");
		}
		if(parseInt(lifePts)<60){
			life.css("color","#b3003f");
		}
		if(parseInt(lifePts)<40){
			life.css("color", "#e6001f");
		}
		if(parseInt(lifePts)<20){
			life.css("color", "#ff0000");
		}
        
		var oppLifePts = oppLife.html();
		if(parseInt(oppLifePts)<80){
			oppLife.css("color","#ff003f");
		}
		if(parseInt(oppLifePts)<60){
			oppLife.css("color","#ff001f");
		}
		if(parseInt(oppLifePts)<40){
			oppLife.css("color", "#ff000f");
		}
		if(parseInt(oppLifePts)<20){
			oppLife.css("color", "#ff0000");
		}
	}
    
    //requests a new string
	var reqString = function(length,x,isMine,deadString){
        socket.emit("reqString",username,oppname,length,x,isMine,deadString)
	}
    
    //check through strings for matches
    var checkString = function(str,isMine) {
        var found = false;
        var line;
        
        for(var i = 0; i < stringList.length; i++){
            if(stringList[i].isMine==isMine){
                found = comp(str, stringList[i].txt, i,isMine);
            }
        }
        if(isMine){
            if(found){
                score+=str.length;
                correct.play();    
            }
            else{
                incorrect.play();
            }
            textBox.value = "";
            textBox.focus();
        }
    }
    
    //player loses
    var die = function() {
        if(!dead){
            dead=true;
            clearInterval(reqStringInterval);
            loseGame.play();
            $("#postGameMessage").html("You Lose");
            $("#postGameMessage").css("color","#ff0000");
            $(".writingGame").hide();
            $("#postGame").show();
            for(var i = 0; i < stringList.length;i++){
                stringList[i].die(i);
            }
        }
    }
    
    //player wins
    var win = function() {
        if(!dead){
            dead=true;
            clearInterval(reqStringInterval);
            winGame.play();
            $("#postGameMessage").html("You Win");
            $("#postGameMessage").css("color","#00ff00");
            $(".writingGame").hide();
            $("#postGame").show();
            submitScore();
            for(var i = 0; i < stringList.length;i++){
                stringList[i].die(i);
            }
        }
    }
    
    var submitScore = function(){
        socket.emit("postWritingScore",username,score);
    }
    
//declare socket responses
    socket.on("placeString",function(receiver,observer,x,str,deadString){
        //console.log("placeString rec: "+receiver+", obs: "+observer+", str: "+str+", deadString: "+deadString);
        
        if(receiver==username||observer==username){
            isMine= username==receiver;
            var xpos = x*c.width;
            if (!isMine){
                xpos = c.width-xpos;
            }
            else{
                if(deadString!=null){
                    console.log("Length: "+deadString.length);
                    checkString(deadString,false);
                }
            }
            console.log("placeString "+str+" isMine:"+isMine.toString()+",x:"+xpos)
            text(str,username==receiver,xpos);
        }
    });

    socket.on("updateLife",function(player1,player2,p1Life,p2Life){
        console.log("updateLife p1: "+player1+", p2: "+player2+", p1Life: "+p1Life+", p2Life: "+p2Life);
        if(player1==username||player2==username){
            if (username==player1){
                life.html(p1Life);
                oppLife.html(p2Life);
            }
            else{
                life.html(p2Life);
                oppLife.html(p1Life);
            }
            userColor();
            if(life.html()<1){
                die();
            }
            if(oppLife.html()<1){
                win();
            }
        }
    });
//game logic
    
	//show canvas and hide mainPage
    $('#multiplayerLobby').hide();
	$("#writingCanvas").show();
    $(".writingGame").show();
    
	background = "#E7D894";
	
	//Set canvas
    c.width = window.innerWidth;
    c.height = window.innerHeight-50;
	ctx = c.getContext("2d");
	ctx.fillStyle = background;
	ctx.fillRect(0,0,c.width,c.height);

	//Life
	life = $("#lifePoints");
	oppLife = $("#oppLifePoints");
    
    reqString(difficulty,.5,true,null);
    
	textBox.focus();
	
	//check entered string
	$(document).keypress(function(key){
		if(key.which == 13||key.keycode == 13) {
            checkString(textBox.value,true)
        }
    });
	
	//Interval to get new strings
	reqStringInterval = setInterval(function(){
		reqString(difficulty,.5,true,null);
	},timerOffset);
};