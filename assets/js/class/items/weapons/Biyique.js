
class Biyique extends WeaponBase {
    constructor(){
        super(
            "Bıyıque",
            "The greatest moustache in the world",
            "Whip",
            5,
            0,
            9
        )
        this.stats = [
            {
                damage: 5,
                attack_speed: 1,
                area:2
            },
            {
                damage: 10,
                attack_speed: 1,
                area:2
            },
            {
                damage: 15,
                attack_speed: 1.5,
                area:2
            },
            {
                damage: 15,
                attack_speed: 1.5,
                area:3
            },

        ]
    }
    attack(){
        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width
        animationCanvas.height = c.height
        
        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        const ctx = animationCanvas.getContext("2d");

        const playerPos = player.getHeadPos()

        ctx.setTransform(1,0,0,1,playerPos.x,playerPos.y);
        
        const stats = this.stats[this.level]
        const baseHeight = 10
        const baseReach = 60

        let dots = []
        let curveHeight = 10; 
        
        var hitBox = {x:0,h:baseHeight*stats.area,r:baseReach*stats.area}

        var phase = false;
        
        let attackAnimation = setInterval(() =>{

        if(!phase){
            if(hitBox.x < hitBox.r){
  
                hitBox.x += stats.attack_speed * 5;
                dots.push({x: hitBox.x,y: hitBox.h/3 + Math.sin(hitBox.x) - curveHeight + 10})
                curveHeight *= 0.5;
            }else{
                phase = true;
                console.log(phase)
            }
        }else{
            if(hitBox.x > 0){
                hitBox.x -= stats.attack_speed * 10;
            }else{
                dots.pop()
            }
        }
            if(dots.length == 0){
                animationCanvas.remove()
                clearInterval(attackAnimation);
            }


   


            ctx.clearRect(-playerPos.x,-playerPos.y,c.width,c.height);
            ctx.strokeRect(0, hitBox.h/2, hitBox.x , hitBox.h)
            ctx.strokeRect(0, hitBox.h/2, -hitBox.x , hitBox.h)
            ctx.strokeStyle="#3A200F"
            ctx.lineCap = "round"
            ctx.lineWidth = 5

            const truePos = player.getTruePos()

            this.checkHit({x:truePos.x-hitBox.x,y:truePos.y-hitBox.h/2,w:hitBox.x,h:hitBox.h})

            
            dots.forEach((dot,i)=>{
                ctx.beginPath()
                ctx.arc(dot.x, dot.y, hitBox.h/(i+20)*5 ,0,Math.PI*2)
                ctx.fill()

                ctx.beginPath()
                ctx.arc(-dot.x, dot.y, hitBox.h/(i+20)*5 ,0,Math.PI*2)
                ctx.fill()
            })

            
        },10)
        
    }
}