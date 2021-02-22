const { Player } = require('../lib/player.js');
const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'adventure',
    aliases: ['a','ad'],
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
            sendMessage(message.channel,`You don't seem to exist ${userName}. Maybe try the !init command?`);
            return;
        }
        if (player.dead) {
            sendMessage(message.channel,`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
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

        }
        game.combat.sort(function (a, b) {
            return b.getSpeed() - a.getSpeed();
        });

        if(dialog.length) {
            sendMessage(message.channel,dialog.join('\n'));
        }
    }
};
