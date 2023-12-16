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
        allItems.splice(allItems.indexOf(this),1)
        player.inventory.addXp(this.value)
        new DamageText(this,{damage:"+"+this.value+"xp",modifier:   4})
    }
    draw(ctx){
        ctx.fillStyle= `hsl(${this.value},100%,50%)`
        ctx.fillRect(this.pos.x,this.pos.y,10,10)
    }
    update(ctx){
        const playerPos=player.getTruePos()
        const dx = playerPos.x - this.pos.x;
        const dy = playerPos.y - this.pos.y;

        const distance = Math.hypot(dx, dy);

        if(distance < player.getStat("pickUpRange") && !this.attraction){
            this.startSucking()
        }

        if(this.attraction){
            const angle = Math.atan2(dy,dx)
            this.pos.x += Math.cos(angle)*this.speed
            this.pos.y += Math.sin(angle)*this.speed
            if(distance < player.size.width){
                this.pickup()
            }
        }else{
            var allXp = [...allItems].filter(item => item.vaccumable && item != this && item.constructor.name == "Experience")
            var nearXp = allXp.filter(item => {
                const dx = this.pos.x - item.pos.x;
                const dy = this.pos.y - item.pos.y;
                const distance = Math.hypot(dx, dy);
                return distance < 100
            })

            if(nearXp.length > 10){
                const valueOfNearXp = nearXp.reduce((acc,item) => acc+item.value,0)
                nearXp.forEach(x => allItems.splice(allItems.indexOf(x),1))
                new Experience(this.pos,valueOfNearXp+this.value)
                allItems.splice(allItems.indexOf(this),1)

            }

        }
        this.draw(ctx)
    }
}
