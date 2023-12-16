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
                damage: 20,
                attackSpeed: 0.04,
                range: 2,
                amount: 3,
                size: 1,
                critDamage:2,
                critChance:0.1,
                knockBack: 25,
            },
            {
                damage: 20,
                attackSpeed: 0.04,
                range: 2,
                amount: 3,
                size: 1,
                critDamage:2,
                critChance:0.1,
                knockBack: 25,
            },
            {
                damage: 5,
                attackSpeed: 0.04,
                range: 2,
                amount: 3,
                size: 1,
                critDamage:2,
                critChance:0.1,
                knockBack: 25,
            },
            {
                damage: 5,
                attackSpeed: 0.04,
                range: 2,
                amount: 3,
                size: 1,
                critDamage:2,
                critChance:0.1,
                knockBack: 25,
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

            if(gamePaused) return

            const stats = this.stats[this.level];

            const area = player.getStat("range") * stats.range * 50;
            const amount = stats.amount + player.getStat("amount")
            const size = stats.size * player.getStat("size");
            const attackSpeed = stats.attackSpeed * player.getStat("attackSpeed");

            ctx.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);
            const offset = (Math.PI*2/amount);

            const truePos = player.getTruePos();

            for(var i=0;i<amount;i++){

                const degOffset = rad + offset*i

                const x = Math.cos(degOffset) * area-sprite.height/2*size;
                const y = Math.sin(degOffset) * area-sprite.width/2*size;
    
                ctx.drawImage(sprite, x, y, sprite.width*size, sprite.height*size);
    
                this.checkHit({
                    x: truePos.x+x,
                    y: truePos.y+y,
                    w: sprite.width*size,
                    h: sprite.height*size,
                })

            }

          
            rad += attackSpeed;
        }, 10);
    }
    
}
