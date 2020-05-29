const command = 'parar'

async function execute(msg, data, args){
    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)
    
    if(!serverQueue){
        console.log('Server sem fila ainda...')
    }
    
    const musics = serverQueue.musics
    serverQueue.musics = [musics[0]]
    serverQueue.voiceConnection.dispatcher.end()
}

module.exports = { command, execute }