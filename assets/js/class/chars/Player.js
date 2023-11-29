class Player {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.stats = {
            speed: 1,
            strength: 1,
            defence: 1,
            luck: 1.5,
            attack_speed: 1,
            pickUpRange: 50,
        };

        this.images = Array.from(document.getElementById(this.constructor.name).children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.size = { width: 40, height: 60 };
        this.dir = { x: 0, y: 0 };
        this.angle = 0;
        this.heldDirKeys = [];

        this.startingWeapon = "TestSword"

        console.log(this.getStats());
    }

    suckXp() {
        allItems.forEach((item) => {
            if (item.vaccumable) {
                item.startSucking();
            }
        });
    }

    attackTick(ctx) {
        this.inventory.data.weapons.forEach((weapon) => {
            if (new Date() - weapon.lastAttack > 2000) {
                const howMany = weapon.getStat("amount") || 1;
                if (howMany) {
                    let n = 0;
                    const multiFire = setInterval(() => {
                        if (n === howMany) {
                            clearInterval(multiFire);
                            return;
                        }
                        weapon.attack(ctx);
                        n++;
                    }, 100);
                }
                weapon.lastAttack = new Date();
            }
        });
    }

    getStats() {
        const ret = {};

        for (const statIndex in this.stats) {
            if (this.stats.hasOwnProperty(statIndex)) {
                const statValue = this.stats[statIndex] * 100;
                const statName = statIndex.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
                ret[statName] = statValue + '%';
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

    move() {
        if (uiActive) return;

        const angle = Math.atan2(this.dir.y, this.dir.x);
        const playerPos = this.getCenterPos();

        const nextPosX = this.pos.x + Math.cos(angle) * this.stats.speed;
        const nextPosY = this.pos.y + Math.sin(angle) * this.stats.speed;

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

    animate() {
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
