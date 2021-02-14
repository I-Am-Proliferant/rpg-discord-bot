module.exports = {
    name: 'botavatar',
    aliases: [],
    description: 'Ping!',
    args: false,
    usage: '<user> <role>',
    guildOnly: false,
    permissions: 'Admin',
    cooldown: 5,
    execute(message, args, game) {
        client.user.setAvatar('../assets/bot-avatar.png');
    },
};

