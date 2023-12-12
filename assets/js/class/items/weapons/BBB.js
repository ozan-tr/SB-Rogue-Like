class BBB extends WeaponBase {
    constructor() {

        super(
            "BBB",
            "Büyük Beyaz Bok",
            "Area",
            5
        );
        this.stats = [
            {
                damage: 1,
                attackSpeed: 0.04,
                area: 2,
                amount: 3,
                size: 1,
                critDamage:2,
                critChance:0.1,
                knockBack: 25,
            },
            {
                damage: 10,
                attackSpeed: 0.1,
                area: 2,
                size: 1.5,
                amount: 4
            },
            {
                damage: 15,
                attackSpeed: 1.5,
                area: 3,
                size: 2,
                amount: 5
            },
            {
                damage: 15,
                attackSpeed: 1.5,
                area: 3,
                amount: 6
            }
        ];
        this.maxLevel = this.stats.length - 1;
    }

    attack() {

        var attackAnimation = undefined

        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width;
        animationCanvas.height = c.height;

        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        const ctx = animationCanvas.getContext("2d");

        const playerPos = player.getHeadPos();

        ctx.setTransform(1, 0, 0, 1, playerPos.x, playerPos.y);

        const sprite = document.getElementById("BBB.png").children[0];

        var rad = 0;

        attackAnimation = setInterval(() => {

            const stats = this.stats[this.level];
            const area = 50*stats.area

            ctx.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);
            const offset = (Math.PI*2/stats.amount);

            const truePos = player.getTruePos();

            for(var i=0;i<stats.amount;i++){

                const degOffset = rad + offset*i

                const x = Math.cos(degOffset) * area-sprite.height/2*stats.size;
                const y = Math.sin(degOffset) * area-sprite.width/2*stats.size;
    
                ctx.drawImage(sprite, x, y, sprite.width*stats.size, sprite.height*stats.size);
    
                this.checkHit({
                    x: truePos.x+x,
                    y: truePos.y+y,
                    w: sprite.width*stats.size,
                    h: sprite.height*stats.size,
                })

            }

          
            rad += player.getStat("attackSpeed") * stats.attackSpeed;
        }, 10);
    }
    
}
