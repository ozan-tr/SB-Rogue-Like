class Chest extends PickUpTemplate{
    constructor(pos,value){
        super(
            pos,
            value,
            null,
            false
        )
        this.size = {width:50,height:50};
        this.img = document.getElementById("Chest")
        this.openImg = document.getElementById("ChestOpen")
        this.attraction = false

        this.speed = 0
    }
    pickup(){
        renderedItems.splice(renderedItems.indexOf(this),1)
        this.openUI()
    }
    draw(ctx){
        ctx.drawImage(this.img,this.pos.x,this.pos.y,this.size.width,this.size.height)
    }
    openUI(){
        gamePaused = true

        const chestUI = document.createElement('div')
        const chestAnimationCanvas = document.createElement('canvas')

        chestAnimationCanvas.width = 600
        chestAnimationCanvas.height = 600

        

        this.rewards = []

        for(var i = 0; i < this.value; i++){
            const itemsList = player.inventory.getAvailableItems()
            if(itemsList.length == 0){
                console.log("item kalmadı")
            }else{
                const item = itemsList[Math.floor(Math.random()*itemsList.length)]
                this.rewards.push(item)
            }
        }


        this.value = this.rewards.length

        chestUI.appendChild(chestAnimationCanvas)
        chestUI.classList.add('chestUI')

        document.body.appendChild(chestUI)

        const anim = chestAnimationCanvas.getContext('2d')

        const offset = Math.PI*2 / this.value

        const animationTime = 1000
        const animationStep = 10
        const animationStart = Date.now() 


        const chestAnimation = setInterval(() => {
            anim.setTransform(1,0,0,1,chestAnimationCanvas.width/2,chestAnimationCanvas.height/2)
            anim.clearRect(-chestAnimationCanvas.width/2,-chestAnimationCanvas.height/2,chestAnimationCanvas.width,chestAnimationCanvas.height)

            var dotPos = []

            const dt = new Date() - animationStart

            anim.lineWidth = 3

            for(var i = 0; i < this.value; i++){

                const deg = (dt/100) + i*offset 

                const x = Math.cos(deg) * dt / 15
                const y = Math.sin(deg) * dt / 15

                anim.beginPath()
                anim.arc(x,y,20,0,Math.PI*2)
                anim.fillStyle=rarity[this.rewards[i].rarity].color
                anim.fill()
                anim.stroke()
                anim.drawImage(this.rewards[i].imgElement,x-17,y-15)

                dotPos.push({x:x,y:y})
            }

            anim.save()

            const dx = Math.random()*10;
            const dy = Math.random()*10;

            anim.translate(dx, dy); 

            anim.drawImage(this.img,-this.size.width/2,-this.size.height/2,this.size.width,this.size.height)

            anim.restore()

            if(dt > animationTime){
                clearInterval(chestAnimation)
                this.animationEnd(chestAnimationCanvas,dotPos,chestUI)
            }

        },animationStep)
    }
    animationEnd(chestAnimationCanvas,dotPos,chestUI){
        const anim = chestAnimationCanvas.getContext("2d")
        var step = 0;
        const chestAnimation2 = setInterval(()=>{
            step+=0.1;
            anim.setTransform(1,0,0,1,chestAnimationCanvas.width/2,chestAnimationCanvas.height/2)
            anim.clearRect(-chestAnimationCanvas.width/2,-chestAnimationCanvas.height/2,chestAnimationCanvas.width,chestAnimationCanvas.height)

            anim.drawImage(this.openImg,-this.size.width/2,-this.size.height/2,this.size.width,this.size.height)

            for(var i = 0; i<dotPos.length;i++){
                const dot = dotPos[i]

                anim.beginPath()
                anim.arc(dot.x,dot.y+Math.sin(step)*2,20,0,Math.PI*2)
                anim.fillStyle=rarity[this.rewards[i].rarity].color
                anim.fill()
                anim.stroke()
                anim.drawImage(this.rewards[i].imgElement,dot.x-17,dot.y-15+Math.sin(step)*2)
            }

        },10)

        const confirmButton = document.createElement('button')
        confirmButton.classList.add('confirmButton')
        confirmButton.innerHTML = "Confirm"
        chestUI.appendChild(confirmButton)
        confirmButton.onclick = ()=>{
            this.rewards.forEach((item)=>{
                player.inventory.addItem(item.constructor.name)
            })
            renderedItems.slice(renderedItems.indexOf(this),1)
            clearInterval(chestAnimation2)
            document.body.removeChild(chestUI)
            gamePaused = false
        }

    }
}
