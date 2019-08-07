const commands = [
    '$play'    
]
function robot(entrada, saida){
    entrada((content) => {
        if (logica) {
            saida();
        }
    }, commands);
}

module.exports = robot