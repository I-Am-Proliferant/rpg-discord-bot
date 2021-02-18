const items = require('./items.js');
getItem = function (name) {
    return items.find(e => e.name === name);
}
module.exports = [
    {name: 'Normal Slime', hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('healing'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}
    ] },
    { name: 'Green Slime', hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25 , drops:[
        {item:getItem('healingBand'), chance:1},
        {item:getItem('healing'), chance:75},
        {item:getItem('token'), chance:100}

    ] },
    { name: 'Blue Slime', hpMax: 10, power: 5, defense: 8, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('buckler'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Red Slime', hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('greatSword'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Purple Slime', hpMax: 10, power: 5, defense: 3, speed: 15, exp: 5, gold: 25, drops:[
        {item:getItem('plainBand'), chance:10},
        {item:getItem('leather'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Skeleton', hpMax: 10, power: 5, defense: 2, speed: 5, exp: 25, gold: 25, drops:[
        {item:getItem('sword'), chance:10},
        {item:getItem('healing'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Gnoll', hpMax: 10, power: 5, defense: 5, speed: 8, exp: 35, gold: 25, drops:[
        {item:getItem('sword'), chance:10},
        {item:getItem('burn'), chance:10},
        {item:getItem('token'), chance:100}

    ]  },
    { name: 'Guardian', hpMax: 10, power: 5, defense: 15, speed: 5, exp: 50, gold: 25, drops:[
        {item:getItem('greatSword'), chance:10},
        {item:getItem('plate'), chance:10}
    ]  },
    { name: 'Dragon', hpMax: 10, power: 5, defense: 20, speed: 10, exp: 100, gold: 25, drops:[
        {item:getItem('plate'), chance:25},
        {item:getItem('burn'), chance:100},
        {item:getItem('healingBand'), chance:25},
        {item:getItem('greatSword'), chance:25}
    ] }
];
