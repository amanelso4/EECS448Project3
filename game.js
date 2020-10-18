var myCharacter;
var ground;

function startGame() {
  myCharacter = new component(30, 50, "black", 10, 350);
  ground = new component(900, 300, "green", 0, 400);
  myGameArea.start();
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
    this.interval = setInterval(updateGameArea, 20); //to make the game go faster or slower change this interval
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  }

  function updateGameArea() {
    myCharacter.clear(); //we use myCharacter.clear() instead of myGameArea.clear() because we don't want the ground to clear
    myCharacter.x += 1;
    ground.x += 1;
    myCharacter.update();
    ground.update();
  }
