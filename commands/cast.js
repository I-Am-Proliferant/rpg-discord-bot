const { randomRange } = require('../lib/random.js');
const { sendMessage } = require('../lib/utils');
const { Player } = require('../lib/player.js');


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
        let player = game.getPlayer(userName);
        if (!player) {
            player = new Player(userName, true);
            game.players.push(player);
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

        
        
        
        //... if (player.isTurn)
            const ability = player.getAbilityByName(args[0]);
            let target = false;

            if (!ability) {
                dialog.push(`You don't know this ability.`)
                sendMessage(message.channel, dialog.join('\n'));
                return;
            }
            if (ability.target.length <= 0) {
                dialog.push('This ability doesn\'t have a target.')
                sendMessage(message.channel, dialog.join('\n'));
                return
            }

            if (ability.target.find(e => e === 'enemy')) {
                target = [game.enemy];
            }
            else if (ability.target.find(e => e === 'all players')) {
                target = game.getAllPlayers();
            }
            else if (ability.target.find(e => e === 'player')) {
                if (args[1]) {
                    target = [game.getPlayer(args[1])];
                    if (target.name === userName) target = false;
                }
            }


            if (!target && ability.target.find(e => e === 'self')) {
                target = [player];
            }


            if (!target) {
                dialog.push('Please specify a valid target for this ability.')
                sendMessage(message.channel, dialog.join('\n'));
                return
            }

            

            let amount = 1;
            if (ability.range && ability.range.min && ability.range.max) {
                amount = randomRange(ability.range.max, ability.range.min);
            }
            else {
                dialog.push(`You hear a chilling laugh on the wind...`);
            }

            if (ability.effects && ability.effects.length > 0) {
                ability.effects.forEach(effect => {
                    if (effect.uses <= 0) {
                        dialog.push(`You must rest at the !inn before you can use ${effect.name} again.`);
                    }
                    else if (effect.name === 'heal') {
                        for (i = 0; i < target.length; i++) {
                            if (target[i].hp >= target[i].totalStats.hpMax) {
                                dialog.push(`${target[i].name} is already at full health.`);
                            }
                            else {
                                dialog.push(target[i].heal(amount));
                            }
                            player.aggro += amount * 2;
                            effect.uses--;
                            game.addToCombat(player);
                            player.actionAvailable = false;
                        }
                    }
                    else if (effect.name === 'blood heal') {
                        for (i = 0; i < target.length; i++) {
                            if (target[i].hp >= target[i].totalStats.hpMax) {
                                dialog.push(`${target[i].name} is already at full health.`);
                            }
                            else {
                                dialog.push(target[i].heal(amount));
                                dialog.push(player.damage(Math.floor(amount / 3)));
                            }
                            game.addToCombat(player);
                            player.actionAvailable = false;
                            player.aggro += amount * 2;
                            effect.uses--;
                        }
                    }
                    else if (effect.name === 'burn') {
                        if (!inCombat) {
                            dialog.push(`You need to be in combat to use this.`);
                        }
                        else {
                            for (i = 0; i < target.length; i++) {
                                dialog.push('```css');
                                dialog.push(`A mote of flame burns ${target[i].name} for ${amount} damage.`);
                                dialog.push('```');
                                dialog.push(target[i].damage(amount));
                            }
                            player.aggro += amount * 7;
                            effect.uses--;
                            game.addToCombat(player);
                            player.actionAvailable = false;
                            dialog.push(game.updateCombat());
                        }
                    }
                    else if (effect.name === 'taunt') {
                        if (!inCombat) {
                            dialog.push(`You need to be in combat to use this.`);
                        }
                        else {
                            const aggroAmount = amount * 14;
                            dialog.push('```css');
                            dialog.push(`${player.name} makes a big scene! (+${aggroAmount} aggro).`);
                            dialog.push('```');
                            player.aggro += aggroAmount;
                            effect.uses--;
                            game.addToCombat(player);
                            player.actionAvailable = false;
                            dialog.push(game.updateCombat());
                        }
                    }
                    else if (effect.name === 'buff') {
                        if (!inCombat) {
                            dialog.push(`You need to be in combat to use this.`);
                        }
                        else {
                            if (effect.stats && effect.stats.length > 0) {
                                const duration = effect.duration + game.turn.round;
                                effect.stats.forEach(stat => {
                                    for (i = 0; i < target.length; i++) {
                                        target[i].bonus.push({ name: stat.name, amount: amount, duration: duration });
                                        target[i].calcStats();
                                        dialog.push('```css');
                                        dialog.push(`${player.name} increases ${target[i].name}'s ${stat.name} by ${amount} for ${effect.duration} rounds.`);
                                        dialog.push('```');
                                    }
                                })
                                effect.uses--;
                                game.addToCombat(player);
                                player.actionAvailable = false;
                                dialog.push(game.updateCombat());
                            }
                            else {
                                dialog.push(`There seems to be something wrong with this ability.`);
                            }
                        }
                    }
                    else if (effect.name === 'curse') {
                        if (!inCombat) {
                            dialog.push(`You need to be in combat to use this.`);
                        }
                        else {
                            if (effect.stats && effect.stats.length > 0) {
                                const duration = effect.duration + game.turn.round;
                                effect.stats.forEach(stat => {
                                    for (i = 0; i < target.length; i++) {
                                        target[i].bonus.push({ name: stat.name, amount: -amount, duration: duration });
                                        target[i].calcStats();
                                        dialog.push('```css');
                                        dialog.push(`${player.name} decreases ${target[i].name}'s ${stat.name} by ${amount} for ${effect.duration} rounds.`);
                                        dialog.push('```');
                                    }
                                })
                                effect.uses--;
                                game.addToCombat(player);
                                player.actionAvailable = false;
                                dialog.push(game.updateCombat());
                            }
                            else {
                                dialog.push(`There seems to be something wrong with this ability.`);
                            }
                        }
                    }
                    else if (effect.name === 'summon') {
                        if (!inCombat) {
                            dialog.push(`You need to be in combat to use this.`);
                        }

                        //... need another arg specifying type of monster to summon and another for clay amount
                        //... Have to specify how much clay you want to use where the cost per type is the minimum
                        //... More clay ups the version and stats of the monster
                        //... check for enough trophies of the monster type for it to be eligible
                        //... Create the monster and assign control to the player
                        //... Add the monster to game.summons[] for the duration
                        //... Clean up summons when duration is over, player dies or combat ends

                    }
                });

            }
            else {
                dialog.push(`Screams echo in your mind...`);
            }

        if (dialog.length) {
            sendMessage(message.channel, dialog.join('\n'));
        }
    }
};
