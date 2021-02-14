const { Player } = require('../lib/player.js');
const utils = require('../lib/utils');

module.exports = {
    name: 'adventure',
    aliases: ['a'],
    description: 'Starts an adventure by summoning an enemy. Adds user to the combat',
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
        const player = game.getPlayer(userName);
        if (!player) {
            utils.sendMessage(message.channel,`You don't seem to exist ${userName}. Maybe try the !init command?`);
            return;
        }
        if (player.dead) {
            utils.sendMessage(message.channel,`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            return;
        }

        const inCombat = (game.combat.find(({ name }) => name === userName) || false);
        if (inCombat) {
            dialog.push(`You are already in combat.`);
        }
        else {
            game.combat.push(player);
            dialog.push(`${userName} joins the combat.`);
        }

        if (!game.enemy || game.turn.isCombat === false) {
            const enemy = new Player('Monster', false);
            enemy.generateMonster();
            game.enemy = enemy;
            game.combat.push(enemy);
            dialog.push(`A ${enemy.name} stands in your way!`);

            game.startCombat();
            dialog.push(game.updateCombat())

            // if (game.turn.userName === game.enemy.name) {
            //     const target = game.getRandomPlayer();
            //     if (!target) {
            //         dialog.push(`Target returned false`)
            //         message.channel.send(dialog.join('\n'));
            //         return;
            //     }
            //     dialog.push(game.enemy.attack(target));
            //     dialog.push(game.updateCombat())
            // }
        }
        game.combat.sort(function (a, b) {
            return b.getSpeed() - a.getSpeed();
        });

        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};
