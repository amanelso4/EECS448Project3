var myCharacter;
var ground;
var obstacles;
var tps =100;
var key;
var timer;
var timeLeft = 6000;
var obstacleFreq = .01; // 0-1, smaller = less frequent
var minDist = 400; // Minimum distance between obstacles

/**
 * Object wrapping a 2D context and containing display and update methods.
 */
var myGameArea = {
  context: null,
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 700; //the size of the game screen
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 1000/tps); //to make the game go faster or slower change this interval
    window.addEventListener('keydown', function (e) {
      key = e.key;
     })
     window.addEventListener('keyup', function (e) {
       key = false;
     })
  },
  /**
   * Clear the display.
   */
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  /**
   * Pause the game.
   */
  stop: function () {
    clearInterval(this.interval);
  }
}

/**
 * Base game object which handles display and collision detection  
 */
class Component {
    /**
     * 
     * @param {number} width Width of the object
     * @param {number} height Height of the object
     * @param {string} color The object's color
     * @param {number} x The object's initial x location
     * @param {number} y The object's initial y location
     */
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;

    /**
     * Check if this object is colliding with another.
     * 
     * @param {Component} ob The object against which to check for collision.
     */
    this.crashWith = function(ob) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var objleft = ob.x;
      var objright = ob.x + (ob.width);
      var objtop = ob.y;
      var objbottom = ob.y + (ob.height);
      var crash = true;
      if ((mybottom < objtop) ||
      (mytop > objbottom) ||
      (myright < objleft) ||
      (myleft > objright)) {
        crash = false;
      }
      return crash;
    }
  }
  /**
   * Draw the object at the current location.
   */
  update = function () {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  /**
   * Remove the object image from the current location.
   */
  clear = function () {
    let ctx = myGameArea.context;
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

/**
 * Create the character and start the game.
 */
function startGame() {
  myGameArea.start();
  myCharacter = new Character();
  obstacles = [];
  ground = new Component(900, 300, "green", 0, 400);
  timer = setInterval(updateTimer, 1000);
}
/**
 * A game object controlled by the player.
 */
class Character extends Component{
  crouching =false;
  charGrounded = true;
  yVelocity = 0;
  gravity = 20;
  jumpStrength = 700;
  constructor(){
    super(30, 50, "black", 10, 350);
  }
  /**
   * Check for key presses and move the character accordingly.
   */
  move = function (){
   
    if(key == "s"){
      if(!this.crouching){
        this.y+=25;
      }
      this.crouching=true;
      this.height = 25;

    }else{
      if(this.crouching){
        this.y-=25;
      }
      this.crouching=false;
      this.height = 50;

    }
    if(this.x <=50){
      this.x +=1;
    }
    this.charGrounded = this.y+this.height>=ground.y;
    if(this.charGrounded){
      this.yVelocity=0;
      if(key == "w"){
        this.yVelocity = 0-this.jumpStrength;
      }
    }
    else{
      this.yVelocity += this.gravity;
    }
    //this.y += this.yVelocity/tps; //smoother, but leaves artifacts. Would have to clear entire game area to fix
    this.y += Math.round(this.yVelocity/tps); //still occasionally leaves artifacts.
    this.update();
  }
}

/**
 * A game object which serves as an obstacle for the character to avoid.
 */
class Obstacle extends Component {

  constructor() {
    super(30, 50, "red", myGameArea.canvas.width, 350);
  }

  /**
   * Move the object towards the character.
   */
  move = function () {
    this.x -= 5;
  };
}

/**
 * Update and check the game timer to see if the character has won.
 */
function updateTimer() {
  timeLeft = timeLeft - 1;
  if(timeLeft === 0){
    myGameArea.stop();
    document.getElementById("gameOver").innerHTML = "You WIN! Refresh to try again!";
  }
}

/**
 * Run the main game loop.
 */
function updateGameArea() {

  // Check for collisions with player
  for(let ob of obstacles){
    if(myCharacter.crashWith(ob)){
      myGameArea.stop();
      document.getElementById("gameOver").innerHTML = "You lose! Refresh to try again!";
    }
  }

  // Spawn obstacles
  if (Math.random() < obstacleFreq) {
    if (obstacles.length < 1 || myGameArea.canvas.width - obstacles[obstacles.length - 1].x >= minDist) {
        obstacles.push(new Obstacle());
    }
  }
  if(myGameArea.canvas.width - obstacles[obstacles.length - 1].x >= myGameArea.canvas.width*.9){
    obstacles.push(new Obstacle());
  }
  updateTimer();

  
  // Update the character and obstacles
  myCharacter.clear(); //we use myCharacter.clear() instead of myGameArea.clear() because we don't want the ground to clear
  for (let ob of obstacles) {
    ob.clear();
  }
  ground.x += 1;
  ground.update();
  myCharacter.move();
  for (let ob of obstacles) {
    ob.move();
    ob.update();
  }


}
