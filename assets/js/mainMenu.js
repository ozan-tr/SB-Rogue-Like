




function characterSelector() {


}

function mapSelector(){


}


function startGame(playerName,mapName){
    mainContainer.style.display = "block"

    player = new NeslihanBeyaz()
    map = new TestMap(player)

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    requestAnimationFrame(gameLoop)
}