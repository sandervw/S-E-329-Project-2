var io = require('socket.io').listen(5000);
var fs = require('fs');

var usersOn = [];//Array of everybody online, so th
var usersActive = [];//Users in lobby for multiplayer games

//When somebody connects, add these handlers
io.sockets.on('connection', function(socket) {
    //Handle username/password validation, add to UsersOn/UsersActive
    socket.on('login', function(loginData) {
        
        var users = fs.readFileSync("Portfolio 3/users.txt");
        users = users.toString().split('\n');

        var success = false;
        var found = false;

        for (var i = 0; i < users.length;i++){
            if(loginData.localeCompare(users[i].trim()) == 0){
				success=true;
				for(var j=0;j<usersOn.length;j++){
					if(usersOn[j]==loginData.split(" ")[0]){
						found=true;
					}
				}
				if(!found){
					usersOn.push(loginData.split(" ")[0]);
					usersActive.push(loginData.split(" ")[0]);
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
        var index = usersOn.indexOf(username);
        if(index > -1){
            usersOn.splice(index, 1);
        }
		index = usersActive.indexOf(username);
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
			if(usersActive[i]!=username){
				yourUsers.push(usersActive[i]);
			}
		}
        socket.emit('updateUsersOn', yourUsers);
    });
	/*
    Remove players from the lobby array and pass
    to initializeGame to handle game specific details
	*/
    socket.on('startGame', function(userArray,gameType){
		users = userArray.split(",");
        for (i = 0; i < userArray.length;i++)
        {
            var index = usersActive.indexOf(users[i]);
            if(index > -1)
            {
                usersActive.splice(index, 1);
            }            
        }
        initializeGame(gameType);
        sendUsersActive(); 
    });
    //Notify players of an update to the users array
    function sendUsersActive(){
		io.sockets.emit('updateAvailable');
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

console.log("Web sockets readied");