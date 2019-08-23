import { IBotnatorRobot } from "../interfaces/IBotnatorRobot";
import { IBotnatorRequest } from "../interfaces/IBotnatorRequest";
import { IBotnatorResponse, BotnatorResponseType } from "../interfaces/IBotnatorResponse";
import ytdl from "ytdl-core";
import { Message } from "discord.js";
import { defaultCoreCipherList } from "constants";

export class PlayerBot implements IBotnatorRobot {
    robotName: 'PlayerBot';
    robotDescription: 'Bot which plays music';
    commands = [
        'tocar',
        'pular',
        'parar',
        'sabadaço'
    ];

    mainResponseType = BotnatorResponseType.Stream;

    protected queue = new Map();

    protected msg: Message;

    execute(entrada: IBotnatorRequest, ...params: any): IBotnatorResponse {
        
        this.msg = params[0];
        const serverQueue = this.queue.get(entrada.senderGroupId);
    
        if(entrada.rawMessage.indexOf('sabadaço') > -1){
            this.stop(entrada.rawMessage, serverQueue);
            this.msg.content = this.msg.content.replace('sabadaço', 'tocar ') + 'https://youtu.be/LCDaw0QmQQc';
            this.exec(msg, serverQueue);
            return
        }
    
        if(this.msg.content.indexOf('tocar') > -1) {
            this.exec(msg, serverQueue);
            return
        }
    
        if(this.msg.content.indexOf('pular') > -1) {
            this.skip(msg, serverQueue);
            return
        }
    
        if(this.msg.content.indexOf('parar') > -1) {
            stop(this.msg, serverQueue);
            return
        }
    
        this.msg.channel.send(`Comando inválido`);
        return;
        
        
    }

    async exec(msg, serverQueue){
        const link = await getLink(msg.content);
    
        const music = { title, video_url } = await ytdl.getInfo(link);
    
        if(serverQueue){
            serverQueue.musics.push(music);
            msg.channel.send(`Música ${music.title} adicionada a fila na posição: ${serverQueue.musics.length}`);
        }else{
            const queueServer = {
                musics: [],
                voiceChannel: msg.member.voiceChannel,
                textChannel: msg.channel
            }
    
            this.queue.set(msg.guild.id, queueServer);
    
            queueServer.musics.push(music);
    
    
            await msg.member.voiceChannel.join().catch(e => {
                msg.channel.send(`Não consegui me conectar ao seu canal de voz`);
                return
            });
            
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
        serverQueue.voiceChannel.connection.dispatcher.end();
    }
    
    function stop(msg, serverQueue) {
        if(!serverQueue){
            // msg.channel.send(`Server sem fila ainda...`);
            console.log('Server sem fila ainda...');
            return
        }
        serverQueue.musics = [];
        serverQueue.voiceChannel.connection.dispatcher.end();
    }
    
    async getLink(content: any){
        const lastIndex = content.lastIndexOf('tocar') + 1 + ('tocar'.length);
        const search = content.substr(lastIndex);
    
        let link = search;
        if(!ytdl.validateURL(link)){
            link = await ytSearch(search);
        }
        console.log(`Link encontrado: ${link}`);
        return link;
    }
    
    
}