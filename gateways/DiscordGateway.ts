import { IBotnatorGateway } from "../interfaces/IBotnatorGateway";
import { Client } from 'discord.js';
import { HelloBot } from "../robots/HelloBot";
import { PlayerBot } from "../robots/PlayerBot";

declare var process: any;

export class DiscordGateway implements IBotnatorGateway {
    gatewayName = 'Discord Gateway';

    robots = [
        new HelloBot(),
        new PlayerBot()
    ];

    protected client = new Client();

    async login() {
        console.log("Login discord api")
        await this.client.login(process.env.DISCORD_TOKEN);
    }

    registerEvents(): void {
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        })
        
        this.client.on('message', async msg => {
            //Ignorar se a mensagem vier de um bot
            if (msg.author.bot) return;
            if (!msg.mentions.members.first()) return;
            if (msg.mentions.members.find(member => member.id == this.client.user.id) === null) {
                return;
            }
        
            if(msg.content.indexOf('ping') > -1) {
                const responseMessage = await msg.channel.send(`Ping?`);
                // responseMessage.edit(`🏓 Pong! \`${responseMessage.createdTimestamp - msg.createdTimestamp}ms\` | Ping server: \`${client.ping}ms\``)
            }
        
            if (msg.content.indexOf('tocar') > -1 || msg.content.indexOf('pular') > -1 || msg.content.indexOf('parar') > -1 || msg.content.indexOf('sabadaço') > -1) {
                // robots.player(msg);
                // Bad code. Will refactor soon! Promise.
                var command;
                if (msg.content.indexOf('tocar') > -1) command = 'tocar';
                if (msg.content.indexOf('pular') > -1) command = 'pular';
                if (msg.content.indexOf('parar') > -1) command = 'parar';
                if (msg.content.indexOf('sabadaço') > -1) command = 'sabadaço';
                this.robots
                .filter(robot => {
                    return (robot.robotName === 'PlayerBot');
                })
                .pop()
                .execute({
                    command,
                    params: msg.content.split(' '),
                    rawMessage: msg.content
                });
            }
        
            if(msg.content.indexOf('gancho') > -1) {
        
                const randomNumber = Math.floor(Math.random() * 100);
                if(randomNumber < 4){
                // msg.channel.send(`${msg.member.nickname || msg.member.user.username} saiu do gancho na sua frente! 😎`);
                msg.reply(`saiu do gancho na sua frente! 😎`);
                }else{
                // msg.channel.send(`${msg.member.nickname || msg.member.user.username} foi pra entidade mais próxima!`);
                msg.reply(`foi pra entidade mais próxima! 🔪`);
                }
        
                return
            }
        
            if(msg.content.indexOf('falar') > -1) {
                const lastIndex = msg.content.lastIndexOf('falar') + 1 + ('falar'.length);
                const sentence = msg.content.substr(lastIndex);
                msg.delete().catch(xD => { console.log(xD) });
                msg.channel.send(sentence);
            }
        
            /* if(msg.content.indexOf('pesquisar') > -1) {
                const lastIndex = msg.content.lastIndexOf('pesquisar') + 1 + ('pesquisar'.length);
                const search = msg.content.substr(lastIndex);
                const link = await robots.youtubeSearch(search);
                msg.reply(`encontrei isso daqui no youtube: ${link}`);
            } */
        })
    }


    async start() {
        await this.login();
        this.registerEvents();
    }
}