class RedBull extends WeaponBase {
    constructor() {
        super(
            "Red Bull",
            'jizz',
            "Magic",
            2
        );
        this.stats = [
            {
                damage: 5,
                size: 1,
                attackSpeed: 1,
                duration: 1,
                critChange: 0.05,
                critDamage: 3,
            }
        ];

        this.maxLevel = this.stats.length - 1;

        this.sprite = document.querySelector("RedBull").children.sor((a,b)=>{a.id[0]-b.id[0]})
    }
    attack() {
        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width;
        animationCanvas.height = c.height;

        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        const anim = animationCanvas.getContext("2d");

        const playerPos = player.getTruePos();

        const stats = this.stats[this.level];

        const timeOut = new Date();
        const lifeSpan = 3000 * stats.duration;

        var angle;

        if(allMobs.length > 0){
            const nearestMob = allMobs.sort((a,b)=>{
                Math.hypot(playerPos.x - a.pos.x,playerPos - a.pos.y) - Math.hypot(playerPos.x - b.pos.x,playerPos.y - b.pos.y)
            })[0]

            angle = Math.atan2(playerPos.x-nearestMob.pos.x, playerPos.y-nearestMob.pos.y)
            console.log("mobFound:"+angle)
        }else{
            angle = Math.atan2((Math.random*2)-1, (Math.random*2)-1)
            console.log("noMob:"+angle)
        }

        var pos = { x: 0, y: 0 }

        var howManyHits = 0;

        const attackAnimation = setInterval(() => {
            const relativePos = { x: playerPos.x + player.pos.x, y: playerPos.y + player.pos.y }

            anim.setTransform(1, 0, 0, 1, relativePos.x, relativePos.y);

            pos.x += Math.cos(angle) * stats.attackSpeed * 2;
            pos.y += Math.sin(angle) * stats.attackSpeed * 2;

            const x = pos.x - sprite.width / 2;
            const y = pos.y - sprite.height / 2;

            anim.clearRect(-relativePos.x, -relativePos.y, c.width, c.height);

            anim.save()

            anim.translate(x, y)
            anim.rotate(angle + Math.PI / 2)



            anim.restore()

            const truePos = player.getTruePos();

            const hitbox = {
                x: truePos.x + x,
                y: truePos.y + y,
                w: sprite.width,
                h: sprite.height
            };

            this.checkHit(hitbox);

            if (howManyHits >= stats.piercing) {
                clearInterval(attackAnimation);
                document.getElementsByClassName("mainContainer")[0].removeChild(animationCanvas);
            }

            if (new Date() - timeOut > lifeSpan) {
                clearInterval(attackAnimation);
                document.getElementsByClassName("mainContainer")[0].removeChild(animationCanvas);
            }
        }, 10);
    }
}
