const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


module.exports = {
    name: 'unequip',
    aliases: ['remove', 'takeoff', 'ueq', 'ue'],
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

        let player = game.getPlayer(userName);
        if (!player) {
            player = new Player(userName, true);
            game.players.push(player);
        }

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You can't do this while in combat.`);
            if (dialog.length) {
                sendMessage(message.channel, dialog.join('\n'));
            }
            return;
        }

        if (player.dead) {
            dialog.push(`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        dialog.push(player.unEquip(args[0]));
        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};
