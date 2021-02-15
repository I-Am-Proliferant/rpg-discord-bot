const Discord = require('discord.js');
module.exports = {
    name: 'msg',
    aliases: ['ii'],
    description: 'Tests Discord\'s embedded message functionality.',
    args: false,
    usage: '',
    guildOnly: false,
    cooldown: 1,
    execute(message, args, game) {
        const userName = (args[0] || message.author.username);
        if (!userName) {
            return;
        }
        const player = game.getPlayer(userName) || game.enemy.name;

        if (player) {

            const exampleEmbed = new Discord.MessageEmbed()
    	        .setColor('#0099ff')
    	        .setTitle(`${player.name}`)
    	        .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                .setDescription(`${player.name}'s character sheet`)
    	        .setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true }))
    	        .addFields(
    	        	{ name: 'Level', value: player.level },
    	        	{ name: '\u200B', value: '\u200B' },
    	        	{ name: 'Experience', value: `${player.exp}/${player.expNeeded}`, inline: true },
    	        	{ name: 'Gold', value: player.gold, inline: true },
    	        )
    	        .addField('Inline field title', 'Some value here', true)
    	        .setTimestamp()
                .setFooter('Some footer text here');

            message.channel.send(exampleEmbed);
        }

    }
};