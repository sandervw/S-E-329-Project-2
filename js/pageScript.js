//Function To Display Sign Up mathGameup
function signUp_show() {
  document.getElementById('signUp').style.display = "block";
}

//Function to Hide Sign Up mathGameup
function signUp_hide(){
  document.getElementById('signUp').style.display = "none";
}

//Function To Display Log In mathGameup
function logIn_show() {
  document.getElementById('logIn').style.display = "block";
  document.getElementById('loginUsername').focus();
}

//Function to Hide Log In mathGameup
function logIn_hide(){
  document.getElementById('logIn').style.display = "none";
  $(".loginError").html("");
}
var mathHighScores;
var socket = io.connect('http://192.168.1.4:4000');
var accountID;

$(document).ready(function(){
    socket.emit('getMathHighScores',"");
  //socket.connect();
  $("#signUp_Failure").hide();
  $("#signUp_Success").hide();
  $("#userDisplay").hide();
  $("#signOutButton").hide();
  $("#multiplayerLobby").hide();
  $("#postGame").hide();
  $(".writingGame").hide();
  $("#profiledocument").hide();
  $(".btn-math").click(function(){
        start_MathGame();
	});
  $(".btn-writing").click(function(){
        joinLobby(socket,$("#userDisplay").html());
	});
  $("#exitWritingGame").click(function(){
        $(".writingGame").hide();
        $("#multiplayerLobby").hide();
        $("#postGame").hide();
        $("#mainPage").show();
	});

  $("#backButton").click(function(){
        $("#profiledocument").hide();
        $("#maindocument").show();
  });
  socket.on('returnMathHighScores',function(rows){
    //Start table
    var table = "<h1>High Scores<br><small>Math Game</small></h1><table class='table table-responsive table-hover table-bordered table-condensed'><thead><tr><th style='width:30px;'>Rank</th><th>Username</th><th>Score</th></tr></thead><tbody>";
    //Add rows - this will be a database pull and a for loop later
    console.log(rows);
    var i = 0;
    for(i = 0; i < rows.length; i++){
      table = table + "<tr class='active'><td>"+ (i+1) +"</td><td>" + rows[i].Username + "</td><td>"+ rows[i].HIGHSCORE +"</td></tr>";
    }

    //End table
    table = table + "</tbody></table>";
    mathHighScores = table;

    $("#MHS").html(mathHighScores);
  });

  $("#signOutButton").click(function(){
      accountID = null;
      $("#userDisplay").html("");
      $("#userDisplay").hide();
      $("#loginButton").show();
      $("#signupButton").show();
      $("#signOutButton").hide();
  });

  $("#userDisplay").click(function(){
    $("#profiledocument").show();
    $("#maindocument").hide();
    getProfileData(accountID);
  });

  function getProfileData(profID){
    socket.emit("getProfileData", accountID, profID);
    socket.on("returnProfileData",function(userID, uname, memberDate, location, gender, mathHS, writingHS, readingHS){
      console.log(userID + " " + uname + " " + memberDate + " " + location + " " + gender + " " + mathHS + " " + writingHS + " " + readingHS);
      if(userID == accountID){
        $("#uname").html(uname);
        $("#memberDate").html(memberDate);
        $("#location").html(location);
        $("#gender").html(gender);
        $("#mathHS").html(mathHS);
      //  $("#writHS").html(writingHS);
      //  $("#readHS").html(readingHS);
      }
    });

  };

  $("#mathHS").click(function(){
    socket.emit('getMathHighScores',"");
    $("#page-content-wrapper").html(mathHighScores);

  });

  $("#writingHS").click(function(){
    //Start table
    var table = "<h1>High Scores<br><small>Writing Game</small></h1><table class='table table-responsive table-hover table-bordered table-condensed'><thead><tr><th style='width:30px;'>Rank</th><th>Username</th><th>Score</th></tr></thead><tbody>";
    //Add rows - this will be a database pull and a for loop later
    table = table + "<tr class='success'><td>1</td><td>Pr0NoSc0Pes420</td><td>420</td></tr>";
    table = table + "<tr class='warning'><td>2</td><td>HowToPlay</td><td>235</td></tr>";
    table = table + "<tr class='danger'><td>3</td><td>zzzjeez</td><td>120</td></tr>";
    table = table + "<tr class='active'><td>4</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>5</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>6</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>7</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>8</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>9</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>10</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>11</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>12</td><td>...</td><td>12</td></tr>";
    //End table
    table = table + "</tbody></table>";
    $("#page-content-wrapper").html(table);
  });

  $("#readingHS").click(function(){
    //Start table
    var table = "<h1>High Scores<br><small>Reading Game</small></h1><table class='table table-responsive table-hover table-bordered table-condensed'><thead><tr><th style='width:30px;'>Rank</th><th>Username</th><th>Score</th></tr></thead><tbody>";
    //Add rows - this will be a database pull and a for loop later
    table = table + "<tr class='success'><td>1</td><td>Pr0NoSc0Pes420</td><td>420</td></tr>";
    table = table + "<tr class='warning'><td>2</td><td>HowToPlay</td><td>235</td></tr>";
    table = table + "<tr class='danger'><td>3</td><td>zzzjeez</td><td>120</td></tr>";
    table = table + "<tr class='active'><td>4</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>5</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>6</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>7</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>8</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>9</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>10</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>11</td><td>...</td><td>12</td></tr>";
    table = table + "<tr class='active'><td>12</td><td>...</td><td>12</td></tr>";
    //End table
    table = table + "</tbody></table>";
    $("#page-content-wrapper").html(table);
  });

  //Sign up form validation
  $("#btnSignUp").click(function(){
    var password = $("#password").val();
    var cfrmPassword = $("#cfrmpassword").val();
    var username = $("#username").val();
    var name = $("#name").val();
    var email = $("#email").val();
    var fail = false;

    $("#signUp_Failure").hide();
    $("#signUp_Failure").html("<strong>Whoops!</strong>");
    if(name.length < 1){
      $("#signUp_Failure").html($("#signUp_Failure").html() + "<br> Please enter your name!");
      fail=true;
    }
    if(email.length < 1){
      $("#signUp_Failure").html($("#signUp_Failure").html() + "<br> Please enter your email!");
      fail=true;
    }
    if(username.length < 1){
      $("#signUp_Failure").html($("#signUp_Failure").html() + "<br> Please enter your username!");
      fail=true;
    }
    if(password.length < 8) {
      $("#signUp_Failure").html($("#signUp_Failure").html() + "<br> Your password must be eight or more characters!");
      fail=true;
    }
    if(password !== cfrmPassword){
      $("#signUp_Failure").html($("#signUp_Failure").html() + "<br> Your password confirmation should match the password you entered!");
      fail=true;
    }
    if(fail){
      $("#signUp_Failure").show("fade");
    } else {
      //This shouldn't actually say success, this is when we use php to execute
      //a password check and stuff.
      socket.emit('signUp',name,email,username,password)
      socket.on("signupResponse",function(response){
        console.log(response);
        if(response !== 'failed'){
          $("#signUp_Success").show("fade");
          accountID = response;
        }
        else{
          $("#signUp_Failure").show("fade");

        }
      });
    }
  });

  $("#ConfirmLogin").click(function(){
      var user = $("#loginUsername").val();
      var pass = $("#loginPassword").val();

      socket.emit("login",user+" "+pass);
      socket.on("loginResponse", function(response){
        console.log('accIDLogin' + response);
  			if(response !== "Invalid username/password"){
          $(".loginError").html(response);
  			}
  			else{
  				setUsername($("#popupLogin").text());
  			}
          accountID = response;
        $("#userDisplay").html(user);
        $("#userDisplay").show();
        $("#loginButton").hide();
        $("#signupButton").hide();
        $("#signOutButton").show();
        console.log('accIDLoginpost' + accountID);
  		});
  });

  //Function To Hide Banner and Nav Bar
  function hide_Banner_And_Nav(){
    $("#banner").hide();
    $("#sidebar-wrapper").hide();
    $("#page-content-wrapper").css({position: "absolute", left:0});
  }
  function setUsername(username){
      console.log("Successful login:"+username+"!");
      logIn_hide();
      $("#loginButton").hide();
      $("#signupButton").hide();
      $("#userDisplay").show();
      $("#userDisplay").html(username);
      $("#signOutButton").show();
  }
});
