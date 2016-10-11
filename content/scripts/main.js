// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 650;
canvas.height = 600;
document.body.appendChild(canvas);

let monstersCaught = 0;
let startDate = new Date();

// Background image
let bgReady = false;
let bgImage = new Image();
bgImage.src = "images/backgroundForest.png";
bgImage.onload = function () {
    bgReady = true;
};

// Hero image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/heroL.gif";

// Monster image
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monsterL2.png";

// Game objects
let hero = {
    speed: 256 // movement in pixels per second
};
let monster = {};

// Handle keyboard controls
let keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
let reset = function () {
	//the score reset to 0, when monstersCaught becomes 100
	if(monstersCaught == 100){
		let time = parseInt((new Date()- startDate)/1000);
		alert("Your time is: "+ time + " seconds"); //shows final time
		//reset for a new game
		monstersCaught = 0;
		startDate = new Date();
	}
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 74));
    monster.y = 32 + (Math.random() * (canvas.height - 74));

    //Deleted are all object's traces after each movement
    ctx.clearRect(0, 0, 650, 600);
    ctx.drawImage(monsterImage, monster.x, monster.y);
    ctx.drawImage(heroImage, hero.x, hero.y);

};

// Update game objects
let update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
        if (hero.y >= 600|| hero.y<0){
            hero.y = 529;
        }
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
        if (hero.y >= 530|| hero.y<0){
            hero.y=0;
        }
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
        if (hero.x >= 600|| hero.x<0){
            hero.x = 590;
        }
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
        if (hero.x >= 600|| hero.x<0){
            hero.x=0;
        }
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        let catchMonsterTon = new Audio('sounds/monster.wav');
        catchMonsterTon.play();
        reset();
    }
};

// Draw everything
let render = function () {
    if (bgReady) {
        // Draw the corresponding background and increasing the hero speed
        if (monstersCaught <= 25){
            bgImage.src = "images/backgroundForest.png";
        }
		else if(monstersCaught > 50 && monstersCaught <= 100){
			bgImage.src = "images/backgroundDesert.jpg";
            hero.speed = 356;
		}
		else{
			bgImage.src = "images/backgroundCave.jpg";
            hero.speed = 306;
		}
		
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);

    // Timer
	var elapsed = parseInt((new Date()- startDate)/1000);
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("Time: " + elapsed, 568, 32);
};

// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;

    update(delta / 1000);
    render();
	
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
reset();
main();
