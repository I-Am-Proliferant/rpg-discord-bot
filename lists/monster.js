const items = require('./items.js');
getItem = function (name) {
    return items.find(e => e.name === name);
}
module.exports = [
    {name: 'Normal Slime', hpMax: 50, power: 20, defense: 3, speed: 5, exp: 25, gold: 30, drops:[
        {item:getItem('healing'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}
    ] },
    { name: 'Green Slime', hpMax: 75, power: 20, defense: 3, speed: 5, exp: 40, gold: 30 , drops:[
        {item:getItem('healingBand'), chance:1},
        {item:getItem('healing'), chance:75},
        {item:getItem('token'), chance:100}

    ] },
    { name: 'Blue Slime', hpMax: 50, power: 25, defense: 8, speed: 5, exp: 25, gold: 65, drops:[
        {item:getItem('buckler'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Red Slime', hpMax: 50, power: 30, defense: 3, speed: 5, exp: 30, gold: 40, drops:[
        {item:getItem('greatSword'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Purple Slime', hpMax: 50, power: 25, defense: 3, speed: 15, exp: 40, gold: 40, drops:[
        {item:getItem('plainBand'), chance:10},
        {item:getItem('leather'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Skeleton', hpMax: 45, power: 30, defense: 2, speed: 5, exp: 30, gold: 25, drops:[
        {item:getItem('sword'), chance:10},
        {item:getItem('healing'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Gnoll', hpMax: 125, power: 45, defense: 5, speed: 8, exp: 250, gold: 250, drops:[
        {item:getItem('sword'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Guardian', hpMax: 250, power: 30, defense: 15, speed: 5, exp: 400, gold: 300, drops:[
        {item:getItem('greatSword'), chance:10},
        {item:getItem('plate'), chance:10}
    ]  },
    { name: 'Dragon', hpMax: 500, power: 50, defense: 20, speed: 10, exp: 2000, gold: 2500, drops:[
        {item:getItem('plate'), chance:25},
        {item:getItem('burn'), chance:100},
        {item:getItem('healingBand'), chance:25},
        {item:getItem('greatSword'), chance:25}
    ] }
];
