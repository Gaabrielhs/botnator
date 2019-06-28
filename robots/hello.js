function robot(msg){
    console.log("Hello bot")
    if(msg.content == '$status'){
        msg.reply('GHS BOT IS WORKING')
    }
}

module.exports = robot