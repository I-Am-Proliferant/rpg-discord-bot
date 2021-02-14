class Items {
    constructor(name, type, stats, value = 1, quantity = 1) {
        this.stats.hpMax = (stats.hpMax) ? stats.hpMax : 0;
    };
    name;
    type;
    description;
    quantity;
    value;
    price;
    stats = {
        hpMax:Number,
        power:Number,
        defense:Number,
        speed:Number
    };
    damageType;
    usage;
    effects = [];
    // min;
    // max;
    target = [];
    requirements = [];
    combatOnly;
    use(){

    }
    // abilities = [];
    // effects = [];
}



class Scrolls {
    constructor(){
        this.type = 'scroll';
        this.init();
    };
}

Scrolls.prototype.init = function () {
    this.name = 'healing';
    this.min = '5';
    this.max = '10';
    this.description = `Heals a target player for ${this.min} - ${this.max} hp`;
    this.usage = '!read "Minor Heal" "Player Name"'
    this.target = ['self', 'player'];
    this.requirements = 'skills.literate === true';
    this.combatOnly = false;
    this.effects = ['heal'];
    this.quantity = 1;
    this.value = 100;
    this.price = this.value;
}

module.exports = { Scrolls };

