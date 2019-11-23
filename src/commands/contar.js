const command = 'contar'

function execute(msg, data, args){
    try{
        if(!Number.isInteger(countInSeconds)) {
            throw `O valor precisa ser um numero inteiro bbk`
        }

        let countInSeconds = +args[0]
        const msgSended = await msg.channel.send(`Começando a contar ${countInSeconds}s`)

        let looper = setInterval(async function(){ 
            if (countInSeconds <= 0)
            {
                clearInterval(looper)
                await msgSended.edit(`Acabou o tempo! xD`)
                return
            }
            
            await msgSended.edit(`${--countInSeconds}s`)
        }, 1000)
    }catch(err){
        console.log(``)
        msg.reply(err)
    }
    
  
      
}