const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'sell',
    aliases: ['$'],
    description: 'Sells an item for 50% of the value.',
    args: true,
    usage: '"item name"',
    guildOnly: false,
    cooldown: 1,
    execute(message, args, game) {
        const dialog = [];
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const player = game.getPlayer(userName);
        if (!player) {
            dialog.push(`You don't seem to exist ${userName}. Maybe try the !init command?`);
            sendMessage(message.channel,dialog.join('\n'));
            return;
        }

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You can't do this while in combat.`);
            if(dialog.length) {
                sendMessage(message.channel,dialog.join('\n'));
            }
            return;
        }

        const item = player.getFromInventory(args[0],true);

        if (!item) {
            dialog.push(`Can't find the item '${args[0]}' in your inventory.`)
            sendMessage(message.channel,dialog.join('\n'));
            return;
        }

        //... check for equiped items
        //... let you sell in bulk
        const sellPrice = Math.floor(item.value * .5);
        player.gold += sellPrice;
        dialog.push(`${item.name} sold for ${sellPrice} gold.`);

        if(dialog.length) {
            sendMessage(message.channel,dialog.join('\n'));
        }
    }
}