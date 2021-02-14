class Equipment {
    constructor(name, type, stats, value = 1, quantity = 1) {
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.stats.hpMax = (stats.hpMax) ? stats.hpMax : 0;
        this.stats.power = (stats.power) ? stats.power : 0;
        this.stats.defense = (stats.defense) ? stats.defense : 0;
        this.stats.speed = (stats.speed) ? stats.speed : 0;
        this.value = value;
        this.price = this.value;
    };
    quantity;
    name;
    type;
    value;
    price;
    damageType;
    stats = {
        hpMax:Number,
        power:Number,
        defense:Number,
        speed:Number
    };
    // abilities = [];
    // effects = [];
    preRequsites = [];
}

const sword = new Equipment('sword', 'right', {'str': 5}, 1);

module.exports = { Equipment };