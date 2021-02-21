const { random } = require('./random.js');
const roster = require('../lists/monster');
const items = require('../lists/items.js');

class Player {
    constructor(name = 'enemy', isPlayer = false, hpMax = 50, power = 4,
        defense = 2, speed = 10, exp = 0, gold = 1000000) {
        this.name = name;
        this.level = 1;
        this.exp = exp;
        this.expNeeded = 100;
        this.gold = gold;
        this.dead = false;
        this.isPlayer = isPlayer;

        this.critChance = 20;
        this.fumbleChance = 1;

        this.aggro = 0;

        this.baseStats.hpMax = hpMax;
        this.baseStats.power = power;
        this.baseStats.defense = defense;
        this.baseStats.speed = speed;
        this.hp = this.baseStats.hpMax;

        this.addToInventory(getItem('Club'), 1);
        this.addToInventory(getItem('Wand of Everything'), 1);
        this.addToInventory(getItem('Scroll of Healing'), 2);
        this.addToInventory(getItem('Scroll of Burning'), 1);
        this.addToInventory(getItem('Healing Potion'), 2);
        
        this.equip('Club');

        //... Need a current load out. Then equip to the load out.
        this.loadouts.push({name: 'Solo', equipment: []});
        this.loadouts.push({name: 'Tank', equipment: []});
        this.loadouts.push({name: 'Damage', equipment: []});
        this.loadouts.push({name: 'Support', equipment: []});

        this.calcStats();
    }
    equipment = [];
    inventory = [];
    bonus = [];
    loadouts = [];
    effects = [];
    abilities = [];
    level;
    exp;
    expNeeded;
    gold;
    dead;
    isPlayer;
    hp;
    baseStats = {
        hpMax: Number,
        power: Number,
        defense: Number,
        speed: Number
    }
    bonusStats = {
        hpMax: Number,
        power: Number,
        defense: Number,
        speed: Number
    }

    equipmentStats = {
        hpMax: Number,
        power: Number,
        defense: Number,
        speed: Number
    }
    totalStats = {
        hpMax: Number,
        power: Number,
        defense: Number,
        speed: Number
    }
    getSpeed = function () {
        return this.speed;
    }
    getItem = function (name) {
        return items.find(e => e.name === name);
    }
}

Player.prototype.heal = function (healing) {
    const report = [];
    if ((this.hp + healing) > this.totalStats.hpMax) {
        healing = this.totalStats.hpMax - this.hp;
    }
    report.push(`${this.name} gains ${healing} health!`);
    this.hp += healing;
    if (this.dead) {
        this.dead = false;
    }
    return report.join('\n');
}

Player.prototype.damage = function (amount) {
    this.hp -= amount;
    const report = [];
    if (this.hp <= 0) {
        this.hp = 0;
        this.dead = true;
        report.push(`${this.name} is dead!!`);
    }
    if (report.length) {
        return report.join('\n');
    }
    return;
}

Player.prototype.attack = function (target) {
    const report = [];
    let numberOfAttacks = 1;
    const multiAttack = this.effects.find(e => e.name.toUpperCase() === 'MULTI ATTACK');
    const lifeSteal = this.effects.find(e => e.name.toUpperCase() === 'LIFE STEAL');
    const dmgMitigation = target.effects.find(e => e.name.toUpperCase() === 'DAMAGE MITIGATION');
    numberOfAttacks += multiAttack ? multiAttack.value : 0;

    for (i = 1; i <= numberOfAttacks; i++ ) {
        const mitigationAmount = dmgMitigation ? dmgMitigation.value / 100 : 0;
        const attack = Math.floor((this.totalStats.power - (this.totalStats.power * mitigationAmount)) * (100 / (100 + target.totalStats.defense)));
    
        const dice = random(20) + 1;
        let modifier = 1;
    
        if (dice <= 5) modifier = .5;
        else if (dice > 5 && dice <= 10) modifier = .65;
        else if (dice > 10 && dice <= 15) modifier = .85;
    
        if (this.critChance <= dice) modifier = 2;
        if (this.fumbleChance >= dice) modifier = 0;
        
        const modifiedDamage = Math.floor(attack * modifier);
        const damage = modifiedDamage >= 0 ? modifiedDamage : 0;
        this.aggro += damage * 5;

        report.push('```css');
        // report.push(` [Dice] ${dice} [modifier] ${modifier} [attack] ${attack} [mitigationAmount] ${mitigationAmount} [amount mitigated] ${(this.totalStats.power * mitigationAmount)} [modifiedDamage] ${modifiedDamage} [damage] ${damage} `);
        report.push(`${this.name} dealt ${damage} damage to ${target.name}`);
       
        if (lifeSteal) {
            const lifeStolen = lifeSteal.valueType === 'static' ? lifeSteal.value : Math.floor(damage * lifeSteal.value / 100);
            if (lifeStolen > 0) {
                report.push(`${this.name} regained ${lifeStolen} hp from the attack`);
                this.heal(lifeStolen);
            }
        }

        report.push('```');
        report.push(target.damage(damage));
    }

    return report.join('\n');
}

