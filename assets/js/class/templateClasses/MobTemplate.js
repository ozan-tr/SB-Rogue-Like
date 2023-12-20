

class MobTemplate{
    constructor(name,pos,size,stats,value){
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.stats = stats;
        this.value = value;

        this.invincibiltyFrame=250

        this.dir = {x:0,y:0};

        this.health=this.stats.maxHealth

        this.images = Array.from(document.getElementById(this.name.replace(" ","")).children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.lastFrame=new Date()

        this.frame = false

        this.render = true

        this.lastRender = new Date()

        this.lastDamage = new Date()

        this.lastDamageApplied = new Date()

        this.chestChance = 0.01  

        renderedMobs.push(this)        

        
    }
    animation(){
        const timePassed = new Date()-this.lastFrame
        const animationDelay = 100/this.stats.speed
        if(timePassed >= animationDelay){
            this.frame = !this.frame
            if(this.frame){
                switch(this.dir.x){
                    case 1:
                        this.img = this.images[0]
                        break;
                    case -1:
                        this.img = this.images[2]
                        break;
                }
            }else{
                switch(this.dir.x){
                    case 1:
                        this.img = this.images[1]
                        break;
                    case -1:
                        this.img = this.images[3]
                        break;
                }
            }
            this.lastFrame = new Date()
    
        }
    }
    update(ctx){
            const playerPos = player.getTruePos();
    
            const dx = playerPos.x-this.pos.x
            const dy = playerPos.y-this.pos.y
            this.distToPlayer = Math.hypot(dx,dy)

            if(this.distToPlayer < c.width*2){
                const xStep = (dx/this.distToPlayer) * this.stats.speed
                const yStep = (dy/this.distToPlayer) * this.stats.speed
    
                this.animation()
        
                this.dir = {x: xStep > 0 ? 1 : -1, y: yStep > 0 ? 1 : -1}
        
                for (const mob of renderedMobs) {
                    if (mob !== this && !mob.immovable) {
                        const mobDx = mob.pos.x - this.pos.x;
                        const mobDy = mob.pos.y - this.pos.y;
                        const mobDistance = Math.hypot(mobDx, mobDy);
                        
                        const minDistance = (this.size.width + mob.size.width) / 2;
        
                        if (mobDistance < minDistance) {
                            const pushFactor = (minDistance - mobDistance) / mobDistance;
        
                            const pushX = mobDx * pushFactor;
                            const pushY = mobDy * pushFactor;
        
                            this.pos.x -= pushX / 2;
                            this.pos.y -= pushY / 2;
        
                            mob.pos.x += pushX / 2;
                            mob.pos.y += pushY / 2;
                            
                        }
                    }
                }
    
                if(this.distToPlayer < player.size.width/2+this.size.width/2){
                    player.applyDamage(this.getDamage())
                }
    
                this.pos.x += xStep
                this.pos.y += yStep
                ctx.drawImage(this.img,this.pos.x,this.pos.y)

            }else{
                this.kill(false)
            }
        
    }
    getDamage(){
        if(new Date() - this.lastDamageApplied > 1000/this.stats.attackSpeed){
            this.lastDamageApplied = new Date()
            return this.stats.damage
        }
        return 0
    }
    applyDamage(damage,hitbox) {

        if(new Date()-this.lastDamage > this.invincibiltyFrame){

            if(this.health - damage.value <= 0){
                damage.value = this.health
            }

            new Text(damage.value,this.pos,damage.modifier)
            this.health -= damage.value

            player.dps += damage.value

            setTimeout(() => {
                player.dps -= damage.value
            },10000)

            /*
            const damagePos = hitbox.r ? {x:hitbox.x,y:hitbox.y} : {x:hitbox.x+hitbox.w/2,y:hitbox.y+hitbox.h/2}
            const dirToDamage = Math.atan2(this.pos.y-damagePos.y,this.pos.x-damagePos.x)
            const knockBack = {x:Math.cos(-dirToDamage)*damage.knockBack,y:Math.sin(-dirToDamage)*damage.knockBack}
            
            this.pos.x += knockBack.x
            this.pos.y += knockBack.y
            */

            this.lastDamage=new Date()
            if(this.health <= 0 && !this.dead) {
                this.dead = true
                this.kill()
            }
            return true
        }   
        return false
    }
    /*
    shouldRender(){
        const truePos = player.getTruePos()
        const dx = truePos.x - this.pos.x;
        const dy = truePos.y - this.pos.y;
        const distance = Math.hypot(dx, dy);

        if(this.render){
            if(distance > c.width*3){
                this.render = false
                this.lastRender = new Date()
            }
        }else{
            const inactiveTime = new Date()- this.lastRender
            if(inactiveTime > 5000){
                this.kill()
            }else if(distance <= c.width*3){ 
                this.render=true
            }
        }
    }
    */
    kill(dropXp=true){
        const index = renderedMobs.indexOf(this)
        renderedMobs.splice(index, 1)

        if(proc(this.chestChance+player.getStat("luck"))){
            const chestNum = Math.floor(Math.random()*5)+1
            new Chest(this.pos,chestNum)
        }

        if(dropXp){
            new Experience(this.pos,this.value)
            player.killCount++
        }

    }
}


class ImmovableMob extends MobTemplate {
    constructor(name,size,stats){
        var side = Math.random() > 0.5
        const playerPos = player.getTruePos();
        super(
            name,
            {x: side ? player.pos.x - c.width: player.pos.x + c.width,y:playerPos.y+player.size.height/2},
            size,
            stats,
            0
        )
        this.travelDistance = 0
        this.side=side
        this.dir = {x: side ? 1 : -1, y:0}
        this.rotation=0
        this.immovable=true
        this.spawnTime = new Date()
        this.warningTime = 1000
    }
    update(ctx){

    const playerPos = player.getTruePos();
    const timeSinceSpawn = new Date() - this.spawnTime
    if(timeSinceSpawn > this.warningTime){
        for (const mob of renderedMobs) {
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
    
        const dx = playerPos.x-this.pos.x
        const dy = playerPos.y-this.pos.y
        this.distToPlayer = Math.hypot(dx,dy)

        if(this.distToPlayer < player.size.width/2+this.size.width/2){
            player.applyDamage(this.getDamage())
        }

        const travelDist =this.dir.x * this.stats.speed

        this.pos.x += travelDist
        this.travelDistance += travelDist

        
        ctx.save()
        ctx.translate(this.pos.x,this.pos.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(this.img,-this.size.width/2,-this.size.height/2)
        ctx.restore()


        this.rotation += this.dir.x * this.stats.speed * 0.05

        if(Math.abs(this.travelDistance) > (c.width + this.size.width)*2){
            renderedMobs.splice(renderedMobs.indexOf(this),1)
        }
    }else{
            ctx.setTransform(1,0,0,1,Math.random()*2,Math.random()*2)

            const x = this.side ? 100: c.width - 100  
            const y = c.width/2 - 50

            ctx.font = "80px PixelFont"
            ctx.fillStyle="black"
            ctx.fillText("!",x,y)

            ctx.setTransform(1,0,0,1,player.pos.x,player.pos.y)

        

        this.pos={x: this.side ? playerPos.x - c.width: playerPos.x + c.width,y:playerPos.y+player.size.height/2}
    }   
}
}


