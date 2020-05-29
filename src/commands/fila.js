const { sendQueueMessage } = require('../helpers/music')
const command = 'fila'

function execute(msg, data, args) {
    const queue = data.queue
    const serverQueue = queue.get(msg.guild.id)
    
    if(!serverQueue){
        throw "Server sem fila..."
    }

    sendQueueMessage(serverQueue)
}

module.exports = { command, execute }