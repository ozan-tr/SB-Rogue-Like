class RegenCoolDownItem extends PassiveBase {
    constructor() {
        super("Regen Cool Down Item", "Increases The Speed Of Health Regeneration",2);

        this.stats = [
                -100,
                -150,
                -200,
                -250,
                -300,
                -350,
                -400,
                -450,
                -500,
        ];

        this.maxLevel = 9;
    }
}