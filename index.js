const gateways = {
    discord: require('./gateways/discord')
}

const ytdl = require('ytdl-core');

function start(){
    console.log('Starting gateways...');

    gateways.discord();
}

start()
