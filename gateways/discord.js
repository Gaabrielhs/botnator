const config = require('../config/discord')
const Discord = require('discord.js')
const client = new Discord.Client()
const robots = {
    hello: require('../robots/hello')
}


// TODO: base interface
function gateway(){
    console.log("Starting Discord Gateway...")    
    login()

    registerEvents()
}

function registerEvents(){
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on('message', async msg => {
    if (msg.mentions.members.first().user.id !== client.user.id) {
      console.log('Mencionou alguém, mas não fui eu');
      return;
    }
    if (msg.content.indexOf('fala') > -1) {
      if (!msg.member.voiceChannel) {
        return msg.reply('Não posso falar, você não está em um voice channel!');
      }
      const connection = await msg.member.voiceChannel.join();
      const dispatcher = connection.playFile('/home/andersonef/Projects/botnator/extras/sample.mp3');
    }
    for (let indexOfRobot in robots) {
      robots[indexOfRobot](
        (callback, commands) => {
          console.log('mensagem recebida =>>> ' + msg.content);
          if (commands.indexOf(msg.content) > -1) {
            callback(msg.content);
          }
        }, 
        (response) => {
          msg.reply(response);
        }
      )
    }
  })
}

async function login(){
    console.log("Login discord api")
    await client.login(config.credentials.bot_token)
}

module.exports = gateway