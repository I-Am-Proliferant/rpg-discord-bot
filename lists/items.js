module.exports = [
    {name:'Token', type:'coin', description:'Proof that you defeated an enemy', target: [], effects: [], range:{}, stats:{}, value: 1, requirements:[]},
    {name:'Sword', type:'right', description:'Common sword', target: ['enemy'], effects: ['damage'], range:{}, stats:{ 'power': 2 }, value: 500, requirements:[{name:'level',value:1}]},
    {name:'Long Sword', type:'right', description:'Common sword', target: ['enemy'], effects: ['damage'], range:{}, stats:{ 'power': 3 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Great Sword', type:'2hand', description:'Common two-handed sword', target: ['enemy'], effects: ['damage'], range:{}, stats:{ 'power': 5 }, value: 750, requirements:[{name:'level',value:3}]},
    {name:'Big Club', type:'2hand', description:'Small tree', target: ['enemy'], effects: ['damage'], range:{}, stats:{ 'power': 4 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Shield', type:'left', description:'Common shield', target: [], effects: [], range:{}, stats:{ 'defense': 1 }, value: 250, requirements:[{name:'level',value:1}]},
    {name:'Buckler', type:'left', description:'Common buckler', target: [], effects: [], range:{}, stats:{ 'defense': 3 }, value: 450, requirements:[{name:'level',value:1}]},
    {name:'Leather', type:'armor', description:'Common leather armor', target: [], effects: [], range:{}, stats:{ 'defense': 2, 'hpMax':5 }, value: 750, requirements:[{name:'level',value:1}]},
    {name:'Plate', type:'armor', description:'Common plate armor', target: [], effects: [], range:{}, stats:{ 'defense': 5, 'hpMax':25, 'speed':-5 }, value: 1750, requirements:[{name:'level',value:3}]},
    {name:'Ring of Quickness ', type:'ring', description:'Common Ring of speed', target: [], effects: [], range:{}, stats:{ 'speed': 5 }, value: 1000, requirements:[{name:'level',value:1}]},
    {name:'Ring of Strength', type:'ring', description:'Common Ring of power', target: [], effects: [], range:{}, stats:{ 'power': 5 }, value: 1000, requirements:[{name:'level',value:1}]},
    {name:'Ring of Vitality', type:'ring', description:'Common Ring of health', target: [], effects: [], range:{}, stats:{ 'hpMax': 5 }, value: 1000, requirements:[{name:'level',value:1}]},
    {name:'Ring of Healing', type:'ring', description:'Uncommon Ring of healing', target: [], effects: [{name:'heal',uses:5,usesMax:5}], range:{min:10,max:20}, stats:{ }, value: 3000, requirements:[{name:'level',value:1}]},
    {name:'Scroll of Healing', type:'scroll', description:`Heals a target player for 10 - 20 hp`, target: ['self','player'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:10,max:20}, stats:{}, value: 100, requirements:[]},
    {name:'Scroll of Burning', type:'scroll', description:`Deals 30 - 50 damage to an enemy`, target: ['enemy'], effects: [{name:'burn',uses:1,usesMax:1}], range:{min:30,max:50}, stats:{}, value: 300, requirements:[]},
    {name:'Healing Potion', type:'potion', description:`Heals self for 25 - 50 hp`, target: ['self'], effects: [{name:'heal',uses:1,usesMax:1}], range:{min:25,max:50}, stats:{}, value: 200, requirements:[]},
];

//.. type: item, slot: left
//.. type: item, slot: left