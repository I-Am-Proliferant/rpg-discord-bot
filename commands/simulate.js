const { sendMessage } = require('../lib/utils');
const { random } = require('../lib/random.js');

module.exports = {
    name: 'simulate',
    aliases: ['sim'],
    description: 'Simulate different features for development and balance',
    args: true,
    usage: '"User Name"',
    guildOnly: 'ADMIN',
    cooldown: 5,
    execute(message, args, game) {
        const userName = message.author.username;
        const dialog = [];

        if (args[0] === 'level') {
            let simLevel = 0;
            const num = args[1] || 100;
            let count = 0;
            let expNeeded = 100;
            const exponent = 1.5;
            const baseXp = 100;
            dialog.push(`Simulating levels.....`);

            while (count <= num) {
                count++;
                simLevel++;
                // expNeeded += Math.floor((4 * (simLevel ^ 3)) / 5);
                expNeeded += baseXp * (simLevel ^ exponent);
                dialog.push(`level: ${simLevel}, EXP Needed: ${expNeeded}`);
            }

        }

        else if (args[0] === 'attack') {
            const num = 100;
            let power = 1;
            let defense = args[1] || 1;
            let count = 0;
            dialog.push(`Simulating attacks.....`);

            //... Stats Power+ defense static
            //... Stats Power static defense+
            //... Stats Power+ defense+

            while (count <= num) {
                const attack = Math.floor((power / 2) + power);
                // const damage = Math.floor(attack * (100 / (100 + defense)));
                const damage = Math.floor(attack * (1 - (0.06 * defense) / (1 + 0.06 * defense)));
                dialog.push(`Power: ${power} Defense: ${defense} Attack: ${attack} Damage: ${damage}`);
                count++;
                power++;
            }

        }

        else if (args[0] === 'defense') {
            const num = 100;
            let power = args[1] || 50;
            let defense = 1;
            let count = 0;
            dialog.push(`Simulating defense.....`);

            //... Stats Power+ defense static
            //... Stats Power static defense+
            //... Stats Power+ defense+

            while (count <= num) {
                const attack = Math.floor((power / 2) + power);
                // const damage = Math.floor(attack * (100 / (100 + defense)));
                const damage = Math.floor(attack * (1 - (0.06 * defense) / (1 + 0.06 * defense)));
                dialog.push(`Power: ${power} Defense: ${defense} Attack: ${attack} Damage: ${damage}`);
                count++;
                defense++;
            }

        }

        sendMessage(message.channel, dialog.join('\n'));
    },
};