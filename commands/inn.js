const { randomRange } = require('../lib/random');
const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


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

        // if (player.hp >= player.hpMax) {
        //     dialog.push(`You are currently at full health.`);
        //     if(dialog.length) {
        //         sendMessage(message.channel,dialog.join('\n'));
        //     }
        //     return;
        // }

        if (player.gold >= innPrice) {
            player.gold -= innPrice;

            if (player.abilities && player.abilities.length > 0) {
                player.abilities.forEach(ability => {
                    ability.effects.forEach(effect => {
                        effect.uses = effect.usesMax;
                    })
                })
            }

            player.exhaustion = false;

            const healAmount = randomRange(player.totalStats.hpMax, player.totalStats.hpMax / 3);
            dialog.push(player.heal(healAmount));
        }
        else {
            dialog.push(`Come back when you have at least ${innPrice} gold.`);
        }
        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};