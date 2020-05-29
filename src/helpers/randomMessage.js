const msgs = require('../helpers/default_messages.json')
const lerolero = require('lerolero')

module.exports = function () {
    if(process.env.LERO_ENABLED){
        return lerolero()
    }

    return msgs[Math.floor(Math.random() * msgs.length)]
}