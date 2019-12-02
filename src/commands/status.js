const command = 'status'

async function execute(msg, data, args){
    if(msg.author.id != process.env.ADMIN_ID){
        throw "Comando só pode ser executado por um admin"
    }

    const presenceData = {
        status: args[0],
        game: {
            type: args[1],
            name: args[2] ? args[2].replace(/_/g, ' ') : undefined,
            url: args[3]
        },
        afk: args[4]
    }

    await data.client.user.setPresence(presenceData).catch(err => console.log(err))    
}


module.exports = { command, execute }