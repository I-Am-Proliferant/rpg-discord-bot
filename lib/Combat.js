
class Combat {
    constructor() {
        this.round = 0;
        this.combatIndicator = false;
        this.combatants = [];
        this.summons = [];
    }
    enemy;
}

Combat.prototype.addCombatant = function (combatant) {
    this.combatants.push(combatant);
};

Combat.prototype.removeCombatant = function (combatant) {
    this.combatants.slice(this.combatants.indexOf(combatant));
};

Combat.prototype.addSummons = function (summons) {
    this.summons.push(summons);
};

Combat.prototype.removesummons = function (summons) {
    this.summons.slice(this.summons.indexOf(summons));
};

Combat.prototype.startCombat = function () {
    this.combatIndicator = true;
};

Combat.prototype.endCombat = function () {
    this.combatants.slice(0, this.combatants.length);
    this.summons.slice(0, this.summons.length);

    this.combatIndicator = false;
    this.round = 0;
};

Combat.prototype.nextRound = function () {
    this.round++;
};


module.export = { Combat };
