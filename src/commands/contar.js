const command = 'contar'

async function execute(msg, data, args){
    let countInSeconds = +args[0]
    if(!Number.isInteger(countInSeconds)) {
        throw `O valor precisa ser um numero inteiro bbk`
    }

    const msgSended = await msg.channel.send(`Começando a contar ${countInSeconds}s`)

    const process1Sec = async function() {
        if(countInSeconds == 0){
            msgSended.edit(`Acabou o tempo! xD`)
            return
        }
        await msgSended.edit(`${--countInSeconds}s`)
        setTimeout(process1Sec, 1000);
    }

    process1Sec()
}

module.exports = { command, execute }