const { randomRange } = require('../lib/random.js');
const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


//... This might turn into !use once base item class is setup
module.exports = {
    name: 'read',
    aliases: ['scroll', 'use'],
    description: 'Trys to cast a spell from a scroll consuming the scroll in the process.',
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
        if (player.dead) {
            dialog.push(`I'm sorry ${userName}, but you're dead. Maybe !rest awhile?`);
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        //... if (player.isTurn)
        const scroll = player.getFromInventory(args[0], false);
        let target = false;

        if (!scroll) {
            dialog.push(`Can't find the scroll '${args[0]}' in your inventory.`)
            sendMessage(message.channel, dialog.join('\n'));
            return;
        }

        if (scroll.target.length <= 0) {
            dialog.push('This scroll doesn\'t have a target.')
            sendMessage(message.channel, dialog.join('\n'));
            return
        }

        if (scroll.target.find(e => e === 'enemy')) {
            target = game.enemy;
        }
        else if (scroll.target.find(e => e === 'player')) {
            if (args[1]) {
                target = game.getPlayer(args[1]);
            }
            else {
                target = player;
            }
        }
        else {
            target = player;
        }

        const amount = randomRange(scroll.range.max, scroll.range.min);
        scroll.effects.forEach(effect => {
            if (effect.name === 'heal' && effect.uses > 0) {
                if (target.hp >= target.totalStats.hpMax) {
                    dialog.push(`${target.name} is already at full health.`);
                }
                else {
                    dialog.push(target.heal(amount));
                    player.aggro += amount * 2;
                    effect.uses--;
                }
                if (effect.uses <= 0) {
                    effect.uses = effect.usesMax;
                    player.getFromInventory(scroll.name);
                }
            }
            else if (effect.name === 'burn' && effect.uses > 0) {
                if (!inCombat) {
                    dialog.push(`You need to be in combat to use this.`);
                }
                else {
                    dialog.push('```css');
                    dialog.push(`A spark of flame burns ${target.name} for ${amount} damage.`);
                    dialog.push('```');
                    dialog.push(target.damage(amount));
                    player.aggro += amount * 10;
                    effect.uses--;
                    if (effect.uses <= 0) {
                        effect.uses = effect.usesMax;
                        player.getFromInventory(scroll.name);
                    }
                    //... TODO: Need to fix turn handling for scrolls.
                    dialog.push(game.updateCombat());
                }
            }
        });


        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};
