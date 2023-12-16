class AmountItem extends PassiveBase {
    constructor() {
        super("Amount Item", "Increases Projectile Amount",2);

        this.stats = [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10
        ];

        this.maxLevel = 9;
    }
}