class Biyique extends WeaponBase {
    constructor() {
        super(
            "Biyique",
            "The greatest moustache in the world",
            "Whip",
            5
        );
        this.stats = [
            {
                damage: 5,
                attackSpeed: 1,
                area: 2
            },
            {
                damage: 10,
                attackSpeed: 1,
                area: 2
            },
            {
                damage: 15,
                attackSpeed: 1.5,
                area: 2
            },
            {
                damage: 15,
                attackSpeed: 1.5,
                area: 3
            }
        ];
        this.maxLevel = this.stats.length - 1;

    }

    attack() {
        const {anim, animationCanvas} = this.createAnimationCanvas();

        const playerPos = player.getHeadPos();

        anim.setTransform(1, 0, 0, 1, playerPos.x, playerPos.y);

        const stats = this.stats[this.level];
        const baseHeight = 10;
        const baseReach = 60;

        let dots = [];
        let curveHeight = 10;
        const hitBox = { x: 0, h: baseHeight * stats.area, r: baseReach * stats.area };
        let phase = false;

        const attackAnimation = setInterval(() => {
            if (!phase) {
                if (hitBox.x < hitBox.r) {
                    hitBox.x += stats.attackSpeed * 5;
                    dots.push({
                        x: hitBox.x,
                        y: hitBox.h / 3 + Math.sin(hitBox.x) - curveHeight + 10
                    });
                    curveHeight *= 0.5;
                } else {
                    phase = true;
                }
            } else {
                if (hitBox.x > 0) {
                    hitBox.x -= stats.attackSpeed * 10;
                } else {
                    dots.pop();
                }
            }

            if (dots.length === 0) {
                animationCanvas.remove();
                clearInterval(attackAnimation);
            }

            anim.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);

            const truePos = player.getTruePos();

            this.checkHit({
                x: truePos.x - hitBox.x,
                y: truePos.y + hitBox.h / 2,
                w: hitBox.x * 2,
                h: hitBox.h
            });

            anim.fillStyle = "#3A200F";

            dots.forEach((dot, i) => {
                anim.beginPath();
                anim.arc(dot.x, dot.y, hitBox.h / (i + 20) * 5, 0, Math.PI * 2);
                anim.fill();

                anim.beginPath();
                anim.arc(-dot.x, dot.y, hitBox.h / (i + 20) * 5, 0, Math.PI * 2);
                anim.fill();
            });
        }, 10);
    }
}