Player.prototype.showInventory = function () {
    const report = [];
    if (!this.inventory[0]) {
        report.push(`You don't have anything in your inventory.`);
    }
    else {
        this.inventory.forEach(item => {
            const equipped = this.equipment.find(e => e.name === item.name) ? '[E]' : '';
            let itemInfo = `[${item.type}] ${equipped} ${item.name} ${item.quantity} :`;
            if (item.requirements && item.requirements[0]) {
                item.requirements.forEach(e => {
                    itemInfo += ` [${e.name} ${e.value}] `;
                })
            }
            if (item.stats) {
                if(item.stats.hpMax) itemInfo += ` [Max Hp +${item.stats.hpMax}] `;
                if(item.stats.power) itemInfo += ` [Power +${item.stats.power}] `;
                if(item.stats.defense) itemInfo += ` [Defense +${item.stats.defense}] `;
                if(item.stats.speed) itemInfo += ` [Speed +${item.stats.speed}] `;
            }
            report.push(itemInfo);
        });
    }
    
    if (report.length) {
        return report.join('\n');
    }
    return;
}

Player.prototype.levelUp = function () {
    const report = [];
    const exponent = 1.5;
    const baseXp = 100;
    while (this.exp >= this.expNeeded) {
        this.level++;
        // this.expNeeded += (4 * (level ^ 3)) / 5;
        this.expNeeded += Math.floor(baseXp * (this.level ^ exponent));
        this.baseStats.hpMax += 5;
        this.baseStats.power += 1;
        this.baseStats.defense += 1;
        this.hp = this.totalStats.hpMax;
        // Need to add stats and skill points
        this.calcStats();
        report.push(`${this.name} is now level ${this.level} `);
    }
    return report.join('\n');
}

Player.prototype.equip = function (itemName) {
    const report = [];
    const oldEquipment = [];
    let qualified = true;
    let equippable = false;
    const item = this.getFromInventory(itemName, false);
    if (!item && !item.type) {
        report.push(`Cannot find ${itemName} in your inventory.`);
        return report.join('\n');
    }

    const itemTypes = ['Main Hand', 'Off Hand', 'Armor', 'Ring', '2-Handed'];
    itemTypes.forEach(e => {
        if(e === item.type) equippable = true;
    })
    
    if (!equippable) {
        report.push(`That item cannot be equipped.`);
        return report.join('\n');
    }

    if(item.requirements[0]) {
        item.requirements.forEach( e => {
            if (e.name === 'level' && this.level < e.value) qualified = false;
            if (e.name === 'power' && this.totalStats.power < e.value) qualified = false;
            if (e.name === 'defense' && this.totalStats.defense < e.value) qualified = false;
            if (e.name === 'speed' && this.totalStats.speed < e.value) qualified = false;
            if (e.name === 'hpMax' && this.totalStats.hpMax < e.value) qualified = false;
        })
    }

    if (!qualified) {
        report.push(`You don't meet the requirements for this item.`);
        return report.join('\n');
    }

    if (item.type === '2-Handed') {
        oldEquipment.push(this.equipment.find(e => e.type === 'Main Hand'));
        oldEquipment.push(this.equipment.find(e => e.type === 'Off Hand'));
    }
    else if(item.type === 'Main Hand' || item.type === 'Off Hand') {
        oldEquipment.push(this.equipment.find(e => e.type === '2-Handed'));
    }
    
    oldEquipment.push(this.equipment.find(e => e.type === item.type));
    
    if (oldEquipment[0]){
        oldEquipment.forEach(e => {
            if(e && e.name) {
                report.push(`${e.name} was unequipped!`);
                this.equipment.splice(this.equipment.indexOf(e), 1);
            }
        })
    }

    this.equipment.push(item);
    report.push(`${item.name} equipped!`);
    this.calcStats();
    return report.join('\n');
}
Player.prototype.calcStats = function () {
    this.totalStats.hpMax = 0;
    this.totalStats.power = 0;
    this.totalStats.defense = 0;
    this.totalStats.speed = 0;
    this.bonusStats.hpMax = 0;
    this.bonusStats.power = 0;
    this.bonusStats.defense = 0;
    this.bonusStats.speed = 0;
    this.equipmentStats.hpMax = 0;
    this.equipmentStats.power = 0;
    this.equipmentStats.defense = 0;
    this.equipmentStats.speed = 0;

    // Calc equipment bonus
    if (this.equipment[0]) {
        this.equipment.forEach(e => {
            this.totalStats.hpMax += e.stats.hpMax ? e.stats.hpMax : 0,
            this.totalStats.power += e.stats.power ? e.stats.power : 0,
            this.totalStats.defense += e.stats.defense ? e.stats.defense : 0,
            this.totalStats.speed += e.stats.speed ? e.stats.speed : 0
    
            this.equipmentStats.hpMax += e.stats.hpMax ? e.stats.hpMax : 0,
            this.equipmentStats.power += e.stats.power ? e.stats.power : 0,
            this.equipmentStats.defense += e.stats.defense ? e.stats.defense : 0,
            this.equipmentStats.speed += e.stats.speed ? e.stats.speed : 0
        });
    }

    // Calc bonus bonus
    if (this.bonus[0]) {
        this.bonus.forEach(e => {
            this.totalStats.hpMax += e.stats.hpMax ? e.stats.hpMax : 0,
            this.totalStats.power += e.stats.power ? e.stats.power : 0,
            this.totalStats.defense += e.stats.defense ? e.stats.defense : 0,
            this.totalStats.speed += e.stats.speed ? e.stats.speed : 0
    
            this.bonusStats.hpMax += e.stats.hpMax ? e.stats.hpMax : 0,
            this.bonusStats.power += e.stats.power ? e.stats.power : 0,
            this.bonusStats.defense += e.stats.defense ? e.stats.defense : 0,
            this.bonusStats.speed += e.stats.speed ? e.stats.speed : 0
        });
    }

    // Calc total bonus
        this.totalStats.hpMax += this.baseStats.hpMax,
        this.totalStats.power += this.baseStats.power,
        this.totalStats.defense += this.baseStats.defense,
        this.totalStats.speed +=this.baseStats.speed,
        this.hp = this.totalStats.hpMax;

        this.updateAbilities();

}
Player.prototype.updateAbilities = function () {
    //.. Will need to do something different when other players buff
    this.effects.splice(0, this.effects.length);
    this.abilities.splice(0, this.abilities.length);

    // Calc equipment bonus
    if (this.equipment[0]) {
        this.equipment.forEach(e => {
            if (e.effects && e.effects[0]) {
                e.effects.forEach(effect => {
                    this.effects.push(effect);
                })
            }
            if (e.abilities && e.abilities[0]) {
                e.abilities.forEach(ability => {
                    this.abilities.push(ability);
                })
            }
        });
    }
}

