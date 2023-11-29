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
        const element = document.createElement("div")
        element.className = "characterSelector"

        const img = document.createElement("img")
        img.src=`assets/img/characters/${name}/0.png`

        img.className="charImg"
    
        var tempPlayer = eval("new "+name+"()")
        console.log(tempPlayer.startingWeapon) 

        img.width = tempPlayer.size.width
        img.height = tempPlayer.size.height
    
        const startingItem = document.createElement("img")
        startingItem.src=`assets/img/weapons/${tempPlayer.startingWeapon}.png`
        startingItem.className="charItemImg"

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
            console.log(selectedCharacter)
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
        element.style.backgroundImage = `url(assets/img/maps/${name}.png)`

        const mapName = document.createElement("span")
        mapName.className = "mapName"
        mapName.innerHTML = separateStringByCapital(name)

        element.onclick = function(){
            const preSel = document.querySelector(`.selectedMap`)
            if(preSel){
                preSel.classList.remove("selectedMap");
            }
            selectedMap=name;
            element.classList.add("selectedMap")
            console.log(selectedMap)
        }
        
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