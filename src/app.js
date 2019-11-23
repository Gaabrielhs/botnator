require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const robots = {
    hello: require('./commands/hello'),
    player: require('./commands/player')
}

function registerEvents(){
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on('message', async msg => {
    //Ignorar se a mensagem vier de um bot
    if (msg.author.bot) return
    if (!msg.mentions.members.first()) return
    if (msg.mentions.members.find(member => member.id = client.user.id) === null) {
      return
    }

    if (msg.content.indexOf('tocar') > -1 || msg.content.indexOf('pular') > -1 || msg.content.indexOf('parar') > -1 || msg.content.indexOf('sabadaço') > -1) {
      robots.player(msg)
    }
  })
}


async function login(){
  console.log("Login discord api")
  await client.login(process.env.BOT_TOKEN)
}

function initialize(){
  console.log("Starting Discord Gateway...")
  login()
  registerEvents()
}

initialize()