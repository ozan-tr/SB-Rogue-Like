


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
    if(!gamePaused && gameActive){
        const gameDuration = this.waves.reduce((acc,cur)=>acc+cur.duration,0)

        this.passedTime = new Date() - this.startTime
        this.remainingTime = gameDuration - this.passedTime

        if(this.passedTime >= gameDuration){
            gameActive = false
            endGame(true)
        }else if(this.passedTime > this.timeUntillNextWave){
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
    const wave = this.waves[this.currentWave].mobs
        wave.forEach((part)=>{
            part.forEach((mob)=>{
              if(mob.x == undefined && mob.y == undefined){
                eval(`new ${mob.type}()`)
              }else{
                eval(`new ${mob.type}({x:${playerPos.x+mob.x},y:${playerPos.y+mob.y}})`)
              }
            })
        })
  }
  /**
   * Spawn an immovable mob.
   * @param {string} mobType - The type of the mob to spawn.
   * @returns {Array} - An array containing the spawned mob.
   */
  spawnImmovable(mobType){
    return [{type:mobType}]
  }
  /**
   * Spawn a single mob at a specific distance from the player.
   * @param {string} mobType - The type of the mob to spawn.
   * @param {number} dist - The distance from the player.
   * @returns {Array} - An array containing the spawned mob.
   */
  spawnSingle(mobType,dist){
    const x = Math.cos(Math.random()*Math.PI*2)*dist
    const y = Math.sin(Math.random()*Math.PI*2)*dist
    return [{type:mobType,x:x,y:y}]
  }
    /**
   * Scatter mobs randomly around the player.
   * @param {string} mobType - The type of the mobs to scatter.
   * @param {number} amount - The number of mobs to scatter.
   * @param {number} rand - The maximum random distance from the minimum distance.
   * @param {number} minDist - The minimum distance from the player.
   * @returns {Array} - An array containing the scattered mobs.
   */
  simpleScatter(mobType, amount, rand,minDist) {
    var simpleScatter = []
    for(var i=0;i<amount;i++){
        const x = Math.cos(Math.random()*Math.PI*2)*minDist + Math.random()*rand
        const y = Math.sin(Math.random()*Math.PI*2)*minDist + Math.random()*rand
        simpleScatter.push({type:mobType,x:x,y:y})
    }
    return simpleScatter
  }
    /**
   * Create a mixed group of mobs.
   * @param {number} dist - The distance from the player.
   * @param {...{type: string, amount: number}} group - The mobs to include in the group.
   * @returns {Array} - An array containing the mixed group of mobs.
   */
  mixedGroup(dist,...group){
    const x = Math.cos(Math.random()*Math.PI*2)*dist
    const y = Math.sin(Math.random()*Math.PI*2)*dist

    var nameDesginator = []

    const totalAmount = group.reduce((acc,cur)=>acc+cur.amount,0)

    const mobSize = 40;

    group.forEach((part)=>{
        for(var i=0;i<part.amount;i++){
            nameDesginator.push(part.type)
        }
    })

    nameDesginator = nameDesginator.sort(()=>Math.random()-0.5)

    var mixedGroup = []

    var boxSize = mobSize*Math.ceil(Math.sqrt(totalAmount))

    for(var dx=0;dx<boxSize;dx+=mobSize){
      for(var dy=0;dy<boxSize;dy+=mobSize){
          if(mixedGroup.length < totalAmount){
              mixedGroup.push({type:nameDesginator[mixedGroup.length],x:x+dx,y:y+dy})
          }
      }
  }

    return mixedGroup
  }
    /**
   * Create a simple group of mobs.
   * @param {string} mobType - The type of the mobs to include in the group.
   * @param {number} amount - The number of mobs in the group.
   * @param {number} dist - The distance from the player.
   * @returns {Array} - An array containing the simple group of mobs.
   */
  simpleGroup(mobType, amount, dist) {
    const x = Math.cos(Math.random()*Math.PI*2)*dist
    const y = Math.sin(Math.random()*Math.PI*2)*dist

    const mobSize = 40;

    var boxSize = mobSize*Math.ceil(Math.sqrt(amount))

    var group = []

    for(var dx=0;dx<boxSize;dx+=mobSize){
        for(var dy=0;dy<boxSize;dy+=mobSize){
            if(group.length < amount){
                group.push({type:mobType,x:x+dx,y:y+dy})
            }
        }
    }
    return group
  }
    /**
   * Create a mixed encerlement of mobs.
   * @param {number} dist - The distance from the player.
   * @param {...{type: string, amount: number}} group - The mobs to include in the encerlement.
   * @returns {Array} - An array containing the mixed encerlement of mobs.
   */
  mixedEncerlement(dist,...group){  
      var nameDesginator = []
  
      const totalAmount = group.reduce((acc,cur)=>acc+cur.amount,0)
  
      group.forEach((part)=>{
          for(var i=0;i<part.amount;i++){
              nameDesginator.push(part.type)
          }
      })
  
      nameDesginator = nameDesginator.sort(()=>Math.random()-0.5)
  
      var mixedEncerlement = []
  
      var incr = 360/totalAmount

      for(var i=0;i<360;i+=incr){
          const deg = i*Math.PI/180
          mixedEncerlement.push({type:nameDesginator[mixedEncerlement.length],x:Math.cos(deg)*dist,y:Math.sin(deg)*dist})
      }
      return mixedEncerlement
  }
    /**
   * Create a simple encerlement of mobs.
   * @param {string} mobType - The type of the mobs to include in the encerlement.
   * @param {number} amount - The number of mobs in the encerlement.
   * @param {number} dist - The distance from the player.
   * @returns {Array} - An array containing the simple encerlement of mobs.
   */
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