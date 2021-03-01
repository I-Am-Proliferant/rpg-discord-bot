const { randomRange } = require('../lib/random');
const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


module.exports = {
    name: 'rest',
    aliases: ['rr', 'sleep'],
    description: 'Rest in the wilderness to regain your health and abilities in real time.',
    args: false,
    usage: '',
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

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You can't do this while in combat.`);
            if (dialog.length) {
                sendMessage(message.channel, dialog.join('\n'));
            }
            return;
        }

        if (player.hp >= player.hpMax) {
            dialog.push(`You are currently at full health.`);
            if (dialog.length) {
                sendMessage(message.channel, dialog.join('\n'));
            }
            return;
        }
        
        dialog.push(player.heal(randomRange((player.level * 2) + 3, player.level)));
        
        if (player.exhausted){
            player.exhausted = false;
            dialog.push(`${player.name} recovers from their exhaustion`);
        }

        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};