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
                area: 1,
                attackSpeed: 1,
                duration: 1,
                critChange: 0.05,
                critDamage: 3,
            }
        ];

        this.maxLevel = this.stats.length - 1;


        this.sprites = Array.from(document.getElementById("RedBull").children).sort((a, b) => { a.id[0] - b.id[0] })
    }
    attack() {
        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width;
        animationCanvas.height = c.height;

        
        const stats = this.stats[this.level];

        const size = stats.size * player.getStat("size");
        const attackSpeed = stats.attackSpeed * player.getStat("attackSpeed");
        const posionDuration = stats.duration * player.getStat("effectDuration");
        const area = stats.area * player.getStat("area") * 50;
        const lifeSpan = 2000

        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        const anim = animationCanvas.getContext("2d");

        const playerPos = player.getTruePos()

        const timeOut = new Date();


        const totalSprites = this.sprites.length

        var spriteIndex = 0

        var animTime = new Date()

        var angle;

        if (allMobs.length > 0) {
            var nearestMob = allMobs.sort((a, b) => { return a.distToPlayer - b.distToPlayer })[0]
            angle = Math.atan2(playerPos.y - nearestMob.pos.y, playerPos.x - nearestMob.pos.x)
            console.log("mobFound:" + angle)
        } else {
            angle = Math.atan2(Math.floor((Math.random() * 2) - 1), Math.floor(Math.random() * 3) - 1)
            console.log("noMob:" + angle)
        }

        var pos = { x: 0, y: 0 }

        var howManyHits = 0;

        console.log(area)

        var attackAnimation = setInterval(() => {


            const animSpeed = 1000 / (attackSpeed * totalSprites)

            if (new Date() - animTime > animSpeed) {
                spriteIndex++
                if (spriteIndex > totalSprites - 1) { spriteIndex = 0 }
                animTime = new Date()
            }



            const sprite = this.sprites[spriteIndex]

            pos.x -= Math.cos(angle) * attackSpeed * 2;
            pos.y -= Math.sin(angle) * attackSpeed * 2;

            const x = pos.x - sprite.width * size / 2;
            const y = pos.y - sprite.height * size / 2;

            const relativePos = { x: playerPos.x + player.pos.x, y: playerPos.y + player.pos.y }

            anim.setTransform(1, 0, 0, 1, relativePos.x, relativePos.y);
            anim.clearRect(-relativePos.x, -relativePos.y, c.width, c.height);

            anim.save()

            anim.translate(x, y)
            anim.rotate(angle)

            anim.drawImage(sprite, 0, 0, sprite.width * size, sprite.height * size);

            anim.restore()

            const hitbox = {
                x: playerPos.x + x,
                y: playerPos.y + y,
                w: sprite.width * size,
                h: sprite.height * size
            };

            howManyHits = this.checkHit(hitbox);

            if (howManyHits > 0) {
                anim.clearRect(-relativePos.x, -relativePos.y, c.width, c.height);
                posionAttack(x,y,this)
            }

            if (new Date() - timeOut > lifeSpan) {
                anim.clearRect(-relativePos.x, -relativePos.y, c.width, c.height);
                posionAttack(x,y,this)
            }
        }, 10);

        function posionAttack(x,y,weapon){
            clearInterval(attackAnimation);

            const bubbleTime = 200;
            var lastBubble = new Date();

            const bubbleNum = 20;
            
            var bubblePos = []

            const bubbleRange = area*0.75

            for(let i = 0; i < bubbleNum; i++){
                bubblePos.push({x:Math.floor(Math.random()*bubbleRange*2-bubbleRange),y:Math.floor(Math.random()*bubbleRange*2-bubbleRange)})
            }

            attackAnimation = setInterval(() => {

                const relativePos = { x: playerPos.x + player.pos.x, y: playerPos.y + player.pos.y }

                anim.setTransform(1, 0, 0, 1, relativePos.x, relativePos.y);
                anim.clearRect(-relativePos.x, -relativePos.y, c.width, c.height);

                anim.save()
                anim.translate(x, y)
                anim.beginPath();
                anim.arc(0, 0, area, 0, Math.PI * 2);
                anim.fillStyle = "rgba(0,200,100,0.2)"; 
                anim.fill();

                for(let i = 0; i < bubbleNum; i++){
                    anim.beginPath();
                    anim.arc(bubblePos[i].x,bubblePos[i].y, 2, -Math.PI, 0)
                    anim.strokeStyle = "black"; 
                    anim.stroke();
                }

                anim.restore()

                if(new Date()-lastBubble > bubbleTime){
                    lastBubble = new Date();
                    bubblePos=[]
                    for(let i = 0; i < bubbleNum; i++){
                        bubblePos.push({x:Math.floor(Math.random()*bubbleRange*2-bubbleRange),y:Math.floor(Math.random()*bubbleRange*2-bubbleRange)})
                    }
                }

                console.log(playerPos.x + x, playerPos.y + y, area)

                weapon.checkHitCircular({
                    x: playerPos.x + x,
                    y: playerPos.y + y,
                    r: area
                })


            }, 10);
            setTimeout(() => {
                clearInterval(attackAnimation);
                animationCanvas.remove();
            }, posionDuration * 3000);
        }
    }
}
