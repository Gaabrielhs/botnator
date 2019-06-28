const gateways = {
    discord: require('./gateways/discord')
}


function start(){
    console.log('Starting gateways...');
    gateways.discord(); 
}

start()
