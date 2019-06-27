module.exports = {
    bots: [],
    addBot(bot) {
        if (!bot.run) throw "All bots need to implement run method!";
        this.bots.push(bot);
        if (bot.events && bot.events.onRegister) {
            bot.events.onRegister();
        }
    },
    configure() {
        console.log('Configuring botnator...');
    },
    run() {
        console.log('Running botnator...');
        this.bots.forEach(bot => {
            bot.run(); // TODO: make it asynchronous
        });
    }
};