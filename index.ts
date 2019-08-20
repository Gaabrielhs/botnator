import { gateway as discordGateway } from './gateways/discord';


class Botnator {
    start() {
        console.log('Starting gateways...');
        discordGateway();
    }
}

console.log('alterei agora');
const botnator = new Botnator();
botnator.start();