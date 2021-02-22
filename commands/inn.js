const { randomRange } = require('../lib/random');
const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'inn',
    aliases: ['tavern'],
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
            sendMessage(message.channel,`You don't seem to exist. Maybe try the !init command?`);
            return;
        }

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You can't do this while in combat.`);
            if(dialog.length) {
                sendMessage(message.channel,dialog.join('\n'));
            }
            return;
        }

        // if (player.hp >= player.hpMax) {
        //     dialog.push(`You are currently at full health.`);
        //     if(dialog.length) {
        //         sendMessage(message.channel,dialog.join('\n'));
        //     }
        //     return;
        // }

        if (player.gold >= innPrice) {
            player.gold -= innPrice;

            if (player.abilities && player.abilities[0]) {
                player.abilities.forEach(ability => {
                    ability.effects.forEach(effect => {
                        effect.uses = effect.usesMax;
                    })
                })
            }

            const healAmount = randomRange(player.totalStats.hpMax, player.totalStats.hpMax / 3);
            dialog.push(player.heal(healAmount));
        }
        else {
            dialog.push(`Come back when you have at least ${innPrice} gold.`);
        }
        if(dialog.length) {
            sendMessage(message.channel,dialog.join('\n'));
        }
    }
};