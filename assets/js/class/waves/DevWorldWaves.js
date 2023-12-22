

class DevWorldWaves extends WavesManager{
    constructor(){
        super()
        this.waves = [
            {
                duration: 99999999999999,
                mobs: [
                    this.spawnSingle("TargetDummy",100)
                ]
            }
        ]
        this.spawnWave()
    }
}