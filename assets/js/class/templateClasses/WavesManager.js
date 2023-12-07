


class WavesManager {
  constructor(waves) {
    this.waves = waves
    this.startTime = new Date()
    this.passedTime = new Date() - this.startTime
    this.remainingTime = this.gameDuration - this.passedTime
    this.currentWave = 0
    this.timeUntillNextWave = 0;
  }
  drawTimer(ctx){
    if(gameActive){
        const gameDuration = this.waves.reduce((acc,cur)=>acc+cur.duration,0)

        this.passedTime = new Date() - this.startTime
        this.remainingTime = gameDuration - this.passedTime

        if(this.passedTime > gameDuration){
            gameActive = false
            gameWon = true
            //TODO endGame() 
        }

        if(this.passedTime > this.timeUntillNextWave){
            this.currentWave++
            this.spawnWave()
        }
    }
    ctx.fillStyle = "white"
    ctx.font = "30px PixelFont"
    ctx.textAlign = "center"
    ctx.fillText(`${new Date(this.remainingTime).toISOString().substr(14, 5)} (${new Date(this.timeUntillNextWave-this.passedTime).toISOString().substr(14, 5)})`,c.width/2,60)
  }

  spawnWave(){
    this.timeUntillNextWave += this.waves[this.currentWave].duration
    const playerPos = player.getTruePos()
    console.log("spawned wave "+this.currentWave)  
    const wave = this.waves[this.currentWave].mobs
        wave.forEach((part)=>{
            part.forEach((mob)=>{
                eval(`new ${mob.type}({x:${playerPos.x+mob.x},y:${playerPos.y+mob.y}})`)
            })

        })
  }

  simpleEncerlement(mobType, amount,dist) {
    var simpleEncerlement = []

    var incr = 360/amount
    for(var i=0;i<360;i+=incr){
        const deg = i*Math.PI/180
        simpleEncerlement.push({type:mobType,x:Math.cos(deg)*dist,y:Math.sin(deg)*dist})
    }

    return simpleEncerlement
  }

}