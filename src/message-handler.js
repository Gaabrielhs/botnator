function handler(msg) {
    //Ignorar se a mensagem vier de um bot
    if (msg.author.bot) return
    if (!msg.mentions.members.first()) return
    

    const parts = msg.content.split(' ')
    let args = msg.content.split(' ')
    args.splice()
    args.splice()
    return {
        command: parts[1],
        args
    }
}
module.exports = handler