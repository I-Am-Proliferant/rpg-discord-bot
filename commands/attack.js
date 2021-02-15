const utils = require('../lib/utils');
module.exports = {
    name: 'attack',
    aliases: ['aa'],
    description: 'Attacks the current monster. Does nothing if out of combat.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 1,
    execute(message, args, game) {
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const dialog = [];

        if (!game.enemy || !game.turn.isCombat) {
            dialog.push(`There is currently no active combat. Try !adventure to start one.`);
            utils.sendMessage(message.channel,dialog);
            return;
        }

        if (game.turn.userName === userName) {
            const player = game.getPlayerFromCombat(userName);
            if(!player) {
                dialog.push(`You are not in combat. Try !adventure to join one.`);
                utils.sendMessage(message.channel,dialog);
                return;
            }
            else {
                dialog.push(player.attack(game.enemy));
                dialog.push(game.updateCombat());
            }

        }
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};

