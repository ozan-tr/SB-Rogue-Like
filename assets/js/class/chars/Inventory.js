const weaponsInv = document.getElementById("weaponsInv");
const itemsInv = document.getElementById("itemsInv")
const descriptionBox = document.getElementsByClassName("descriptionContainer")[0];




class Inventory{
    constructor(player) {
        this.player = player
        this.data = {
            weapons:[

            ],
            items:{

            },
            xp:0,
            currency:0
        }
        this.addWeapon(player.startingWeapon)
    }
    addXp(amnt){
        this.data.xp += amnt
        if(this.data.xp >= this.player.levelUpReq){
            this.data.xp = 0
            this.player.levelUp()
        }
    }
    addCurrency(amnt){
        this.data.currency += amnt
    }
    addWeapon(weapon){
        var exists = false
        this.data.weapons.forEach((w) => {
            if(w.constructor.name === weapon){
                exists = true
                w.levelUp()
            }
        })
        if(exists){
               document.getElementById(weapon+"Level").innerHTML = this.data.weapons[this.data.weapons.length-1].level+1
        }
        else{
            this.data.weapons.push(eval(`new ${weapon}()`))

            var weaponObj = this.data.weapons[this.data.weapons.length-1]

            const slot = document.createElement('div')
            slot.id = weapon
            slot.classList.add('inventoryItem')
            slot.style.borderColor = rarity[weaponObj.rarity].color
            slot.style.backgroundImage = weaponObj.img//`url(assets/img/weapons/${weaponObj.name}.png)`

            const itemlevel = document.createElement('div')
            itemlevel.id = weapon+"Level"
            itemlevel.classList.add('itemlevel')
            itemlevel.innerHTML = weaponObj.level+1

            slot.appendChild(itemlevel)

            const descriptionText = document.createElement('div')
            descriptionText.classList.add('descriptionText')
            descriptionText.innerHTML = weaponObj.description

            slot.tabIndex = 0

            this.statsToDisplay = weaponObj.getStats()

            slot.addEventListener('keydown', (e)=>{
                if(e.code === "ShiftLeft"){
                    descriptionBox.innerHTML = ""
                    this.statsToDisplay = weaponObj.improvementInfo()
                    descriptionBox.appendChild(descriptionText)
                    this.createStatPanel()
                    this.createLevelPanel(weaponObj,true)
                }
            })
            
            slot.addEventListener('keyup', (e)=>{
                if(e.code === "ShiftLeft"){
                    descriptionBox.innerHTML = ""
                    this.statsToDisplay = weaponObj.getStats()
                    descriptionBox.appendChild(descriptionText)
                    this.createStatPanel()
                    this.createLevelPanel(weaponObj,false)
                }
            })

            slot.addEventListener('mouseenter', (e) => {
                slot.focus()            
                descriptionBox.innerHTML = ""
                this.statsToDisplay = weaponObj.getStats()
                descriptionBox.appendChild(descriptionText)
                this.createStatPanel()
                this.createLevelPanel(weaponObj,false)
            })
            slot.addEventListener('mouseleave', (e) => {
                descriptionBox.innerHTML = "Hover over an item to see its description."
            })

            weaponsInv.appendChild(slot)

            if(weaponObj.type === "Area"){
                setTimeout(() => {
                    weaponObj.attack()
                }, 1000);
            }
        }
    
    }
    createLevelPanel(weapon,nextLevel){
        var levelInfo;

        if(nextLevel){
            levelInfo = `<span style="color:${rarity[weapon.rarity].color}">${rarity[weapon.rarity].name}</span><br><span>Level ${weapon.level+2} / ${weapon.maxLevel+1}</span>`
        }else{
            levelInfo = `<span style="color:${rarity[weapon.rarity].color}">${rarity[weapon.rarity].name}</span><br><span>Level ${weapon.level+1} / ${weapon.maxLevel+1}</span>`
        }
        const levelPanel = document.createElement('div')
        levelPanel.classList.add('weaponLevel')
        levelPanel.innerHTML = levelInfo
        descriptionBox.appendChild(levelPanel)
    }
    createStatPanel(){
        const weaponStats = document.createElement('div')                                    
        weaponStats.classList.add('weaponStats')

        for(const stat in this.statsToDisplay) {                                         
            const value = this.statsToDisplay[stat]

            const statElement = document.createElement('div')
            const statSymbol = document.createElement('img')
            const statValue = document.createElement('span')

            statElement.classList.add('weaponStat')


            statSymbol.src=`assets/img/UI/statIcon/${stat.replace(" ","_")}.png`
            statValue.innerHTML = value

            statElement.appendChild(statSymbol)
            statElement.appendChild(statValue)

            weaponStats.appendChild(statElement)
        }


        descriptionBox.appendChild(weaponStats)
    }
    getAvailableItems(){
        var ret = []
        ItemsDict.forEach((item) => {
            const isMax = this.data.weapons[item] ? this.data.weapons[item].level === this.data.weapons[item].maxLevel : false
            if(!isMax){
                ret.push(item)
            }
        })
        return ret
    }
}