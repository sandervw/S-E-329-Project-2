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

  //Function to Start the Math Game
  function start_MathGame(){
  //  hide_Banner_And_Nav();
  $('#mainPage').hide("slide");
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
      mathGame.canvas = document.getElementsByTagName('canvas')[0];
      mathGame.WIDTH = $(window).width();
      mathGame.HEIGHT = $(window).height();
      mathGame.canvas.width = mathGame.WIDTH;
      mathGame.canvas.height = mathGame.HEIGHT;
      mathGame.currentHeight = mathGame.HEIGHT;
      mathGame.currentWidth = mathGame.WIDTH;
      mathGame.ctx = mathGame.canvas.getContext('2d');
      mathGame.ua = navigator.userAgent.toLowerCase();
      mathGame.android = mathGame.ua.indexOf('android') > -1 ? true : false;
      mathGame.ios = ( mathGame.ua.indexOf('iphone') > -1 || mathGame.ua.indexOf('ipad') > -1  ) ? true : false;

      //Event Listeners, click and touch.
      window.addEventListener('click', function(e) {
          e.preventDefault();
          mathGame.Input.set(e);
      }, false);
      window.addEventListener('touchstart', function(e) {
          e.preventDefault();
          mathGame.Input.set(e.touches[0]);
      }, false);
      window.addEventListener('touchmove', function(e) {
          e.preventDefault();
      }, false);
      window.addEventListener('touchend', function(e) {
          e.preventDefault();
      }, false);

      mathGame.resize();
      mathGame.loop();
    },

    update: function() {
    },

    render: function() {

    },

    loop: function() {
      requestAnimFrame(mathGame.loop);
      mathGame.update();
      mathGame.render();
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
          mathGame.Draw.circle(this.x, this.y, 10, 'red');
      }
  };

});
