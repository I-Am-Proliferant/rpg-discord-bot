const { Equipment } = require('./equipment.js');
const { Scrolls } = require('./scrolls.js');
const { random } = require('./random.js');
const roster = require('../lists/monster');
const items = require('../lists/items.js');

class Player {
    constructor(name = 'enemy', isPlayer = false, hpMax = 100, power = 33,
        defense = 5, speed = 10, exp = 0, gold = 0) {
        this.name = name;
        this.hpMax = hpMax;
        this.hp = hpMax;
        this.power = power;
        this.defense = defense;
        this.speed = speed;
        this.level = 1;
        this.exp = exp;
        this.expNeeded = 100;
        this.gold = gold;
        this.dead = false;
        this.isPlayer = isPlayer;

        this.equipmentStats.hpMax = 0;
        this.equipmentStats.power = 0;
        this.equipmentStats.defense = 0;
        this.equipmentStats.speed = 0;

        getItem('sword');
        this.addToInventory(getItem('sword'), 1);
        this.addToInventory(getItem('shield'), 1);
        this.addToInventory(getItem('leather'), 1);
        this.addToInventory(getItem('plainBand'), 1);
        // this.addToInventory(new Equipment('shield', 'left', { 'defense': 5 }), 1);
        // this.addToInventory(new Equipment('leather', 'armor', { 'hpMax': 5 }), 1);
        // this.addToInventory(new Equipment('plainBand', 'ring', { 'speed': 5 }), 1);
        
        this.addToInventory(getItem('healing'), 3);
        this.addToInventory(getItem('burn'), 3);
        
        // this.addToInventory(new Scrolls(), 2);
        // this.addToInventory(new Scrolls(), 2);
        // this.addToInventory(new Scrolls(),3);

        this.equip('sword');
        this.equip('shield');
        this.equip('leather');
        this.equip('plainBand');
    }
    equipment = [];
    inventory = [];
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
    if ((this.hp + healing) > this.hpMax) {
        healing = this.hpMax - this.hp;
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
    const attack = Math.floor(((this.power + this.equipmentStats.power) / 3) + random((this.power + this.equipmentStats.power) / 2));
    const damage = Math.floor(attack * (100 / (100 + target.defense)));
    // const damage = Math.floor(attack * ( 1 - ( 0.06 * target.defense + target.equipmentStats.defense ) / ( 1 + 0.06 * target.defense + target.equipmentStats.defense )));
    // const damage = this.power * (100 / (100 + target.defense));
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
            report.push(`[${item.type}] ${item.name} x${item.quantity}`);
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
    if (this.exp >= this.expNeeded) {
        this.level++;
        this.expNeeded = Math.floor(baseXp * (this.level ^ exponent));
        this.hpMax += 10;
        this.attack += 3;
        this.defense += 3;
        this.hp = this.hpMax;
        // Need to add stats and skill points

        report.push(`${this.name} is now level ${this.level} `);
    }
    return report.join('\n');
}
Player.prototype.equip = function (itemName) {
    const report = [];
    const item = this.getFromInventory(itemName, false)
    if (!item && !item.type) {
        report.push(`Cannot find ${itemName} in your inventory.`);
        return report.join('\n');
    }
    if (!item.type in ['right', 'left', 'armor', 'ring']) {
        report.push(`Cannot find ${itemName} in your inventory.`);
        return report.join('\n');
    }
    oldEquipment = this.equipment.find(e => e.type === item.type);
    if (oldEquipment) {
        this.equipment.splice(this.equipment.indexOf(oldEquipment), 2);
    }
    this.equipment.push(item);
    report.push(`${item} equipped!`);
    this.calcEquipmentBonus();
    return report.join('\n');
}
Player.prototype.calcEquipmentBonus = function () {
    this.equipmentStats.hpMax = 0;
    this.equipmentStats.power = 0;
    this.equipmentStats.defense = 0;
    this.equipmentStats.speed = 0;
    this.equipment.forEach(e => {
        this.equipmentStats.hpMax += e.stats.hpMax,
            this.equipmentStats.power += e.stats.power,
            this.equipmentStats.defense += e.stats.defense,
            this.equipmentStats.speed += e.stats.speed
    });
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
        item.quantity -= 1;
        if (item.quantity <= 0) {
            this.inventory.splice(this.inventory.indexOf(item), 2);
        }
        return item;
    }
    return item;
}
Player.prototype.getEquipment = function (typeName) {
    let equipment = new Equipment('none', 'right', {}, 1);
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
