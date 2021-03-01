const { Player } = require('../lib/player.js');
const { sendMessage } = require('../lib/utils');

module.exports = {
    name: 'adventure',
    aliases: ['a', 'ad'],
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
        let player = game.getPlayer(userName);
        if (!player) { 
            player = new Player(userName, true);
            game.players.push(player);
        }
        if (player.dead) {
            sendMessage(message.channel, `I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            return;
        }


        game.messageChannel = message.channel;

        if (!game.enemy || !game.turn.isCombat) {
            const enemy = new Player('Monster', false);
            enemy.generateMonster();
            game.enemy = enemy;
            // game.combat.push(enemy);
            dialog.push(`A ${enemy.name} stands in your way!`);
            game.startCombat();
            game.addToCombat(player);
            dialog.push(game.updateCombat())

        }

        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};
