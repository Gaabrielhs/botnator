const config = require('../config/discord')
const Discord = require('discord.js')
const client = new Discord.Client()
const robots = {
    hello: require('../robots/hello'),
    youtubeSearch: require('../robots/youtubeSearch')
}
const ytdl = require('ytdl-core');




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

    if (msg.mentions.members.first().user.id !== client.user.id) {
      console.log('Mencionou alguém, mas não fui eu');
      return;
    }

    if(msg.content.indexOf('ping') > -1) {
      msg.reply(`Pong!`);
    }

    if (msg.content.indexOf('tocar') > -1) {
      if (!msg.member.voiceChannel) {
        return msg.reply('Não posso tocar, você não está em um voice channel!');
      }
      const connection = await msg.member.voiceChannel.join();
      const lastIndex = msg.content.lastIndexOf('tocar') + 1 + ('tocar'.length);
      const search = msg.content.substr(lastIndex);
      console.log(`Parametro de busca: ${search}`);

      let link = search;
      if(!ytdl.validateURL(link)){
        link = await robots.youtubeSearch(search);
      }
      console.log(`Link encontrado: ${link}`);

      const dispatcher = connection.playStream(ytdl(link));

      dispatcher.on('start', () => {
        msg.reply(`tocando: ${link}`);
      });

      dispatcher.on('end', () => {
        connection.disconnect();
      });

      dispatcher.on('error', e => {
        console.log(e);
      })
    }

    if(msg.content.indexOf('pesquisar') > -1) {
      const lastIndex = msg.content.lastIndexOf('pesquisar') + 1 + ('pesquisar'.length);
      const search = msg.content.substr(lastIndex);
      const link = await robots.youtubeSearch(search);
      msg.reply(`encontrei isso daqui no youtube: ${link}`);
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
    await client.login(config.credentials.bot_token);
}

module.exports = gateway