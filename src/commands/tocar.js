const ytdl = require('ytdl-core-discord')

const { getMusic, sendQueueMessage, sendPlayMessage } = require('../helpers/music')

const command = 'tocar'

async function execute(msg, data, args) {
    if (!msg.member.voice.channel) {
        throw 'Você não está em um voice channel!'
    }

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    const sentence = args.join(' ')
    console.log(`> Sentence: `,sentence)

    const music = await getMusic(sentence)
    music.requestUser = msg.member

    if(serverQueue){
        serverQueue.musics.push(music)
        sendQueueMessage(msg.channel, music, serverQueue.musics.length)
    }else{
        const voiceConnection = await msg.member.voice.channel.join().catch(e => {
            throw `Não consegui me conectar ao seu canal de voz`
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

async function play(msg, data) {

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
    const dispatcher = serverQueue.voiceConnection.play(stream, { type: 'opus' })
    let last_message = null

    dispatcher.on('start', async () => {
        last_message = await sendPlayMessage(serverQueue.textChannel, music)
        
        const reactions = ['▶', '⏸', '⏩', '🔂']
        reactions.forEach(r => last_message.react(r))

        const reactionCollector = last_message.createReactionCollector((reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id != data.client.user.id && !user.bot
        })

        reactionCollector.on('collect', reaction => {
            switch(reaction.emoji.name) {
                case '▶': dispatcher.resume()
                break
                
                case '⏸': dispatcher.pause()
                break

                case '⏩': dispatcher.end()
                break
                
                case '🔂':
                    const listener = data.commandsMap.get('replay')
                    listener(msg, data, [music.video_url])
                break
            }
        })
        reactionCollector.on('end', (reaction) => last_message.reactions.resolve(reaction).remove())
    })

    dispatcher.on('finish', () => {
        serverQueue.musics.shift()
        removeReactions()
        play(msg, data)
    })

    dispatcher.on('error', e => {
        removeReactions()
        serverQueue.textChannel.send(`Deu merda aqui: ${e}`)
    })

    function removeReactions() {
        const reactions = last_message.reactions
        reactions.resolve('▶').remove()
        reactions.resolve('⏸').remove()
        reactions.resolve('⏩').remove()
    }
}

module.exports = { command, execute }