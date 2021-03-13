const { InventoryHandler } = require('./InventoryHandler');
const { AbilityHandler } = require('./AbilityHandler');
const { EffectHandler } = require('./EffectHandler');

class Monster {
    constructor(){
        this.inventory = new InventoryHandler(); //... This needs to handle drop chances
        this.abilities = new AbilityHandler();
        this.effects = new EffectHandler();
        this.generate();
    }
}

Monster.prototype.generate = function () {
//... use a random num
//... get the stats for the monster that coincides it.

};

module.export = { Monster };



// {
//     name: 'Dragon', 
//     type: 'Dragon', 
//     locations: [], 
//     level: 5, 
//     hpMax: 200, 
//     power: 25, 
//     magic: 25, 
//     defense: 25, 
//     exp: 500, 
//     gold: 500, 
//     AbilityHandler,
//     EffectHandler
//     drops: [
//         { item: getItem('Plate'), chance: 10 },
//         { item: getItem('Ring of Healing'), chance: 10 },
//         { item: getItem('Great Sword'), chance: 10 },
//         { item: getItem('Great Axe'), chance: 2 },
//         { item: getItem('Ring of Strength'), chance: 2 },
//         { item: getItem('Scroll of Burning'), chance: 100 },
//     ]
// },