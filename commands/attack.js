const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');

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

        let player = game.getPlayer(userName);
        if (!player) {
            player = new Player(userName, true);
            game.players.push(player);
        }
        if (player.dead) {
            sendMessage(message.channel, `I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            return;
        }

        if (!game.enemy || !game.turn.isCombat) {
            dialog.push(`There is currently no active combat. Try !adventure to start one.`);
            sendMessage(message.channel, dialog);
            return;
        }

        game.messageChannel = message.channel;

        game.addToCombat(player);
        if (player.actionAvailable) {
            dialog.push(player.attack(game.enemy));
            dialog.push(game.updateCombat());
            player.actionAvailable = false;
        }
        else {
            dialog.push(`You have already used your action ${player.name}`);
        }

        if (dialog.length > 0) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};

