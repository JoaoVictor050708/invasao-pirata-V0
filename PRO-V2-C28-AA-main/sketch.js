const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var balls=[]
var cannonBall;
var boats = []
var boatAnimation=[]
var boatSpriteData;
var boatSpriteSheet;
var brokenBoatAnimation=[]
var brokenBoatSpriteData;
var brokenBoatSpriteSheet;
var waterSplashAnimation=[]
var waterSplashSpriteData;
var waterSplashSpriteSheet;
var waterSound, pirateSound, bkMusic, cannonExplosion;
var isGameOver=false
var isLaughing=false;
var score=0

var canvas, tower, ground, cannon;
var angle=20;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  boatSpriteData = loadJSON("./assets/boat/boat.json")
  boatSpriteSheet = loadImage("./assets/boat/boat.png")

  brokenBoatSpriteData = loadJSON("./assets/boat/brokenBoat.json")
  brokenBoatSpriteSheet = loadImage("./assets/boat/brokenBoat.png")

  waterSplashSpriteData=loadJSON("./assets/waterSplash/waterSplash.json")
  waterSplashSpriteSheet=loadImage("./assets/waterSplash/waterSplash.png")

  bkMusic=loadSound("./assets/background_music.mp3")
  waterSound=loadSound("./assets/cannon_water.mp3")
  pirateSound=loadSound("./assets/pirate_laugh.mp3")
  cannonExplosion=loadSound("./assets/cannon_explosion.mp3")
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  angleMode(DEGREES)
  angle=15;

  cannon=new Cannon(180,110,130,100,angle)
  boat=new Boat(width-79,height-60,170,170,-80)

  var boatFrames=boatSpriteData.frames
  for (let i = 0; i < boatFrames.length; i++) {
    var pos=boatFrames[i].position
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img)
  }

  var brokenBoatFrames=brokenBoatSpriteData.frames
  for (let i = 0; i < brokenBoatFrames.length; i++) {
    var pos=brokenBoatFrames[i].position
    var img = brokenBoatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img)
  }

  var waterSplashFrames=waterSplashSpriteData.frames
  for (let i = 0; i < waterSplashFrames.length; i++) {
    var pos=waterSplashFrames[i].position
    var img = waterSplashSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img)
  }  
}

function draw() {
  image(backgroundImg,0,0,1200,600)
  if(!bkMusic.isPlaying()){
    bkMusic.play()
    bkMusic.setVolume(0.05)
  }
  Engine.update(engine);

  
  rect(ground.position.x, ground.position.y, width * 2, 1);
  text("Pontuação: " +score, width-200,50)

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();  

  cannon.display()
  showBoat()
  for(var i =0;i<balls.length;i++){
    showCannonBalls(balls[i],i)
    collisionWithBoat(i)
  }

  
  
}

function keyReleased(){
  if(keyCode===DOWN_ARROW){
    balls[balls.length-1].shoot()
  }  
}
function keyPressed(){
  if(keyCode===DOWN_ARROW){
  var cannonBall=new CannonBall(cannon.x,cannon.y);
  balls.push(cannonBall)
  }  
}
function showCannonBalls(ball,i){
  if(ball){
    ball.display()
    ball.animate()
    if(ball.body.position.x>=width||ball.body.position.y>=height-50){
      waterSound.play()
      waterSound.setVolume(0.02)
      ball.remove[i]
    }
  }
}

function showBoat(){
  if(boats.length>0){
    if (boats[boats.length-1] === undefined ||
      boats[boats.length-1].body.position.x<width-300) {
      var positions=[-40,-60,-70,-20]
      var position=random(positions)
      var boat=new Boat(width-79,height-60,170,170,position,boatAnimation)
      boats.push(boat)
    }
    for (var i = 0; i < boats.length; i++) {
      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body,{
          x:-0.9, y:0
        })
        boats[i].display()
        boats[i].animate()
        var collision=Matter.SAT.collides(tower.body,boats[i].body)
        if (collision.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirateSound.isPlaying()) {
            pirateSound.play() 
          }
          isGameOver=true
          GameOver()
        }
      }
    }
  }else{
   var boat=new Boat(width-79,height-60,170,170,-80,boatAnimation)
   boats.push(boat)
  }
}

function collisionWithBoat(index) {
  for (let i = 0; i < boats.length; i++) {
    if(balls[index]!==undefined&&boats[i]!==undefined){
      var collision=Matter.SAT.collides(balls[index].body,boats[i].body)
      if(collision.collided){
        boats[i].remove(i)
        Matter.World.remove(world,balls[index].body)
        delete balls[index]
      }
    }
  }
}

function GameOver(){
  swal({
    title: "Fim de Jogo!",
    text:"Obrigado por Jogar!",
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize:"150x150",
    confirmButtonText:"Jogar Novamente",
  },
  function(isConfirm){
    if(isConfirm){
      location.reload();
    }
  });
}