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
                knockBack:0,
            }
        ];

        this.maxLevel = this.stats.length - 1;


        this.sprites = Array.from(document.getElementById("RedBull_P").children).sort((a, b) => { a.id[0] - b.id[0] })
    }
    attack() {
        const {anim, animationCanvas} = this.createAnimationCanvas();
        
        const stats = this.stats[this.level];

        const size = stats.size * player.getStat("size");
        const attackSpeed = stats.attackSpeed * player.getStat("attackSpeed");
        const posionDuration = stats.duration * player.getStat("effectDuration");
        const area = stats.area * player.getStat("area") * 50;
        const lifeSpan = 2000


        const playerPos = player.getTruePos()

        const timeOut = new Date();


        const totalSprites = this.sprites.length

        var spriteIndex = 0

        var animTime = new Date()

        var angle;

        const nearMobs = renderedMobs.filter(mob => {
            return Math.sqrt(Math.pow(mob.pos.x - playerPos.x, 2) + Math.pow(mob.pos.y - playerPos.y, 2)) < 1000
        })

        if (nearMobs.length > 0) {
            var nearestMob = nearMobs.sort((a, b) => { return a.distToPlayer - b.distToPlayer })[0]
            angle = Math.atan2(playerPos.y - nearestMob.pos.y, playerPos.x - nearestMob.pos.x)
        } else {
            angle = Math.atan2(Math.floor((Math.random() * 3) - 1), Math.floor(Math.random() * 3) - 1)
        }

        var pos = { x: 0, y: 0 }

        var howManyHits = 0;

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

                weapon.checkHitCircular({
                    x: playerPos.x + x,
                    y: playerPos.y + y,
                    r: area
                })


            }, 10);
            setTimeout(() => {
                clearInterval(attackAnimation);
                animationCanvas.remove();
            }, posionDuration * 1000);
        }
    }
}
