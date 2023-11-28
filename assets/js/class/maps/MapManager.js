class MapManager {
    constructor(player){
        this.player=player
        this.dimensions = {width:1400,height:1000}
        this.mapPositions = []
        this.indices = {x:213123,y:12412}
        this.viewPortOffset = {x:(this.dimensions.width - c.width) /2 ,y:(this.dimensions.height - c.height) / 2}
        this.drawOffset = 1;
        this.drawTiles = []
        this.drawObstacles = []
    }
    drawMap(ctx){
        this.calculateIndices()

        this.drawTiles.forEach((mapPos)=>{
            ctx.drawImage(this.background, mapPos.x, mapPos.y)
        })

        
        /*
        this.drawObstacles.forEach((obstaclePos)=>{
            ctx.fillStyle="transparent"
            ctx.shadowColor = "black";

            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            ctx.strokeRect(obstaclePos.x, obstaclePos.y,obstaclePos.w, obstaclePos.h)
        })
        */
        

        if(false){
            this.drawTiles.forEach((mapPos)=>{
                ctx.strokeStyle="green"
                ctx.lineWidth=2
                for(let x = mapPos.x; x <= mapPos.x + this.dimensions.width; x+=100) {
                    ctx.beginPath();
                    ctx.moveTo(x,0)
                    ctx.lineTo(x,this.dimensions.height)
                    ctx.stroke()
                }
                for(let y = mapPos.y; y <= mapPos.y + this.dimensions.height; y+=100) {
                    ctx.beginPath();
                    ctx.moveTo(0,y)
                    ctx.lineTo(this.dimensions.width, y)
                    ctx.stroke()
                }
                ctx.lineWidth=4
                ctx.strokeStyle="white"
                ctx.strokeRect(mapPos.x, mapPos.y, this.dimensions.width, this.dimensions.height)
            })

        }
       
    }
    updateSections(){
        this.drawTiles = []
        console.log("change")
        this.indicesToDrawOn.forEach((index)=>{
            this.drawTiles.push({x:index.x*this.dimensions.width - this.viewPortOffset.x ,y:index.y*this.dimensions.height - this.viewPortOffset.y});
        })
    }
    updateObstacles(){
        this.drawObstacles = []
        this.obstacles.forEach((obstacle) => {
            this.indicesToDrawOn.forEach((index)=>{
                const obstacleX = (index.x*this.dimensions.width - this.viewPortOffset.x) + obstacle.x
                const obstacleY = (index.y*this.dimensions.height - this.viewPortOffset.y) + obstacle.y
                this.drawObstacles.push({x:obstacleX,y:obstacleY,w:obstacle.w,h:obstacle.h})
            })
        })
    }
    calculateIndices() {
        const playerOffset = player.getCenterPos()
        const playerPos = this.player.pos

        const xIndex = -Math.floor((playerPos.x + playerOffset.x) / this.dimensions.width)
        const yIndex = -Math.floor((playerPos.y + playerOffset.y) / this.dimensions.height)

        if(xIndex !== this.indices.x || yIndex !== this.indices.y) {
            this.indicesToDrawOn = []
            for(let x = xIndex-this.drawOffset; x <= xIndex + this.drawOffset; x++){
                for(let y = yIndex-this.drawOffset; y <= yIndex + this.drawOffset; y++){
                    this.indicesToDrawOn.push({x: x, y: y})
                }
            }
            this.indices = {x:xIndex,y:yIndex}
            this.updateObstacles()
            this.updateSections()
        }
    }


}
