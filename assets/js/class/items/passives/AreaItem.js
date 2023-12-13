class AreaItem extends PassiveBase {
    constructor() {
        super("Area Item", "Increases Area",2);

        this.stats = [
                0.1,
                0.2,
                0.3,
                0.4,
                0.5,
                0.6,
                0.7,
                0.8,
                0.9,
                1
        ];

        this.maxLevel = 9;
    }
}