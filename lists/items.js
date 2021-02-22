module.exports = [
    {name:'Token', type:'Coin', description:'Proof that you defeated an enemy'},
    {name:'Trophy', type:'Trophy', description:'Proof that you defeated an enemy'},
    
    {name:'Wand of Everything', type:'Main Hand', description:'Common sword', target: ['enemy'], 
        abilities: [
            {name:'Heal', type:'Ability', description: `Heals player for 10 - 20 hp`, target: ['self','player'], effects: [{ name: 'heal', uses: 5, usesMax: 5, duration: 0 }], range: { min: 10, max: 20 }},
            {name:'AOE Heal', type:'Ability', description: `Heals all players for 10 - 20 hp`, target: ['all players'], effects: [{ name: 'heal', uses: 1, usesMax: 1, duration: 0 }], range: { min: 10, max: 20 }},
            {name:'Burn', type:'Ability', description: `Burns enemy for 10 - 20 damage`, target: ['enemy'], effects: [{ name: 'burn', uses: 5, usesMax: 5, duration: 0 }], range: { min: 10, max: 20 }},
            {name:'Haste', type:'Ability', description: `Increases targets speed.`, target: ['self', 'player'], effects: [{ name: 'buff', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'speed' }] }], range: { min: 3, max: 7 }},
            {name:'Strength', type:'Ability', description: `Increases targets power`, target: ['self', 'player'], effects: [{ name: 'buff', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'power'}] }], range: { min: 3, max: 7 }},
            {name:'Iron Skin', type:'Ability', description: `Increases targets defense`, target: ['self', 'player'], effects: [{ name: 'buff', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'defense'}] }], range: { min: 3, max: 7 }},
            {name:'Bolster', type:'Ability', description: `Increases targets max life`, target: ['self', 'player'], effects: [{ name: 'buff', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'hpMax'}] }], range: { min: 3, max: 7 }},
            {name:'Slow', type:'Ability', description: `Decreases targets speed.`, target: ['enemy'], effects: [{ name: 'curse', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'speed'}] }], range: { min: 3, max: 7 }},
            {name:'Weaken', type:'Ability', description: `Decreases targets power.`, target: ['enemy'], effects: [{ name: 'curse', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'power'}] }], range: { min: 3, max: 7 }},
            {name:'Decay Armor', type:'Ability', description: `Decreases targets defense.`, target: ['enemy'], effects: [{ name: 'curse', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'defense'}] }], range: { min: 3, max: 7 }},
            {name:'Fraility', type:'Ability', description: `Decreases targets max life.`, target: ['enemy'], effects: [{ name: 'curse', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'hpMax'}] }], range: { min: 3, max: 7 }},
            {name:'Taunt', type:'Ability', description: `Generates a burst of aggro`, target: ['self'], effects: [{ name: 'taunt', uses: 5, usesMax: 5, duration: 0 }], range: { min: 5, max: 10 }},
        ],
        effects: [
            {name:'Regeneration',valueType: 'static', value:5, description:'Health gained every turn'},
            {name:'Life Steal',valueType: 'percent', value:25, description:'Damage returned as health'},
            {name:'Damage Mitigation',valueType: 'percent', value:25, description:'A significant boost to aggro'},
            {name:'Multi Attack',value:1,description:'Additional strikes when the attack action is used.'},
            {name:'Bonus', stats: [{name: 'exp', valueType: 'percent', value:5},{name: 'dmg',valueType: 'percent', value:5}],description:'A bonus increase to a stat'},
        ], range:{}, stats:{ }, value: 5000, requirements:[]},
    
    {name:'Club', type:'Main Hand', description:'Common sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 2 }, value: 500, requirements:[{name:'level',value:1}]},
    {name:'Short Sword', type:'Main Hand', description:'Common sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 3 }, value: 500, requirements:[{name:'level',value:1}]},
    {name:'Long Sword', type:'Main Hand', description:'Common sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 4 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Rapier', type:'Main Hand', description:'Common sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 3, 'speed': 3 }, value: 500, requirements:[{name:'level',value:1}]},
    {name:'Battle Axe', type:'Main Hand', description:'Common sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 5 }, value: 500, requirements:[{name:'level',value:1}]},
    {name:'Spear', type:'Main Hand', description:'Common sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 3 }, value: 500, requirements:[{name:'level',value:1}]},
    
    {name:'Big Club', type:'2-Handed', description:'Small tree', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 6, 'speed': -6 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Maul', type:'2-Handed', description:'Small tree', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 7, 'speed': -4 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Great Sword', type:'2-Handed', description:'Common two-handed sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 8, 'speed': -1 }, value: 750, requirements:[{name:'level',value:3}]},
    {name:'Great Axe', type:'2-Handed', description:'Common two-handed sword', target: ['enemy'], effects: [], range:{}, stats:{ 'power': 10, 'speed': -3 }, value: 750, requirements:[{name:'level',value:3}]},
    
    {name:'Sword Breaker', type:'Off Hand', description:'Common shield', target: [], effects: [], range:{}, stats:{ 'power': 3, 'speed': 3, 'hpMax':5 }, value: 250, requirements:[{name:'level',value:1}]},
    {name:'Shield', type:'Off Hand', description:'Common shield', target: [], effects: [], range:{}, stats:{ 'defense': 3 }, value: 250, requirements:[{name:'level',value:1}]},
    {name:'Buckler', type:'Off Hand', description:'Common buckler', target: [], effects: [], range:{}, stats:{ 'defense': 1 }, value: 450, requirements:[{name:'level',value:1}]},
    {name:'Tower', type:'Off Hand', description:'Common buckler', target: [], effects: [], range:{}, stats:{ 'defense': 8, 'speed': -3 }, value: 450, requirements:[{name:'level',value:1}]},
    {name:'Half', type:'Off Hand', description:'Common buckler', target: [], effects: [], range:{}, stats:{ 'defense': 3, 'speed': 3 }, value: 450, requirements:[{name:'level',value:1}]},
    
    {name:'Leather', type:'Armor', description:'Common leather armor', target: [], effects: [], range:{}, stats:{ 'defense': 2, 'hpMax':5 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Chain', type:'Armor', description:'Common leather armor', target: [], effects: [], range:{}, stats:{ 'defense': 3, 'hpMax':5 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Scale', type:'Armor', description:'Common leather armor', target: [], effects: [], range:{}, stats:{ 'defense': 5, 'hpMax':5 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Studded Leather', type:'Armor', description:'Common leather armor', target: [], effects: [], range:{}, stats:{ 'defense': 4, 'hpMax':5 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Silk', type:'Armor', description:'Common leather armor', target: [], effects: [], range:{}, stats:{ 'defense': 2, 'hpMax':5 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Plate', type:'Armor', description:'Common plate armor', target: [], effects: [], range:{}, stats:{ 'defense': 8, 'hpMax':25, 'speed':-5 }, value: 1750, requirements:[{name:'level',value:3}]},
    
    {name:'Ring of Quickness ', type:'Ring', description:'Common Ring of speed', target: [], effects: [], range:{}, stats:{ 'speed': 5 }, value: 1000, requirements:[{name:'level',value:1}]},
    {name:'Ring of Strength', type:'Ring', description:'Common Ring of power', target: [], effects: [], range:{}, stats:{ 'power': 5 }, value: 1000, requirements:[{name:'level',value:1}]},
    {name:'Ring of Vitality', type:'Ring', description:'Common Ring of health', target: [], effects: [], range:{}, stats:{ 'hpMax': 5 }, value: 1000, requirements:[{name:'level',value:1}]},
    {name:'Ring of Healing', type:'Ring', description:'Uncommon Ring of healing', target: [], effects: [{name:'heal',uses:5,usesMax:5}], range:{min:10,max:20}, stats:{ }, value: 3000, requirements:[{name:'level',value:1}]},
    
    {name:'Scroll of Healing', type:'Scroll', description:`Heals a target player for 10 - 20 hp`, target: ['self','player'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:10,max:20}, stats:{}, value: 100, requirements:[]},
    {name:'Scroll of Burning', type:'Scroll', description:`Deals 10 - 20 damage to an enemy`, target: ['enemy'], effects: [{name:'burn',uses:1,usesMax:1}], range:{min:10,max:20}, stats:{}, value: 300, requirements:[]},
    {name:'Healing Potion', type:'Potion', description:`Heals self for 25 - 50 hp`, target: ['self'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
    
    {name:'Spell Book', type:'Class', description:`Allows casting of spells`, target: ['self'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
    {name:'Sculpting Tools', type:'Class', description:`Allows summoning of monsters. Requires Sculpting Clay.`, target: ['self'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
    {name:'Guantlets', type:'Class', description:`Gives you the ability to survive where others have fallen.`, target: ['self'], 
        abilities: [
            {name:'Taunt', type:'Ability', description: `Generates a burst of aggro`, target: ['self'], effects: [{ name: 'taunt', uses: 5, usesMax: 5, duration: 0 }], range: { min: 5, max: 10 }}
        ], 
        effects: [
            {name:'Damage Mitigation',valueType: 'percent', value:25, description:'A significant boost to aggro'}
        ], 
    range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
    {name:'Blood Crystal', type:'Class', description:`Allows to heal others at a cost.`, target: ['self'], effects: [{name:'Regeneration',valueType: 'static', value:5, description:'Health gained every turn'}], range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
    {name:'Ceremonial Mask', type:'Class', description:`Allows the use of buffs and curses.`, target: ['self'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
    {name:'War Paint', type:'Class', description:`Gives you unparalled melee abilities.`, target: ['self'], 
        abilities: [
            {name:'Strength', type:'Ability', description: `Increases targets power`, target: ['self'], effects: [{ name: 'buff', uses: 5, usesMax: 5, duration: 3, stats: [{name: 'power'}] }], range: { min: 3, max: 7 }},
        ], 
        effects: [
            {name:'Multi Attack',value:1,description:'Additional strikes when the attack action is used.'}
        ], 
        range:{min:25,max:50}, stats:{}, value: 200, requirements:[]}
];
