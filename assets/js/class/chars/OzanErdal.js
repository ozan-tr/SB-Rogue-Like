class OzanErdal extends Player {
    constructor(){
        super()


        this.headOffset = {x: 20, y: 20}


        this.startingWeapon = "Biyique"

        this.inventory = new Inventory(this)

        this.frame = true;

        this.lastFrame = new Date()
    }


}