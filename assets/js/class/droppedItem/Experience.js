class Experience extends PickUpTemplate{
    constructor(pos,value){
        super(
            pos,
            value,
            document.getElementById("Experience"),
            true
        )

        this.attraction = false

        this.speed = 0

        allItems.push(this)
    }
    pickup(){
        player.inventory.addXp(this.value)
        allItems.splice(allItems.indexOf(this),1)
    }
    draw(ctx){
        ctx.fillStyle="black"
        ctx.fillRect(this.pos.x,this.pos.y,10,10)
    }
}
