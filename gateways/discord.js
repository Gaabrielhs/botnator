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

  client.on('message', msg => {
    robots.hello(msg)
  })
}

async function login(){
    console.log("Login discord api")
    await client.login(config.credentials.bot_token)
}

module.exports = gateway