const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'Hello World bot',

    events: {
        onRegister() {
            console.log('I was successfully registered XD');
        }
    },

    register(botnator) {
        console.log('Registering Hello World bot!');
        botnator.addBot(this);
    },

    run() {
        client.on('ready', response => {
            console.log('Login com sucesso: ', client.channels.keys().next());
            
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
    }
}