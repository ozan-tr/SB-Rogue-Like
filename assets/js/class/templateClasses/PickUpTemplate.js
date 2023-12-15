class PickUpTemplate{
    constructor(pos,value,img,vaccumable){
        this.pos = pos;
        this.value = value
        this.img = img;
        this.vaccumable = vaccumable
        this.attraction = false

        this.speed = 0

        allItems.push(this)
    }
    pickup(){
        return false
    }
    draw(ctx){
        ctx.drawImage(this.img,this.pos.x,this.pos.y,10,10)
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

        console.log(distance)

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
        }
        this.draw(ctx)
    }
}