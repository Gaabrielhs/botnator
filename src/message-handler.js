function handler(msg) {
    //Ignorar se a mensagem vier de um bot
    if (msg.author.bot) throw new Error('O autor é o próprio bot!')
    if (!msg.mentions.members.first()) throw new Error('Não existem membros nas mentions!')
    

    const message = msg.content.split(' ').splice()
    let args = msg.content.split(' ')
    args.splice()
    return {
        command: message,
        args
    }
}
module.exports = handler