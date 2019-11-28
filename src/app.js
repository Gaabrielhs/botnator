require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

const msgs = [
  'oi, o ghs humano é o outro 😂',
  'não responda esta mensagem, ou vou te responder isso novamente 🤯',
  '?',
  'ata',
  'bobo',
  'oi?',
  'eu só toco música 😔',
  'nem playlist eu toco ainda 🥺',
  'q joga'
]

function registerEvents(){
  const messageHandler = require('./message-handler')
  const sharedData = {}
  sharedData.commandsMap = new Map()
  require("fs").readdirSync('src/commands').forEach(function(file) {
    const {command, execute} = require("./commands/" + file);
    sharedData.commandsMap.set(command, execute)
  });

  sharedData.queue = new Map()

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on('message', async msg => {
    try {
      const response = messageHandler(msg)
      if (!response) {
        return
      }
      const {command, args} = response
      const currentCommand = sharedData.commandsMap.get(command)
      if (!currentCommand) {
        msg.channel.send(msgs[Math.floor(Math.random()*msgs.length)])
        return
      }

      await currentCommand(msg, sharedData, args)
    } catch (e) {
      msg.reply('Houve um erro com o último pedido. Desculpe =(')
      console.log('ERROR: ', e)
      return
    }

  })
}


async function login(){
  console.log("Login discord api")
  await client.login(process.env.DISCORD_TOKEN)
}

function initialize(){
  console.log("Starting Discord Gateway...")
  login()
  registerEvents()
}

initialize()