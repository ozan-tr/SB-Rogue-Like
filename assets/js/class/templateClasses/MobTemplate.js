var allDamageTexts = []

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
            new DamageText(this,damage)
            this.health -= damage.damage

            const damagePos = {x:hitbox.x+hitbox.w/2,y:hitbox.y+hitbox.h/2}

            const dirToDamage = Math.atan2(this.pos.y-damagePos.y,this.pos.x-damagePos.x)
            const knockBack = {x:Math.cos(-dirToDamage)*damage.knockBack,y:Math.sin(-dirToDamage)*damage.knockBack}
            
            this.pos.x += knockBack.x
            this.pos.y += knockBack.y

            this.lastDamage=new Date()
            if(this.health <= 0) {
                this.kill(true)
            }
            return true
        }   
        return false
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
        player.killCount++
        allMobs.splice(index, 1)

    }
}


class DamageText {
    constructor(mob,damage){
        if(damage.damage == 0)return
        this.mob = mob
        this.damage = damage

        this.tilt = Math.random() > 0.5 ? 0.2 : -0.2
        
        this.pos = {x: mob.pos.x, y: mob.pos.y}
        this.render = true
        this.font = "30px PixelFont"
        this.lifeTime = 1000
        this.birthTime = new Date()
        this.speed = 0.3
        this.opacity = 1
        allDamageTexts.push(this)
    }
    update(ctx){
        const timePassed = new Date() - this.birthTime
        if(timePassed >= this.lifeTime){
            const index = allDamageTexts.indexOf(this)
            allDamageTexts.splice(index,1)
        }else{
            this.pos.y -= this.speed
            this.pos.x += this.tilt
            this.opacity = 1 - (timePassed/this.lifeTime)
        }
        
        ctx.font = this.font
        ctx.strokeStyle = 'black';
        if(this.damage.modifier==0){
            ctx.fillStyle = "white"
        }else if(this.damage.modifier==1){
            ctx.fillStyle = "red"
        }else if(this.damage.modifier==2){
            ctx.fillStyle = "yellow"
        }else if(this.damage.modifier==3){
            ctx.fillStyle = "green"
        }

        ctx.lineWidth = 2

        ctx.globalAlpha = this.opacity
        ctx.fillText(this.damage.damage,this.pos.x,this.pos.y)
        ctx.strokeText(this.damage.damage,this.pos.x,this.pos.y)
        ctx.globalAlpha = 1
    }
}

