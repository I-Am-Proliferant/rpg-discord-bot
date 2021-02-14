const { Player } = require('../lib/player.js');
const utils = require('../lib/utils');

module.exports = {
    name: 'init',
    aliases: ['ii'],
    description: 'Creates your player character for the game.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 5,
    execute(message, args, game) {
        const userName = message.author.username;
        const player = game.getPlayer(userName);
        // const inGame = ( false );
        if (player) {
            utils.sendMessage(message.channel,`You're already part of the game ${userName}`);
        }
        else {
            const newPlayer = new Player(userName, true);
            game.players.push(newPlayer);
            utils.sendMessage(message.channel,`${userName} has joined the game!.`);
        }

    },
};