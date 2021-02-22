module.exports = {
    name: 'ping',
    aliases: ['pp', 'pingpong'],
    description: 'Ping!',
    args: false,
    usage: '<user> <role>',
    guildOnly: false,
    permissions: 'PING_MEMBERS',
    cooldown: 5,
    execute(message, args, game) {
        message.channel.send('Pong.');
    },
};