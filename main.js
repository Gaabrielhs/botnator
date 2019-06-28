console.log('Starting Botnator...');
const botnator = require('./botnator/botnator');

//loading bots:
const botHelloWorld = require('./bots/helloworld/main');

//registering bots:
botnator.registerBot(botHelloWorld);

botnator.configure();
botnator.run();
