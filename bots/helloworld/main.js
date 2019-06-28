const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'Hello World bot',

    events: {
        onRegister(botnator) {
            console.log('I was successfully registered XD', (botnator) ? 'simm' : 'naoo');
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
        client.login('NTkzODczMDcxMjg3NTY2MzQ4.XRVVZQ.HpNRBEYC7Phjz9Md8dmpf6KW8Qk');
        console.log('Doing the magic... Showing: HELLO WORLD!');
    },

    understandVoice (channel) {
        channel.join();
        console.log(channel);
    }
}