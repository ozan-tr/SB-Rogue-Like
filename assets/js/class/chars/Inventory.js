const weaponsInv = document.getElementById("weaponsInv");
const itemsInv = document.getElementById("itemsInv")
const descriptionBox = document.getElementsByClassName("descriptionContainer")[0];

const rarity = [
    {name:"Common",color:"gray"},
    {name:"Uncommon",color:"green"},
    {name:"Rare",color:"blue"},
    {name:"Epic",color:"purple"},
    {name:"Legendry",color:"gold"},
    {name:"Mythical",color:"hotpink"},
    {name:"Special",color:"red"},
]


class Inventory{
    constructor(player,defaultItem) {
        this.player = player
        this.data = {
            weapons:[

            ],
            items:{

            },
            xp:0,
            currency:0
        }
        this.addWeapon(defaultItem)
    }
    addXp(amnt){
        this.data.xp += amnt
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
                document.getElementById(weapon.constructor.name+"Level").innerHTML = w.level
            }
        })
        if(!exists){
            this.data.weapons.push(eval(`new ${weapon}()`))

            var weaponObj = this.data.weapons[this.data.weapons.length-1]

            console.log(weaponObj)

            const slot = document.createElement('div')
            slot.id = weapon
            slot.classList.add('inventoryItem')
            slot.style.borderColor = rarity[weaponObj.rarity].color
            slot.style.backgroundImage = weaponObj.img//`url(assets/img/weapons/${weaponObj.name}.png)`

            console.log(weaponObj.img)

            const itemlevel = document.createElement('div')
            itemlevel.id = weapon+"Level"
            itemlevel.classList.add('itemlevel')
            itemlevel.innerHTML = weaponObj.level+1

            slot.appendChild(itemlevel)

            const descriptionText = document.createElement('div')
            descriptionText.classList.add('descriptionText')
            descriptionText.innerHTML = weaponObj.description


            slot.addEventListener('mousemove', (e) => {
                descriptionBox.innerHTML = ""
                descriptionBox.appendChild(descriptionText)

                const weaponStats = document.createElement('ul')                                    
                weaponStats.classList.add('weaponStats')

                const statsToDisplay = e.shiftKey ? weaponObj.improvementInfo() : weaponObj.getStats()

                for(const stat in statsToDisplay) {                                         
                    const value = statsToDisplay[stat]

                    const statElement = document.createElement('div')
                    const statSymbol = document.createElement('img')
                    const statValue = document.createElement('span')

                    statElement.classList.add('weaponStat')


                    statSymbol.src=`assets/img/statIcon/${stat.replace(" ","_")}.png`
                    statValue.innerHTML = value

                    statElement.appendChild(statSymbol)
                    statElement.appendChild(statValue)

                    weaponStats.appendChild(statElement)
                }
                descriptionBox.appendChild(weaponStats)
            })
            slot.addEventListener('mouseleave', (e) => {
                descriptionBox.innerHTML = "Hover over an item to see its description."
            })

            weaponsInv.appendChild(slot)
        }
    }


}