var myCharacter;
var ground;
var key;
var tps = 50; //This number is how many times it will run in one second.
function startGame() {
  myCharacter = new character();
  ground = new component(900, 300, "green", 0, 400);
  myGameArea.start();
}
function character(){
  this.charGrounded = true;
  this.yVelocity = 0;
  this.gravity = 5;
  this.jumpStrength = 250;
  this.draw = new component(30, 50, "black", 10, 350);
  this.move = function (){
    if(this.draw.x <=20){
      this.draw.x +=1;
    }
    this.charGrounded = this.draw.y+this.draw.height>=ground.y;
    if(this.charGrounded){
      this.yVelocity=0;
      if(key == "w"){
        this.yVelocity = 0-this.jumpStrength;
      }
    }
    else{
      this.yVelocity += this.gravity;
    }
    //this.draw.y += this.yVelocity/tps; //smoother, but leaves artifacts. Would have to clear entire game area to fix
    this.draw.y += Math.round(this.yVelocity/tps); //still occasionally leaves artifacts.
  }
}
function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.clear = function() {
    ctx = myGameArea.context;
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 900;
    this.canvas.height = 700; //the size of the game screen
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 1000/tps);
    window.addEventListener('keydown', function (e) {
     key = e.key;
    })
    window.addEventListener('keyup', function (e) {
      key = false;
    })  
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  }
  
  function updateGameArea() {
    myCharacter.draw.clear(); //we use myCharacter.draw.clear() instead of myGameArea.clear() because we don't want the ground to clear
    myCharacter.move();
    ground.x += 1;
    myCharacter.draw.update();
    ground.update();
  }
