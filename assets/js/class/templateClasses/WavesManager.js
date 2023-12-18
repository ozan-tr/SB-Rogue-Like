/*
  METHODS:

  spawnSingle(mobType,dist) - spawns a single mob of type mobType at a distance of dist from the player
  simpleScatter(mobType, amount, dist) - spawns a group of scattered mobs of type mobType at a distance of dist from the player, amount is the amount of mobs in the group
  mixedGroup(dist,...group) - spawns a group of mobs at a distance of dist from the player, group is an array of objects with the following structure: {type:"mobType",amount:amountOfMobs}
  simpleGroup(mobType, amount, dist) - spawns a group of mobs of type mobType at a distance of dist from the player, amount is the amount of mobs in the group
  mixedEncerlement(dist,...group) - spawns a group of mobs circling the player, group is an array of objects with the following structure: {type:"mobType",amount:amountOfMobs}
  simpleEncerlement(mobType, amount,dist) - spawns a group of mobs of type mobType circling the player, amount is the amount of mobs in the group

*/


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

        if(this.passedTime > gameDuration){
            gameActive = false
            endGame(true)
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

  spawnImmovable(mobType){
    return [{type:mobType}]
  }
  spawnSingle(mobType,dist){
    const x = Math.cos(Math.random()*Math.PI*2)*dist
    const y = Math.sin(Math.random()*Math.PI*2)*dist
    return [{type:mobType,x:x,y:y}]
  }
  simpleScatter(mobType, amount, rand,minDist) {
    var simpleScatter = []
    for(var i=0;i<amount;i++){
        const x = Math.cos(Math.random()*Math.PI*2)*minDist + Math.random()*rand
        const y = Math.sin(Math.random()*Math.PI*2)*minDist + Math.random()*rand
        simpleScatter.push({type:mobType,x:x,y:y})
    }
    return simpleScatter
  }
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