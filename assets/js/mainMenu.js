const mainMenuDiv = document.querySelector('.mainMenu');
const characterSelectorMenu = document.querySelector('.characterSelectorMenu');
const mapSelectorMenu = document.querySelector('.mapSelectorMenu');
const selectorUiHolder = document.querySelector('.selectorUiHolder');

var selectedMap=undefined;
var selectedCharacter=undefined;

var currentMenu = "main"

setTimeout(()=>{
    const characters = Array.from(characterContainer.children)

    characters.forEach((character)=>{
        const name = character.id
        const container = document.createElement("div")
        const element = document.createElement("div")
        container.className="characterSelectorContainer"
        element.className = "characterSelector"
        const img = document.createElement("img")
        img.src=`assets/img/characters/${name}/0.png`
    
        var tempPlayer = eval("new "+name+"()")
        console.log(tempPlayer.startingWeapon)
       
    
        const startingItem = document.createElement("img")
        startingItem.src=`assets/img/weapons/${tempPlayer.startingWeapon}`
        tempPlayer=undefined
        element.appendChild(img)
        element.onclick = function(){selectedCharacter = name}
    
        container.appendChild(element)
    
        characterSelectorMenu.appendChild(container)
    })
    
    const maps = Array.from(mapsContainer.children)
    
    maps.forEach((map)=>{
        const name = map.id
    
        const element = document.createElement("div")
        element.className = "mapSelector"
        element.onclick = function(){selectedMap = name}
        
        mapSelectorMenu.appendChild(element)
    })
    


},100)



function mainMenu(){
    selectedMap=undefined;
    selectedCharacter=undefined;
    mainMenuDiv.style.display = "grid";
    selectorUiHolder.style.display = "none";
    currentMenu = "main"

}

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
        if(map!=undefined){
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
    mainContainer.style.display = "block"
    characterSelectorMenu.style.display = 'none'
    mapSelectorMenu.style.display = 'none' 
    selectorUiHolder.style.display = "none";   

    player = eval(`new ${playerName}()`)
    map = eval(`new ${mapName}()`)

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    requestAnimationFrame(gameLoop)
}