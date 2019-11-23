const command = 'parar'

async function execute(msg, data, args){
    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)
    
    if(!serverQueue){
        // msg.channel.send(`Server sem fila ainda...`);
        console.log('Server sem fila ainda...');
        return
    }

    const connection = serverQueue.voiceChannel.connection || msg.member.voiceChannel.connection 
    serverQueue.musics = [];
    connection.dispatcher.end();
}

module.exports = { command, execute }