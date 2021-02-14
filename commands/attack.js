module.exports = {
    name: 'attack',
    aliases: ['aa'],
    description: 'Attacks the current monster. Does nothing if out of combat.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 1,
    execute(message, args, game) {
        const userName = message.author.username;
        if (!userName) {
            return;
        }
        const dialog = [];

        if (!game.enemy || !game.turn.isCombat) {
            dialog.push(`There is currently no active combat. Try !adventure to start one.`);
            message.channel.send(dialog);
            return;
        }

        if (game.turn.userName === userName) {
            const player = game.getPlayer(userName);
            if(!player) {
                dialog.push(`You are not in combat. Try !adventure to join one.`);
                message.channel.send(dialog);
                return;
            }
            else {
                dialog.push(player.attack(game.enemy));
                dialog.push(game.updateCombat());
            }

            if (game.turn.userName === game.enemy.name) {
                const target = game.getRandomPlayer();
                if (!target) {
                    dialog.push(`Target returned false.`);
                    if(dialog.length) {
                        message.channel.send(dialog.join('\n'));
                    }
                    return;
                }
                dialog.push(game.enemy.attack(target));
                dialog.push(game.updateCombat());
            }
        }
        if(dialog.length) {
            message.channel.send(dialog.join('\n'));
        }
    }
};