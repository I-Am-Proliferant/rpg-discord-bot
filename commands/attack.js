const { sendMessage } = require('../lib/utils');
module.exports = {
    name: 'attack',
    aliases: ['aa', 'at'],
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
            sendMessage(message.channel, dialog);
            return;
        }

        if (game.turn.userName === userName) {
            const player = game.getPlayerFromCombat(userName);
            if (!player) {
                dialog.push(`You are not in combat. Try !adventure to join one.`);
                sendMessage(message.channel, dialog);
                return;
            }
            else {
                dialog.push(player.attack(game.enemy));
                dialog.push(game.updateCombat());
            }

        }
        else {
            dialog.push('```css');
            dialog.push(`[It is currently .${game.turn.userName}s turn]`);
            dialog.push('```');
        }

        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};

