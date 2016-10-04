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
}

//Function to Hide Log In mathGameup
function logIn_hide(){
  document.getElementById('logIn').style.display = "none";
}

$(document).ready(function(){
  $("#signUp_Failure").hide();
  $("#signUp_Success").hide();
  $(".btn-math").click(function(){
  	start_MathGame();
	});
  $(".btn-writing").click(function(){
  	start_WritingGame();
	});

  $("#mathHS").click(function(){
    //Start table
    var table = "<h1>High Scores<br><small>Math Game</small></h1><table class='table table-responsive table-hover table-bordered table-condensed'><thead><tr><th style='width:30px;'>Rank</th><th>Username</th><th>Score</th></tr></thead><tbody>";
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
      $("#signUp_Success").show("fade");
    }
  });

  //Function To Hide Banner and Nav Bar
  function hide_Banner_And_Nav(){
    $("#banner").hide();
    $("#sidebar-wrapper").hide();
    $("#page-content-wrapper").css({position: "absolute", left:0});
  }

});
