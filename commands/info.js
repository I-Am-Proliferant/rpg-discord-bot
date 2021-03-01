const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


module.exports = {
    name: 'info',
    aliases: ['?', 'desc', 'description'],
    description: 'Shows information about an item.',
    args: true,
    usage: '<<item name>>',
    guildOnly: false,
    cooldown: 1,
    execute(message, args, game) {
        const dialog = [];
        const userName = message.author.username;
        if (!userName) {
            return;
        }

        let player = game.getPlayer(userName);
        if (!player) {
            player = new Player(userName, true);
            game.players.push(player);
        }

        const item = player.getFromInventory(args[0], false);
        if (!item) {
            dialog.push(`Can't find the item '${args[0]}' in your inventory.`)
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        dialog.push(item.description);
        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
}