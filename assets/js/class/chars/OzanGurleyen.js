class OzanGurleyen extends Player {
    constructor(){
        super()

        
        this.images = Array.from(document.getElementById('OzanGurleyen').children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.size={width:60,height:80}

        this.headOffset = {x: 30, y: 15}

        this.startingWeapon = "BBB"

        this.inventory = new Inventory(this)

        this.frame = true;

        this.lastFrame = new Date()
    }


}