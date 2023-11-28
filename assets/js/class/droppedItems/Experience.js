class Experience {
    constructor(pos,value){
        this.pos = pos;
        this.value = value
        this.img = null;
        this.vaccumable = true
        this.attraction = false

        this.speed = 0

        allItems.push(this)
    }
    pickup(){
        player.inventory.addXp(this.value)
        allItems.splice(allItems.indexOf(this),1)
    }
    startSucking(){
        const playerPos=player.getTruePos()
        const dx = playerPos.x - this.pos.x;
        const dy = playerPos.y - this.pos.y;

        const distance = Math.hypot(dx, dy);
        
        this.attraction = true
        this.speed = distance / 10
    }
    update(ctx){
        const playerPos=player.getTruePos()
        const dx = playerPos.x - this.pos.x;
        const dy = playerPos.y - this.pos.y;

        const distance = Math.hypot(dx, dy);

        if(distance < player.stats.pickup_range && !this.attraction){
            this.startSucking()
        }

        if(this.attraction){
            const angle = Math.atan2(dy,dx)
            this.pos.x += Math.cos(angle)*this.speed
            this.pos.y += Math.sin(angle)*this.speed
            if(distance < player.size.width){
                this.pickup()
            }
        }

        ctx.fillRect(this.pos.x,this.pos.y,10,10)
    }
}
