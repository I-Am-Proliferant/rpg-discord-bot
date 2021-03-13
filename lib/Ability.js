class Ability {
    constructor(name, type, effect) {
        this.name = name;
        this.type = type;
        this.effect.push(effect);
    };
}

module.export = { Ability };


const burn = {
    name: 'Burn',
    type: 'spell',
    effects:[],
}

