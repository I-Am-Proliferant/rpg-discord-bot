const { randomRange } = require('../lib/random');
const utils = require('../lib/utils');

module.exports = {
    name: 'inn',
    aliases: ['inn', 'tavern'],
    description: 'Rest in the Gorgon\'s Kiss to regain your health and abilities in real time.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 5,
    execute(message, args, game) {
        const dialog = [];
        const innPrice = 50;
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const player = game.getPlayer(userName);

        if (!player) {
            utils.sendMessage(message.channel,`You don't seem to exist. Maybe try the !init command?`);
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
        else {
            game.combat.push(player);
        }

        if (player.hp >= player.hpMax) {
            dialog.push(`You are currently at full health.`);
            if(dialog.length) {
                utils.sendMessage(message.channel,dialog.join('\n'));
            }
            return;
        }

        if (player.gold >= innPrice) {
            player.gold -= innPrice;
            dialog.push(player.heal(randomRange(player.hpMax, player.hpMax / 3)));
        }
        else {
            dialog.push(`Come back when you have atleast ${innPrice} gold.`);
        }
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};