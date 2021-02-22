const { Player } = require('../lib/player.js');
const { sendMessage } = require('../lib/utils');

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
            sendMessage(message.channel, `You're already part of the game ${userName}`);
        }
        else {
            const newPlayer = new Player(userName, true);
            game.players.push(newPlayer);
            sendMessage(message.channel, `${userName} has joined the game!.`);
        }

    },
};