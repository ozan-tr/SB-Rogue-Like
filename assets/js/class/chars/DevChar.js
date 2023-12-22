class DevChar extends Player {
    constructor(){
        super()

        this.size={width:60,height:80}

        this.headOffset = {x: 30, y: 15}

        this.startingWeapon = "BBB"

        this.inventory = new Inventory(this)

        this.frame = true;

        this.lastFrame = new Date()

        this.hidden=true
    }
}