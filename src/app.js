require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

const randomMessages = require('./helpers/randomMessage')

function registerEvents() {

    const messageHandler = require('./message-handler')
    const sharedData = {
        client,
        queue: new Map(),
        commands: new Map()
    }
    require("fs").readdirSync('src/commands').forEach(function (file) {
        const { command, execute } = require("./commands/" + file);
        sharedData.commands.set(command, execute)
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`)
    })

    client.on('message', async msg => {
        try {
            const response = messageHandler(msg)
            if (!response) {
                return
            }
            const { command, args } = response
            const currentCommand = sharedData.commands.get(command)
            if (!currentCommand) {
                msg.channel.send(randomMessages())
                return
            }

            await currentCommand(msg, sharedData, args)
        } catch (e) {
            console.log('ERROR: ', e)
            msg.reply(`Deu merda aqui: ${e}`)
            return
        }

    })

    process.on('unhandledRejection', e => console.error(e))
}


async function login() {
    console.log("Login discord api")
    await client.login(process.env.DISCORD_TOKEN)
}

function initialize() {
    console.log("Starting Discord Gateway...")
    login()
    registerEvents()
}

initialize()