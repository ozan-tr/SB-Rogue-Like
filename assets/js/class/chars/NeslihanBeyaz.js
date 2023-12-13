class NeslihanBeyaz extends Player{
    constructor(){
        super()


        this.size = {width:120,height:120}

        this.angle = 0;

        this.startingWeapon = "ProductionOrale"
        

        this.inventory = new Inventory(this)

        this.headOffset = {x:60,y:60}

    }
    setIdle(){

    }
    animate(){
        clearInterval(this.correction);
        this.angle += this.dir.x * -0.05;
    }
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}