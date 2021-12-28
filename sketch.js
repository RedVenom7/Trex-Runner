var trex ,trex_running,edges,ground,groundimg;
var cloud,cloudimg;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0
var obstacleGroup,cloudGroup
var PLAY=1;
var END=0;
var gameState=PLAY;
var jumpsound,checkpoint,die
var message="this is a message";

function preload(){
  trex_running=loadAnimation("trex1.png",'trex3.png',"trex4.png")
  trex_collided=loadAnimation("trex_collided.png")
  groundimg=loadImage("ground2.png")
  cloudimg=loadImage("cloud.png")
  obstacle1=loadImage("obstacle1.png")
  obstacle2=loadImage("obstacle2.png")
  obstacle3=loadImage("obstacle3.png")
  obstacle4=loadImage("obstacle4.png")
  obstacle5=loadImage("obstacle5.png")
  obstacle6=loadImage("obstacle6.png")
  gameOverimg=loadImage("gameOver.png")
  restartimg=loadImage("restart.png")
  jumpsound=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  checkpoint=loadSound("checkPoint.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight)

  //creating random number generator for clouds
  var ran=Math.round(random(1,100))
  console.log(ran)

  //create a trex sprite
  trex=createSprite(50,height-70,20,50)

  //add character animation
  trex.addAnimation("running",trex_running)
trex.addAnimation("collided",trex_collided)

  //trex sizing
  trex.scale=1;
  trex.x=80

  //creating Game Over and restart buttons
  gameOver=createSprite(width/2,height/2-70);
  gameOver.addImage(gameOverimg)
  gameOver.scale=1
  restart=createSprite(width/2,height/2);
  restart.addImage(restartimg)
  restart.scale=1

  //created edges of the canvas
  edges=createEdgeSprites();

  //create ground sprite
  ground=createSprite(width/2,height-50,width,20)

  //giving the ground a still image
  ground.addImage(groundimg)
  ground.x=ground.width/2;

  //creating invisible ground
  invsground=createSprite(width/2,height-40,width,20)
  invsground.visible=false

  //creating obstacle and cloud groups
  obstacleGroup=new Group()
  cloudGroup=new Group()

  //collision radius/hitboxes

  //trex.debug=true
  
  //setting collider radius
 
  //trex.setCollider("rectangle",0,0,400,trex.height)
   trex.setCollider("circle",0,0,40)
  
}
function draw(){
  background("white")

  console.log(message)

  //displaying change in gamestates
console.log("this is ",gameState)

//score size
textSize(20);

  //displaying score
  text("Score: "+score,width-200,50)
  
  //gamestate play and end
  if(gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    ground.velocityX=-(5+3*score/100);
    score=score+Math.round(getFrameRate()/60);
  if(score>0 && score%100===0){
    checkpoint.play();
  }

    //reset ground
    if(ground.x<0){
        ground.x=ground.width/3.5;
     }

     //trex jumping mechanisim
    if((touches.length>0||keyDown("space"))&&trex.y>=height-100){
      trex.velocityY=-8.4;
      jumpsound.play();
      touches=[];
    }

    //added gravity
    trex.velocityY=trex.velocityY+0.5;

    //spawning clouds and obstacles
    spawnClouds();
    spawnObstacles();

    //Tex dying
    if(obstacleGroup.isTouching(trex)){
      gameState=END
      die.play();
    //trex.velocityY=-8.4;
//jumpsound.play();
    }
     
  }
  else if(gameState===END){
    gameOver.visible=true;
    restart.visible=true;

    //stopping the game after you die
      ground.velocityX=0;
      trex.velocityY=0;
      obstacleGroup.setVelocityXEach(0);
     cloudGroup.setVelocityXEach(0);
     trex.changeAnimation("collided",trex_collided)
     obstacleGroup.setLifetimeEach(-1)
     cloudGroup.setLifetimeEach(-1)
    if((touches.length>0||mousePressedOver(restart))){
      console.log("restart the game");
     reset();
     touches=[]
    }
  }

  //trex fall prevention
  trex.collide(invsground)

  //display sprites
  drawSprites();
}

//making clouds
function spawnClouds(){
if(frameCount%60===0){
  cloud=createSprite(width,height/2+200,40,10);
  cloud.addImage(cloudimg)
  cloud.velocityX=-3
  cloud.y=Math.round(random(100,220))
  cloud.scale=1.2

  //destroying clouds
  cloud.lifetime=width/3;

//addingdepth
 cloud.depth=1;
 trex.depth=2;
 score.depth=3;

 //adding clouds to group
 cloudGroup.add(cloud)
}
  
}

//spawning obstacles
function spawnObstacles(){
if(frameCount%60===0){
  var obstacle=createSprite(width,height-70,10,40);
  obstacle.velocityX=-(6+3*score/100);
  var r=Math.round(random(1,6));
  switch(r){
    case 1:obstacle.addImage(obstacle1);
    obstacle.scale=0.9
          break;
    case 2:obstacle.addImage(obstacle2);
    obstacle.scale=0.9
          break;
    case 3:obstacle.addImage(obstacle3);
    obstacle.scale=0.9
          break;
    case 4:obstacle.addImage(obstacle4);
    obstacle.scale=0.8
          break;
    case 5:obstacle.addImage(obstacle5);
    obstacle.scale=0.7
          break;
    case 6:obstacle.addImage(obstacle6);
    obstacle.scale=0.7
          break;
    default:break;  
  }

  //destroying obstacles
  obstacle.lifetime=width/3

  //adding obstacles to group
  obstacleGroup.add(obstacle)
}
}
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  score=0;
  trex.changeAnimation("running", trex_running);
}
