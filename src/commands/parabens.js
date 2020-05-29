const command = 'parabens'

async function execute(msg, data, args) {
    if(msg.author.id != process.env.ADMIN_ID){
        throw "Comando só pode ser executado por um admin"
    }

    const parar = data.commands.get('parar')
    await parar(msg, data, args)

    const tocarCommand = data.commands.get('tocar')
    const newArgs = [
        "https://www.youtube.com/watch?v=6FhNsxb0C-k"
    ]
    await tocarCommand(msg, data, newArgs)

    const aniversariante = args[0]
    const qnt = args[1]

    for(let i = 0; i < qnt; i++){
        msg.channel.send(`Parabéns ${aniversariante}`)
    }
}


module.exports = { command, execute }