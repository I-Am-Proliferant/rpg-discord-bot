const { Equipment } = require('./equipment.js');
const { Scrolls } = require('./scrolls.js');
const { random } = require('./random.js');

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

        this.addToInventory(new Equipment('sword', 'right', { 'power': 15 }), 1);
        this.addToInventory(new Equipment('shield', 'left', { 'defense': 5 }), 1);
        this.addToInventory(new Equipment('leather', 'armor', { 'hpMax': 5 }), 1);
        this.addToInventory(new Equipment('plainBand', 'ring', { 'speed': 5 }), 1);
        this.addToInventory(new Scrolls(), 2);
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
}

Player.prototype.heal = function (healing) {
    const report =[];
    if ((this.hp + healing)> this.hpMax) {
        this.healing = this.hpMax - this.hp;
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
    return report.join('\n');
}

Player.prototype.attack = function (target) {
    const report = [];
    //... Need to add equipment stats
    const attack = Math.floor(((this.power + this.equipmentStats.power) / 3) + random(this.power / 2));
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
    return report.join('\n');
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
    const roster = [
        { name: 'Normal Slime', hpMax: 50, power: 25, defense: 3, speed: 5, exp: 25, gold: 30 },
        { name: 'Green Slime', hpMax: 50, power: 25, defense: 3, speed: 5, exp: 25, gold: 30 },
        { name: 'Blue Slime', hpMax: 50, power: 25, defense: 3, speed: 5, exp: 25, gold: 30 },
        { name: 'Red Slime', hpMax: 50, power: 25, defense: 3, speed: 5, exp: 25, gold: 30 },
        { name: 'Purple Slime', hpMax: 50, power: 25, defense: 3, speed: 5, exp: 25, gold: 30 },
        { name: 'Skeleton', hpMax: 45, power: 30, defense: 2, speed: 5, exp: 30, gold: 25 },
        { name: 'Gnoll', hpMax: 125, power: 45, defense: 5, speed: 8, exp: 250, gold: 250 },
        { name: 'Guardian', hpMax: 250, power: 30, defense: 15, speed: 5, exp: 400, gold: 250 },
        { name: 'Dragon', hpMax: 500, power: 50, defense: 20, speed: 10, exp: 2000, gold: 2500 }
    ];

    monster = roster[random(roster.length) - 1];
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

}

module.exports = { Player };
