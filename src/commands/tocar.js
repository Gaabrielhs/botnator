const command = 'tocar'

async function execute(msg, data, args){

    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)

    const link = await getLink(msg.content)

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

        play(queueServer, music)

    }
}

async function play(serverQueue, music = null){
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
        play(guildId, serverQueue.musics[0])
    })

    dispatcher.on('error', e => {
        console.log(e)
        serverQueue.textChannel.send(`Deu merda aqui: ${e}`)
    })
}

async function getLink(content){
    const lastIndex = content.lastIndexOf('tocar') + 1 + ('tocar'.length);
    const search = content.substr(lastIndex);

    let link = search;
    if(!ytdl.validateURL(link)){
        link = await ytSearch(search);
    }
    console.log(`Link encontrado: ${link}`);
    return link;
}

module.exports = { command, execute }