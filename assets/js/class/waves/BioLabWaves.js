const fodderMob1 = "BookBat"
const fodderMob2 = "Student1"
const fodderMob3 = "Student2"
const fodderMob4 = "Student3"

const immovableMob1 = "LOignon"
class BioLabWaves extends WavesManager{
    constructor(){
        super()
        this.waves = [
            {
                duration: 3000,
                mobs:[]
            },
            {
                duration: 15000,
                mobs: [
                    this.spawnImmovable(immovableMob1),
                    this.simpleScatter(fodderMob1, 10,20, 400),
                ]
            },
            {
                duration: 15000,
                mobs: [
                    
                    this.simpleScatter(fodderMob2, 10,20, 400),
                    this.simpleGroup(fodderMob1, 40, 400),
                ]
            },
            {
                duration: 15000,
                mobs: [
                    this.simpleScatter(fodderMob1, 20,20, 400),
                ]
            },
            {
                duration: 15000,
                mobs: [
                    this.simpleScatter(fodderMob1, 20,20, 400),
                    this.simpleScatter(fodderMob2, 10,20, 400),
                ]
            },
            {
                duration: 30000,
                mobs: [
                    this.mixedEncerlement(500,{amount:50,type:fodderMob1},{amount:10,type:fodderMob2}),
                ]
            }
        ]
        this.spawnWave()
    }
}