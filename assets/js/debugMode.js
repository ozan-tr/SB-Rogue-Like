

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
        this.log("debug.giveAll(amount) - Gives the player all items")
        this.log("debug.giveAllWeapons(amount) - Gives the player all weapons")
        this.log("debug.giveAllPassives(amount) - Gives the player all passive items")
        this.log("debug.giveAllOfType(type,amount) - Gives the player all items of a type")

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
        if(item == undefined){
            this.log("Item not found")
            return
        }

        for(let i=0;i<amount;i++){
            player.inventory.addItem(item.constructor.name)
        }

        this.log(`Gave ${amount} ${itemName}`)
    }
    giveAll(amount=1){
        ItemsDict.forEach((item)=>{
            this.give(item.constructor.name,amount)
        })
    }
    giveAllWeapons(amount=1){
        var count = 0;
        ItemsDict.forEach((item)=>{
            if(item.type!="Passive"){
                count++
                this.give(item.constructor.name,amount)
            }
        })
        this.log(`Gave ${amount} times ${count} weapons`)
    }
    giveAllPassives(amount=1){
        var count = 0;
        ItemsDict.forEach((item)=>{
            if(item.type=="Passive"){
                count++
                this.give(item.constructor.name,amount)
            }
        })
        this.log(`Gave ${amount} times ${count} passives`)
    }
    giveAllOfType(type,amount=1){
        var count = 0;
        ItemsDict.forEach((item)=>{
            if(item.type==type){
                count++
                this.give(item.constructor.name,amount)
            }
        })
        if(count==0){
            this.log(`No items of type ${type} found`)
        }else{
            this.log(`Gave ${amount} times ${count} items of type ${type}`)
        }
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
        console.log("Cleared "+renderedMobs.length+" mobs")

        var reverseArray = renderedMobs.slice().reverse();

        reverseArray.forEach((mob)=>{
            mob.kill(drops)
        })
    }
}


var debug = new Debug()
