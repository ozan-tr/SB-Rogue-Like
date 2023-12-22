class MaxHealthItem extends PassiveBase {
    constructor() {
        super("Max health Item", "Increases Max Health",2);

        this.stats = [
                10,
                20,
                30,
                40,
                50,
                60,
                70,
                80,
                90,
                100
        ];

        this.maxLevel = 9;
    }
}