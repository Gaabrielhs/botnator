const config = require('../config/discord')
const Discord = require('discord.js')
const client = new Discord.Client()
const robots = {
    hello: require('../robots/hello'),
    youtubeSearch: require('../robots/youtubeSearch'),
    player: require('../robots/player')
}

// TODO: base interface
function gateway(){
    console.log("Starting Discord Gateway...")
    login()
    registerEvents()
}

function registerEvents(){
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  })

  client.on('message', async msg => {
    //Ignorar se a mensagem vier de um bot
    if (msg.author.bot) return;

    if (msg.mentions.members.first() && msg.mentions.members.first().user.id !== client.user.id) {
      console.log('Mencionou alguém, mas não fui eu');
      return;
    }

    if(msg.content.indexOf('ping') > -1) {
      msg.reply(`Pong!`);
    }

    if (msg.content.indexOf('tocar') > -1 || msg.content.indexOf('pular') > -1 || msg.content.indexOf('parar') > -1) {
      robots.player(msg);
    }

    if(msg.content.indexOf('pesquisar') > -1) {
      const lastIndex = msg.content.lastIndexOf('pesquisar') + 1 + ('pesquisar'.length);
      const search = msg.content.substr(lastIndex);
      const link = await robots.youtubeSearch(search);
      msg.reply(`encontrei isso daqui no youtube: ${link}`);
    }

    if(msg.content.indexOf('gado') > -1) {
      if (!msg.member.voiceChannel) {
        return msg.reply('Não posso tocar, você não está em um voice channel!');
      }
      const connection = await msg.member.voiceChannel.join().catch(e => {
        msg.channel.send(`Não consegui me conectar ao seu canal de voz`);
        return
      });

      const dispatcher = connection.playFile('/home/ghs/gado.mp3');

      dispatcher.on('start', () => {
        msg.reply(`tocando rei do gado`);
      });

      dispatcher.on('end', () => {
        connection.disconnect();
      });

      dispatcher.on('error', e => {
        console.log(e);
      });


    }
  })
}


async function login(){
  console.log("Login discord api")
  await client.login(config.credentials.bot_token);
}


module.exports = gateway