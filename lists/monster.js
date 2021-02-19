const items = require('./items.js');
getItem = function (name) {
    return items.find(e => e.name === name);
}
module.exports = [
    {name: 'Normal Slime', hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('Scroll of Healing'), chance:10},
        {item:getItem('Scroll of Burning'), chance:10},
        {item:getItem('Token'), chance:100}
    ] },
    { name: 'Green Slime', hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25 , drops:[
        {item:getItem('Ring of Healing'), chance:1},
        {item:getItem('Scroll of Healing'), chance:75},
        {item:getItem('Token'), chance:100}

    ] },
    { name: 'Blue Slime', hpMax: 10, power: 5, defense: 8, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('Buckler'), chance:10},
        {item:getItem('Scroll of Burning'), chance:10},
        {item:getItem('Token'), chance:100}

    ]  },
    { name: 'Red Slime', hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('Big Club'), chance:10},
        {item:getItem('Scroll of Burning'), chance:10},
        {item:getItem('Token'), chance:100}

    ]  },
    { name: 'Purple Slime', hpMax: 10, power: 5, defense: 3, speed: 15, exp: 5, gold: 25, drops:[
        {item:getItem('Ring of Quickness'), chance:10},
        {item:getItem('Leather'), chance:10},
        {item:getItem('Token'), chance:100}

    ]  },
    { name: 'Skeleton', hpMax: 10, power: 5, defense: 2, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('Sword'), chance:10},
        {item:getItem('Buckler'), chance:10},
        {item:getItem('Healing Potion'), chance:10},
        {item:getItem('Token'), chance:100}

    ]  },
    { name: 'Gnoll', hpMax: 10, power: 5, defense: 5, speed: 8, exp: 35, gold: 25, drops:[
        {item:getItem('Long Sword'), chance:10},
        {item:getItem('Scroll of Burning'), chance:10},
        {item:getItem('Token'), chance:100}

    ]  },
    { name: 'Guardian', hpMax: 10, power: 5, defense: 15, speed: 5, exp: 50, gold: 25, drops:[
        {item:getItem('Great Sword'), chance:10},
        {item:getItem('Plate'), chance:10},
        {item:getItem('Healing Potion'), chance:10},
        {item:getItem('Ring of Vitality'), chance:10},
        {item:getItem('Token'), chance:100}

    ]  },
    { name: 'Dragon', hpMax: 10, power: 5, defense: 20, speed: 10, exp: 100, gold: 25, drops:[
        {item:getItem('Plate'), chance:25},
        {item:getItem('Scroll of Burning'), chance:100},
        {item:getItem('Ring of Healing'), chance:25},
        {item:getItem('Great Sword'), chance:25},
        {item:getItem('strongBand'), chance:25},
        {item:getItem('Token'), chance:100}

    ] }
];
