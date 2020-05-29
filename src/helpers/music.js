const ytSearch = require('../helpers/youtubeSearch')
const ytdl = require('ytdl-core-discord')
const { MessageEmbed } = require('discord.js')

async function createMusic(msg, link) {
    console.log(link)
    const info = await ytdl.getInfo(link)

    return {
        title: info.title,
        videoUrl: info.video_url,
        shortDescription: info.player_response.videoDetails.shortDescription.slice(0, 2048),
        duration: info.player_response.videoDetails.lengthSeconds,
        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails.pop().url,
        request: {
            guildMember: msg.member,
            textChannel: msg.channel
        }
    }
}

async function sendQueueMessage(queue) {
    const musics = queue.musics
    const embed = new MessageEmbed()
                            .setColor(0x0088FF)
                            .setTitle('Player')
                            .setAuthor(musics[0].request.guildMember.nickname || musics[0].request.guildMember.user.username, musics[0].request.guildMember.user.avatarURL())
                            .setThumbnail(musics[0].thumbnail)

    embed.addField('Tocando', `[${musics[0].title}](${musics[0].videoUrl})`)
    
    if(musics.length > 1) {
        let musicsList = ''
        for(let i = 1; i < musics.length; i++) {
            musicsList += `[${i}. ${musics[i].title}](${musics[i].videoUrl})\n`
        }
        embed.addField('Próximas', musicsList.slice(0, 2048))
    }
    const totalDuration = musics.map(m => parseInt(m.duration)).reduce((a, b) => a + b)
    embed.addField('Duração total', secToPrettyOutput(totalDuration))

    
    if(!process.env.SINGLE_MUSIC_MESSAGE){
        if(queue.queueMessage) await queue.queueMessage.delete()
        queue.queueMessage = await musics[musics.length - 1].request.textChannel.send(embed)
        return queue.messageSent
    }

    let messageSent = null
    if(queue.queueMessage){
        messageSent = await queue.queueMessage.edit(embed)
    }else{
        messageSent = await musics[musics.length - 1].request.textChannel.send(embed)
    }
    queue.queueMessage = messageSent
    await manageReactions(queue)

    return messageSent
}

async function manageReactions(queue) {
    const dispatcher = queue.voiceConnection.dispatcher
    const message = queue.queueMessage

    const reactions = ['▶', '⏸', '⏩']
    reactions.forEach(async r => await message.react(r))
    const reactionCollector = message.createReactionCollector((reaction, user) => {
        return reactions.includes(reaction.emoji.name) && !user.bot
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
        }
    })
}

async function sendPlayMessage(music) {
    const embed = new MessageEmbed()
        .setColor(0x0088FF)
        .setTitle(music.title)
        .addField('Duração', secToPrettyOutput(music.duration))
        .setThumbnail(music.thumbnail)
        .setURL(music.videoUrl)
        .setAuthor(music.request.guildMember.nickname || music.request.guildMember.user.username, music.request.guildMember.user.avatarURL())

    return await music.request.textChannel.send(embed)
}

function secToPrettyOutput(input){
    const hours = parseInt(input / 3600)
    const minutes = parseInt((input % 3600) / 60)
    const seconds = input % 60
    
    return `${hours > 0 ? hours + "h" : ""} ${minutes > 0 ? minutes + "m" : ""} ${seconds}s`
}

async function getLink(search){
    console.log(`> Getting link for:`, search)

    if(!ytdl.validateURL(search)){
        search = await ytSearch.search(search)
    }
    console.log(`> Link: ${search}`)
    return search
}

module.exports = { createMusic, getLink, secToPrettyOutput, sendQueueMessage, sendPlayMessage }