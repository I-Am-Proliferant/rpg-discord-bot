const { Equipment } = require('./equipment.js');
const { random } = require('./random.js');
const roster = require('../lists/monster');
const items = require('../lists/items.js');

class Player {
    constructor(name = 'enemy', isPlayer = false, hpMax = 100, power = 4,
        defense = 2, speed = 10, exp = 0, gold = 1000) {
        this.name = name;
        this.level = 3;
        this.exp = exp;
        this.expNeeded = 100;
        this.gold = gold;
        this.dead = false;
        this.isPlayer = isPlayer;

        this.critChance = 20;
        this.fumbleChance = 1;

        this.baseStats.hpMax = hpMax;
        this.baseStats.power = power;
        this.baseStats.defense = defense;
        this.baseStats.speed = speed;
        this.hp = this.baseStats.hpMax;

        this.addToInventory(getItem('Sword'), 1);
        // this.addToInventory(getItem('shield'), 1);
        // this.addToInventory(getItem('leather'), 1);
        // this.addToInventory(getItem('quickBand'), 1);
        this.addToInventory(getItem('Big Club'), 1);
        this.addToInventory(getItem('Great Sword'), 1);
        this.addToInventory(getItem('Scroll of Healing'), 3);
        this.addToInventory(getItem('Scroll of Burning'), 3);
        this.addToInventory(getItem('Healing Potion'), 3);
        
        this.equip('Sword');
        // this.equip('shield');
        // this.equip('leather');
        // this.equip('quickBand');

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
    //... Need to add equipment stats
    // const attack = Math.floor((this.totalStats.power / 2) + random(this.totalStats.power));
    const attack = Math.floor(this.totalStats.power * (100 / (100 + target.totalStats.defense)));
    // const damage = Math.floor(attack * (100 / (100 + target.totalStats.defense)));
    // const damage = Math.floor(attack * ( 1 - ( 0.06 * target.defense + target.equipmentStats.defense ) / ( 1 + 0.06 * target.defense + target.equipmentStats.defense )));
    // const damage = this.power * (100 / (100 + target.defense));

    const dice = random(20) + 1;
    let modifier = 1;

    if (dice <= 5) {
        modifier = .5;
    }
    else if (dice > 5 && dice <= 10) {
        modifier = .65;
    }
    else if (dice > 10 && dice <= 15) {
        modifier = .85;
    }

    if (this.critChance <= dice) modifier = 2;
    if (this.fumbleChance >= dice) modifier = 0;
    
    const modifiedAttack = Math.floor(attack * modifier);
    const damage = modifiedAttack >= 0 ? modifiedAttack : 0;
    report.push('```css');
    report.push(` [Dice] ${dice} [modifier] ${modifier} [attack] ${attack} [modifiedAttack] ${modifiedAttack} [damage] ${damage} `);
    report.push('```');
    report.push(`${this.name} dealt ${damage} damage to ${target.name}`);
    report.push(target.damage(damage));
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
            item.requirements.forEach(e => {
                itemInfo += ` [${e.name} ${e.value}] `;
            })
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

    const itemTypes = ['right', 'left', 'armor', 'ring', '2hand'];
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

    if (item.type === '2hand') {
        oldEquipment.push(this.equipment.find(e => e.type === 'right'));
        oldEquipment.push(this.equipment.find(e => e.type === 'left'));
    }
    else if(item.type === 'right' || item.type === 'left') {
        oldEquipment.push(this.equipment.find(e => e.type === '2hand'));
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
        var nameA = a.type.toUpperCase(); // ignore upper and lowercase
        var nameB = b.type.toUpperCase(); // ignore upper and lowercase
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
    const item = this.inventory.find(e => e.name === itemName);
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
Player.prototype.getEquipment = function (typeName) {
    let equipment = new Equipment('none', typeName, {}, 1);
    let oldEquipment = this.equipment.find(e => e.type === typeName) || equipment;

    return oldEquipment;
}
Player.prototype.generateMonster = function () {

    const monster = roster[random(roster.length)];
    this.name = monster.name;
    this.hpMax = monster.hpMax;
    this.hp = monster.hpMax;
    this.power = monster.power;
    this.defense = monster.defense;
    this.speed = monster.speed;
    this.level = 1;
    this.exp = monster.exp;
    this.expNeeded = 100;
    this.gold = monster.gold;
    this.dead = false;
    this.isPlayer = false;

    this.drops = monster.drops;

}

module.exports = { Player };
