class Item {
    constructor ( item ) {
        this.name = item.name
        this.type = item.type
        this.location = item.location
        this.description = item.description
        this.value = item.value
        this.Abilities = item.Abilities
        this.Effects = item.Effects
        this.requirements = item.requirements
    };


}

Item.prototype.getItemFromDb = function () {

};

module.export = { Item };


// const club = { 
//     name: 'Small Club',
//     type: 'Weapon',
//     location: 'Main Hand',
//     description: 'Common sword',
//     abilities: [],
//     effects: [],
//     value: 500,
//     requirements: [{ name: 'level', value: 1 }] 
// }
