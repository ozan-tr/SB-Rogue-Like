class LOignon extends MobTemplate {
    constructor(){
        var playerPos = player.getCenterPos();
        var side = Math.random() > 0.5
        super(
            "L'Oignon",
            {x: side ? playerPos.x: player.pos.x + c.width,y:playerPos.y+player.size.height/2},
            {width:128,height:128},
            {
                speed:10,
                damage:10000
            },
            0

        )
        this.side=side
        this.dir = {x: side ? 1 : -1, y:0}
        this.rotation=0
        this.immovable=true

        
    }
    update(ctx){
        for (const mob of allMobs) {
            if (mob !== this && !mob.immovable) {
                const mobDx = mob.pos.x - this.pos.x;
                const mobDy = mob.pos.y - this.pos.y;
                const mobDistance = Math.hypot(mobDx, mobDy);
                
                const minDistance = (Math.hypot(this.size.width + this.size.height) + Math.hypot(mob.size.width + mob.size.height))/4  // Assuming mobs have a size property

                if (mobDistance < minDistance) {
                    // Collision detected, push mobs away from each other
                    const pushFactor = (minDistance - mobDistance) / mobDistance * 5;

                    const pushX = mobDx * pushFactor;
                    const pushY = mobDy * pushFactor;

                    mob.pos.x += pushX / 2;
                    mob.pos.y += pushY / 2;
                    
                }
            }
        }

        this.pos.x += this.dir.x * this.stats.speed

        ctx.setTransform(1,0,0,1,this.pos.x,this.pos.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(this.img,-this.size.width/2,-this.size.height/2)
        ctx.setTransform(1,0,0,1,player.pos.x,player.pos.y)

        this.rotation += this.dir.x * this.stats.speed * 0.05

        /*
        ctx.strokeStyle="black"
        ctx.strokeRect(this.pos.x,this.pos.y,this.size.width,this.size.height)
        ctx.beginPath()
        ctx.moveTo(this.pos.x,this.pos.y)
        ctx.lineTo(this.pos.x+this.size.width,this.pos.y+this.size.height)
        ctx.strokeStyle="red"
        ctx.stroke()
        */
    }
}