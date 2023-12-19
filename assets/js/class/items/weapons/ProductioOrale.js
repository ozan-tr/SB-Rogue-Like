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
                damage: 10,
                attackSpeed: 5,
                area: 5,
                amount: 2,
                duration: 2,
            }
        ];

        this.maxLevel = this.stats.length - 1;

    }

    attack() {
        const {anim, animationCanvas} = this.createAnimationCanvas();


        const playerPos = player.getTruePos();

        const stats = this.stats[this.level];

        const timeOut = new Date();
        const lifeSpan = 3000 * stats.duration;

        let r = 10*stats.area;

        const currentDir = player.dir

        const angle = Math.atan2(-currentDir.y, -currentDir.x)

        
        const attackAnimation = setInterval(() => {
            r+=stats.attackSpeed;

            const relativePos = {x:playerPos.x+player.pos.x,y:playerPos.y+player.pos.y}

            anim.setTransform(1, 0, 0, 1, relativePos.x, relativePos.y);

            anim.clearRect(-relativePos.x, -relativePos.y, c.width, c.height);

            anim.beginPath();
            anim.strokeStyle = "white";
            anim.lineWidth = 5;
            anim.lineCap = "round";
            anim.arc(0, 0, r, angle + Math.PI / 4, angle - Math.PI / 4, true);

            anim.stroke();

            const lineLength =  r*2 / Math.sqrt(2)


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
            
            this.checkHit({
                x: hitbox.x,
                y: hitbox.y,
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
