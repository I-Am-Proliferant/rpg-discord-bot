const { Player } = require('../lib/player.js');
const { random } = require('../lib/random.js');
const utils = require('../lib/utils');

//... This might turn into !use once base item class is setup
module.exports = {
    name: 'read',
    aliases: ['scroll'],
    description: 'Trys to cast a spell from a scroll consuming the scroll in the process.',
    args: true,
    usage: '',
    guildOnly: false,
    cooldown: 2,
    execute(message, args, game) {
        const dialog = [];
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const player = game.getPlayer(userName);
        if (!player) {
            dialog.push(`You don't seem to exist ${userName}. Maybe try the !init command?`);
            if(dialog.length) {
                utils.sendMessage(message.channel,dialog.join('\n'));
            }
            return;
        }
        if (player.dead) {
            dialog.push(`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            utils.sendMessage(message.channel,dialog.join('\n'));
            return;
        }
        
        //... if (player.isTurn)
        if (!game.enemy || game.turn.userName === userName) {
            const scroll = player.getFromInventory(args[0]);
            const target = (game.getPlayer(args[1])) ? game.getPlayer(args[1]) : player;
            if (!scroll) {
                dialog.push(`Can't find the scroll '${args[0]}' in your inventory.`)
                utils.sendMessage(message.channel,dialog.join('\n'));
                return;
            }
            const amount = random(scroll.max,scroll.min);
            scroll.effects.forEach(effect => {
                if (effect === 'heal') {
                    dialog.push(target.heal(amount));
                }
            });


        }
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};
