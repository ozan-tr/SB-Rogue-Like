class OzanGurleyen extends Player {
    constructor(){
        super()

        
        this.images = Array.from(document.getElementById('OzanGurleyen').children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        this.size={width:60,height:80}

        this.headOffset = {x: 30, y: 15}

        this.startingWeapon = "BBB"

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
        const animationDelay = 100/this.stats.speed

        if(timePassed >= animationDelay){
            this.frame = !this.frame
            if(this.frame){
                switch(this.dir.x){
                    case 0:
                        this.img = this.images[8]
                        break;
                    case -1:
                        this.img = this.images[4]
                        break;
                    case 1:
                        this.img = this.images[6]
                        break;
                }
                if(this.dir.y==1){this.img = this.images[10]}
            }else{
                switch(this.dir.x){
                    case 0:
                        this.img = this.images[9]
                        break;
                    case -1:
                        this.img = this.images[5]
                        break;
                    case 1:
                        this.img = this.images[7]
                        break;
                }
                if(this.dir.y==1){this.img = this.images[11]}
            }
            this.lastFrame = new Date()

        }
    }

}