ItemId = []


class ItemBase{
    constructor(name,description,rarity){
        this.name = name
        this.rarity = rarity
        this.description = description
        this.stats = []
    }
    getStats(){
        var ret = {}

        for(const statIndex in this.stats[this.level]){
            const statValue = this.stats[this.level][statIndex]
            const statName = (statIndex.charAt(0).toUpperCase() + statIndex.slice(1)).replace("_"," ")
            ret[statName] = statValue
        }

        return ret;
    }
    getStat(stat){
        return this.stats[this.level][stat]
    }
    levelUp(){
        this.level +=1;
    }
    improvementInfo(){

        var oldStats = this.getStats();

        var ret = {}

        for(const statIndex in this.stats[this.level+1]){
            const statValue = this.stats[this.level+1][statIndex]
            const statName = (statIndex.charAt(0).toUpperCase() + statIndex.slice(1)).replace("_"," ")
            const change = statValue - oldStats[statName]
            const statChange = change > 0 ? `${oldStats[statName]} <span style="color:green"><b>(+${change})</b></span>` : oldStats[statName]
            ret[statName] = statChange
        }

        return ret;
    }
}

class WeaponBase extends ItemBase{
    constructor(name,description,type,rarity,level,maxLevel){
        super(name,description,rarity)
        this.level = level;
        this.maxLevel = maxLevel;
        this.lastAttack = new Date();
        this.baseCooldown = 2000;
        this.type=type
        this.hitBox = {x:0,y:0,r:0}
        this.img=`url(assets/img/weapons/${this.name.replace(" ","_")}.png)`
    }
    attack(){

    }
    checkHit(hitbox){
        const truePos = player.getTruePos()

        allMobs.forEach((mob)=>{
            const dx = truePos.x - mob.pos.x;
            const dy = truePos.y - mob.pos.y;
            const distance = Math.hypot(dx, dy);

            if(distance < hitbox.w){
                const mobPos={x:mob.pos.x,y:mob.pos.y,w:mob.size.width,h:mob.size.height}
                if(doesCollide(hitbox,mobPos)){
                    console.log("Hit")
                }
            }

        })
    }
}

function doesCollide(hitbox, mob) {
    return !(
        ((hitbox.y + hitbox.h) < (mob.y)) ||
        (hitbox.y > (mob.y + mob.h)) ||
        ((hitbox.x + hitbox.w) < mob.x) ||
        (hitbox.x > (mob.x + mob.w))
    );
}
