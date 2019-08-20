"use strict";
exports.__esModule = true;
var discord_1 = require("./gateways/discord");
var Botnator = /** @class */ (function () {
    function Botnator() {
    }
    Botnator.prototype.start = function () {
        console.log('Starting gateways...');
        discord_1.gateway();
    };
    return Botnator;
}());
console.log('alterei agora');
var botnator = new Botnator();
botnator.start();
