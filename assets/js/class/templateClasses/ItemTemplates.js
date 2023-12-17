
class ItemBase {
    constructor(name, description, rarity) {
        this.name = name;
        this.rarity = rarity;
        this.description = description;
        this.stats = [];
        this.overLeveling = false;
        this.level = 0;
    }

    getStats() {
        const ret = {};

        for (const statIndex in this.stats[this.level]) {
            if (this.stats[this.level].hasOwnProperty(statIndex)) {
                const statValue = this.stats[this.level][statIndex];
                const statName = (statIndex.charAt(0).toUpperCase() + statIndex.slice(1)).replace("_", " ");
                ret[statName] = statValue;
            }
        }

        return ret;
    }

    getStat(stat) {
        return this.stats[this.level][stat];
    }
    canLevelUp() {
        return this.level < this.maxLevel || this.overLeveling;
    }

    levelUp() {
        if(this.level >= this.maxLevel){
            if(this.overLeveling){
                this.stats[this.level+1] = this.fixedImprovement
                this.level += 1;
            }else{
                return false;
            }
        }else{
            this.level += 1;
        }
    }

    improvementInfo() {
        const oldStats = this.getStats();
        const ret = {};

        for (const statIndex in this.stats[this.level + 1]) {
            if (this.stats[this.level + 1].hasOwnProperty(statIndex)) {
                const statValue = this.stats[this.level + 1][statIndex];
                const statName = (statIndex.charAt(0).toUpperCase() + statIndex.slice(1)).replace("_", " ");
                const change = statValue - oldStats[statName];
                const statChange = change > 0 ? `${oldStats[statName]} <span style="color:green"><b>(+${change})</b></span>` : oldStats[statName];
                ret[statName] = statChange;
            }
        }

        return ret;
    }
}

class PassiveBase extends ItemBase {
    constructor(name, description, rarity) {
        super(name, description, rarity);
        this.type = "Passive";
        this.img = `url(assets/img/weapons/${this.constructor.name}.png)`;
        this.imgElement = new Image(40,40)
        this.imgElement.src = `assets/img/weapons/${this.constructor.name}.png`
    }
    getRawStat() {
        return this.stats[this.level];
    }

}

class WeaponBase extends ItemBase {
    constructor(name, description, type, rarity) {
        super(name, description, rarity);
        this.lastAttack = new Date();
        this.previousTimeStamp = 0;
        this.baseCooldown = 2000;
        this.type = type;
        this.img = `url(assets/img/weapons/${this.name.replace(" ", "")}.png)`;
        this.imgElement = new Image(40,40)
        this.imgElement.src = `assets/img/weapons/${this.name.replace(" ", "")}.png`
    }

    attack() {
        // TODO: Implement attack logic
    }

    checkHit(hitbox) {
        const truePos = player.getTruePos();

        var howManyHits = 0;

        allMobs.forEach((mob) => {
            const dx = truePos.x - mob.pos.x;
            const dy = truePos.y - mob.pos.y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < 500) {
                const mobPos = { x: mob.pos.x, y: mob.pos.y, w: mob.size.width, h: mob.size.height };
                if (doesCollide(hitbox, mobPos)) {
                    if(mob.applyDamage(player.getDamage(this),hitbox)){
                        howManyHits++
                    };
                }
            }
        });

        return howManyHits;

    }

    /**checkHitCircular(hitbox)
    *   @param {Object} hitbox
    *   @param {Number} hitbox.x
    *   @param {Number} hitbox.y
    *   @param {Number} hitbox.r
    **/
    checkHitCircular(hitbox) {
        var howManyHits = 0;

        allMobs.forEach((mob) => {
            const dx = hitbox.x - mob.pos.x;
            const dy = hitbox.y - mob.pos.y;
            const distance = Math.hypot(dx, dy);
            
            if (distance < hitbox.r) {
                    if(mob.applyDamage(player.getDamage(this),hitbox)){
                        howManyHits++
                    };
            }
        });

        return howManyHits;

    }
}

function doesCollide(hitbox, mob) {
    return !(
        (hitbox.y + hitbox.h < mob.y) ||
        (hitbox.y > mob.y + mob.h) ||
        (hitbox.x + hitbox.w < mob.x) ||
        (hitbox.x > mob.x + mob.w)
    );
}
