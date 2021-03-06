
var intervalId;
var ID_GLOBAL = 0;
var rooms = {}; //Treat this as a map

var diff = 1;
var amount = 5; //Default value
var lastend = Math.PI * 3/2;
var onExpireLoad;
var DEFAULT_POINT_VAL = 10;
var score = 0;// -15;//You get 15 for the first slide
start = new Date().getTime();
var time = Math.round((new Date().getTime() - start)/1000)

var data = JSON.stringify( rooms );
var fileName = "my-download.json";

var ready = false;
var canvas;
var context;
function loadFile() {
ready = true;
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    lines = e.target.result;
    var newArr = JSON.parse(JSON.parse(lines));
  console.log( newArr)
  rooms = newArr;
  }
}

this.init = function init(){
if(!ready){
  alert("Please load a file!")
  return;
}
canvas = document.getElementById('rgcanvas');
context = canvas.getContext('2d');
var star = document.getElementById("beginbtn");
star.style.visibility = "hidden";
var field = document.getElementById("fieldset");
field.hidden=true;
var slide = document.getElementById("difficulty");

loadTile("start_room");

clock();

intervalId = setInterval(clock, 1000);
}

function show_image(src, width, height, alt) {

var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;

var pic = document.getElementById('picture');
pic.innerHTML = "";
if(src)
{
  pic.appendChild(img);
}

}

function exitGame() {

var img = document.createElement("img");
  $('#mainPage').show();
  $("#readingGame").hide();
}


//Display text should appear on a button
var nxttile = function(nextname, displaytext)
{
this.nextname = nextname;
this.displaytext = displaytext;
}

//A tile has a scenario text and an array of nxttiles
//It will make a button for each option
//It also has an id
var tile = function(name, scenariotext, options, time, imgpath, onExpireName, pointval, isFinal)
{
this.name = name;//Tile name, globally unique
this.scenariotext = scenariotext; //The quesiton displayed
this.options = options; //List of buttons (text, next tile) that give choices
this.time = time; //Amount of time to react
this.img = imgpath; //The image to display
this.onExpireName = onExpireName; //name of the tile to load if no action is taken. Usually gameover.
if(pointval)
{
this.pointval = pointval; //Points this tile is worth
}
else
{
  this.pointval = DEFAULT_POINT_VAL;
}
this.isFinal = isFinal;

rooms[name] = this;//Add to global map
}

var loadTile = function(name, isFinal)
{
console.log(name)
console.log( rooms)
console.log(rooms[name])
var slide = document.getElementById('difficulty');
slide.style.visibility = "hidden";
context.clearRect(0, 0, canvas.width, canvas.height);
var tile = rooms[name];//tiles[id];
var qid = document.getElementById('question');
var cid = document.getElementById("choices");
cid.innerHTML = "";
qid.innerHTML = tile.scenariotext;
show_image(tile.img, 500,300, "");

//reset
amount = tile.time;
//lastend = Math.PI * 3/2;
start = new Date().getTime();
expired = false;

score += tile.pointval;
score+= amount - time;
var myscore = document.getElementById('myscore');
//myscore.innerHTML = `<b>Score: ${score}</b>`;
myscore.innerHTML = "<b>Score: " + score + "</b>";
onExpireLoad = tile.onExpireName;

//Load options
for(i = 0; i < tile.options.length; i++)
{
  var btn = document.createElement("BUTTON");
  btn.next = tile.options[i].nextname;
  btn.onclick = function(){
    loadTile(this.next);
    };

  var t = document.createTextNode(tile.options[i].displaytext);
  btn.appendChild(t);

  cid.appendChild(btn);
}

console.log(isFinal)
if(isFinal)   //tile.isFinal)
{
  var bspace = document.getElementById('choices');
  var btn = document.createElement("BUTTON");
  btn.onclick = function(){
    //todo high score stuff
  };
  var t = document.createTextNode("Submit High Score");
  btn.appendChild(t)
  bspace.appendChild(btn);
}

}

var start;
var expired = false;

//Called every second
function clock(){
expired = false;
// no notification when we get unloaded/replaced, so check here
canvas = document.getElementById('rgcanvas');
if (!canvas) {
  clearInterval(intervalId);
  return;
}

time = Math.round((new Date().getTime() - start)/1000)
lastend = Math.PI * 3/2;
var context = canvas.getContext('2d');

var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var radius = 70;
//amount = 5;
context.beginPath();
context.arc(centerX, centerY, radius, 0 * Math.PI, 2 * Math.PI, false);
context.fillStyle = 'red';
context.lineWidth = 5;
context.strokeStyle = '#003300';
context.stroke();
context.beginPath();
context.moveTo(canvas.width / 2, canvas.height / 2);
context.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, lastend, lastend + (Math.PI * 2 * (time / amount)), false);
context.lineTo(canvas.width / 2, canvas.height / 2);

context.fill();

lastend += (Math.PI * 2 * (time / amount)) % Math.PI;
 if (time > amount && !expired)//Only trigger expire once. You ran out of time, yo.
{
  if(onExpireLoad)
  {
    loadTile(onExpireLoad, true);
  }
}
}

var saveData = function () {
	newTiles();
	var data = JSON.stringify( rooms );
	var fileName = "my-download.json";

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
  //  return function (data, fileName) {
	console.log( data);
	console.log( fileName)
	  var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
};

		start = new Date().getTime();
	  $( "#difficulty" ).slider({
      value:1,
      min: 1,
      max: 3,
      step: 1,
      slide: function( event, ui ) {
		var pc = document.getElementById('picture');
		pc.innerHTML = "Difficulty: " + ui.value;
		diff = ui.value;
      }
    });

	//this.init();
