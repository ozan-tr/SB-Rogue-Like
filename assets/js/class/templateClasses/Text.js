
class Text {
    constructor(value,pos,modifier){
        if(value == 0)return
        this.pos = JSON.parse(JSON.stringify(pos))
        this.value = value
        
        if(modifier==0){
            this.color = "white"
        }else if(modifier==1){
            this.color = "red"
        }else if(modifier==2){
            this.color = "yellow"
        }else if(modifier==3){
            this.color = "green"
        }else if(modifier==4){
            this.color = "blue"
        }

        this.tilt = Math.random() > 0.5 ? 0.2 : -0.2

        this.font = "30px PixelFont"

        this.render = true
        this.lifeTime = 1000
        this.birthTime = new Date()

        this.speed = 0.3
        this.opacity = 1
        
        renderedTexts.push(this)
    }
    update(){
        console.log(ctx)
        const timePassed = new Date() - this.birthTime
        if(timePassed >= this.lifeTime){
            const index = renderedTexts.indexOf(this)
            renderedTexts.splice(index,1)
        }else{
            this.pos.y -= this.speed
            this.pos.x += this.tilt
            this.opacity = 1 - (timePassed/this.lifeTime)
        }
        
        ctx.font = this.font
        ctx.strokeStyle = 'black';
        ctx.fillStyle = this.color
        ctx.lineWidth = 2
        ctx.globalAlpha = this.opacity

        ctx.fillText(this.value,this.pos.x,this.pos.y)
        ctx.strokeText(this.value,this.pos.x,this.pos.y)

        ctx.globalAlpha = 1
    }
}
