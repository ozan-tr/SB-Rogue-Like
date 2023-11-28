class ProductionOrale extends WeaponBase{
    constructor(){
        super(
            "Production Orale",
            "",
            "Magic",
            2,
            0,
            9
        )
        this.stats = [
            {
                   attack_speed: 5,
                   area: 5,   
                   amount:5       
            },
            {
                attack_speed: 5,
                area: 5, 
                amount:10
            }
        ]
    }
    attack(ctx){
        console.log("attacked")

        const animationCanvas = document.createElement("canvas");
        animationCanvas.width = c.width
        animationCanvas.height = c.height
        
        document.getElementsByClassName("mainContainer")[0].appendChild(animationCanvas);
        ctx = animationCanvas.getContext("2d");

        const playerPos = player.getHeadPos()
        console.log(playerPos)
        ctx.setTransform(1,0,0,1,playerPos.x,playerPos.y);
        
        const stats = this.stats[this.level]
        const baseHeight = 10
        const baseReach = 60
        
        const timeOut = new Date()
        const lifeSpan = 3000;

        var r = 0;

        const angle = Math.atan2(-player.dir.y, -player.dir.x)

        
        let attackAnimation = setInterval(() =>{
            r++

            ctx.clearRect(-playerPos.x,-playerPos.y,c.width,c.height);


            ctx.beginPath();
            ctx.strokeStyle="white"
            ctx.lineWidth = 5
            ctx.lineCap="round"
            ctx.arc(0,0,r,angle + Math.PI/4,angle - Math.PI/4,true)

            ctx.stroke()

           

            if(new Date() - timeOut > lifeSpan){
                animationCanvas.remove()
                clearInterval(attackAnimation);
            }
        },10)
        
    }

}