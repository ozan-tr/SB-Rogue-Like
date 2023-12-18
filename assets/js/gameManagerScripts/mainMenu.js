const mainMenuDiv = document.querySelector('.mainMenu');
const characterSelectorMenu = document.querySelector('.characterSelectorMenu');
const mapSelectorMenu = document.querySelector('.mapSelectorMenu');
const selectorUiHolder = document.querySelector('.selectorUiHolder');
const postGameMenu = document.querySelector('.postGameMenu');
var selectedMap=undefined;
var selectedCharacter=undefined;

var currentMenu = "main"

setTimeout(()=>{
    const characters = Array.from(characterContainer.children)

    characters.forEach((character)=>{
        const name = character.id
        const element = document.createElement("div")
        element.className = "characterSelector"

        const img = document.createElement("img")
        img.src=`assets/img/characters/${name}/0.png`

        img.className="charImg"

        const weapon = startingWeapons[name] ? startingWeapons[name] : "TestSword"

    
        const startingItem = document.createElement("img")
        startingItem.src=`assets/img/weapons/${weapon}.png`
        startingItem.className="charItemImg"

        startingItem.style.backgroundImage="url(assets/img/UI/ItemBorder.png"
        startingItem.style.backgroundColor=rarity[0].color

        startingItem.width=40
        startingItem.height=40
        
        tempPlayer=undefined
        
        element.onclick = function(){
            const preSel = document.querySelector(`.selectedChar`)
            if(preSel){
                preSel.classList.remove("selectedChar");
            }
            selectedCharacter=name;
            element.classList.add("selectedChar")
        }
        element.appendChild(img)
        element.appendChild(startingItem)

    
        characterSelectorMenu.appendChild(element)
    })
    
    const maps = Array.from(mapsContainer.children)
    
    maps.forEach((map)=>{
        const name = map.id
    
        const element = document.createElement("div")
        element.className = "mapSelector"
        element.style.backgroundImage = `url(assets/img/maps/${name})`

        const mapName = document.createElement("span")
        mapName.className = "mapName"
        mapName.innerHTML = separateStringByCapital(name)

        element.onclick = function(){
            const preSel = document.querySelector(`.selectedMap`)
            if(preSel){
                preSel.classList.remove("selectedMap");
            }
            selectedMap=name.split(".")[0];
            element.classList.add("selectedMap")
        }
        element.appendChild(mapName)
        mapSelectorMenu.appendChild(element)
    })
    


},100)


function mainMenu(){
    selectedMap=undefined;
    selectedCharacter=undefined;

    mainContainer.style.display = "block"
    characterSelectorMenu.style.display = 'none'
    mapSelectorMenu.style.display = 'none' 
    selectorUiHolder.style.display = "none";  
    postGameMenu.style.display = "none"

    mainMenuDiv.style.display = "grid";
    currentMenu = "main"
}

function endRun(win){
    cancelAnimationFrame(gameLoop)
    gameActive=false
    selectedMap=undefined;
    selectedCharacter=undefined;

    c.style.display = "none"        
    postGameMenu.style.display = "none"
    postGameMenu.innerHTML = ""
    
    renderedItems=[]
    renderedMobs=[]
    renderedTexts=[]

    var auxCanvases = Array.from(mainContainer.children)
    auxCanvases.forEach((canvas)=>{
        if(canvas.id != "c"){
            canvas.remove()
        }
    })

    const runStats = {
        map: map.name,
        player: player.constructor.name,
        level: player.level,
        timeSurvived: wave.passedTime,
        completed: win,
        killCount: player.killCount,
        completionTime: new Date(),
        debugEnabled: localStorage.getItem("debug")
    }
    localStorage.setItem("lastRun",JSON.stringify(runStats))
    var runHistory = JSON.parse(localStorage.getItem("runHistory"))
    if(runHistory == null){
        runHistory = [runStats]
        localStorage.setItem("runHistory",JSON.stringify(runHistory))
    }else{
        runHistory.push(runStats)
        localStorage.setItem("runHistory",JSON.stringify(runHistory))
    }

    mainMenu()
}

const separateStringByCapital = str => (matches => matches ? matches.join(' ') : str)(str.match(/[A-Z][a-z]*/g));


function characterSelector() {
    selectedCharacter = undefined;
    mainMenuDiv.style.display = 'none';
    characterSelectorMenu.style.display = 'flex'
    selectorUiHolder.style.display = "grid";
    currentMenu = "character"
}

function mapSelector(){
    if(selectedCharacter!=undefined){
        selectedMap=undefined
        characterSelectorMenu.style.display = 'none'
        mapSelectorMenu.style.display = 'flex' 
        selectorUiHolder.style.display = "grid";   
        currentMenu = "map"
    }
}

