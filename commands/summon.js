const { randomRange } = require('../lib/random.js');
const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


//... This might turn into !use once base item class is setup
module.exports = {
    name: 'summon',
    aliases: [],
    description: 'Summon an monster to aid you in combat.',
    args: true,
    usage: '',
    guildOnly: false,
    cooldown: 2,
    execute(message, args, game) {
        const dialog = [];
        const userName = message.author.username;
        const inCombat = (game.turn.isCombat && game.enemy)

        if (!userName) {
            return;
        }
        let player = game.getPlayer(userName);
        if (!player) {
            player = new Player(userName, true);
            game.players.push(player);
        }

        if (!player.getAbilityByName('summon')) {
            dialog.push(`You don't know this ability.`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        if (!inCombat) {
            dialog.push(`You need to be in combat to use this.`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        if (player.dead) {
            dialog.push(`I'm sorry ${player.name}, but you're dead. Maybe !rest awhile?`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        if (!player.actionAvailable) {
            dialog.push(`You have already used your action ${player.name}`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }
        
        game.addToCombat(player);
        player.actionAvailable = false;
        const summonedMonster = new Player('Monster Name', false);
        summonedMonster.generateMonster();
        summonedMonster.name += ' (Summoned)'
        
        game.summons.push(summonedMonster);
        dialog.push(`${player.name} summons a mighty ${summonedMonster.name}`);

            //... need another arg specifying type of monster to summon and another for clay amount
            //... Have to specify how much clay you want to use where the cost per type is the minimum
            //... More clay ups the version and stats of the monster
            //... check for enough trophies of the monster type for it to be eligible
            //... Create the monster and assign control to the player
            //... Add the monster to game.summons[] for the duration
            //... Clean up summons when duration is over, player dies or combat ends
        
        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};