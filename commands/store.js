const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'store',
    aliases: ['buy', 'shop'],
    description: 'Purchase items from the ever popular General Store',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 2,
    execute(message, args, game) {
        const dialog = [];
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const player = game.getPlayer(userName);
        if (!player) {
            dialog.push(`You don't seem to exist ${userName}. Maybe try the !init command?`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        if (player.dead) {
            dialog.push(`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You can't do this while in combat.`);
            if (dialog.length) {
                sendMessage(message.channel, dialog.join('\n'));
            }
            return;
        }

        if (args.length <= 0) {
            if (game.store.length <= 0) {
                dialog.push(`Whoops. Looks like I'm all out of items for the day. Try again tomorrow.`);
                sendMessage(message.channel, dialog.join('\n'));
                return;
            }
            dialog.push('```css');
            game.store.forEach(i => {
                const item = i.item;
                const itemQuantity = i.quantity;
                dialog.push(`$${item.price} [${item.type}] ${item.name} ${itemQuantity}`);
            })
            dialog.push('```');

        }
        else {
            const exactItem = game.store.find(e => e.item.name.toLowerCase() === args[0].toLowerCase());
            const fuzzyItem = game.store.find(e => e.item.name.toLowerCase().includes(args[0].toLowerCase()));
            const storeInventoryItem = exactItem || fuzzyItem;
            const storeItem = storeInventoryItem.item;
            // const storeInventoryItem.quantity = storeInventoryItem.quantity;
            if (!storeItem) {
                dialog.push(`Doesn't look like I have that item in stock.`);
                sendMessage(message.channel, dialog.join('\n'));
                return;
            }

            let purchaseAmount = args[1] || 1;
            //... Todo make sure its a non zero number

            if (storeInventoryItem.quantity < purchaseAmount) {
                purchaseAmount = storeInventoryItem.quantity;
            }

            const totalPrice = storeItem.price * purchaseAmount;

            if (player.gold >= totalPrice) {
                player.gold -= totalPrice;
                player.addToInventory(storeItem, purchaseAmount);

                //... Add option to buy in bulk
                storeInventoryItem.quantity -= purchaseAmount ;
                if (storeInventoryItem.quantity <= 0) {
                    game.store.splice(game.store.indexOf(storeItem), 1);
                }
                dialog.push(`You bought ${purchaseAmount} ${storeItem.name} for ${totalPrice} gold.`);
            }
            else {
                dialog.push(`You don't have enough gold.`);
            }
        }
        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};