function next(){
    if(currentMenu == "character"){
        mapSelector()
    }
    if(currentMenu == "map"){
        if(selectedMap!=undefined){
            startGame(selectedCharacter, selectedMap)
        }
    }
}

function back(){
    if(currentMenu == "map"){
        characterSelector()
    }
    if(currentMenu == "character"){
        mainMenu()
    }
}


function startGame(playerName,mapName){
    gameActive=true
    gamePaused=false

    heldDirKeys = {
        left: false,
        right: false,
        up:false,
        down:false,
    }

    c.style.display = "block"  

    mainContainer.style.display = "block"
    mainMenuDiv.style.display = 'none';
    characterSelectorMenu.style.display = 'none'
    mapSelectorMenu.style.display = 'none' 
    selectorUiHolder.style.display = "none";
    postGameMenu.style.display = "none"
    postGameMenu.innerHTML = "" 

    player = eval(`new ${playerName}()`)
    map = eval(`new ${mapName}()`)
    wave = eval(`new ${mapName}Waves()`)

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    requestAnimationFrame(gameLoop)
}

function openSettings(){
    document.getElementsByClassName("settingsContainer")[0].style.display = "block"
}

function enableDebug(){
    console.log("Debug mode enabled \n Refresh to activate")
    localStorage.setItem("debug",true)
}

function disableDebug(){
    console.log("Debug mode disabled \n Refresh to activate")
    localStorage.removeItem("debug")
}

function endGame(win){
    gameActive=false
    document.removeEventListener("keydown", keyDown)
    document.removeEventListener("keyup", keyUp)

    postGameMenu.appendChild(createVictoryText(win))
    postGameMenu.appendChild(createGameTimeDiv())
    postGameMenu.appendChild(createGameStatsDiv())
    postGameMenu.appendChild(createPlayerInfoDiv())
    postGameMenu.appendChild(createMainMenuButton(win))
    postGameMenu.appendChild(createInventoryDataDiv())

    postGameMenu.style.display = "grid"
}
function createVictoryText(win){
    const victoryText = document.createElement("span")
    victoryText.className = "victoryText"
    victoryText.innerHTML = win ? "Victory!" : "Defeat"

    return victoryText
}

function createMainMenuButton(win){
    const mainMenuBtn = document.createElement("button")
    mainMenuBtn.className = "mainMenuBtn"

    mainMenuBtn.innerHTML = "Main Menu"

    mainMenuBtn.onclick = function (){endRun(win)}


    return mainMenuBtn
}


function createPlayerInfoDiv(){
    const playerInfo = document.createElement("div")
    playerInfo.className = "playerInfo"

    const playerName = document.createElement("span")
    const playerLevel = document.createElement("span")
    const playerImg = document.createElement("img")

    playerName.innerHTML = separateStringByCapital(player.constructor.name)
    playerLevel.innerHTML =`Level: ${player.level}`
    playerImg.src = `assets/img/characters/${player.constructor.name}/0.png`

    playerInfo.appendChild(playerName)
    playerInfo.appendChild(playerLevel)
    playerInfo.appendChild(playerImg)

    return playerInfo
}

function createInventoryDataDiv(){
    const invData = document.createElement("div")
    invData.className = "invData"

    const items = document.createElement("div")
    items.className = "itemsPostGame"

    const activeItems = document.createElement("div")
    activeItems.className = "postGameItemsContainer"

    const passiveItems = document.createElement("div")
    passiveItems.className = "postGameItemsContainer"

    player.inventory.data.items.forEach((item) => {
        const itemDiv = document.createElement("div")
        itemDiv.className = "postGameItemContainer"
        itemDiv.style.backgroundImage = item.img

        const itemLevel = document.createElement("span")
        itemLevel.innerHTML = item.level+1
        itemLevel.className = "postGameItemLevel"

        itemDiv.style.borderColor = rarity[item.rarity].color

        itemDiv.appendChild(itemLevel)

        if(item.type == "Passive"){
            passiveItems.appendChild(itemDiv)
        }else{  
            activeItems.appendChild(itemDiv)
        }
    })
    

    items.appendChild(activeItems)
    items.appendChild(passiveItems)
    invData.appendChild(items)


    return invData
}

function createGameStatsDiv(){
    const gameStats = document.createElement("div")
    gameStats.className = "gameStats"

    const kills = document.createElement("span")
    kills.innerHTML = `Kills: ${player.killCount}`

    const wavesCount = document.createElement("span")
    wavesCount.innerHTML = `Waves: ${wave.currentWave}`

    gameStats.appendChild(kills)
    gameStats.appendChild(wavesCount)

    return gameStats
}

function createGameTimeDiv(){
    const gameTime = document.createElement("span")
    gameTime.className = "gameTime"
    gameTime.innerHTML = `Time: ${new Date(wave.passedTime).toISOString().substr(14, 5)}`    

    return gameTime
}



