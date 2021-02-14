const { random } = require('../lib/random');
const utils = require('../lib/utils');

module.exports = {
    name: 'rest',
    aliases: ['rr', 'sleep'],
    description: 'Rest in the wilderness to regain your health and abilities in real time.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 360,
    execute(message, args, game) {
        const dialog = [];
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

        dialog.push(player.heal(random((player.level * 2) + 3, player.level)));
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};