class ProductionOrale extends WeaponBase {
    constructor() {
        super(
            "Production Orale",
            "u e e e e e e e ",
            "Magic",
            2
        );
        this.stats = [
            {
                attackSpeed: 5,
                area: 5,
                amount: 5
            },
            {
                attackSpeed: 5,
                area: 5,
                amount: 10
            }
        ];

        this.maxLevel = this.stats.length - 1;

    }

    attack(ctx) {

        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width;
        animationCanvas.height = c.height;

        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        ctx = animationCanvas.getContext("2d");

        const playerPos = player.getHeadPos();
        ctx.setTransform(1, 0, 0, 1, playerPos.x, playerPos.y);

        const stats = this.stats[this.level];
        const baseHeight = 10;
        const baseReach = 60;

        const timeOut = new Date();
        const lifeSpan = 3000;

        let r = 0;



        const attackAnimation = setInterval(() => {
            r++;

            ctx.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);

            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.arc(0, 0, r, angle + Math.PI / 4, angle - Math.PI / 4, true);

            ctx.stroke();

            const lineLength =  r*2 / Math.sqrt(2)

            //console.log(Math.cos(angle), Math.sin(angle))

            var hitbox = {
                x: Math.cos(angle) - lineLength/2,
                y: Math.sin(angle) - lineLength/2,
                w: lineLength,
                h: lineLength
            };

            const truePos = player.getTruePos();

            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
            
            this.checkHit({
                x: truePos.x + hitbox.x,
                y: truePos.y + hitbox.y,
                w: hitbox.w,
                h: hitbox.h
            });

            if (new Date() - timeOut > lifeSpan) {
                animationCanvas.remove();
                clearInterval(attackAnimation);
            }
        }, 10);
    }
}
