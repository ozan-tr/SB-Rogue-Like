const fodderMob1 = "BookBat"
const fodderMob2 = "Student1"
const fodderMob3 = "Student2"
const fodderMob4 = "Student3"

class BioLabWaves extends WavesManager{
    constructor(){
        super()
        this.waves = [
            {
                duration: 15000,
                mobs: [
                    this.simpleEncerlement(fodderMob1, 50,400),
                    this.simpleEncerlement(fodderMob2, 50,300),
                ]
            },
            {
                duration: 30000,
                mobs: [
                    this.simpleEncerlement(fodderMob1, 50,400),
                    this.simpleEncerlement(fodderMob2, 50,300),
                ]
            },
            {
                duration: 15000,
                mobs: [
                    this.simpleEncerlement(fodderMob2, 50,400),
                    this.simpleEncerlement(fodderMob2, 50,300),
                ]
            }
        ]
        this.spawnWave()
    }
}