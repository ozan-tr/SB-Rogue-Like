

const bindInputs = Array.from(document.getElementsByClassName("keybindInput"))

const defaultBinds = {
    moveLeft:"KeyA",
    moveRight:"KeyD",
    moveUp:"KeyW",
    moveDown:"KeyS",
}

var currentBinds = {}

function loadBinds(){
    if(localStorage.getItem("keybinds")){
        currentBinds = JSON.parse(localStorage.getItem("keybinds"))
    }else{
        currentBinds = defaultBinds
    }
    bindInputs.forEach((input)=>{
        input.value = currentBinds[input.id]
    })
    saveBinds()
}

function saveBinds(){
    bindInputs.forEach((input)=>{
        currentBinds[input.id] = input.value
    })
    localStorage.setItem("keybinds",JSON.stringify(currentBinds))
}

loadBinds()

bindInputs.forEach((input) => {
    input.addEventListener("keydown",(e)=>{
        e.preventDefault()
        input.value = e.code
    })
})

function closeSettings(){
    saveBinds()
    document.getElementsByClassName("settingsContainer")[0].style.display = "none"
}

function openSettings(){
    document.getElementsByClassName("settingsContainer")[0].style.display = "block"
}