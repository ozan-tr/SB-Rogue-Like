class Raket extends WeaponBase {
    constructor() {
        super(
            "Raket",
            'an "Accident"',
            "Throwable",
            2
        );
        this.stats = [
            {
                damage: 5,
                attackSpeed: 1,
                duration: 1,
                piercing:2,
                critChange:0.05,
                critDamage: 3
            },
            {
                damage: 5,
                attackSpeed: 1.1,
                duration: 1,
                piercing:4,
                critChange:0.05,
                critDamage: 3
            },
            {
                damage: 7,
                attackSpeed: 1.2,
                duration: 1,
                piercing:6,
                critChange:0.05,
                critDamage: 3
            },
            {
                damage: 10,
                attackSpeed: 1.3,
                duration: 1,
                piercing:8,
                critChange:0.05,
                critDamage: 3
            },
        ];

        this.maxLevel = this.stats.length - 1;
    }
    attack() {
        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width;
        animationCanvas.height = c.height;

        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        const anim = animationCanvas.getContext("2d");

        const playerPos = player.getHeadPos();
        anim.setTransform(1, 0, 0, 1, playerPos.x, playerPos.y);

        const stats = this.stats[this.level];


        const timeOut = new Date();
        const lifeSpan = 3000 * stats.duration;

        const currentDir = player.dir

        const sprite = document.getElementById("Raket.png").children[0];
        const damagedSprite = document.getElementById("RaketCrushed.png").children[0];

        const angle = Math.atan2(-currentDir.y, -currentDir.x)

        var pos = { x: 0, y: 0 }

        var howManyHits = 0;
        
        const attackAnimation = setInterval(() => {

            pos.x += Math.cos(angle) * stats.attackSpeed *2;
            pos.y += Math.sin(angle) * stats.attackSpeed * 2;

            const x = pos.x - sprite.width/2;
            const y = pos.y - sprite.height/2;

            anim.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);

            anim.save()

            anim.translate(x, y)
            anim.rotate(angle + Math.PI/2)

            if(howManyHits >= stats.piercing/2){
                anim.drawImage(damagedSprite, 0,0, sprite.width, sprite.height);
            }else{
                anim.drawImage(sprite, 0,0, sprite.width, sprite.height);
            }

            anim.restore()

            const truePos = player.getTruePos();

            const hitbox = { 
                x:truePos.x + x, 
                y:truePos.y + y, 
                w: sprite.width, 
                h: sprite.height
            };

            howManyHits += this.checkHit(hitbox);

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