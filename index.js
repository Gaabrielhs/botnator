"use strict";
exports.__esModule = true;
var DiscordGateway_1 = require("./gateways/DiscordGateway");
var dotenv_1 = require("dotenv");
var Botnator = /** @class */ (function () {
    function Botnator() {
    }
    Botnator.prototype.start = function () {
        console.log('Starting gateways...');
        dotenv_1.config();
        new DiscordGateway_1.DiscordGateway().start();
    };
    return Botnator;
}());
console.log('alterei agora');
var botnator = new Botnator();
botnator.start();
