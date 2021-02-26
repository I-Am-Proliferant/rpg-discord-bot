const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'stats',
    aliases: ['s', 'sheet'],
    description: 'Provides a character sheet of the user.',
    args: false,
    usage: '"User Name"',
    guildOnly: false,
    cooldown: 2,
    execute(message, args, game) {

        const userName = (args[0] || message.author.username);
        if (!userName) {
            return;
        }

        const player = game.getPlayer(userName) || game.getEnemyByName(userName);
        if (player) {
            const statSheet = [];
            statSheet.push('```css');
            statSheet.push(`Character name: ${player.name}`);
            statSheet.push(`Level: ${player.level}`);
            statSheet.push(`Hp: ${player.hp}/${player.totalStats.hpMax} (${player.baseStats.hpMax}) [${player.equipmentStats.hpMax}]`);
            statSheet.push(`Attack: ${player.totalStats.power} (${player.baseStats.power}) [${player.equipmentStats.power}]`);
            statSheet.push(`Defense: ${player.totalStats.defense} (${player.baseStats.defense}) [${player.equipmentStats.defense}]`);
            statSheet.push(`Speed: ${player.totalStats.speed} (${player.baseStats.speed}) [${player.equipmentStats.speed}]`);
            statSheet.push(`Experience: ${player.exp}/${player.expNeeded}`);
            statSheet.push(`Gold: ${player.gold}`);


            if (player.bonus && player.bonus.length > 0) {
                statSheet.push(`[--------Bonuses--------]`);

                player.bonus.forEach(b => {
                    let bonusInfo = `${b.name}: `;
                    bonusInfo += `[${b.amount} for ${b.duration - game.turn.round} rounds] `;
                    statSheet.push(bonusInfo);
                }
                );
            }
            if (player.abilities && player.abilities.length > 0) {
                statSheet.push(`[-------Abilities-------]`);

                player.abilities.forEach(ability => {
                    let abilityInfo = `${ability.name}: `;
                    if (ability.effects && ability.effects.length > 0) {
                        ability.effects.forEach(e => {
                            abilityInfo += ` [${e.name}: ${e.uses}/${e.usesMax}] `;
                        })
                    }
                    statSheet.push(abilityInfo);
                }
                );
            }

            if (player.equipment && player.equipment.length > 0) {
                statSheet.push(`[-------Equipment-------]`);
                player.equipment.forEach(e => {
                    let itemInfo = `[${e.type}] ${e.name}:`;
                    if (e.stats.hpMax) itemInfo += ` [Max Hp ${e.stats.hpMax}] `;
                    if (e.stats.power) itemInfo += ` [Power ${e.stats.power}] `;
                    if (e.stats.defense) itemInfo += ` [Defense ${e.stats.defense}] `;
                    if (e.stats.speed) itemInfo += ` [Speed ${e.stats.speed}] `;
                    statSheet.push(itemInfo);
                });
            }

            if (player.effects && player.effects.length > 0) {
                statSheet.push(`[--------Effects--------]`);

                player.effects.forEach(effect => {
                    let effectInfo = `${effect.name}: `;
                    if (effect.valueType && effect.value) effectInfo += ` [${effect.value}${effect.valueType === 'percent' ? '%' : ''}] `;
                    else if (effect.value) effectInfo += ` [${effect.value}] `;
                    else if (effect.stats && effect.stats.length > 0) {
                        effect.stats.forEach(e => {
                            effectInfo += ` [${e.name} ${e.value}${effect.valueType === 'percent' ? '%' : ''}] `;
                        })
                    }
                    statSheet.push(effectInfo);
                }
                );
            }
            statSheet.push(`[-------Inventory-------]`);
            statSheet.push(player.showInventory());
            statSheet.push('```');
            sendMessage(message.channel, statSheet);
        }
        else {
            sendMessage(message.channel, `Cannot find stats for ${userName}`);
        }
    },
};