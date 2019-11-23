const command = 'gancho'

async function execute(msg, data, args){
    const randomNumber = Math.floor(Math.random() * 100)
    if(randomNumber < 4){
        // msg.channel.send(`${msg.member.nickname || msg.member.user.username} saiu do gancho na sua frente! 😎`)
        msg.reply(`saiu do gancho na sua frente! 😎`)
    }else{
        // msg.channel.send(`${msg.member.nickname || msg.member.user.username} foi pra entidade mais próxima!`)
        msg.reply(`foi pra entidade mais próxima! 🔪`)
    }
}

module.exports = { command, execute }