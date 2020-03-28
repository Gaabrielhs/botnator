const ytdl = require('ytdl-core')

const { getMusic, sendQueueMessage, sendPlayMessage } = require('../helpers/music')

const command = 'tocar'

async function execute(msg, data, args){
    if (!msg.member.voiceChannel) {
        throw 'Você não está em um voice channel!'
    }

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    const sentence = args.join(' ')
    console.log(`sentence: `,sentence)

    const music = await getMusic(sentence)
    music.requestUser = msg.member

    if(serverQueue){
        serverQueue.musics.push(music)
        sendQueueMessage(msg.channel, music, serverQueue.musics.length)
    }else{
        const voiceConnection = await msg.member.voiceChannel.join().catch(e => {
            throw `Não consegui me conectar ao seu canal de voz`
            //msg.channel.send(`Não consegui me conectar ao seu canal de voz`)
        })

        const queueServer = {
            musics: [],
            voiceConnection,
            textChannel: msg.channel
        }

        queue.set(msg.guild.id, queueServer)

        queueServer.musics.push(music)

        play(msg, data)
    }
}

async function play(msg, data){

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    //Saindo do canal de voz
    if(serverQueue.musics.length === 0){
        serverQueue.voiceConnection.disconnect()
        queue.delete(msg.guild.id)
        return
    }

    const music = serverQueue.musics[0]

    const stream = await ytdl(music.video_url)

    const dispatcher = serverQueue.voiceConnection.playStream(stream)

    let collectorSkip = null
    let collectorReplay = null

    dispatcher.on('start', async () => {
        const last_message = await sendPlayMessage(serverQueue.textChannel, music)
        
        await last_message.react('⏩')
        
        collectorSkip = last_message.createReactionCollector((reaction, user) => reaction.emoji.name === '⏩')
        collectorSkip.on('collect', reaction => {
            if(reaction.count > 1) {
                dispatcher.end()
            }
        })
        collectorSkip.on('end', () => last_message.reactions.get('⏩').remove())

        await last_message.react('🔂')
        collectorReplay = last_message.createReactionCollector((reaction, user) => reaction.emoji.name === '🔂')
        collectorReplay.on('collect', reaction => {
            if(reaction.count > 1) {
                const listener = data.commandsMap.get('replay')
                listener(msg, data, [music.video_url])
            }
        })

        collectorReplay.on('end', () => last_message.reactions.get('🔂').remove())
    })

    dispatcher.on('end', () => {
        serverQueue.musics.shift()
        if(collectorSkip) collectorSkip.stop()
        play(msg, data)
    })

    dispatcher.on('error', e => {
        console.log(e)
        if(collectorSkip) collectorSkip.stop()
        serverQueue.textChannel.send(`Deu merda aqui: ${e}`)
    })
}

module.exports = { command, execute }