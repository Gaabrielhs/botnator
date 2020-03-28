const ytSearch =  require('../helpers/youtubeSearch')
const ytdl = require('ytdl-core')
const { RichEmbed } = require('discord.js')

async function getMusic(sentence) {
    const link = await getLink(sentence)
    const info = await ytdl.getInfo(link)

    const music = { 
        title: info.title,
        video_url: info.video_url,
        short_description: info.player_response.videoDetails.shortDescription,
        duration: info.player_response.videoDetails.lengthSeconds,
        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails.pop().url
    }

    return music
}

async function sendQueueMessage(channel, music, index) {
    const embed = new RichEmbed()
                            .setColor(0x0088FF)
                            .setTitle(music.title)
                            .setDescription(`Adicionado a fila na posição ${index}`)
                            .setThumbnail(music.thumbnail)
                            .setURL(music.video_url)
                            .setAuthor(music.requestUser.nickname || music.requestUser.user.username, music.requestUser.user.avatarURL)
    return await channel.send(embed)
}

async function sendPlayMessage(channel, music) {
    const embed = new RichEmbed()
        .setColor(0x0088FF)
        .setTitle(music.title)
        .setDescription(`Duração: ${secToPrettyOutput(music.duration)}`)
        .setThumbnail(music.thumbnail)
        .setURL(music.video_url)
        .setAuthor(music.requestUser.nickname || music.requestUser.user.username, music.requestUser.user.avatarURL)

    return await channel.send(embed)
}

function secToPrettyOutput(input){
    const hours = parseInt(input / 3600)
    const minutes = parseInt((input % 3600) / 60)
    const seconds = input % 60
    
    return `${hours > 0 ? hours + "h" : ""} ${minutes > 0 ? minutes + "m" : ""} ${seconds}s`
}

async function getLink(search){
    let link = search
    if(!ytdl.validateURL(link)){
        link = await ytSearch.search(search)
    }
    console.log(`Link encontrado: ${link}`)
    return link
}

module.exports = { getMusic, secToPrettyOutput, sendQueueMessage, sendPlayMessage }