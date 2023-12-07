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
                damage: 5,
                attackSpeed: 1,
                area: 0.5,
                amount: 1,
                duration: 1
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

        const timeOut = new Date();
        const lifeSpan = 3000 * stats.duration;

        let r = 10*stats.area;

        const currentDir = player.dir

        const angle = Math.atan2(-currentDir.y, -currentDir.x)

        
        const attackAnimation = setInterval(() => {
            r+=stats.attackSpeed;

            ctx.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);

            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.arc(0, 0, r, angle + Math.PI / 4, angle - Math.PI / 4, true);

            ctx.stroke();

            const lineLength =  r*2 / Math.sqrt(2)

            //console.log(Math.cos(angle), Math.sin(angle))

            if(currentDir.y != 0)
                var hitbox = {
                    x: -lineLength/2,
                    y: (-currentDir.y)*lineLength/2,
                    w: lineLength,
                    h: (currentDir.y*(r-lineLength)) * 0.75
                };   
            else{
                var hitbox = {
                    x: (-currentDir.x)*lineLength/2,
                    y: -lineLength/2,
                    w: (currentDir.x*(r-lineLength)) * 0.75,
                    h: lineLength
                };   
            } 

            const truePos = player.getTruePos();
            
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
