const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


module.exports = {
    name: 'run',
    aliases: ['retreat', 'escape'],
    description: 'Tries to retreat from combat. Does nothing if out of combat.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 5,
    execute(message, args, game) {
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const dialog = [];

        if (!game.enemy || !game.turn.isCombat) {
            dialog.push(`There is currently no active combat. Try !adventure to start one.`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        let player = game.getPlayer(userName);
        if (!player) {
            player = new Player(userName, true);
            game.players.push(player);
        }

        if (player.exhaustion) {
            dialog.push(`You're too exhausted to run away.`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        if (!player.actionAvailable) {
            dialog.push(`You have already used your action ${player.name}`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        dialog.push(`${player.name} retreats from combat and is now exhausted!`);
        //... Add random chance to be exhausted.
        player.exhaustion = true;
        game.combat.splice(game.combat.indexOf(player), 1);

        if (game.combat.length <= 0 && game.enemy) {
            game.endCombat();
            dialog.push(`All heroes have fled or fallen. The monsters have won!`);
        }
        else {
            dialog.push(game.updateCombat());

            // enemies turn -- pull this out into another function
            if (game.turn.userName === game.enemy.name) {
                const target = game.getRandomPlayer();
                if (!target) {
                    dialog.push(`Target returned false.`);
                    if (dialog.length) {
                        message.channel.send(dialog.join('\n'));
                    }
                    return;
                }
                dialog.push(game.enemy.attack(target));
                dialog.push(game.updateCombat());
            }
        }

        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};