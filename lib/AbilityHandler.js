class AbilityHandler {
    constructor() {
    };
    abilities = [];
}

AbilityHandler.prototype.addAbility = function (ability) {
    this.abilities.push(ability);
};

AbilityHandler.prototype.removeAbility = function (ability) {
    this.abilities.splice(this.abilities.indexOf(ability));
};

AbilityHandler.prototype.getAbility = function (ability) {
    return this.abilities.find(e => e === ability);
};

AbilityHandler.prototype.validateAbility = function (ability) {
    return true
};

module.export = { AbilityHandler };