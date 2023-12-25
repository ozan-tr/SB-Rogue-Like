
/**
 * Represents a base item.
 * @class
 */
class ItemBase {
    /**
     * Creates an instance of ItemBase.
     * @constructor
     * @param {string} name - The name of the item.
     * @param {string} description - The description of the item.
     * @param {string} rarity - The rarity of the item.
     */
    constructor(name, description, rarity) {
        this.name = name;
        this.rarity = rarity;
        this.description = description;
        this.stats = [];
        this.overLeveling = false;
        this.level = 0;
    }

    /**
     * Gets the stats of the item at the current level.
     * @returns {Object} - The stats of the item.
     */
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

    /**
     * Gets the value of a specific stat of the item at the current level.
     * @param {string} stat - The name of the stat.
     * @returns {number} - The value of the stat.
     */
    getStat(stat) {
        return this.stats[this.level][stat];
    }

    /**
     * Checks if the item can be leveled up.
     * @returns {boolean} - True if the item can be leveled up, false otherwise.
     */
    canLevelUp() {
        return this.level < this.maxLevel || this.overLeveling;
    }

    /**
     * Levels up the item.
     * @returns {boolean} - True if the item was leveled up, false otherwise.
     */
    levelUp() {
        if (this.level >= this.maxLevel) {
            if (this.overLeveling) {
                this.stats[this.level + 1] = this.fixedImprovement;
                this.level += 1;
            } else {
                return false;
            }
        } else {
            this.level += 1;
        }
    }

    /**
     * Gets the improvement in stats when leveling up the item.
     * @returns {Object} - The improvement in stats.
     */
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

/**
 * Represents a base passive item.
 * @class
 * @extends ItemBase
 */
class PassiveBase extends ItemBase {
    /**
     * Creates an instance of PassiveBase.
     * @constructor
     * @param {string} name - The name of the passive item.
     * @param {string} description - The description of the passive item.
     * @param {string} rarity - The rarity of the passive item.
     */
    constructor(name, description, rarity) {
        super(name, description, rarity);
        this.type = "Passive";
        this.img = `url(assets/img/passives/${this.constructor.name}.png)`;
        this.imgElement = new Image(40, 40);
        this.imgElement.src = `assets/img/passives/${this.constructor.name}.png`;
        this.imgElement.onerror = () =>{
            this.imgElement.src="assets/img/placeholder.png"
        }
    }

    /**
     * Gets the raw stats of the passive item at the current level.
     * @returns {Object} - The raw stats of the passive item.
     */
    getRawStat() {
        return this.stats[this.level];
    }
}

/**
 * Represents a base weapon item.
 * @class
 * @extends ItemBase
 */
class WeaponBase extends ItemBase {
    /**
     * Creates an instance of WeaponBase.
     * @constructor
     * @param {string} name - The name of the weapon item.
     * @param {string} description - The description of the weapon item.
     * @param {string} type - The type of the weapon item.
     * @param {string} rarity - The rarity of the weapon item.
     */
    constructor(name, description, type, rarity) {
        super(name, description, rarity);
        this.lastAttack = new Date();
        this.previousTimeStamp = 0;
        this.baseCooldown = 2000;
        this.type = type;
        this.img = `url(assets/img/weapons/${this.name.replace(" ", "")}.png)`;
        this.imgElement = new Image(40, 40);
        this.imgElement.src = `assets/img/weapons/${this.name.replace(" ", "")}.png`;
    }

    /**
     * Performs an attack with the weapon.
     */
    attack() {
        // TODO: Implement attack logic
    }

    /**
     * Checks if the weapon hits any mobs within a certain range.
     * @param {Object} hitbox - The hitbox of the weapon.
     * @param {number} hitbox.x - The x-coordinate of the hitbox.
     * @param {number} hitbox.y - The y-coordinate of the hitbox.
     * @param {number} hitbox.w - The width of the hitbox.
     * @param {number} hitbox.h - The height of the hitbox.
     * @returns {number} - The number of mobs hit.
     */
    checkHit(hitbox) {
        const truePos = player.getTruePos();

        var howManyHits = 0;

        renderedMobs.forEach((mob) => {
            if(!mob.immovable){
                const dx = truePos.x - mob.pos.x;
                const dy = truePos.y - mob.pos.y;
                const distance = Math.hypot(dx, dy);
    
                if (distance < 500) {
                    const mobPos = { x: mob.pos.x, y: mob.pos.y, w: mob.size.width, h: mob.size.height };
                    if (doesCollide(hitbox, mobPos)) {
                        if (mob.applyDamage(player.getDamage(this), hitbox)) {
                            howManyHits++;
                        }
                    }
                }
            }
        });

        return howManyHits;
    }

    /**
     * Checks if the weapon hits any mobs within a circular range.
     * @param {Object} hitbox - The hitbox of the weapon.
     * @param {number} hitbox.x - The x-coordinate of the hitbox.
     * @param {number} hitbox.y - The y-coordinate of the hitbox.
     * @param {number} hitbox.r - The radius of the hitbox.
     * @returns {number} - The number of mobs hit.
     */
    checkHitCircular(hitbox) {
        var howManyHits = 0;

        renderedMobs.forEach((mob) => {
            if(!mob.immovable){
                const dx = hitbox.x - mob.pos.x;
                const dy = hitbox.y - mob.pos.y;
                const distance = Math.hypot(dx, dy);
    
                if (distance < hitbox.r) {
                    if (mob.applyDamage(player.getDamage(this), hitbox)) {
                        howManyHits++;
                    }
                }
            }
        });

        return howManyHits;
    }
    createAnimationCanvas(){
        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width;
        animationCanvas.height = c.height;

        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        const anim = animationCanvas.getContext("2d");

        return {anim:anim, animationCanvas:animationCanvas}

    }
}

