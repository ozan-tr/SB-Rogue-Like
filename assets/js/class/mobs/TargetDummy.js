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
            new Text(damage.value,this.pos,damage.modifier)
            return true
        }

        return false
    }

}