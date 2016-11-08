var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

// Routes and io.on statement with listeners on 'connection'

/*
    localhost:4000 and localhost:4000/index.html will send the main page
    
    all assets and assets in sub-directories can be accessed by adding their pathing
        ex:localhost:4000/images/pandabear.png
*/

base_dir = __dirname.substr(0,__dirname.length-4);
app.use(express.static(base_dir));

var client = function(username,socket){
    this.username = username;
    this.id = socket.id;
}

var threeWords=arrayify("3words.txt");
var  fourWords=arrayify("4words.txt");
var  fiveWords=arrayify("5words.txt");
var   sixWords=arrayify("6words.txt");
var sevenWords=arrayify("7words.txt");
var eightWords=arrayify("8words.txt");
var  nineWords=arrayify("9words.txt");

var easyPlayer;
var mediumPlayer;
var hardPlayer;
//Web Socket code follows

var usersOn = [];//Array of everybody online, so the
var usersActive = [];//Users in lobby for multiplayer games

//When somebody connects, add these handlers
io.sockets.on('connection', function(socket) {
    //Check for existing session
    usersOn.forEach(function(item){
        if (item.id == socket.id){
            //resume Session
            console.log("magic");
        }
    });
    //Handle username/password validation, add to UsersOn/UsersActive
    socket.on('login', function(loginData) {
        var loginInfo = loginData.split(" ")
        var loginUser = new client(loginInfo[0],socket.id);
        console.log("user: "+loginUser.username);
        
        var storedUsers = fs.readFileSync(__dirname+"\\users.txt");
        storedUsers = storedUsers.toString().split('\n');

        var success = false;
        var found = false;

        for (var i = 0; i < storedUsers.length;i++){
            if(loginData.localeCompare(storedUsers[i].trim()) == 0){
				success=true;
				for(var j=0;j<usersOn.length;j++){
					if(usersOn[j].username==loginUser.username){
						found=true;
					}
				}
				if(!found){
					usersOn.push(loginUser);
					usersActive.push(loginUser);
					sendUsersActive();
				}
                break;
            }
        }
		if(success&&!found){
			socket.emit('loginResponse','success');
		}
		else if(success&&found){
			socket.emit('loginResponse','user is already logged on!');
		}
        else 
			socket.emit('loginResponse','Invalid username/password');
    });
    //Handle logging out and taking the user out of the user arrays
    socket.on('logout', function(username){
        console.log("got logout request!");
        var compareUser = new client(username, socket.id);
        var index = usersOn.indexOf(compareUser);
        if(index > -1){
            usersOn.splice(index, 1);
        }
		index = usersActive.indexOf(compareUser);
        if(index > -1){
            usersActive.splice(index, 1);
        }
        sendUsersActive();
    });
    //Add a new person to the lobby, relay the change to all users
	socket.on('addToLobby', function(username){
		usersActive.push(username);
        sendUsersActive();
    });
	//Notify users of an update to the users available, somebody new joined
    socket.on('populateUsers', function(){
       sendUsersActive(); 
    });
	//Send user the list of users they should see
	socket.on('requestUpdate', function(username){  
		var yourUsers = [];
		for(var i=0;i<usersActive.length;i++){
			if(usersActive[i].username!=username){
				yourUsers.push(usersActive[i]);
			}
		}
        socket.emit('updateUsersOn', yourUsers);
    });
    //Update Math High Scores
    socket.on('highScoreMath',function(score){
        
    });
    //join lobby
    socket.on('readyUp',function(difficulty,username){
        if(difficulty==3){
            if(easyPlayer==null){
                easyPlayer=username;
                console.log("readied: "+username+" with difficulty: "+difficulty);
            }
            else{
                io.sockets.emit("startGame",easyPlayer,username);
                console.log("starting game with: "+username+" and "+easyPlayer+" on difficulty: "+difficulty);
                easyPlayer=null;
            }
        }
        if(difficulty==5){
            if(mediumPlayer==null){
                mediumPlayer=username;
                console.log("readied: "+username+" with difficulty: "+difficulty);
            }
            else{
                io.sockets.emit("startGame",mediumPlayer,username);
                console.log("starting game with: "+username+" and "+mediumPlayer+" on difficulty: "+difficulty);
                mediumPlayer=null;
            }
        }
        if(difficulty==7){
            if(hardPlayer==null){
                hardPlayer=username;
                console.log("readied: "+username+" with difficulty: "+difficulty);
            }
            else{
                io.sockets.emit("startGame",hardPlayer,username);
                console.log("starting game with: "+username+" and "+hardPlayer+" on difficulty: "+difficulty);
                hardPlayer=null;
            }
        }
    });
    //give a new string
    socket.on('reqString',function(sender,opponent,length,x,toSender,deadString){
        
        console.log('reqstring sender:'+sender+',opponent:'+opponent+',length:'+length+',x:'+x+',toSender:'+toSender+',deadString: '+deadString);
        var str;
        var index = Math.floor(Math.random()*30);
        if(length==3){
            str=threeWords[index];
        }
        else if(length==4){
            str=fourWords[index];
        }
        else if(length==5){
            str=fiveWords[index];
        }
        else if(length==6){
            str=sixWords[index];
        }
        else if(length==7){
            str=sevenWords[index];
        }
        else if(length==8){
            str=eightWords[index];
        }
        else{
            str=nineWords[index];
        }
        str=str.substr(0,length);
        if(toSender){
            console.log("sent: "+str);
            io.sockets.emit("placeString",sender,opponent,x,str,deadString);
        }
        else{
            console.log("sent: "+str);
            io.sockets.emit("placeString",opponent,sender,x,str,deadString);
        }
    });
    //update player life totals
    socket.on("changeLife",function(p1,p2,p1Life,p2Life){
       io.sockets.emit("updateLife",p1,p2,p1Life,p2Life); 
    });
    //Notify players of an update to the users array
    function sendUsersActive(){
		socket.emit('updateAvailable');
    }
    //Handle game initialization by gametype
    function initializeGame(users,gameType){
        if (gameType == 'Math')
        {
            //Initialize dictionary?
            io.sockets.emit('joinGame', 'Math', users);
        }
    }
});

server.listen(4000);
console.log("app server readied");
io.listen(5000);
console.log("Web sockets readied");

function arrayify(file) {
    var fullFile = __dirname+"\\"+file;
    var readFile = fs.readFileSync(fullFile);
    var retArray = readFile.toString().split('\n');
    return retArray;
}