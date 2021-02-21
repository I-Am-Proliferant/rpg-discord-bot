const utils = require('../lib/utils');

module.exports = {
    name: 'stats',
    aliases: ['s', 'sheet'],
    description: 'Provides a character sheet of the user.',
    args: false,
    usage: '"User Name"',
    guildOnly: false,
    cooldown: 5,
    execute(message, args, game) {

        const userName = (args[0] || message.author.username);
        if (!userName) {
            return;
        }

        const player = game.getPlayer(userName) || game.getEnemyByName(userName);
        if (player) {
            const statSheet = [];
            statSheet.push("```css");
            statSheet.push(`Character name: ${player.name}`);
            statSheet.push(`Level: ${player.level}`);
            statSheet.push(`Hp: ${player.hp}/${player.totalStats.hpMax} (${player.baseStats.hpMax}) [${player.equipmentStats.hpMax}]`);
            statSheet.push(`Attack: ${player.totalStats.power} (${player.baseStats.power}) [${player.equipmentStats.power}]`);
            statSheet.push(`Defense: ${player.totalStats.defense} (${player.baseStats.defense}) [${player.equipmentStats.defense}]`);
            statSheet.push(`Speed: ${player.totalStats.speed} (${player.baseStats.speed}) [${player.equipmentStats.speed}]`);
            statSheet.push(`Experience: ${player.exp}/${player.expNeeded}`);
            statSheet.push(`Gold: ${player.gold}`);
            statSheet.push(`-------Equipment-------`);
            const equipmentType = ['2-Handed', 'Main Hand', 'Off Hand', 'Armor', 'Ring'];
            equipmentType.forEach(eType => {
                const equipped = player.getEquipment(eType);
                if (equipped.name !== 'none') {
                    let itemInfo = `[${equipped.type}] ${equipped.name}:`;
                    if (equipped.stats.hpMax) itemInfo += ` [Max Hp ${equipped.stats.hpMax}] `;
                    if (equipped.stats.power) itemInfo += ` [Power ${equipped.stats.power}] `;
                    if (equipped.stats.defense) itemInfo += ` [Defense ${equipped.stats.defense}] `;
                    if (equipped.stats.speed) itemInfo += ` [Speed ${equipped.stats.speed}] `;
                    statSheet.push(itemInfo);
                }
            });
            if (player.bonus && player.bonus[0]) {
                statSheet.push(`--------Bonuses--------`);

                player.bonus.forEach( b => {
                    let bonusInfo = `${b.name}: `;
                        bonusInfo += `[${b.amount} for ${b.duration - game.turn.round} rounds] `;
                    statSheet.push(bonusInfo);
                }
                );
            }
            if (player.abilities && player.abilities[0]) {
                statSheet.push(`-------Abilities-------`);

                player.abilities.forEach(ability => {
                    let abilityInfo = `${ability.name}: `;
                    ability.effects.forEach(e => {
                        abilityInfo += ` [${e.name}: ${e.uses}/${e.usesMax}] `;
                    })
                    statSheet.push(abilityInfo);
                }
                );
            }
            if (player.effects && player.effects[0]) {
                statSheet.push(`--------Effects--------`);

                player.effects.forEach(effect => {
                    let effectInfo = `${effect.name}: `;
                    if(effect.valueType && effect.value) effectInfo += ` [${effect.value}${effect.valueType === 'percent' ? '%' : ''}] `;
                    statSheet.push(effectInfo);
                }
                );
            }
            statSheet.push(`-------Inventory-------`);
            statSheet.push(player.showInventory());
            statSheet.push("```");
            utils.sendMessage(message.channel, statSheet);
        }
        else {
            utils.sendMessage(message.channel, `Cannot find stats for ${userName}`);
        }
    },
};