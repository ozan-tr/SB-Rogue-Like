class BookBat extends MobTemplate{
    constructor(pos){
        super(
            "Book Bat",
            pos,
            {width:40, height:40},
            {
                speed:1,
                damage:10,
                maxHealth:100,
            },
            100
        )
    }
}