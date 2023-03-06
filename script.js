window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.linewidth = 3;
    ctx.strokeStyle = 'white';
    ctx.font = '18px Helvetica'
    ctx.textAlign = 'center'
    class Player{
        constructor(game){
            this.game = game;
            this.collisionx = this.game.width*0.5;
            this.collisiony = this.game.height*0.5;
            this.collisionr = 30;
            this.speedx = 0;
            this.speedy = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5; // pushes 5px both direc
            this.image = document.getElementById('bull');
            this.spriteWidth = 255;
            this.spriteHeight = 256;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = 0;
        }
        draw(context){
            context.drawImage(this.image, this.frameX*this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collisionx,this.collisiony,this.collisionr,0,Math.PI*2);
                context.save();   //betwwen save and restore write drwaing code to limit it to only certain drwing calls as save saves above canvas setting and retore restores above setting
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                context.beginPath();
                context.moveTo(this.collisionx, this.collisiony);// moveto will define stqaring x and y coord
                context.lineTo(this.game.mouse.x, this.game.mouse.y); // ending x y coord
                context.stroke();
            }
        }
        update(){
            this.dx = this.game.mouse.x - this.collisionx;
            this.dy =this.game.mouse.y - this.collisiony;
            const distance = Math.hypot(this.dy,this.dx);
            if(distance > this.speedModifier){
                this.speedx = (this.dx)/distance || 0;
                this.speedy = (this.dy)/distance || 0;
            }
            else{
                this.speedx=0;
                this.speedy=0;
            }
            // this.collisionx=this.game.mouse.x;
            // this.collisiony=this.game.mouse.y;
            this.collisionx += this.speedx*this.speedModifier;
            this.collisiony += this.speedy*this.speedModifier;

            this.spriteX = this.collisionx - this.width*0.5;   //sprite bull
            this.spriteY = this.collisiony - this.height*0.5 - 100;
            
            //horizontal boundaries
            if(this.collisionx < this.collisionr){
                this.collisionx = this.collisionr;
            }
            else if(this.collisionx > this.game.width - this.collisionr){
                this.collisionx = this.game.width - this.collisionr;
            }
            //Vertical boundaries
            if(this.collisiony < this.game.topMargin + this.collisionr){
                this.collisiony = this.game.topMargin + this.collisionr;
            }
            else if(this.collisiony > this.game.height - this.collisionr){
                this.collisiony = this.game.height - this.collisionr;
            }
            //collison with obstacles
            this.game.obstacles.forEach(obstacle => {
                let [collison, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
                // destructuring
                if(collison){
                    const unitX = dx/distance;
                    const unitY = dy/distance;
                    // console.log(unitX, unitY)
                    this.collisionx = obstacle.collisionx + (sumOfRadii + 1)*unitX;     //pushes player when collided with obstacle
                    this.collisiony = obstacle.collisiony + (sumOfRadii + 1)*unitY;
                }
            });

            const angle =  Math.atan2(this.dy, this.dx); // rerurns angle in rad between +ve x and line projected from (0,0) to point
            if(angle < -2.74 || angle > 2.74){
                this.frameY = 6;
            }
            else if(angle < -1.96){
                this.frameY = 7;
            }
            else if(angle < -1.17){
                this.frameY = 0;
            }
            else if(angle < -0.39){
                this.frameY = 1;
            }
            else if(angle < 0.39){  //turn player on 8 directions with 8 diff images
                this.frameY = 2;
            }
            else if(angle < 1.17){
                this.frameY = 3;
            }
            else if(angle < 1.96){
                this.frameY = 4;
            }
            else if(angle < 2.74){
                this.frameY = 5;
            }

        }
    }

    class Obstacle{
        constructor(Game){
            this.game = game;
            this.collisionx = Math.random()*this.game.width;
            this.collisiony = Math.random()*this.game.height;
            this.collisionr = 60;
            this.image = document.getElementById("obstacles");
            this.spriteHeight = 250;
            this.spriteWidth = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionx - this.width*0.5;
            this.spriteY = this.collisiony - this.height*0.5 - 100;
            this.frameX = Math.floor(Math.random()*4);
            this.frameY = Math.floor(Math.random()*3);
        }
        draw(context){
            // context.drawImage(this.image, this.collisionx, this.collisiony, this.width, this.height)
            context.drawImage(this.image, this.frameX*this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height); // we use the baove code and add source_x, source_y, source_width, source_height after specifying image to crop it, rest are center and height and width of image to draw
            if(this.game.debug){ // debug added latter to show and hide obst circles
                context.beginPath();
                context.arc(this.collisionx,this.collisiony,this.collisionr,0,Math.PI*2);
                context.save();   //betwwen save and restore write drwaing code to limit it to only certain drwing calls as save saves above canvas setting and retore restores above setting
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }
        update(){

        }
    }

    class Egg{
        constructor(game){
            this.game = game;
            this.collisionr = 40;
            this.margin = this.collisionr*2;
            this.collisionx = this.margin + Math.random()*(this.game.width - this.margin*2);
            this.collisiony = this.game.topMargin + Math.random()*(this.game.height - this.game.topMargin - this.margin);
            this.image = document.getElementById('egg');
            this.spriteWidth = 110;
            this.spriteHeight = 135;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 3000;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image, this.spriteX, this.spriteY);
            if(this.game.debug){ // debug added latter to show and hide obst circles
                context.beginPath();
                context.arc(this.collisionx,this.collisiony,this.collisionr,0,Math.PI*2);
                context.save();   //betwwen save and restore write drwaing code to limit it to only certain drwing calls as save saves above canvas setting and retore restores above setting
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                const displayTimer = (this.hatchTimer*0.001).toFixed(0) 
                context.fillText(displayTimer, this.collisionx, this.collisiony - this.collisionr*2.5);
            }
        }
        update(deltaTime){
            // handle collisions
            this.spriteX = this.collisionx - this.width*0.5;
            this.spriteY = this.collisiony - this.height*0.5 -30;    // spresding enemies in egg class rather then enemy class because there enemy collides and moves away but here enemy collides and moves egg away
            let collisonObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies]; // spread operator allows quickly expand elements in anrray to another array
            collisonObjects.forEach(object => {
                let [collison, distance, sumOfRadii, dx, dy] =  this.game.checkCollision(this, object);
                if(collison){
                    const unitX = dx/distance;
                    const unitY = dy/distance;
                    this.collisionx = object.collisionx + (sumOfRadii + 1)*unitX;
                    this.collisiony = object.collisiony + (sumOfRadii + 1)*unitY
                }
            });
            // handle hatching
            if(this.hatchTimer > this.hatchInterval){
                this.game.hatchlings.push(new Larva(this.game, this.collisionx, this.collisiony))
                this.markedForDeletion = true;
                this.game.removeGameObject();
            }
            else{
                this.hatchTimer += deltaTime;
            }
        }
    }


    class Enemy{
        constructor(game){
            this.game = game;
            this.collisionr = 30;
            this.speedx = Math.random()*3 + 0.5;
            this.image = document.getElementById('toad');
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.collisionx = this.game.width +  this.width + Math.random()*this.game.width*0.5;
            this.collisiony = this.game.topMargin + Math.random()*(this.game.height - this.game.topMargin);
            this.spriteX;
            this.spriteY;
        }
        draw(context){
            context.drawImage(this.image, this.spriteX, this.spriteY);
            if(this.game.debug){ // debug added latter to show and hide obst circles
                context.beginPath();
                context.arc(this.collisionx,this.collisiony,this.collisionr,0,Math.PI*2);
                context.save();   //betwwen save and restore write drwaing code to limit it to only certain drwing calls as save saves above canvas setting and retore restores above setting
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }
        update(){
            this.spriteX = this.collisionx - this.width*0.5;
            this.spriteY = this.collisiony - this.height + 40;
            this.collisionx -= this.speedx;
            if(this.spriteX + this.width < 0){
            this.collisionx = this.game.width +  this.width + Math.random()*this.game.width*0.5;
            this.collisiony = this.game.topMargin + Math.random()*(this.game.height - this.game.topMargin);
        }
        let collisonObjects = [this.game.player, ...this.game.obstacles]; // spread operator allows quickly expand elements in anrray to another array
            collisonObjects.forEach(object => {
                let [collison, distance, sumOfRadii, dx, dy] =  this.game.checkCollision(this, object);
                if(collison){
                    const unitX = dx/distance;
                    const unitY = dy/distance;
                    this.collisionx = object.collisionx + (sumOfRadii + 1)*unitX;
                    this.collisiony = object.collisiony + (sumOfRadii + 1)*unitY
                }
            });
    }
    }


    class Larva{
        constructor(game, x, y){
            this.game = game;
            this.collisionx = x;
            this.collisiony = y;
            this.collisionr = 30;
            this.image = document.getElementById('larva');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.speedy = 1+Math.random();
        }
        draw(context){
            context.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
            if(this.game.debug){ // debug added latter to show and hide obst circles
                context.beginPath();
                context.arc(this.collisionx,this.collisiony,this.collisionr,0,Math.PI*2);
                context.save();   //betwwen save and restore write drwaing code to limit it to only certain drwing calls as save saves above canvas setting and retore restores above setting
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }
        update(){
            this.collisiony -= this.speedy;
            this.spriteX = this.collisionx - this.width*0.5;
            this.spriteY = this.collisiony -  this.height*0.5 - 50;
            // move larva to safety
            if(this.collisiony < this.game.topMargin){
                this.markedForDeletion = true;
                this.game.removeGameObject();
            }
        }
    }


    class Game{
        constructor(canvas){
            this.canvas = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
            this.topMargin = 260; // h of forest on top
            this.player = new Player(this);
            this.numberOfObstacles = 10;
            this.obstacles = [];
            this.mouse = {
                x: this.width*0.5, //default val for mouse position
                y: this.height*0.5,
                pressed: false
            }
            
            // add event listeners
            canvas.addEventListener('mousedown', (e)=>{ // we use arrow func not function() because arrow func automatically inherits the reference to 'this' from parent scope and function() dosent.
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
                // console.log(e.offsetX, e.offsetY);
                // console.log(this.mouse.x, this.mouse.y);
            })
            canvas.addEventListener('mouseup', (e)=>{ // we use arrow func not function() because arrow func automatically inherits the reference to 'this' from parent scope and function() dosent.
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            })
            canvas.addEventListener('mousemove', (e)=>{ // we use arrow func not function() because arrow func automatically inherits the reference to 'this' from parent scope and function() dosent.
                if(this.mouse.pressed){
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
                // this.mouse.pressed = true;
                // console.log(this.mouse.x);
            })
            
            this.debug = true;
            window.addEventListener('keydown', e =>{
                if(e.key == 'd'){
                    this.debug = !this.debug;
                }
            })
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.maxEggs = 10;
            this.eggs = [];
            this.eggTimer = 0;
            this.eggInterval = 500;
            this.gameObjects = []; // for making eggs behind and in front of obstacles
            this.enemies = [];
            this.hatchlings = [];
        }

        render(context, deltaTime){
            if(this.timer > this.interval){
                context.clearRect(0, 0, this.width, this.height);
                this.gameObjects = [this.player, ...this.eggs, ...this.obstacles, ...this.enemies, ...this.hatchlings]; // it renders egg first and the obs therfore egg behind obs
                // sort by vertical method
                this.gameObjects.sort((a, b)=>{
                    return a.collisiony - b.collisiony  // egg goes behind obs when egg y increases
                });
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                });
                this.timer = 0;
            }
            this.timer+=deltaTime;

            //add eggs periodically
            if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs){
                this.addEgg();
                this.eggTimer = 0;
            }
            else{
                this.eggTimer += deltaTime;
            }
        }

        checkCollision(a, b){
            const dx = a.collisionx - b.collisionx;
            const dy = a.collisiony - b.collisiony;
            const distance = Math.hypot(dy, dx);
            const sumOfRadii = a.collisionr + b.collisionr;
            return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
        }

        addEgg(){
            this.eggs.push(new Egg(this)) // expects game arugument and we are in game therfore we put this
        }

        addEnemy(){
            this.enemies.push(new Enemy(this));
        }
        removeGameObject(){
            this.eggs = this.eggs.filter(object => !object.markedForDeletion) // creates an copy of array satisfying given conditions.
            this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion) // creates an copy of array satisfying given conditions.
        }

        init(){
            for(let i=0; i<3; i++){
                this.addEnemy();
            }
            let attempts = 0;
            while(this.obstacles.length < this.numberOfObstacles && attempts<500){
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionx - obstacle.collisionx;
                    const dy = testObstacle.collisiony - obstacle.collisiony
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 150;
                    const sumOfRadii = testObstacle.collisionr + obstacle.collisionr + distanceBuffer; // buffer sees that random obstcle are 100px apart
                    if(distance < sumOfRadii){
                        overlap = true;
                    }
                });
                const margin = testObstacle.collisionr*3;
                if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisiony > this.topMargin + margin && testObstacle.collisiony < this.height - margin){
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }


const game = new Game(canvas);
game.init()
// game.render(ctx);
console.log(game);


let lastTime =0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // ctx.clearRect(0,0,canvas.width, canvas.height);
        game.render(ctx, deltaTime); // here from above so that we can call it again and again
        requestAnimationFrame(animate);
    }
    animate(0);
})