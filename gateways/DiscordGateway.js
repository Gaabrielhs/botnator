"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var HelloBot_1 = require("../robots/HelloBot");
var PlayerBot_1 = require("../robots/PlayerBot");
var DiscordGateway = /** @class */ (function () {
    function DiscordGateway() {
        this.gatewayName = 'Discord Gateway';
        this.robots = [
            new HelloBot_1.HelloBot(),
            new PlayerBot_1.PlayerBot()
        ];
        this.client = new discord_js_1.Client();
    }
    DiscordGateway.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Login discord api");
                        return [4 /*yield*/, this.client.login(process.env.DISCORD_TOKEN)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DiscordGateway.prototype.registerEvents = function () {
        var _this = this;
        this.client.on('ready', function () {
            console.log("Logged in as " + _this.client.user.tag + "!");
        });
        this.client.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var responseMessage, command, randomNumber, lastIndex, sentence;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //Ignorar se a mensagem vier de um bot
                        if (msg.author.bot)
                            return [2 /*return*/];
                        if (!msg.mentions.members.first())
                            return [2 /*return*/];
                        if (msg.mentions.members.find(function (member) { return member.id == _this.client.user.id; }) === null) {
                            return [2 /*return*/];
                        }
                        if (!(msg.content.indexOf('ping') > -1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, msg.channel.send("Ping?")];
                    case 1:
                        responseMessage = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (msg.content.indexOf('tocar') > -1 || msg.content.indexOf('pular') > -1 || msg.content.indexOf('parar') > -1 || msg.content.indexOf('sabadaço') > -1) {
                            if (msg.content.indexOf('tocar') > -1)
                                command = 'tocar';
                            if (msg.content.indexOf('pular') > -1)
                                command = 'pular';
                            if (msg.content.indexOf('parar') > -1)
                                command = 'parar';
                            if (msg.content.indexOf('sabadaço') > -1)
                                command = 'sabadaço';
                            this.robots
                                .filter(function (robot) {
                                return (robot.robotName === 'PlayerBot');
                            })
                                .pop()
                                .execute({
                                command: command,
                                params: msg.content.split(' '),
                                rawMessage: msg.content
                            });
                        }
                        if (msg.content.indexOf('gancho') > -1) {
                            randomNumber = Math.floor(Math.random() * 100);
                            if (randomNumber < 4) {
                                // msg.channel.send(`${msg.member.nickname || msg.member.user.username} saiu do gancho na sua frente! 😎`);
                                msg.reply("saiu do gancho na sua frente! \uD83D\uDE0E");
                            }
                            else {
                                // msg.channel.send(`${msg.member.nickname || msg.member.user.username} foi pra entidade mais próxima!`);
                                msg.reply("foi pra entidade mais pr\u00F3xima! \uD83D\uDD2A");
                            }
                            return [2 /*return*/];
                        }
                        if (msg.content.indexOf('falar') > -1) {
                            lastIndex = msg.content.lastIndexOf('falar') + 1 + ('falar'.length);
                            sentence = msg.content.substr(lastIndex);
                            msg["delete"]()["catch"](function (xD) { console.log(xD); });
                            msg.channel.send(sentence);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    DiscordGateway.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.login()];
                    case 1:
                        _a.sent();
                        this.registerEvents();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DiscordGateway;
}());
exports.DiscordGateway = DiscordGateway;
