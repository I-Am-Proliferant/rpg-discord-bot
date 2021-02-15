const utils = require('../lib/utils');

module.exports = {
    name: 'equip',
    aliases: ['wear', 'eq'],
    description: 'Equips items from your inventory.',
    args: true,
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

        dialog.push(player.equip(args[0]));
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};
