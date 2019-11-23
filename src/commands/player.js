const ytdl = require('ytdl-core');
const ytSearch =  require('../helpers/youtubeSearch');

//Queues
const queue = new Map();

async function robot(msg){
    if (!msg.member.voiceChannel) {
        return msg.reply('Você não está em um voice channel!');
    }

    const serverQueue = queue.get(msg.guild.id);

    if(msg.content.indexOf('sabadaço') > -1){
        stop(msg, serverQueue);
        msg.content = msg.content.replace('sabadaço', 'tocar ') + 'https://youtu.be/LCDaw0QmQQc';
        execute(msg, serverQueue);
        return
    }

    if(msg.content.indexOf('tocar') > -1) {
        execute(msg, serverQueue);
        return
    }

    if(msg.content.indexOf('pular') > -1) {
        skip(msg, serverQueue);
        return
    }

    if(msg.content.indexOf('parar') > -1) {
        stop(msg, serverQueue);
        return
    }

    msg.channel.send(`Comando inválido`);
    return;

}

async function execute(msg, serverQueue){

    const link = await getLink(msg.content);

    const music = { title, video_url } = await ytdl.getInfo(link);

    if(serverQueue){
        serverQueue.musics.push(music);
        msg.channel.send(`Música ${music.title} adicionada a fila na posição: ${serverQueue.musics.length}`);
    }else{

        const connect = await msg.member.voiceChannel.join().catch(e => {
            msg.channel.send(`Não consegui me conectar ao seu canal de voz`);
        });
    
        if(!connect) return;

        const queueServer = {
            musics: [],
            voiceChannel: msg.member.voiceChannel,
            textChannel: msg.channel
        }

        queue.set(msg.guild.id, queueServer);

        queueServer.musics.push(music);
        
        /* console.log(`Voice channel`);
        console.log(msg.member.voiceChannel); */
        play(msg.guild.id, music);

    }
}

async function play(guildId, music = null){
    const serverQueue = queue.get(guildId);

    //Saindo do canal de voz
    if(!music){
        serverQueue.voiceChannel.leave();
        queue.delete(guildId);
        return;
    }

    const stream = await ytdl(music.video_url);

    const dispatcher = serverQueue.voiceChannel.connection.playStream(stream);

    dispatcher.on('start', () => {
        serverQueue.textChannel.send(`Tocando: ${music.title}`);
    });

    dispatcher.on('end', () => {
        serverQueue.musics.shift();
        play(guildId, serverQueue.musics[0]);
    });

    dispatcher.on('error', e => {
        console.log(e);
        serverQueue.textChannel.send(`Deu merda aqui: ${e}`);
    });
}

function skip(msg, serverQueue) {
    if(!serverQueue){
        // msg.channel.send(`Server sem fila ainda...`);
        console.log('Server sem fila ainda...');
        return
    }

    const connection = serverQueue.voiceChannel.connection || msg.member.voiceChannel.connection 
    connection.dispatcher.end();
    dispatcher.end();
}

function stop(msg, serverQueue) {
    if(!serverQueue){
        // msg.channel.send(`Server sem fila ainda...`);
        console.log('Server sem fila ainda...');
        return
    }

    const connection = serverQueue.voiceChannel.connection || msg.member.voiceChannel.connection 
    serverQueue.musics = [];
    connection.dispatcher.end();
}


module.exports = robot