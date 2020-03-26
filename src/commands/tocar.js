const { RichEmbed } = require('discord.js')
const ytdl = require('ytdl-core')
const ytSearch =  require('../helpers/youtubeSearch')

const command = 'tocar'

async function execute(msg, data, args){
    if (!msg.member.voiceChannel) {
        throw 'Você não está em um voice channel!'
    }

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    const sentence = args.join(' ')
    console.log(`sentence: `,sentence)

    const link = await getLink(sentence)
    const info = await ytdl.getInfo(link)

    const music = { 
        title: info.title,
        video_url: info.video_url,
        short_description: info.player_response.videoDetails.shortDescription,
        duration: info.player_response.videoDetails.lengthSeconds,
        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails.pop().url,
        requestUser: msg.member
    }

    if(serverQueue){
        addMusicToQueue(music, serverQueue)
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

        play(msg.guild.id, queue)
    }
}

async function play(guildId, queue){

    const serverQueue = queue.get(guildId)

    //Saindo do canal de voz
    if(serverQueue.musics.length === 0){
        serverQueue.voiceConnection.disconnect()
        queue.delete(guildId)
        return
    }

    const music = serverQueue.musics[0]

    const stream = await ytdl(music.video_url)

    const dispatcher = serverQueue.voiceConnection.playStream(stream)

    dispatcher.on('start', async () => {
        const embed = new RichEmbed()
                            .setColor(0x0088FF)
                            .setTitle(music.title)
                            .setDescription(`Duração: ${secToPrettyOutput(music.duration)}`)
                            .setThumbnail(music.thumbnail)
                            .setURL(music.video_url)
                            .setAuthor(music.requestUser.nickname || music.requestUser.user.username, music.requestUser.user.avatarURL)

        const last_message = await serverQueue.textChannel.send(embed)
        // await last_message.react('⏸')
        await last_message.react('⏩')
        
        const collectorSkip = last_message.createReactionCollector((reaction, user) => reaction.emoji.name === '⏩')
        collectorSkip.on('collect', reaction => {
            if(reaction.count > 1) {
                dispatcher.end()
            }
        })

        await last_message.react('🔂')
        const collectorReplay = last_message.createReactionCollector((reaction, user) => reaction.emoji.name === '🔂')
        collectorReplay.on('collect', reaction => {
            if(reaction.count > 1) {
                addMusicToQueue(music, serverQueue)
            }
        })
    })

    dispatcher.on('end', () => {
        serverQueue.musics.shift()
        play(guildId, queue)
    })

    dispatcher.on('error', e => {
        console.log(e)
        serverQueue.textChannel.send(`Deu merda aqui: ${e}`)
    })
}

async function addMusicToQueue(music, serverQueue) {
    serverQueue.musics.push(music)
    const embed = new RichEmbed()
                        .setColor(0x0088FF)
                        .setTitle(music.title)
                        .setDescription(`Adicionado a fila na posição ${serverQueue.musics.length - 1}`)
                        .setThumbnail(music.thumbnail)
                        .setURL(music.video_url)
                        .setAuthor(music.requestUser.nickname || music.requestUser.user.username, music.requestUser.user.avatarURL)

    serverQueue.textChannel.send(embed)
}

async function getLink(search){
    let link = search
    if(!ytdl.validateURL(link)){
        link = await ytSearch.search(search)
    }
    console.log(`Link encontrado: ${link}`)
    return link
}

function secToPrettyOutput(input){
    const hours = parseInt(input / 3600)
    const minutes = parseInt((input % 3600) / 60)
    const seconds = input % 60
    
    return `${hours > 0 ? hours + "h" : ""} ${minutes > 0 ? minutes + "m" : ""} ${seconds}s`
}

module.exports = { command, execute }