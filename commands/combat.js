const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'combat',
    aliases: ['c'],
    description: 'Starts an adventure by summoning an enemy. Adds user to the combat',
    args: false,
    usage: '<user>',
    guildOnly: false,
    cooldown: 2,
    execute(message, args, game) {
        if (!game.combat || !game.combat.length) {
            sendMessage(message.channel, `There is currently no active combat`);
            return;
        }
        if (args.length === 0 || args[0] === 'list') {
            const combatList = []

            const enemyInfo = `${game.enemy.name} Health: ${game.enemy.hp}/${game.enemy.totalStats.hpMax} Speed: ${game.enemy.totalStats.speed} Aggro: ${game.enemy.aggro}`;
            combatList.push(enemyInfo);

            game.combat.forEach(function (player) {
                const info = `${player.name} Health: ${player.hp}/${player.totalStats.hpMax} Speed: ${player.totalStats.speed} Aggro: ${player.aggro}`;
                combatList.push(info);
            });

            if (game.summons.length > 0) {
                game.summons.forEach(function (summon) {
                    const summonInfo = `${summon.name} Health: ${summon.hp}/${summon.totalStats.hpMax} Speed: ${summon.totalStats.speed} Aggro: ${summon.aggro}`;
                    combatList.push(summonInfo);
                });
            }
            sendMessage(message.channel, combatList);
        }
    }
};