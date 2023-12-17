class ZeynepKarademir extends Player {
    constructor(){
        super()

        this.images = Array.from(document.getElementById('ZeynepKarademir').children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.headOffset = {x: 20, y: 20}

        this.startingWeapon = "RedBull"

        this.inventory = new Inventory(this)

        this.frame = true;

        this.lastFrame = new Date()
    }

}