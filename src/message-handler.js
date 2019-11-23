function handler(msg) {
    //Ignorar se a mensagem vier de um bot
    if (msg.author.bot) return
    if (!msg.mentions.members.first()) return
    if (msg.mentions.members.find(member => member.id = client.user.id) === null) {
    return
    }

    const message = msg.content.splice(' ').splice()
    let args = msg.content.splice(' ')
    args.splice()
    return {
        message,
        args
    }
}
module.exports = handler