Player.prototype.addToInventory = function (items, quantity = 1) {
    const report = [];

    if (items[0]) {
        items.forEach(item => {
            const inventoryItem = this.inventory.find(e => e.name === item.name);
            if (inventoryItem) {
                inventoryItem.quantity += quantity;
            }
            else {
                item.quantity = quantity;
                this.inventory.push(item);
            }
        })
    }
    else if (items) {
        const inventoryItem = this.inventory.find(e => e.name === items.name);
        if (inventoryItem) {
            inventoryItem.quantity += quantity;
        }
        else {
            items.quantity = quantity;
            this.inventory.push(items);
        }
    }

    this.inventory.sort(function(a, b) {
        var nameA = a.type.toUpperCase();
        var nameB = b.type.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });

    return report.join('\n');
}

Player.prototype.getFromInventory = function (itemName, remove = true) {
    if (!this.inventory[0]) {
        return false;
    }
    const item = this.inventory.find(e => e.name.toUpperCase().includes(itemName.toUpperCase()));
    //... need to give choice if mulitple items return
    //... Also need to remove from inventory or drop quanitity
    if (item && remove) {
        item.quantity--;
        if (item.quantity <= 0) {
            this.inventory.splice(this.inventory.indexOf(item), 1);
        }
        return item;
    }
    return item;
}

Player.prototype.getAbilityByName = function (abilityName) {
    if (!this.abilities[0]) {
        return false;
    }
    const ability = this.abilities.find(e => e.name.toUpperCase().includes(abilityName.toUpperCase()));
    //... need to give choice if mulitple items return
    //... Also need to remove from inventory or drop quanitity
    return ability;
}

Player.prototype.getEquipment = function (typeName) {
    let placeHolder = {name: 'none'};
    let equippedItem = this.equipment.find(e => e.type === typeName) || placeHolder;

    return equippedItem;
}

Player.prototype.generateMonster = function () {

    const monster = roster[random(roster.length)];
    this.name = monster.name;
    this.baseStats.hpMax = monster.hpMax;
    this.baseStats.power = monster.power;
    this.baseStats.defense = monster.defense;
    this.baseStats.speed = monster.speed;
    this.hp = monster.hpMax;
    this.level = monster.level;
    this.exp = monster.exp;
    this.expNeeded = monster.exp * 10;
    this.gold = monster.gold;
    this.trophyType = monster.trophyType;
    this.dead = false;
    this.isPlayer = false;
    
    this.drops = monster.drops;
    this.calcStats();
    this.effects = monster.effects;
}

module.exports = { Player };
