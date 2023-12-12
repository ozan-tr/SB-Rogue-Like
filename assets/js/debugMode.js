

if(localStorage.getItem("instantStart")){
    setTimeout(()=>{
        startGame("OzanGurleyen","BioLab")
    },1000)    
}

class Debug{
    constructor(){
        this.log("Started with debug enabled")
    }
    help(){
        this.log("Commands:")
        this.log("debug.skipMenu() - Skips the main menu")
        this.log("debug.give(itemName,amount) - Gives the player an item")
        this.log("debug.xp(amount) - Gives the player xp")
        this.log("debug.god() - Enables god mode")
        this.log("debug.clearMobs(drops) - Clears all mobs")
    }
    log(message){
        console.log("DEBUG: "+message)
    }
    skipMenu(){
        if(localStorage.getItem("instantStart")){
            localStorage.removeItem("instantStart")
            this.log("Instant start disabled")
        }else{
            localStorage.setItem("instantStart",true)
            this.log("Instant start enabled")
        }
    }
    give(itemName,amount=1){
        const item = ItemsDict.find((item) => item.constructor.name == itemName)

        console.log(item)
        if(item == undefined){
            this.log("Item not found")
            return
        }

        for(let i=0;i<amount;i++){
            player.inventory.addItem(item.constructor.name)
        }

        this.log(`Gave ${amount} ${itemName}`)
    }
    xp(amount=1){
        new Experience(player.pos,amount)
        this.log(`Gave ${amount} xp`)
    }
    god(){
        if(player.maxHealth == Infinity){
            player.maxHealth = this.oldHealthVal
            this.log("God mode disabled")
        }else{
            this.oldHealthVal = player.maxHealth
            player.maxHealth = Infinity
            this.log("God mode enabled")
        }
    }
    clearMobs(drops=true){
        console.log("Cleared "+allMobs.length+" mobs")

        var reverseArray = allMobs.slice().reverse();

        reverseArray.forEach((mob)=>{
            mob.kill(drops)
        })
    }
}


var debug = new Debug()
