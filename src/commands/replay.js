const { validateURL } = require('ytdl-core')
const { sendQueueMessage } = require('../helpers/music')

const command = 'replay'

function execute(msg, data, args) {
    const serverQueue = data.queue.get(msg.guild.id)
    
    const tocarCommand = data.commandsMap.get('tocar')
    const param =  args[0]
    
    if(!serverQueue){
        tocarCommand(msg, data, [param])
        return
    }
    
    const index = parseInt(args[0])
    if(Number.isInteger(index)) {
        const music = serverQueue.musics[index]
        if(!music)
            throw "Enviou o parametro errado burrao"

        music.requestUser = msg.member
        serverQueue.musics.push(music)
        sendQueueMessage(msg.channel, music, serverQueue.musics.length)
        return
    }

    if(validateURL(param)){
        const music = serverQueue.musics.filter(music => music.video_url == param)[0]
        if(music) {
            serverQueue.musics.push(music)
            sendQueueMessage(msg.channel, music, serverQueue.musics.length)
            return
        }
        tocarCommand(msg, data, [param])
    }

}

module.exports = { execute, command }