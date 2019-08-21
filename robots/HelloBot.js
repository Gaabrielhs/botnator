"use strict";
exports.__esModule = true;
var IBotnatorResponse_1 = require("../interfaces/IBotnatorResponse");
var HelloBot = /** @class */ (function () {
    function HelloBot() {
        this.commands = [
            'ola',
            'responda'
        ];
    }
    HelloBot.prototype.execute = function (entrada) {
        if (entrada.command === 'ola') {
            return {
                type: IBotnatorResponse_1.BotnatorResponseType.String,
                responseContent: 'Olá como vai!'
            };
        }
        if (entrada.command === 'responda') {
            return {
                type: IBotnatorResponse_1.BotnatorResponseType.String,
                responseContent: 'Estou respondendo!'
            };
        }
    };
    return HelloBot;
}());
exports.HelloBot = HelloBot;
