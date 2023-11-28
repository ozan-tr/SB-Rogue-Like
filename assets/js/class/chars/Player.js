class Player{
    constructor(){
        this.pos = {
            x: 0,
            y: 0
        }
        this.stats={
            speed: 1,
            strength: 1,
            defence: 1,
            luck: 1.5,
            attack_speed: 1,
            pickUpRange: 50,
        }

        this.size = {width:  40, height:60}


        this.dir = {x: 0, y: 0}

        this.angle=0

        this.heldDirKeys = []

        console.log(this.getStats())

    }
    attackTick(ctx){
        this.inventory.data.weapons.forEach(weapon=>{
            if(new Date() - weapon.lastAttack > 2000){
                const howMany = weapon.getStat("amount") || 1
                if(howMany){
                    var n = 0
                    var multiFire = setInterval(()=>{
                        if(n == howMany){
                            clearInterval(multiFire)
                            return
                        }
                        weapon.attack(ctx)
                        n++
                    },100)
                }
                weapon.lastAttack = new Date()
            }

        })
    }
    getStats(){
        var ret = {}

        for(const statIndex in this.stats){
            const statValue = this.stats[statIndex] * 100
            const statName = statIndex.charAt(0).toUpperCase() + statIndex.slice(1)
            ret[statName] = statValue+"%"
        }

        return ret;
    }
    setDirection(){

        if(uiActive) return

        var reset = true
        for(var dir in heldDirKeys){
            if(heldDirKeys[dir]){reset = false}
        }

        if(!reset){this.dir={x:0,y:0}}
 

        if(heldDirKeys.left){
            this.dir.x = 1 
        }if (heldDirKeys.right){
            this.dir.x = -1
        }
        if((heldDirKeys.left && heldDirKeys.right)){
            this.dir.x=0
        }


        if(heldDirKeys.up){
            this.dir.y = 1
        }if (heldDirKeys.down){
            this.dir.y = -1
        }
        if((heldDirKeys.up && heldDirKeys.down)){
            this.dir.y=0
        }
    }
    attack(){
        
    }
    move(){
        if(uiActive) return
   
        const angle = Math.atan2(this.dir.y, this.dir.x);
        const playerPos = this.getCenterPos();
        
        const nextPosX = this.pos.x + Math.cos(angle) * this.stats.speed;
        const nextPosY = this.pos.y + Math.sin(angle) * this.stats.speed;
        
        const p = {
          x: playerPos.x - nextPosX,
          y: playerPos.y - nextPosY,
          w: this.size.width,
          h: this.size.height
        };
        
        let collision = false;

        map.drawObstacles.forEach(obstacle => {
            if (doesCollide(p, obstacle)) {
              collision = true;
            }
          });

          if (!collision) {
            this.pos = { x: nextPosX, y: nextPosY };
          }else{



            /*
            let align = true
            let initAttempt = this.stats.speed - 1
            while(align) {
                const nextPosX2 = this.pos.x + Math.cos(angle) * initAttempt;
                const nextPosY2 = this.pos.y + Math.sin(angle) * initAttempt;

                const p2 = {
                    x: playerPos.x - nextPosX2,
                    y: playerPos.y - nextPosY2,
                    w: this.size.width,
                    h: this.size.height
                  };

                  if(doesCollide(p2,collidedObject)) {
                    this.pos = { x: this.pos.x + Math.cos(angle) * (initAttempt - 1), y: this.pos.y + Math.sin(angle) * (initAttempt - 1) };
                    console.log(initAttempt )
                    align=false
                  }else{
                    initAttempt --;
                  }

                  if(initAttempt === 1){
                    this.pos = { x: this.pos.x + Math.cos(angle) * (initAttempt - 1), y: this.pos.y + Math.sin(angle) * (initAttempt - 1) };
                    align = false;
                  }

            }
            */
          }


        this.animate()
    }
    getHeadPos(){
        const angle = this.angle - Math.PI/2
        return {x: c.width/2 + Math.cos(angle)*this.headOffset.x, y: c.height/2 + Math.sin(angle)*this.headOffset.y};
    }
    getTruePos(){
        const center = this.getHeadPos()
        return {x: center.x-this.pos.x, y: center.y-this.pos.y}
    }
    
    getCenterPos(){
        return {x:c.width/2-this.size.width/2,y:c.height/2-this.size.height/2,}
    }
    getAimingPos(){
        var headPos = this.getHeadPos()
        const aimingOffsetAmount = -10
        const angle = Math.atan2(this.dir.y, this.dir.x)
        var aimingPos={
            x:headPos.x + (Math.cos(angle)*aimingOffsetAmount),
            y:headPos.y + (Math.sin(angle)*aimingOffsetAmount)
        }
        return aimingPos
    }
    animate(){
        return
    }


}


class Allah extends Player{
    constructor(){
        super()
    }
}


function doesCollide(player, obstacle) {
    return !(
        ((player.y + player.h) < (obstacle.y)) ||
        (player.y > (obstacle.y + obstacle.h)) ||
        ((player.x + player.w) < obstacle.x) ||
        (player.x > (obstacle.x + obstacle.w))
    );
}

