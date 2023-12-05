class ZeynepKarademir extends Player {
    constructor(){
        super()
        this.stats={
            speed: 5,
            strength: 1,
            defence: 1,
            luck: 1.5,
            attackSpeed: 1,
            pickupRange: 50,
        }
        this.images = Array.from(document.getElementById('ZeynepKarademir').children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.headOffset = {x: 20, y: 20}

        console.log(this.images)

        this.inventory = new Inventory(this)

        this.frame = true;

        this.lastFrame = new Date()
    }
    setIdle(){
        switch(this.dir.x){
            case 0:
                this.img = this.images[0]
                break;
            case -1:
                this.img = this.images[1]
                break;
            case 1:
                this.img = this.images[2]
                break;
        }
        if(this.dir.y==1){this.img = this.images[3]}
    }
    animate(){
        const timePassed = new Date()-this.lastFrame
        const animationDelay = 1000/this.stats.speed

        if(timePassed >= animationDelay){
            this.frame = !this.frame
            if(this.frame){
                switch(this.dir.x){
                    case 0:
                        this.img = this.images[8]
                        break;
                    case 1:
                        this.img = this.images[4]
                        break;
                    case -1:
                        this.img = this.images[6]
                        break;
                }
                if(this.dir.y==1){this.img = this.images[10]}
            }else{
                switch(this.dir.x){
                    case 0:
                        this.img = this.images[9]
                        break;
                    case 1:
                        this.img = this.images[5]
                        break;
                    case -1:
                        this.img = this.images[7]
                        break;
                }
                if(this.dir.y==1){this.img = this.images[11]}
            }
            this.lastFrame = new Date()

        }
    }

}