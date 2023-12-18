
window.scroll(0,0)
const c = document.getElementById('c')
const ctx = c.getContext("2d")

const dpsIndicator = document.getElementsByClassName('dpsIndicator')[0];
const performanceIndicator = document.getElementsByClassName('performanceIndicator')[0];

var heldDirKeys = {
    left: false,
    right: false,
    up:false,
    down:false,
}

c.width = window.innerWidth - 100
c.height = window.innerHeight - 100

window.addEventListener("resize", (e) => {
    c.width = window.innerWidth - 100
    c.height = window.innerHeight - 100
})


var player;
var map;
var wave
var renderedMobs = []
var renderedItems = []

var isMoving = false


var isShiftDown = false

function keyDown(e) {
    if (e.code === currentBinds.moveLeft) {
        heldDirKeys.left = true;
    } else if (e.code === currentBinds.moveRight) {
        heldDirKeys.right = true;
    } else if (e.code === currentBinds.moveUp) {
        heldDirKeys.up = true;
    } else if (e.code === currentBinds.moveDown) {
        heldDirKeys.down = true;
    }

    player.setDirection(true);
}

function keyUp(e) {
    if (e.code === currentBinds.moveLeft) {
        heldDirKeys.left = false;
    } else if (e.code === currentBinds.moveRight) {
        heldDirKeys.right = false;
    } else if (e.code === currentBinds.moveUp) {
        heldDirKeys.up = false;
    } else if (e.code === currentBinds.moveDown) {
        heldDirKeys.down = false;
    }

    player.setDirection(true);
}


function updateDps(){
    const regenAmount = player.getStat("regenAmount")
    const regenRate = player.getStat("regenCoolDown") / 1000
    dpsIndicator.innerHTML = `DPS: ${player.dps/10}\nHPS: ${regenAmount/regenRate}`
}


function dummyWave(size){
    const playerPos = player.getCenterPos()
    var incr = 360/size
    for(var i=0;i<360;i+=incr){
        const deg = i*Math.PI/180
        //new BookBat({x:Math.cos(deg)*500 + playerPos.x,y:Math.sin(deg)*500 + playerPos.y})
        new Student1({x:Math.cos(deg)*400 + playerPos.x,y:Math.sin(deg)*400 + playerPos.y})
        //new Student2({x:Math.cos(deg)*300 + playerPos.x,y:Math.sin(deg)*300 + playerPos.y})
        //new Student3({x:Math.cos(deg)*200 + playerPos.x,y:Math.sin(deg)*200 + playerPos.y})
    }

}

function drawPlayer(){
    ctx.setTransform(1,0,0,1,c.width/2,c.height/2)
    player.drawHealthBar(ctx)
    if(player.angle){ctx.rotate(player.angle)}
    ctx.drawImage(player.img,-player.size.width/2,-player.size.height/2, player.size.width,player.size.height)
    player.attackTick(ctx)
}


function drawXpBar(){
    ctx.setTransform(1,0,0,1,0,0)
    ctx.fillStyle="darkgray"
    ctx.fillRect(10,10,c.width-20,25)
    ctx.fillStyle="blue"
    ctx.fillRect(10,10,(c.width-20)*(player.inventory.data.xp/player.levelUpReq),25)
    ctx.strokeRect(10,10,c.width-20,25)
    ctx.fillStyle="black"
    ctx.font="20px PixelFont"
    ctx.textAlign="center"
    ctx.fillText(`Level: ${player.level} XP: ${player.inventory.data.xp}/${player.levelUpReq}`,c.width/2,30)
}

let fps = 60;
let interval = 1000 / fps;
let then = performance.now();
let previousTimeStamp;

function gameLoop(timeStamp) {
    
    if (previousTimeStamp === undefined) {
        previousTimeStamp = timeStamp;
    }

    const elapsed = timeStamp - previousTimeStamp;
    var shouldMove = false;
    for (var dir in heldDirKeys) {
        if (heldDirKeys[dir]) {
            shouldMove = true;
        }
    }
    if (shouldMove) {
        player.move(elapsed);
    } else {
        player.setIdle();
    }

    previousTimeStamp = timeStamp;

    const now = performance.now();
    const delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
    }
        if (!gamePaused && gameActive) {
            ctx.fillStyle = "black";
            ctx.clearRect(0, 0, c.width, c.height);
    
            ctx.setTransform(1, 0, 0, 1, player.pos.x, player.pos.y);
    
            map.drawMap(ctx);
    
            renderedItems.forEach((item) => {
                item.update(ctx);
            });
            renderedMobs.forEach((mob) => {
                mob.update(ctx);
            });
            renderedTexts.forEach((text) => {
                text.update(ctx);
            });
    
            drawPlayer();
    
            updateDps();
    
            drawXpBar();
    
            wave.drawTimer(ctx);
        }
    

        // Display the actual fps
        performanceIndicator.innerHTML = "FPS: "+Math.round(1000 / delta);

    

    requestAnimationFrame(gameLoop);
}
