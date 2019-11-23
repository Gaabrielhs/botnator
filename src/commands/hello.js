const commands = [
    '$status',
    '$truth'
]
function robot(entrada, saida){
    entrada(() => {
        if (logica) {
            saida('Olá, eu disse a verdade');
        }
    }, commands);
}

module.exports = robot