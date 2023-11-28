const uiContainer = document.getElementsByClassName('uiContainer')[0]
var uiActive = false

const statsList = document.getElementById('statsList')

document.addEventListener('keydown', (e)=>{
    if(e.code==="Escape"){
        uiActive = ! uiActive
        if(uiActive){
            uiContainer.classList.add("activateUi")
            updateStats()
        }else{
            uiContainer.classList.remove("activateUi")
        }
    }
})

function updateStats() {
    const stats = player.getStats()
    statsList.innerHTML=""

    for(const stat in stats) {
        const value = stats[stat]
        const statElement = document.createElement("li")
        statElement.innerHTML = `<b>${stat}:</b> ${value}`
        statElement.classList.add("statsListItem")
        statElement.style.listStyleImage = `url(assets/img/statIcon/${stat}.png)`;
        statsList.appendChild(statElement)
    }

}