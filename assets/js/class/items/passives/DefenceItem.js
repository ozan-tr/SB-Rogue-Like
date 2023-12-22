class DefenceItems extends PassiveBase {
    constructor() {
        super("Bumper", "Increases Defence",2);

        this.stats = [
                0.01,
                0.02,
                0.03,
                0.04,
                0.05,
                0.06,
                0.07,
                0.08,
                0.09,
                0.1
        ];

        this.maxLevel = 9;
    }
}