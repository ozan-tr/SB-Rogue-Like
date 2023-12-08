
window.scroll(0,0)
const c = document.getElementById('c')
const ctx = c.getContext("2d")

var heldDirKeys = {
    left: false,
    right: false,
    up:false,
    down:false,
}

c.width = 700
c.height= 500

var player;
var map;
var wave
var allMobs = []
var allItems = []

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
    if(player.angle){ctx.rotate(player.angle)}
    ctx.drawImage(player.img,-player.size.width/2,-player.size.height/2, player.size.width,player.size.height)
    player.drawHealthBar(ctx)
    player.attackTick(ctx)
}

let start,previousTimeStamp;

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

function gameLoop(timeStamp){

    if(gameActive){
          ctx.fillStyle="black"
          ctx.clearRect(0, 0, c.width,c.height)
      
          ctx.setTransform(1,0,0,1,player.pos.x,player.pos.y)
      
          map.drawMap(ctx)
      
          allItems.forEach((item)=>{
              item.update(ctx)
          })
          allMobs.forEach((mob)=>{
              mob.update(ctx)
          })
          allDamageTexts.forEach((text)=>{
              text.update(ctx)
          })
      
          drawPlayer()
      
          drawXpBar()    


          
          wave.drawTimer(ctx)
          
    }
    
    if (previousTimeStamp === undefined) {
        previousTimeStamp = timeStamp;
      }

    const elapsed = timeStamp - previousTimeStamp;
    var shouldMove = false
    for(var dir in heldDirKeys){
        if(heldDirKeys[dir]){shouldMove = true}
    }
    if(shouldMove){player.move(elapsed)}else{player.setIdle()}

    previousTimeStamp = timeStamp;

    requestAnimationFrame(gameLoop)
}