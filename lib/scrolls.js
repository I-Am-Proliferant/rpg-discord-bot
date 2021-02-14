class Scrolls {
    constructor(){
        this.type = 'scroll';
        this.init();
    };
    name;
    quantity;
    type;
    value;
    price;
    description;
    usage;
    effects;
    target;
    requirements;
    combatOnly;
    min;
    max;
    use(){

    }
}

Scrolls.prototype.init = function () {
    this.name = 'healing';
    this.min = '10';
    this.max = '20';
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

