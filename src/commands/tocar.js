const ytdl = require('ytdl-core-discord')

const { createMusic, getLink ,sendQueueMessage, sendPlayMessage } = require('../helpers/music')

const command = 'tocar'

const reactions = ['▶', '⏸', '⏩', '🔂']

async function execute(msg, data, args) {
    if (!msg.member.voice.channel) {
        throw 'Você não está em um voice channel!'
    }

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    const sentence = args.join(' ')
    const link = await getLink(sentence)

    const music = await getMusic(msg, data, link)

    if(serverQueue) {
        serverQueue.musics.push(music)
        await sendQueueMessage(serverQueue)
        msg.delete()
        return
    }

    const voiceConnection = await msg.member.voice.channel.join().catch(e => {
        throw `Não consegui me conectar ao seu canal de voz`
    })

    const queueServer = {
        musics: [music],
        voiceConnection,
        queueMessage: null
    }

    queue.set(msg.guild.id, queueServer)

    play(msg, data)
    msg.delete()
}

async function play(msg, data) {

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    if(serverQueue.musics.length === 0){
        serverQueue.voiceConnection.disconnect()
        serverQueue.queueMessage.delete()
        queue.delete(msg.guild.id)
        return
    }

    const music = serverQueue.musics[0]

    const stream = await ytdl(music.videoUrl)
    const dispatcher = serverQueue.voiceConnection.play(stream, { type: 'opus' })

    dispatcher.on('start', async () => {
        if(process.env.SINGLE_MUSIC_MESSAGE){
            await sendQueueMessage(serverQueue)
            return
        }

        music.playMessage = await sendPlayMessage(music)
        reactions.forEach(r => music.playMessage.react(r))

        const reactionCollector = music.playMessage.createReactionCollector((reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id != data.client.user.id && !user.bot
        })

        reactionCollector.on('collect', async (reaction, user) => {
            reaction.users.remove(user.id)

            switch(reaction.emoji.name) {
                case '▶': 
                    dispatcher.resume()
                break
                
                case '⏸': 
                    dispatcher.pause()
                break

                case '⏩': 
                    dispatcher.end()
                break
                
                case '🔂':
                    execute(msg, data, [music.videoUrl])
                break
            }
        })
    })

    dispatcher.on('finish', async () => {
        const lastMusic = serverQueue.musics.shift()
        if(!process.env.SINGLE_MUSIC_MESSAGE){
            removeReactions(lastMusic.playMessage.reactions)
        }
        play(msg, data)
    })

    dispatcher.on('error', async e => {
        const lastMusic = serverQueue.musics.shift()
        if(!process.env.SINGLE_MUSIC_MESSAGE){
            removeReactions(lastMusic.playMessage.reactions)
        }
    })
}

async function removeReactions(reactions) {
    if(!reactions) return
    try {
        await reactions.resolve('▶').remove()
        await reactions.resolve('⏸').remove()
        await reactions.resolve('⏩').remove()
    }catch(e) {
        console.log(e)
    }
}

async function getMusic(msg, data, link) {
    let music = null
    data.queue.forEach(queue => {
        if(music) return

        let it = queue.musics.find(m => m.videoUrl == link)
        if(it) {
            music = Object.assign({}, it)
            music.request.guildMember = msg.member
            music.request.textChannel = msg.channel
        }
    })
    
    return music || createMusic(msg, link)
}

module.exports = { command, execute }