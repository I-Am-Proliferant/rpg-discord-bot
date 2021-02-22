const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'combat',
    aliases: ['c'],
    description: 'Starts an adventure by summoning an enemy. Adds user to the combat',
    args: true,
    usage: '<user>',
    guildOnly: false,
    cooldown: 2,
    execute(message, args, game) {
        if (!game.combat || !game.combat.length) {
            sendMessage(message.channel, `There is currently no active combat`);
            return;
        }
        if (args[0] === 'list') {
            const combatList = []
            game.combat.forEach(function (player) {
                const info = `${player.name} Health: ${player.hp}/${player.totalStats.hpMax} Speed: ${player.totalStats.speed} Aggro: ${player.aggro}`;
                combatList.push(info);
            });
            sendMessage(message.channel, combatList);
        }
        else if (args[0] === 'skip') {
            sendMessage(message.channel, game.updateCombat());
        }
    }
};