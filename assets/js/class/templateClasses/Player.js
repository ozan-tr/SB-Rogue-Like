
class Player {
    constructor() {
        this.pos = { x: 0, y: 0 };

        this.stats = {
            speed: 0.5,
            strength: 1,
            defence: 1,
            luck: 1,
            range: 1,
            attackSpeed: 1,
            pickUpRange: 50,
            critChance: 0.1,
            critDamage: 0.5,
            knockBack: 1,
            evasion: 0.05,
            regenAmount: 1,
            regenCoolDown: 1000,
            maxHealth: 100,
            amount: 1,
            size: 1,
            effectDuration: 1,
            area:1
        };

        this.health = this.stats.maxHealth;

        this.lastRegen = new Date()

        this.killCount = 0;

        this.level=1

        this.levelUpReq = 10;

        this.images = Array.from(document.getElementById(this.constructor.name).children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.size = { width: 40, height: 60 };
        this.dir = { x: 0, y: 0 };
        this.angle = 0;
        this.heldDirKeys = [];

        this.startingWeapon = "TestSword"

        this.levelUpQueue = 0

        console.log(this.getStats());
    }

    suckXp() {
        allItems.forEach((item) => {
            if (item.vaccumable) {
                item.startSucking();
            }
        });
    }

    levelUp(){
        this.level+=1
        this.levelUpReq *= 2
        this.levelUpQueue+=1
        console.log(this.levelUpQueue)
        if(this.levelUpQueue == 1){
            openLevelUpMenu()
        }
    }

    attackTick() {
        this.inventory.data.items.forEach((item) => {
        if(item.type != "Area"){
            if (new Date() - item.lastAttack > 2000) {
                const howMany = item.getStat("amount") || 1;
                if (howMany) {
                    let n = 0;
                    const multiFire = setInterval(() => {
                        if (n === howMany) {
                            clearInterval(multiFire);
                            return;
                        }
                        item.attack();
                        n++;
                    }, 100);
                }
                item.lastAttack = new Date();
            }
        }
        })
    }
    regenTimer(){
        const regenCoolDown = this.getStat("regenCoolDown")
        if(regenCoolDown||!isNaN(regenCoolDown)){
            const regenAmount = this.getStat("regenAmount")
             if(new Date()-this.lastRegen > regenCoolDown){
                this.heal(regenAmount)
                this.lastRegen = new Date()
             }
        }
    }

    getDamage(weapon){
        const damage = weapon.getStat("damage") * this.getStat("strength")
        const knockBack = weapon.getStat("knockBack") * this.getStat("knockBack")
        const critChance = weapon.getStat("critChance") + this.getStat("critChance")
        const critDamage = weapon.getStat("critDamage") + this.getStat("critDamage")
        const crit = Math.random() < critChance
        const multiplier = crit ? critDamage : 1
        return {damage:damage * multiplier,modifier:crit,knockBack:knockBack}
    }
    heal(amount){
        var fakePos = this.getTruePos()
        const maxHealth = this.getStat("maxHealth")
        fakePos.y -= 50
        new DamageText(this,{damage:amount,modifier:3}).pos = fakePos
        this.health += amount
        if(this.health > maxHealth){
            this.health = maxHealth
        }
    }
    applyDamage(amount){
        var fakePos = this.getTruePos()
        fakePos.y -= 50
        if(Math.random() < this.getStat("evasion")){
            new DamageText(this,{damage:"Evaded",modifier:2}).pos = fakePos
            return
        }
        new DamageText(this,{damage:amount,modifier:0}).pos = fakePos
        this.health -= amount
        if(this.health <= 0){
            this.health = 0
            this.kill()
        }
    }
    kill(){
        console.log("dead")
        endGame(false)
    }
    drawHealthBar(ctx) {
        const barWidth = 100;
        const healthPercentage = this.health / this.getStat("maxHealth");
        const foregroundWidth = barWidth * healthPercentage;

    
        ctx.fillStyle = 'gray';
        ctx.fillRect(-50,this.size.height/1.5, barWidth, 10);
    
        // Calculate color
        let color;
        if (healthPercentage > 0.5) {
            color = 'green';
        } else if (healthPercentage > 0.2) {
            color = 'yellow';
        } else {
            color = 'red';
        }
    
        // Draw foreground
        ctx.fillStyle = color;
        ctx.fillRect(-50,this.size.height/1.5, foregroundWidth, 10);

        this.regenTimer()
    }

    getStat(stat) {
        const passiveItem = this.inventory.data.items.find(item => item.constructor.name.toLowerCase() === `${stat}Item`.toLowerCase());
        let statValue = this.stats[stat] ?? 0;
    
        if (passiveItem) {
            statValue += passiveItem.getRawStat() ?? 0;
        }
    
        return statValue;
    }
    
    getStats() {

        const ret = {};

        var passiveItems = null;
        if(this.inventory){
            passiveItems = this.inventory.data.items.filter((item) => item.type === "Passive");
        }

        for (const statIndex in this.stats) {
            if (this.stats.hasOwnProperty(statIndex)) {
                var statValue = this.stats[statIndex];

                if(passiveItems){
                    const statItem = passiveItems.find((item) => item.constructor.name.toLowerCase() === `${statIndex}Item`.toLowerCase());
                    if(statItem){
                        statValue += statItem.getRawStat()
                    }
                }

                const type = statUnits[statIndex];
                
                switch (type) {
                    case 'percent':
                        statValue = `${statValue * 100}%`;
                        break;
                    case 'float':
                        statValue =  statValue.toFixed(2);
                        break;
                    case 'int':
                        statValue =  Math.floor(statValue)
                        break;
                    case 'seconds':
                        statValue = `${statValue / 1000}s`;
                        break;
                    default:
                        break;
                }
                
                ret[statIndex] = statValue;
            }
        }

        return ret;
    }

    setDirection() {
        if (uiActive) return;

        let reset = true;
        for (const dir in heldDirKeys) {
            if (heldDirKeys[dir]) {
                reset = false;
            }
        }

        if (!reset) {
            this.dir = { x: 0, y: 0 };
        }

        if (heldDirKeys.left) {
            this.dir.x = 1;
        } if (heldDirKeys.right) {
            this.dir.x = -1;
        }
        if (heldDirKeys.left && heldDirKeys.right) {
            this.dir.x = 0;
        }

        if (heldDirKeys.up) {
            this.dir.y = 1;
        } if (heldDirKeys.down) {
            this.dir.y = -1;
        }
        if (heldDirKeys.up && heldDirKeys.down) {
            this.dir.y = 0;
        }
    }

    attack() {
 
    }

    move(elapsed) {

        if (uiActive) return;

        const angle = Math.atan2(this.dir.y, this.dir.x);
        const playerPos = this.getCenterPos();

        const nextPosX = this.pos.x + Math.cos(angle) * this.stats.speed * elapsed;
        const nextPosY = this.pos.y + Math.sin(angle) * this.stats.speed * elapsed;

        const p = {
            x: playerPos.x - nextPosX,
            y: playerPos.y - nextPosY,
            w: this.size.width,
            h: this.size.height,
        };

        const collision = map.drawObstacles.some((obstacle) => doesCollide(p, obstacle));

        if (!collision) {
            this.pos = { x: nextPosX, y: nextPosY };
        }

        this.animate();
    }

    getHeadPos() {
        const angle = this.angle - Math.PI / 2;
        return {
            x: c.width / 2 + Math.cos(angle) * this.headOffset.x,
            y: c.height / 2 + Math.sin(angle) * this.headOffset.y,
        };
    }

    getTruePos() {
        const center = this.getHeadPos();
        return { x: center.x - this.pos.x, y: center.y - this.pos.y };
    }

    getCenterPos() {
        return {
            x: c.width / 2 - this.size.width / 2,
            y: c.height / 2 - this.size.height / 2,
        };
    }

    getAimingPos() {
        const headPos = this.getHeadPos();
        const aimingOffsetAmount = -10;
        const angle = Math.atan2(this.dir.y, this.dir.x);
        const aimingPos = {
            x: headPos.x + Math.cos(angle) * aimingOffsetAmount,
            y: headPos.y + Math.sin(angle) * aimingOffsetAmount,
        };
        return aimingPos;
    }
  setIdle(){
        switch(this.dir.x){
            case 0:
                this.img = this.images[0]
                break;
            case -1:
                this.img = this.images[1]
                break;
            case 1:
                this.img = this.images[2]
                break;
        }
        if(this.dir.y==1){this.img = this.images[3]}
    }
    animate(){
        const timePassed = new Date()-this.lastFrame
        const animationDelay = 100/this.stats.speed

        if(timePassed >= animationDelay){
            this.frame = !this.frame
            if(this.frame){
                switch(this.dir.x){
                    case 0:
                        this.img = this.images[8]
                        break;
                    case -1:
                        this.img = this.images[4]
                        break;
                    case 1:
                        this.img = this.images[6]
                        break;
                }
                if(this.dir.y==1){this.img = this.images[10]}
            }else{
                switch(this.dir.x){
                    case 0:
                        this.img = this.images[9]
                        break;
                    case -1:
                        this.img = this.images[5]
                        break;
                    case 1:
                        this.img = this.images[7]
                        break;
                }
                if(this.dir.y==1){this.img = this.images[11]}
            }
            this.lastFrame = new Date()

        }
    }


}

class Allah extends Player {
    constructor() {
        super();
    }
}

function doesCollide(player, obstacle) {
    return !(
        (player.y + player.h < obstacle.y) ||
        (player.y > obstacle.y + obstacle.h) ||
        (player.x + player.w < obstacle.x) ||
        (player.x > obstacle.x + obstacle.w)
    );
}
