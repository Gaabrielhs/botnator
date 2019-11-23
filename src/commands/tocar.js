const ytdl = require('ytdl-core');
const ytSearch =  require('../helpers/youtubeSearch');

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

    const music = { title, video_url } = await ytdl.getInfo(link)

    if(serverQueue){
        serverQueue.musics.push(music)
        msg.channel.send(`Música ${music.title} adicionada a fila na posição: ${serverQueue.musics.length}`)
    }else{
        await msg.member.voiceChannel.join().catch(e => {
            throw `Não consegui me conectar ao seu canal de voz`
            //msg.channel.send(`Não consegui me conectar ao seu canal de voz`)
        })
        const queueServer = {
            musics: [],
            voiceChannel: msg.member.voiceChannel,
            textChannel: msg.channel
        }

        queue.set(msg.guild.id, queueServer)

        queueServer.musics.push(music)

        play(msg.guild.id, queue, music)
    }
}

async function play(guildId, queue, music = null){

    const serverQueue = queue.get(guildId)
    //Saindo do canal de voz
    if(!music){
        serverQueue.voiceChannel.leave()
        queue.delete(guildId)
        return
    }

    const stream = await ytdl(music.video_url)

    const dispatcher = serverQueue.voiceChannel.connection.playStream(stream)

    dispatcher.on('start', () => {
        serverQueue.textChannel.send(`Tocando: ${music.title}`)
    })

    dispatcher.on('end', () => {
        serverQueue.musics.shift()
        play(guildId, queue, serverQueue.musics[0])
    })

    dispatcher.on('error', e => {
        console.log(e)
        serverQueue.textChannel.send(`Deu merda aqui: ${e}`)
    })
}

async function getLink(search){
    let link = search
    if(!ytdl.validateURL(link)){
        link = await ytSearch(search);
    }
    console.log(`Link encontrado: ${link}`);
    return link;
}

module.exports = { command, execute }