const utils = require('../lib/utils');

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
            utils.sendMessage(message.channel,dialog.join('\n'));
            return;
        }

        if (player.dead) {
            dialog.push(`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            utils.sendMessage(message.channel,dialog.join('\n'));
            return;
        }

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You can't do this while in combat.`);
            if(dialog.length) {
                utils.sendMessage(message.channel,dialog.join('\n'));
            }
            return;
        }

        if (!args[0]) {
            if(!game.store[0]) {
                dialog.push(`Whoops. Looks like I'm all out of items for the day. Try again tomorrow.`);
                utils.sendMessage(message.channel,dialog.join('\n'));
                return;
            }
            game.store.forEach(item => {
                dialog.push(`$${item.price} [${item.type}] **${item.name}** x${item.quantity}`);
            })
        }
        else {
            const storeItem = game.store.find(e => e.name.toUpperCase().includes(args[0].toUpperCase()));
            if (!storeItem) {
                dialog.push(`Doesn't look like I have that item in stock.`);
                utils.sendMessage(message.channel,dialog.join('\n'));
                return;
            }

            if (player.gold >= storeItem.price) {
                player.gold -= storeItem.price;
                player.addToInventory(storeItem);
                //... Add option to buy in bulk
                dialog.push(`Before quantity ${storeItem.quantity}`);
                storeItem.quantity--;
                dialog.push(`After quantity ${storeItem.quantity}`);
                if (storeItem.quantity <= 0) {
                    game.store.splice(game.store.indexOf(storeItem), 1);
                }
                dialog.push(`You bought 1 ${storeItem.name} for ${storeItem.price} gold.`);
            }
            else {
                dialog.push(`You don't have enough gold.`);
            }
        }
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};
