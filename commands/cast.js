const { randomRange } = require('../lib/random.js');
const utils = require('../lib/utils');

//... This might turn into !use once base item class is setup
module.exports = {
    name: 'cast',
    aliases: [],
    description: 'Use abilities and spells',
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
            const ability = player.getAbilityByName(args[0]);
            let target = false;

            if (!ability) {
                dialog.push(`You don't know this ability.`)
                utils.sendMessage(message.channel,dialog.join('\n'));
                return;
            }
            if (!ability.target[0]) {
                dialog.push('This ability doesn\'t have a target.')
                utils.sendMessage(message.channel,dialog.join('\n'));
                return
            }
            if (ability.target.find(e => e === 'enemy')) {
                target = game.enemy;
            }
            else if (ability.target.find(e => e === 'all players')) {
                target = game.getAllPlayers();
            }
            else if (ability.target.find(e => e === 'player')) {
                if (args[1]) {
                    target = [game.getPlayer(args[1])];
                }
                else {
                    target = [player];
                }
            }
            else {
                target = [player];
            }

            const amount = randomRange( ability.range.max, ability.range.min );
            ability.effects.forEach( effect => {
                if ( effect.uses <= 0 ) {
                    dialog.push( `You must rest at the !inn before you can use ${effect.name} again.` );
                }
                else if ( effect.name === 'heal' ) {
                    for(i = 0; i < target.length; i++) {
                        if (target[i].hp >= target[i].totalStats.hpMax) {
                            dialog.push(`${target[i].name} is already at full health.`);
                        }
                        else {
                            dialog.push(target[i].heal(amount));
                        }
                    }
                    player.aggro += amount * 2;
                    effect.uses--;
                }
                else if ( effect.name === 'burn' ) {
                    if (!inCombat) {
                        dialog.push(`You need to be in combat to use this.`);
                    }
                    else {
                        dialog.push('```css');
                        dialog.push(`A mote of flame burns ${target.name} for ${amount} damage.`);
                        dialog.push('```');
                        dialog.push(target.damage(amount));
                        player.aggro += amount * 7;
                        effect.uses--;
                        //... TODO: Need to fix turn handling for scrolls.
                        dialog.push(game.updateCombat());
                    }
                }
                else if ( effect.name === 'taunt' ) {
                    if (!inCombat) {
                        dialog.push(`You need to be in combat to use this.`);
                    }
                    else {
                        const aggroAmount = amount * 14;
                        dialog.push('```css');
                        dialog.push(`${player.name} tries to draw ${target[0].name}'s attention! (+${aggroAmount} aggro).`);
                        dialog.push('```');
                        player.aggro += aggroAmount;
                        effect.uses--;
                        //... TODO: Need to fix turn handling for scrolls.
                        dialog.push(game.updateCombat());
                    }
                }
                else if ( effect.name === 'buff' ) {
                    if (!inCombat) {
                        dialog.push(`You need to be in combat to use this.`);
                    }
                    else {
                        // find stats
                        // buff target stats
                        // make duration matter
                        const aggroAmount = amount * 14;
                        dialog.push('```css');
                        dialog.push(`${player.name} tries to draw ${target[0].name}'s attention! (+${aggroAmount} aggro).`);
                        dialog.push('```');
                        player.aggro += aggroAmount;
                        effect.uses--;
                        //... TODO: Need to fix turn handling for scrolls.
                        dialog.push(game.updateCombat());
                    }
                }
                else if ( effect.name === 'curse' ) {
                    if (!inCombat) {
                        dialog.push(`You need to be in combat to use this.`);
                    }
                    else {
                        const aggroAmount = amount * 14;
                        dialog.push('```css');
                        dialog.push(`${player.name} tries to draw ${target[0].name}'s attention! (+${aggroAmount} aggro).`);
                        dialog.push('```');
                        player.aggro += aggroAmount;
                        effect.uses--;
                        //... TODO: Need to fix turn handling for scrolls.
                        dialog.push(game.updateCombat());
                    }
                }
            });


        }
        if(dialog.length) {
            utils.sendMessage(message.channel,dialog.join('\n'));
        }
    }
};
