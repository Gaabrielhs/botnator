import { IBotnatorRobot } from "../interfaces/IBotnatorRobot";
import { IBotnatorRequest } from "../interfaces/IBotnatorRequest";
import { IBotnatorResponse, BotnatorResponseType } from "../interfaces/IBotnatorResponse";
import * as ytdl from "ytdl-core";
import { google } from 'googleapis';
import { Message } from "discord.js";

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

    protected youtube: any;

    constructor() {
        this.youtube = google.youtube({
            auth: process.env.YOUTUBE_API,
            version: 'v3'
        });
        console.log('algo?? =>>> ', this.youtube);
    }

    execute(entrada: IBotnatorRequest, ...params: any): IBotnatorResponse {

                this.msg = params[0];
        const serverQueue = this.queue.get(entrada.senderGroupId);
    
        if(entrada.rawMessage.indexOf('sabadaço') > -1){
            this.stop(entrada.rawMessage, serverQueue);
            this.msg.content = this.msg.content.replace('sabadaço', 'tocar ') + 'https://youtu.be/LCDaw0QmQQc';
            this.exec(this.msg, serverQueue);
            return
        }
    
        if(this.msg.content.indexOf('tocar') > -1) {
            this.exec(this.msg, serverQueue);
            return
        }
    
        if(this.msg.content.indexOf('pular') > -1) {
            this.skip(this.msg, serverQueue);
            return
        }
    
        if(this.msg.content.indexOf('parar') > -1) {
            this.stop(this.msg, serverQueue);
            return
        }
    
        this.msg.channel.send(`Comando inválido`);
        return;
        
    }

    async exec(msg, serverQueue){
        const link = await this.getLink(msg.content);
    
        const { title, video_url } = await ytdl.getInfo(link);
        const music = {title, video_url};
    
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
            this.play(msg.guild.id, music);
    
        }
    }

    async  play(guildId, music = null){
        const serverQueue = this.queue.get(guildId);
    
        //Saindo do canal de voz
        if(!music){
            serverQueue.voiceChannel.leave();
            this.queue.delete(guildId);
            return;
        }
    
        const stream = await ytdl(music.video_url);
    
        const dispatcher = serverQueue.voiceChannel.connection.playStream(stream);
    
        dispatcher.on('start', () => {
            serverQueue.textChannel.send(`Tocando: ${music.title}`);
        });
    
        dispatcher.on('end', () => {
            serverQueue.musics.shift();
            this.play(guildId, serverQueue.musics[0]);
        });
    
        dispatcher.on('error', e => {
            console.log(e);
            serverQueue.textChannel.send(`Deu merda aqui: ${e}`);
        });
    }
    
    skip(msg, serverQueue) {
        if(!serverQueue){
            // msg.channel.send(`Server sem fila ainda...`);
            console.log('Server sem fila ainda...');
            return
        }
        serverQueue.voiceChannel.connection.dispatcher.end();
    }
    
    stop(msg, serverQueue) {
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
            link = await this.search(search);
        }
        console.log(`Link encontrado: ${link}`);
        return link;
    }


    async search (searchQuery) {
        const base_url = 'https://www.youtube.com/watch?v=';
        const res = await this.youtube.search.list({
            part: 'id',
            type: 'video',
            maxResults: 1,
            q: searchQuery
        });

        if(res.data.items.length == 0) return null;

        const videoId = res.data.items[0].id.videoId;
        return base_url + videoId;
    }
    
}