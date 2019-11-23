const command = 'ping'

async function execute(msg, data, args) {
    const responseMessage = await msg.channel.send(`Ping?`)
    responseMessage.edit(`🏓 Pong! \`${responseMessage.createdTimestamp - msg.createdTimestamp}ms\``)
}

module.exports = { command, execute }
