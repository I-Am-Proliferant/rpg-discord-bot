const Discord = require('discord.js');

const sendMessage = function(channel, message) {
    filtered = filteredMessage(message);
    if (filtered[0]) {
        channel.send(filtered);
    }
}

const filteredMessage = function(message) {
    if(typeof message === 'object' && message[0]) {
        return message.filter(function (e) {
            return e != '' && e != ' ' && e != '\n' && e != ' \n';
        });
    }
    else if (message != '' && message != ' ' && message != '\n' && message != ' \n') {
        return [message];
    }
    return false;
}

module.exports = { sendMessage }
