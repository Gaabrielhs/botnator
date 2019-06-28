const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'Hello World bot',
    token: null,

    events: {
        onRegister(botnator) {
            console.log('I\'wont do anything here...');
        },
        onConfigure(botnator) {
            module.exports.token = botnator.credentials.discord.token;
        }
    },

    run() {
        client.on('ready', response => {
            const values = client.channels.values();
            for(let x = 0; x < client.channels.size; x++) {
                const channel = values.next().value;
                if (channel.type === 'voice') {
                    this.understandVoice(channel);
                }
            }
            
        });
        client.on('message', message => {
            if (client.user.id == message.author.id) {
                console.log(message.author);
                return;
            }
            
            message.channel.send('VOCÊ QUIS DIZER: ' + message.content);
        });
        client.login(this.token);
        console.log('Doing the magic... Connectig using the following token: ' + this.token);
    },

    understandVoice (channel) {
        channel.join();
        console.log(channel);
    }
}