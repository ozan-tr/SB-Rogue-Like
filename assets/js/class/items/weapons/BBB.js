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

        const {anim, animationCanvas} = this.createAnimationCanvas();

        const playerPos = player.getHeadPos();

        anim.setTransform(1, 0, 0, 1, playerPos.x, playerPos.y);

        const sprite = document.getElementById("BBB_P").children[0];

        console.log(sprite)

        var rad = 0;

        attackAnimation = setInterval(() => {

            if(gamePaused) return

            const stats = this.stats[this.level];

            const area = player.getStat("range") * stats.range * 50;
            const amount = stats.amount + player.getStat("amount")
            const size = stats.size * player.getStat("size");
            const attackSpeed = stats.attackSpeed * player.getStat("attackSpeed");

            anim.clearRect(-playerPos.x, -playerPos.y, c.width, c.height);
            const offset = (Math.PI*2/amount);

            const truePos = player.getTruePos();

            for(var i=0;i<amount;i++){

                const degOffset = rad + offset*i

                const x = Math.cos(degOffset) * area-sprite.height/2*size;
                const y = Math.sin(degOffset) * area-sprite.width/2*size;
    
                anim.drawImage(sprite, x, y, sprite.width*size, sprite.height*size);
    
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
