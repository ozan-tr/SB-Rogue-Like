
var loadedScripts = 0;

const characterContainer = document.getElementById('characterContainer');

loader.characters().then(chars=>{
        var sortedCharPaths = {}
        chars.forEach(char => {
            
            charName = char.toString().split("\\")[3]
            console.log(charName)
            if(!sortedCharPaths[charName]){
                sortedCharPaths[charName] = [char]
            }else{
                sortedCharPaths[charName].push(char)
            }
        });

        console.log(sortedCharPaths)

        for(const charName of Object.keys(sortedCharPaths)){
            console.log(charName)
            const imgContainer = document.createElement("div")
            imgContainer.id=charName
            imgContainer.style.display="none"
    
            sortedCharPaths[charName].forEach((char) => {
                const img = document.createElement("img")
                img.id = char.split("\\")[4].split(".")[0]
                img.src = char
                imgContainer.appendChild(img)
            })
    
            characterContainer.appendChild(imgContainer)
        }
})

const mapsContainer = document.getElementById("mapsContainer")

loader.maps().then((maps) => {
    maps.forEach((map) =>{
        const element = document.createElement("img")
        element.style.display = "none"
        
        element.src=map
        const seperated = map.split("\\")
        element.id=seperated[seperated.length-1].split(".")[0]
        mapsContainer.appendChild(element)
    })

})

const mobsContainer = document.getElementById("mobsContainer")

loader.mobs().then(mobs => {
    var sortedMobPaths = {}
    mobs.forEach(mob => {
        mobName = mob.toString().split("\\")[3]
        if(!sortedMobPaths[mobName]){
            sortedMobPaths[mobName] = [mob]
        }else{
            sortedMobPaths[mobName].push(mob)
        }
    });


    for(const mobName of Object.keys(sortedMobPaths)){
        const imgContainer = document.createElement("div")
        imgContainer.id=mobName
        imgContainer.style.display="none"

        sortedMobPaths[mobName].forEach((mob) => {
            const img = document.createElement("img")
            img.id = mob.split("\\")[4].split(".")[0]
            img.src=mob
            imgContainer.appendChild(img)
        })

        mobsContainer.appendChild(imgContainer)
    }
})


loader.scripts().then(paths => {
    paths.forEach(path => {
        var script = document.createElement('script')
        script.src = path
        document.body.appendChild(script)
        script.addEventListener('load', () => {
            loadedScripts++;
            if(loadedScripts==paths.length){
                setTimeout(() => {
                    startGame()
                }, 100);
            }
        })
    });
})





const mainContainer = document.getElementsByClassName('mainContainer')[0]

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

function startGame(){
    mainContainer.style.display = "block"

    player = new OzanErdal()
    map = new TestMap(player)

    

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    requestAnimationFrame(gameLoop)
}

function dummyWave(size){
    const playerPos = player.getCenterPos()
    var incr = 360/size
    for(var i=0;i<360;i+=incr){
        const deg = i*Math.PI/180
        new BookBat({x:Math.cos(deg)*500 + playerPos.x,y:Math.sin(deg)*500 + playerPos.y}).y

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