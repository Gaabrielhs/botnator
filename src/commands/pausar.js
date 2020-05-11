const command = 'pausar'

async function execute(msg, data, args){
    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    if(!serverQueue){
        // msg.channel.send(`Server sem fila ainda...`);
        console.log('Server sem fila ainda...');
        return
    }
    serverQueue.voiceConnection.dispatcher.pause();
}

module.exports = { command, execute }