var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var mysql = require('mysql');


var connection = mysql.createConnection(
    {
      host     : '127.0.0.1',
      user     : 'root',
      password : 'root',
      database : 'PED',
    }
);

connection.connect();
// Routes and io.on statement with listeners on 'connection'

/*
    localhost:4000 and localhost:4000/index.html will send the main page

    all assets and assets in sub-directories can be accessed by adding their pathing
        ex:localhost:4000/images/pandabear.png
*/

base_dir = __dirname.substr(0,__dirname.length-4);
app.use(express.static(base_dir));

//Web Socket code follows

var usersOn = [];//Array of everybody online, so the
var usersActive = [];//Users in lobby for multiplayer games

//When somebody connects, add these handlers
io.sockets.on('connection', function(socket) {
    //Handle username/password validation, add to UsersOn/UsersActive
    socket.on('login', function(loginData) {
        var success = false;

        var usr  = mysql.escape(loginData.split(" ")[0]);
        var pw   = mysql.escape(loginData.split(" ")[1]);
        connection.query("SELECT * FROM ACCOUNTS WHERE USERNAME = " + usr + " AND PASSWORD = MD5("+pw+")", function(err,rows){
            console.log(err);
            if(rows.length > 0){
              console.log(rows);
              socket.emit('loginResponse', rows[0].ID);
            }
            else
              socket.emit('loginResponse','Invalid username/password');
            });
        });

    //Handle logging out and taking the user out of the user arrays
    socket.on('logout', function(username){
        console.log("got logout request!");
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

  socket.on('signUp', function(Name, Email, Username, Pass){
    var usr  = mysql.escape(Username);
    var pw   = mysql.escape(Pass);
    var ml   = mysql.escape(Email);
    var nm   = mysql.escape(Name);
    console.log(usr);

    console.log(pw);
    console.log(ml);
    console.log(nm);
    connection.query("Insert Into Accounts (Username, Password, Name, Email) Values ("+ usr +",md5("+ pw +"),"+ nm +","+ ml +");", function(err,rows){
        console.log(rows);
        if(rows.length > 0){
          console.log(rows);
          socket.emit('signupResponse',rows.insertId);
        }
        else
          socket.emit('signupResponse','failed');
        });
    });

  socket.on('submitMathHighscore', function(userID, Score){
    var usr  = mysql.escape(userID);
    var sc   = mysql.escape(Score);
    connection.query("INSERT INTO HIGHSCOREMATH (AccountID, HighScore) Values ("+usr+","+sc+");", function(err,rows){

    });
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

    socket.on('getMathHighScores', function(Account){
      connection.query("Select acc.Username, HIGHSCORE from HIGHSCOREMATH LEFT JOIN ACCOUNTS acc ON AccountID = acc.ID;", function(err,rows){
        socket.emit('returnMathHighScores',rows);
      });
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
