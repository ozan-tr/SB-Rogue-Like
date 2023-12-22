

if(localStorage.getItem("instantStart")){
    setTimeout(()=>{
        startGame("DevChar","DevWorld")
    },1000)    
}




class Debug{
    constructor(){
        this.log("Started with debug enabled")
        this.createDevWorld()

        this.activeCheats={
            god:false,
        }
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
    createDevWorld(){
        const devWorldButton = document.createElement("button")
        devWorldButton.innerHTML = "Dev World"
        devWorldButton.classList.add("devWorldButton")
        devWorldButton.addEventListener("click",()=>{
            startGame("DevChar","DevWorld")
        })
        document.querySelector(".mainMenu").appendChild(devWorldButton)
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
        if(player.stats.maxHealth == 99999999){
            player.stats.maxHealth = this.oldHealthVal
            player.health = this.oldHealthVal
            this.activeCheats.god=false
            this.log("God mode disabled")
        }else{
            this.oldHealthVal = player.stats.maxHealth
            player.stats.maxHealth = 99999999
            player.health = this.oldHealthVal
            this.activeCheats.god=true
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
    testProc(chance,testRuns=100){
        var trueReturns = 0;
        var falseReturns = 0;

        for(let i=0;i<testRuns;i++){
            var procRes = proc(chance)
            if(procRes){
                trueReturns++
            }else{
                falseReturns++
            }
        }

        this.log(`Proc test with ${chance*100}% chance: ${trueReturns} true returns, ${falseReturns} false returns, success rate: ${trueReturns/testRuns*100}%`)
    }
    testJsRandom(amount=100){
        var col = amount/10
        var row = amount/col

        var table = []
        var results = []
        for(let i=0;i<row;i++){
            table.push([])
            for(let j=0;j<col;j++){
                const val = Math.random()
                table[i].push(val)
                results.push(val)
            }
        }

        const maxRes = Math.max(...results)
        const minRes = Math.min(...results)

        this.log(`Random test with ${amount} random numbers: ${minRes} min, ${maxRes} max`)


        var rowString = ""
        var rowColorData = []

        this.log("Spread Pattern")

        table.forEach((row)=>{
            row.forEach((val)=>{
                rowString += `%c  `
                rowColorData.push(`background-color: hsl(${val*100},100%,50%)`)
            })
            rowString += "\n"
        })

        console.log(rowString,...rowColorData)

        results.forEach((res)=>{
            closestSnap = Math.floor(res*10)
            
        })

    }
    spawnNearbyChest(items=3){
        const chestPos = {
            x:player.pos.x+Math.random()*1000-500,
            y:player.pos.y+Math.random()*1000-500
        }
        new Chest(chestPos,items)
    }
    spawnRandomChests(maxDist=5000,amount=10,items=3){
        for(let i=0;i<amount;i++){
            const chestPos = {
                x:player.pos.x+Math.random()*maxDist-maxDist/2,
                y:player.pos.y+Math.random()*maxDist-maxDist/2
            }
            new Chest(chestPos,items)
        }
    }
}


var debug = new Debug()
