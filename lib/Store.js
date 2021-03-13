const { InventoryHandler } = require('./InventoryHandler');

class Store {
    constructor() {
        this.inventory = new InventoryHandler;
    };

};
Store.prototype.initStore();

module.export = { Store };
