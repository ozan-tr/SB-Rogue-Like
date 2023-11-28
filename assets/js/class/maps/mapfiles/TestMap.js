class TestMap extends MapManager{
    constructor(player){
        super(player)
        this.background = document.getElementById("testMap")
        this.obstacles = [
            {x:100,y:100,w:500,h:40},
            {x:100,y:300,w:500,h:40},
            {x:100,y:600,w:500,h:40},
            {x:100,y:800,w:500,h:40},


            {x:800,y:100,w:500,h:40},
            {x:800,y:300,w:500,h:40},
            {x:800,y:600,w:500,h:40},
            {x:800,y:800,w:500,h:40},

        ]
    }
}