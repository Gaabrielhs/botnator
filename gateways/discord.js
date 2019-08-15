const config = require('../config/discord')
const Discord = require('discord.js')
const client = new Discord.Client()
const robots = {
    hello: require('../robots/hello'),
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
    if (!msg.mentions.members.first()) return;
    if (msg.mentions.members.first().user.id !== client.user.id) {
      return;
    }

    if(msg.content.indexOf('ping') > -1) {
      const responseMessage = await msg.channel.send(`Ping?`);
      responseMessage.edit(`🏓 Pong! \`${responseMessage.createdTimestamp - msg.createdTimestamp}ms\` | Ping server: \`${client.ping}ms\``)
    }

    if (msg.content.indexOf('tocar') > -1 || msg.content.indexOf('pular') > -1 || msg.content.indexOf('parar') > -1 || msg.content.indexOf('sabadaço') > -1) {
      robots.player(msg);
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

      msg.delete().catch(xD => {});
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


async function login(){
  console.log("Login discord api")
  await client.login(config.credentials.bot_token);
}


module.exports = gateway