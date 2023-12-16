class CritDamageItem extends PassiveBase {
    constructor() {
        super("502 Japon", "İdeal bali itemi, beyaz straforla düşük bütçeli bir napalm için de kullanılabilir. \n increases crit damage",2);

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