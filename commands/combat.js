const utils = require('../lib/utils');

module.exports = {
    name: 'combat',
    aliases: ['c'],
    description: 'Starts an adventure by summoning an enemy. Adds user to the combat',
    args: true,
    usage: '<user>',
    guildOnly: false,
    cooldown: 5,
    execute(message, args, game) {
        if (!game.combat || !game.combat.length) {
            utils.sendMessage(message.channel,`There is currently no active combat`);
            return;
        }
        if (args[0] === 'list') {
            const combatList = []
            game.combat.forEach(function(player) {
                const info = `${player.name}: ${player.hp}/${player.hpMax} #${player.speed} ${player.dead}`;
                combatList.push(info);
            });
            utils.sendMessage(message.channel,combatList);
        }
        else if (args[0] === 'skip') {
            utils.sendMessage(message.channel,game.updateCombat());
        }
    }
};