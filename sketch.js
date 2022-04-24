//zombie
var zombie ,zombie_running, zombie_standing;

//boy
var boy, boy_running, boy_fall;

//background
var background1, background_img;

//obstacles (rocks)
var rock1, rock2, obstacle

//obstacles (tombstone)
var gravestone_img, gravestone

//power-ups
var arrow, spikes, sword, shield
var arrow_img, spikes_img, sword_img, shield_img
var powerups_Group, power_up

//creating obstacles group
var obstaclesGroup;

//game states
var play = 1, end = 0;
var gameState = play;

//game over button
var gameOver, gameOver_img

//invisible ground
var invisibleGround;

//sounds
var die, checkpoint, jump, background_sound, zombie_sound

var score = 0;

function preload(){ // load images, animations and sound files
  
  //zombie images
  zombie_running = loadAnimation("zombie1.png", "zombie2.png", "zombie3.png", "zombie4.png", "zombie5.png", "zombie6.png",);
  zombie_standing = loadAnimation("zombie5.png");

  //boy images
  boy_running = loadAnimation("boy1.png", "boy2.png", "boy3.png", "boy4.png", "boy5.png", "boy6.png", "boy7.png", "boy8.png", "boy9.png", "boy10.png");
  boy_fall = loadAnimation("boy_collided.png")

  //background image
  background_img = loadImage("background.png")

  //rocks
  rock1 = loadImage("rock1.png");
  rock2 = loadImage("rock2.png");

  //gravestone
  gravestone_img = loadImage("gravestone.png");

  //game over
  gameOver_img = loadImage("gameOver.png")

  //sounds
  die = loadSound("die.wav")
  checkpoint = loadSound("checkpoint.mp3")
  jump = loadSound("jump.wav")
  background_sound = loadSound("background_sound.mp3")
  zombie_sound = loadSound("zombie.mp3")
  

  //power ups
  arrow_img = loadImage("arrow.png");
  spikes_img = loadImage("spikes.png");
  sword_img = loadImage("sword.png");
  shield_img = loadImage("shield.png");
}

function setup()
{ // create sprites, add animation and images, executes its st. only once
 createCanvas(800,600)

 //creating a background sprite
 background1 = createSprite(200, 300)
 background1.addImage("background", background_img)
 background1.scale = 0.5;
 background1.velocityX = -2;

 //power-ups
 powerups_Group = new Group();

 //creating the obstcles group
 obstaclesGroup = new Group();

 //create a zombie sprite
 zombie = createSprite(60,440,40,80);
 zombie.addAnimation("running", zombie_running);
 zombie.addAnimation("standing", zombie_standing);
 zombie.scale = 1;

 //create a boy sprite
 boy = createSprite(200, 450, 40, 80);
 boy.addAnimation("running", boy_running);
 boy.addAnimation("falling", boy_fall);
 boy.scale = 0.5;

 //invisible ground
 invisibleGround = createSprite(400,498,800,10)
 invisibleGround.visible=false;

 //game over
 gameOver = createSprite(400,300,20,20);
 gameOver.addImage("gameOver", gameOver_img);
 //gameOver.scale = 0.7;

 //setting the collider for boy
 //boy.debug = true;
 boy.setCollider("circle", -6, 20, 60)

 //setting the collider for the zombie
 //zombie.debug = true;
 zombie.setCollider("circle" , -18, 0, 25)

}

