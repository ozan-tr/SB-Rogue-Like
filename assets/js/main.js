

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
var allMobs = []
var allItems = []

var isMoving = false

function keyDown(e) {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
        heldDirKeys.left = true;
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        heldDirKeys.right = true;
    } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        heldDirKeys.up = true;
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        heldDirKeys.down = true;
    }

    player.setDirection(true);
}

function keyUp(e) {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
        heldDirKeys.left = false;
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        heldDirKeys.right = false;
    } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        heldDirKeys.up = false;
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        heldDirKeys.down = false;
    }

    player.setDirection(true);
}


function dummyWave(size){
    const playerPos = player.getCenterPos()
    var incr = 360/size
    for(var i=0;i<360;i+=incr){
        const deg = i*Math.PI/180
        new BookBat({x:Math.cos(deg)*500 + playerPos.x,y:Math.sin(deg)*500 + playerPos.y})
        //new Student1({x:Math.cos(deg)*400 + playerPos.x,y:Math.sin(deg)*400 + playerPos.y})
        //new Student2({x:Math.cos(deg)*300 + playerPos.x,y:Math.sin(deg)*300 + playerPos.y})
        //new Student3({x:Math.cos(deg)*200 + playerPos.x,y:Math.sin(deg)*200 + playerPos.y})

        
    }

}


function gameLoop(){
    const playerPos = player.getCenterPos()
    const playerHeadPos = player.getHeadPos()
    const playerAimingPos = player.getAimingPos()


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



    ctx.beginPath()
    ctx.arc(c.width/2, c.height/2,10,0,Math.PI*2)
    ctx.fill()

    ctx.setTransform(1,0,0,1,c.width/2,c.height/2)
    if(player.angle){ctx.rotate(player.angle)}
    ctx.drawImage(player.img,-player.size.width/2,-player.size.height/2, player.size.width,player.size.height)
    player.attackTick(ctx)


    var shouldMove = false
    for(var dir in heldDirKeys){
        if(heldDirKeys[dir]){shouldMove = true}
    }
    if(shouldMove){player.move()}else{player.setIdle()}
    
    /*
    ctx.setTransform(1,0,0,1,playerHeadPos.x,playerHeadPos.y)
    ctx.beginPath()
    ctx.arc(0,0,10,0,Math.PI*2)
    ctx.fill(   )
    */

    requestAnimationFrame(gameLoop)
}