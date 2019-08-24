import { IBotnatorGateway } from "../interfaces/IBotnatorGateway";
import { Client } from 'discord.js';
import { HelloBot } from "../robots/HelloBot";
import { PlayerBot } from "../robots/PlayerBot";
import { IBotnatorRobot } from "../interfaces/IBotnatorRobot";
import { IBotnatorResponse, BotnatorResponseType } from "../interfaces/IBotnatorResponse";
import { BotManager } from "../core/managers/BotManager";

export class DiscordGateway implements IBotnatorGateway {
    gatewayName = 'Discord Gateway';

    robotManager = new BotManager([
        new HelloBot(),
        new PlayerBot()
    ]);

    protected client = new Client();

    async login() {
        console.log("Login discord api, using token =>>> " + process.env.DISCORD_TOKEN);
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
                responseMessage[0].edit(`🏓 Pong! \`${responseMessage[0].createdTimestamp - msg.createdTimestamp}ms\` | Ping server: \`${this.client.ping}ms\``);
                return;
            }

            // anotando quais os bots capazes de ouvir o comando que chegou
            const listenerBots: IBotnatorRobot[] = this.robotManager.getBotsAvailableForMessage(msg.content);

            for (const robot of listenerBots) {

                if (
                [
                    BotnatorResponseType.Stream,
                    BotnatorResponseType.AudioFile
                ].includes(robot.mainResponseType) && 
                !msg.member.voiceChannel) {
                    msg.reply(`O Bot ${robot.robotName} requer que você esteja em um canal de áudio para executar o comando solicitado`);
                    continue;
                }

                const botResponse: IBotnatorResponse = robot.execute({
                    command: this.robotManager.extractCommandForBot(robot, msg.content),
                    params: msg.content.split(' '),
                    rawMessage: msg.content,
                    senderId: msg.member.id,
                    senderGroupId: msg.guild.id
                }, msg);
                if (!botResponse) {
                    continue;
                }
                switch (botResponse.type) {
                    case BotnatorResponseType.String:
                        msg.reply(botResponse.responseContent);
                        break;
                    
                    case BotnatorResponseType.Stream:
                        if (!msg.member.voiceChannel) {
                            msg.reply(`O Bot ${robot.robotName} requer que você esteja em um canal de áudio para executar o comando solicitado`);
                            break;
                        }
                        msg.member.voiceChannel.connection.playStream(botResponse.responseContent);
                        break;
                    // TODO: IMplement the other types here
                }
            }
        
            
        })
    }


    async start() {
        await this.login();
        this.registerEvents();
    }
}