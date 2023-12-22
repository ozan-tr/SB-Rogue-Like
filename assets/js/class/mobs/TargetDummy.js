class TargetDummy extends MobTemplate {
    constructor(pos){
        super(
            "TargetDummy",
            pos,
            {width: 40, height: 60},
            {
                speed:0,
                maxHealth:Infinity,
                damage:0,
                attackSpeed:0,
            },
            0
        )
    }
    update(ctx){
        ctx.drawImage(this.img,this.pos.x,this.pos.y)
    }
    applyDamage(damage){
        if(new Date()-this.lastDamage > this.invincibiltyFrame){
            this.lastDamage=new Date()

            new Text(damage.value,this.pos,damage.modifier)

            player.dps += damage.value

            setTimeout(() => {
                player.dps -= damage.value
            },10000)


            return true
        }



        return false
    }

}