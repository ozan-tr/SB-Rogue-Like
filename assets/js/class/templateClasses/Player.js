
class Player {
    constructor() {
        this.pos = { x: 0, y: 0 };

        this.stats = {
            speed: 0.5,
            strength: 1,
            defence: 0.05,
            luck: 0,
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
            amount: 0,
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

        this.dps = 0

        this._godbar = 0


    }

    suckXp() {
        renderedItems.forEach((item) => {
            if (item.vaccumable) {
                item.startSucking();
            }
        });
    }

    levelUp(){
        this.level+=1
        this.levelUpReq *= 2
        this.levelUpQueue+=1
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
        const crit = proc(critChance)
        const multiplier = crit ? critDamage : 1
        return {value:damage * multiplier,modifier:crit,knockBack:knockBack}
    }
    heal(amount){
        const maxHealth = this.getStat("maxHealth")
        new Text(amount,this.getTextPos(),3)
        this.health += amount
        if(this.health > maxHealth){
            this.health = maxHealth
        }
    }
    applyDamage(amount){
        amount = amount - (amount * this.getStat("defence"))
        if(amount < 0){amount = 0}

        const textPos = this.getTextPos()

        if(proc(this.getStat("evasion"))){
            new Text("Evaded",textPos,2)
            return
        }
        new Text(amount,textPos,0)
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
    getTextPos(){
        const truePos = this.getTruePos()
        return {x:truePos.x,y:truePos.y-this.size.height/2}
    }
    drawHealthBar(timestamp) {
        const barWidth = 100;
        const healthPercentage = this.health / this.getStat("maxHealth");
        var foregroundWidth = barWidth * healthPercentage;

        ctx.setTransform(1,0,0,1,0,0)

        let color;

        if(debug && debug.activeCheats.god){
            foregroundWidth = barWidth
           
            const colors = generateSmoothRainbowColors(timestamp);

            color = ctx.createLinearGradient(c.width/2 - barWidth,0, c.width/2+barWidth,0);
            for (let i = 0; i < colors.length; i++) {
                color.addColorStop( i / (colors.length - 1), colors[i]);
            }

        }else{
            if (healthPercentage >= 0.5) {
                color = 'green';
            } else if (healthPercentage >= 0.2) {
                color = 'yellow';
            } else {
                color = 'red';
            }
            

        }

        ctx.fillStyle = 'gray';
        ctx.fillRect(c.width/2-50,c.height/2+this.size.height/1.5, barWidth, 10);
    

        ctx.fillStyle = color;
        ctx.fillRect(c.width/2-50,c.height/2+this.size.height/1.5, foregroundWidth, 10);

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
                        statValue = `${(statValue * 100).toFixed(2)}%`;
                        break;
                    case 'float':
                        statValue =  statValue.toFixed(2);
                        break;
                    case 'int':
                        statValue =  "+"+Math.floor(statValue)
                        break;
                    case 'seconds':
                        statValue = `${(statValue / 1000).toFixed(2)}s`;
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
