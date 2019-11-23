const command = 'falar'

async function execute(msg, data, args){
    const sentence = args.join(' ')
    await msg.delete()
    msg.channel.send(sentence)
}

module.exports = { command, execute }