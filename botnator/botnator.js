module.exports = {
    bots: [],
    credentials: {},
    registerBot(bot) {
        if (!bot.run) throw "All bots need to implement run method!";
        this.bots.push(bot);
        if (bot.events && bot.events.onRegister) {
            bot.events.onRegister(this);
        }
    },
    configure() {
        this.credentials = require('../credentials/discord.json');
        this.bots.forEach(bot => {
            if (bot.events && bot.events.onConfigure) {
                bot.events.onConfigure(this);
            }
        })
        console.log('Configuring botnator...', this.credentials.token);
    },
    run() {
        console.log('Running botnator...');
        this.bots.forEach(bot => {
            bot.run(); // TODO: make it asynchronous
        });
    }
};