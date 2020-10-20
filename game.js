var myCharacter;
var ground;
var obstacles;

var myGameArea = {
  context: null,
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 700; //the size of the game screen
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 10); //to make the game go faster or slower change this interval
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
  }
  update = function () {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  clear = function () {
    let ctx = myGameArea.context;
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

function startGame() {
  myGameArea.start();
  myCharacter = new Component(30, 50, "black", 10, 350);
  ground = new Component(900, 300, "green", 0, 400);
  obstacles = [new Obstacle()];
}

class Obstacle extends Component {

  constructor() {
    super(30, 50, "red", myGameArea.canvas.width, 350);
  }

  move = function () {
    this.x -= 1;
  };
}

function updateGameArea() {
  myCharacter.clear(); //we use myCharacter.clear() instead of myGameArea.clear() because we don't want the ground to clear
  for (let ob of obstacles) {
    ob.clear();
  }
  myCharacter.x += 1;
  ground.x += 1;
  ground.update();
  myCharacter.update();
  for (let ob of obstacles) {
    ob.move();
    ob.update();
  }
}
