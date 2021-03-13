const { InventoryHandler } = require('./InventoryHandler');
const { AbilityHandler } = require('./AbilityHandler');
const { EffectHandler } = require('./EffectHandler');
const { EquipmentHandler } = require('./EquipmentHandler');

class Player {
    constructor(userName){
        this.name = userName;

        this.maxHp = 20;
        this.currentHp = this.maxHp;
        this.maxMana = 20;
        this.currentMana = this.maxMana;

        this.power = 2;
        this.magic = 2;

        this.level = 1;
        this.exp = 0;
        this.expNeeded = 100;

        this.hasAction = true;

        this.inventory = new InventoryHandler();
        this.equipment = new EquipmentHandler();
        this.abilities = new AbilityHandler();
        this.effects = new EffectHandler();
    }
}

Player.prototype.levelUp = function () {
    while (exp >= this.expNeeded) {
        this.level++;
        this.maxHp += 5;
        this.hp = this.maxHp;
        this.power += 2;
        this.magic += 2;
    
        const expModifier = 1.5;
        const baseExp = 100;
        this.expNeeded += baseExp * (this.level ^ expModifier);
    }

};

module.export = { Player };
