const { getItem } = require('./items.js');

module.exports = [
    {
        name: 'Normal Slime', trophyType: 'Slime', locations: [], level: 1, hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, effects: [], drops: [
            { item: getItem('Scroll of Healing'), chance: 10 },
            { item: getItem('Club'), chance: 10 },
            { item: getItem('Rapier'), chance: 2 },
        ]
    },
    {
        name: 'Green Slime', trophyType: 'Slime', locations: [], level: 1, hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, effects: [{ name: 'Regeneration', valueType: 'static', value: 3, description: 'Health gained every turn' },], drops: [
            { item: getItem('Ring of Healing'), chance: 1 },
            { item: getItem('Scroll of Healing'), chance: 75 },
        ]
    },
    {
        name: 'Blue Slime', trophyType: 'Slime', locations: [], level: 1, hpMax: 10, power: 5, defense: 8, speed: 5, exp: 25, gold: 25, effects: [], drops: [
            { item: getItem('Buckler'), chance: 10 },
            { item: getItem('Scroll of Burning'), chance: 10 },
        ]
    },
    {
        name: 'Red Slime', trophyType: 'Slime', locations: [], level: 1, hpMax: 10, power: 5, defense: 3, speed: 5, exp: 25, gold: 25, effects: [], drops: [
            { item: getItem('Big Club'), chance: 10 },
            { item: getItem('Scroll of Burning'), chance: 10 },
        ]
    },
    {
        name: 'Purple Slime', trophyType: 'Slime', locations: [], level: 1, hpMax: 10, power: 5, defense: 3, speed: 15, exp: 25, gold: 25, effects: [], drops: [
            { item: getItem('Ring of Quickness'), chance: 10 },
            { item: getItem('Leather'), chance: 10 },
        ]
    },
    {
        name: 'Skeleton', trophyType: 'Skeleton', locations: [], level: 2, hpMax: 15, power: 8, defense: 2, speed: 5, exp: 25, gold: 45, effects: [], drops: [
            { item: getItem('Short Sword'), chance: 10 },
            { item: getItem('Buckler'), chance: 10 },
            { item: getItem('Healing Potion'), chance: 10 },
        ]
    },
    {
        name: 'Gnoll', trophyType: 'Gnoll', locations: [], level: 2, hpMax: 25, power: 10, defense: 5, speed: 8, exp: 75, gold: 25, effects: [], drops: [
            { item: getItem('Spear'), chance: 10 },
            { item: getItem('Scroll of Burning'), chance: 10 },
        ]
    },
    {
        name: 'Goblin', trophyType: 'Goblin', locations: [], level: 1, hpMax: 15, power: 8, defense: 2, speed: 20, exp: 25, gold: 75, effects: [], drops: [
            { item: getItem('Short Sword'), chance: 10 },
            { item: getItem('Scroll of Burning'), chance: 10 },
        ]
    },
    {
        name: 'Hob Goblin', trophyType: 'Goblin', locations: [], level: 2, hpMax: 25, power: 10, defense: 5, speed: 15, exp: 75, gold: 50, effects: [], drops: [
            { item: getItem('Long Sword'), chance: 10 },
            { item: getItem('Studded Leather'), chance: 10 },
        ]
    },
    {
        name: 'Orc', trophyType: 'Orc', locations: [], level: 3, hpMax: 55, power: 15, defense: 10, speed: 10, exp: 100, gold: 100, effects: [{ name: 'Multi Attack', value: 1, description: 'Additional strikes when the attack action is used.' }], drops: [
            { item: getItem('Long Sword'), chance: 10 },
            { item: getItem('Chain'), chance: 10 },
        ]
    },
    {
        name: 'Guardian', trophyType: 'Construct', locations: [], level: 4, hpMax: 75, power: 10, defense: 15, speed: 5, exp: 200, gold: 200, effects: [{ name: 'Regeneration', valueType: 'static', value: 10, description: 'Health gained every turn' },], drops: [
            { item: getItem('Battle Axe'), chance: 10 },
            { item: getItem('Great Axe'), chance: 2 },
            { item: getItem('Scale'), chance: 10 },
            { item: getItem('Healing Potion'), chance: 10 },
            { item: getItem('Ring of Vitality'), chance: 10 },
        ]
    },
    {
        name: 'Dragon', trophyType: 'Dragon', locations: [], level: 5, hpMax: 200, power: 25, defense: 25, speed: 25, exp: 500, gold: 500, effects: [{ name: 'Multi Attack', value: 1, description: 'Additional strikes when the attack action is used.' }], drops: [
            { item: getItem('Plate'), chance: 10 },
            { item: getItem('Ring of Healing'), chance: 10 },
            { item: getItem('Great Sword'), chance: 10 },
            { item: getItem('Great Axe'), chance: 2 },
            { item: getItem('Ring of Strength'), chance: 2 },
            { item: getItem('Scroll of Burning'), chance: 100 },
        ]
    },
    {
        name: 'Reaper', trophyType: 'Reaper', locations: [], level: 8, hpMax: 500, power: 175, defense: 45, speed: 1, exp: 5000, gold: 5000, effects: [{ name: 'Life Steal', valueType: 'percent', value: 10, description: 'Damage returned as health' }, { name: 'Multi Attack', value: 1, description: 'Additional strikes when the attack action is used.' }], drops: [
            { item: getItem('Plate'), chance: 10 },
            { item: getItem('Ring of Healing'), chance: 10 },
            { item: getItem('Great Sword'), chance: 10 },
            { item: getItem('Ring of Strength'), chance: 10 },
        ]
    },
];
