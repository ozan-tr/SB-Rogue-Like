

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

        allMobs.push(this)        
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
        this.shouldRender()

        if(this.render){
            this.animation()
            const playerPos = player.getCenterPos();
    
            const dx = playerPos.x-player.pos.x-this.pos.x
            const dy = playerPos.y-player.pos.y-this.pos.y
            this.distToPlayer = Math.hypot(dx,dy)
    
            const xStep = (dx/this.distToPlayer) * this.stats.speed
            const yStep = (dy/this.distToPlayer) * this.stats.speed
    
            this.dir = {x: xStep > 0 ? 1 : -1, y: yStep > 0 ? 1 : -1}
    
            for (const mob of allMobs) {
                if (mob !== this && !mob.immovable && mob.render) {
                    const mobDx = mob.pos.x - this.pos.x;
                    const mobDy = mob.pos.y - this.pos.y;
                    const mobDistance = Math.hypot(mobDx, mobDy);
                    
                    const minDistance = (Math.hypot(this.size.width + this.size.height) + Math.hypot(mob.size.width + mob.size.height))/4  // Assuming mobs have a size property
    
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
            this.pos.x += xStep
            this.pos.y += yStep
            ctx.drawImage(this.img,this.pos.x,this.pos.y)
        }
    }
    applyDamage(damage) {
        console.log(new Date() - this.lastDamage,this.invincibiltyFrame)
        if(new Date()-this.lastDamage > this.invincibiltyFrame){
            this.health -= damage
            this.lastDamage=new Date()
            console.log(this.health,damage,this.invincibiltyFrame)
            if(this.health <= 0) {
                this.kill(true)
            }

        }


    }
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
    kill(giveExp){
        const index = allMobs.indexOf(this)
        if(giveExp){
            new Experience(this.pos,this.value)
        }
        allMobs.splice(index, 1)

    }
}

