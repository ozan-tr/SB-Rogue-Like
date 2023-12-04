class BBB extends WeaponBase {
    constructor() {

        super(
            "BBB",
            "Büyük Beyaz Bok",
            "Area",
            5,
            0,
            9
        );
        this.stats = [
            {
                damage: 10,
                attack_speed: 1,
                area: 2,
                amount: 3
            },
            {
                damage: 10,
                attack_speed: 1,
                area: 2,
                amount: 4
            },
            {
                damage: 15,
                attack_speed: 1.5,
                area: 3,
                amount: 5
            },
            {
                damage: 15,
                attack_speed: 1.5,
                area: 3,
                amount: 6
            }
        ];
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

                const x = Math.cos(degOffset) * area -sprite.height/2;
                const y = Math.sin(degOffset) * area -sprite.width/2;
    
                ctx.drawImage(sprite, x, y, sprite.width, sprite.height);
    
                this.checkHit({
                    x: truePos.x+x,
                    y: truePos.y+y,
                    w: sprite.width,
                    h: sprite.height,
                })

            }

          
            rad += 0.01 * stats.attack_speed;
        }, 10);
    }
    
}
