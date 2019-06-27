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
        console.log('Doing the magic... Showing: HELLO WORLD!');
    }
}