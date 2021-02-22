const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();

const { Game } = require('./lib/game.js');

const game = new Game();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
    client.user.setUsername('The Dungeon Master');

});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let args = [];
    const quoteSeparatedArgs = message.content.slice(prefix.length).trim().split(/(\x22[^\x22]*\x22)/).filter(x => x);
    quoteSeparatedArgs.forEach(arg => {
        if (arg.match('\x22')) {
            args.push(arg.replace(/\x22/g, ''));
        } else {
            args = args.concat(arg.trim().split(' '));
        }
    });

    const commandNameRaw = args.shift();
    const commandName = commandNameRaw ? commandNameRaw.toLowerCase() : 'none';

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You can not do this!');
        }
    }

    if (commandName.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, game);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
        message.reply(error);
    }
});

client.login(token);
