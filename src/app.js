require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

function registerEvents(){
  const messageHandler = require('./message-handler')
  const sharedData = {}
  sharedData.commandsMap = new Map()
  require("fs").readdirSync('src/commands').forEach(function(file) {
    const {command, execute} = require("./commands/" + file);
    sharedData.commandsMap.set(command, execute)
  });

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

  client.on('message', async msg => {
    try {
      if (msg.mentions.members.find(member => member.id = client.user.id) === null) {
        return
      }
      const response = messageHandler(msg)
      if (!response) {
        return
      }
      const {command, args} = response
      const currentCommand = sharedData.commandsMap.get(command)
      if (!currentCommand) {
        console.log('nãoe ncontrei o commando ' + command, sharedData.commandsMap);
        return
      }

      currentCommand(msg, sharedData, args)
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