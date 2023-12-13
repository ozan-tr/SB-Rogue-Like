class AlpEgeKurtulus extends Player{
    constructor(){
        super()

        this.size = {width:40,height:120 }

        this.images = Array.from(document.getElementById('AlpEgeKurtulus').children)
        this.images.sort((a,b) => a.id-b.id)
        this.img = this.images[0]

        console.log(this.images)

        this.frame = true;

        this.lastFrame = new Date()
    }
    setIdle(){
        return
    }
    animate() {
        return
    }
}