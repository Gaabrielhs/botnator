import { DiscordGateway } from './gateways/DiscordGateway';
import { config } from 'dotenv';

class Botnator {
    start() {
        console.log('Starting gateways...');
        config();
        new DiscordGateway().start();
    }
}

console.log('alterei agora');
const botnator = new Botnator();
botnator.start();