function draw(){
  background("brown")
  drawSprites();


  textSize(20)
  fill("white");
  text("Distance: " + score, 650, 50);

  //colliding the boy with invisible ground
  boy.collide(invisibleGround);

  //game state play
  if (gameState === play){
  
  //infinite background
  if (background1.x < 400)
  { 
    background1.x = 550;
  }
  background1.velocityX = background1.velocityX - 0.01
  obstaclesGroup.velocityX = obstaclesGroup.velocityX - 0.01

  //invisible game over
  gameOver.visible = false;

  //Jumping the hero
  if (keyDown("space") && boy.y >= 440) 
  {   
   boy.velocityY = -10;  
   jump.play()
  } 
  
  //stopping the boy from flying
  boy.velocityY = boy.velocityY + 0.5;

  //Scoring
  score = score + Math.round(getFrameRate() / 60);

  //power ups giving the zombie its original x position
  if (powerups_Group.isTouching(boy))
  {
    zombie.x = 40;
    powerups_Group.destroyEach();
    zombie_sound.play()
  }

  if (score > 0 && score % 100 === 0)
  {
    checkpoint.play()
  }

  if (zombie.isTouching(boy))
  {
    gameState = end;
    die.play()
    zombie_sound.play()
  }

  //Calling function for obstacle
  spawnObstacles();

  //Calling function for the power-ups
  spawnpowerups();

  //changing the game state to end
  if (obstaclesGroup.isTouching(boy))
 {
  gameState = end;
  zombie.x = boy.x - 100
  boy.x = boy.x - 50
  boy.scale = 0.4
  die.play()
 }

 //speeding the zombie's speed
 zombie.velocityX = (0.22 + score / 9999)
 zombie.velocityX = zombie.velocityX + 0.01

  }

  
 //game state end
 if (gameState === end)
{
 //stopping the movement of the ground
 background1.velocityX = 0;

 //stop the obstacles
 obstaclesGroup.setVelocityXEach(0);

 //stop the power-ups
 powerups_Group.setVelocityXEach(0);
 powerups_Group.destroyEach()

 //stop the boy
 boy.velocityY = 0;

 //changing boy animation to collided
 boy.changeAnimation("falling");

 //changing zombie animation to standing
 zombie.changeAnimation("standing");

 //making zombie static
 zombie.velocityX = 0;

 //changing lifetime for obstacles
 obstaclesGroup.setLifetimeEach(-1);

 //changing lifetime for power-ups
 powerups_Group.setLifetimeEach(-1);

 //showing game over and restart button
 gameOver.visible = true;

 //calling functiion restart
 if (mousePressedOver(gameOver))
 {
   restart();
 }
}

}
 


// function spawn obstacles
function spawnObstacles()
{
  if (frameCount % 85 === 0)
  {
    obstacle = createSprite(800, 465, 10, 40);
    obstacle.velocityX = -6;

  //var num1 = Math.round(random(1,3));
  var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(rock1);
              obstacle.scale = 0.34;
              //obstacle.debug = true;
              obstacle.setCollider("circle", 5, 0 , 74)
              break;
      case 2: obstacle.addImage(rock2);
              obstacle.scale = 0.34;
              //obstacle.debug = true;
              obstacle.setCollider("circle", 10, 0 , 74)
              break;
      case 3: obstacle.addImage(gravestone_img);
              obstacle.scale = 0.15;
              //obstacle.debug = true;
              obstacle.setCollider("circle", 0, -70, 150)
              break;
     default: break;
       
  }
  obstacle.lifetime = 140;
  obstaclesGroup.add(obstacle);
  }
  
}

// function spawn power-ups
function spawnpowerups()
{
  if (frameCount % 260 === 0)
  {
    power_up = createSprite(800, 340, 10, 40);
    power_up.velocityX = -6;

  //var num1 = Math.round(random(1,3));
  var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: power_up.addImage(shield_img);
              power_up.scale = 0.34;
              break;

      case 2: power_up.addImage(sword_img);
              power_up.scale = 0.1;
              break;

      case 3: power_up.addImage(arrow_img);
              power_up.scale = 0.33;
              break;

      //case 4: power_up.addImage(spikes_img);
              //power_up.scale = 0.5;
              //break;
     default: break;
       
  }
  power_up.lifetime = 140;
  powerups_Group.add(power_up);
  }
  
}

function restart()
{
  gameState = play;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  zombie.x = 30;
  boy.scale = 0.5;
  boy.x = 200;
  //changing boy anmation to running
  boy.changeAnimation("running",boy_running);

  //changing zombie animation to running
 zombie.changeAnimation("running", zombie_running);
 background1.velocityX = -2;
 score = 0;
}