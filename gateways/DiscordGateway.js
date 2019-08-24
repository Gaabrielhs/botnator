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
var IBotnatorResponse_1 = require("../interfaces/IBotnatorResponse");
var BotManager_1 = require("../core/managers/BotManager");
var DiscordGateway = /** @class */ (function () {
    function DiscordGateway() {
        this.gatewayName = 'Discord Gateway';
        this.robotManager = new BotManager_1.BotManager([
            new HelloBot_1.HelloBot(),
            new PlayerBot_1.PlayerBot()
        ]);
        this.client = new discord_js_1.Client();
    }
    DiscordGateway.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Login discord api, using token =>>> " + process.env.DISCORD_TOKEN);
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
            var responseMessage, listenerBots, _i, listenerBots_1, robot, botResponse;
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
                        responseMessage[0].edit("\uD83C\uDFD3 Pong! `" + (responseMessage[0].createdTimestamp - msg.createdTimestamp) + "ms` | Ping server: `" + this.client.ping + "ms`");
                        return [2 /*return*/];
                    case 2:
                        listenerBots = this.robotManager.getBotsAvailableForMessage(msg.content);
                        for (_i = 0, listenerBots_1 = listenerBots; _i < listenerBots_1.length; _i++) {
                            robot = listenerBots_1[_i];
                            if ([
                                IBotnatorResponse_1.BotnatorResponseType.Stream,
                                IBotnatorResponse_1.BotnatorResponseType.AudioFile
                            ].includes(robot.mainResponseType) &&
                                !msg.member.voiceChannel) {
                                msg.reply("O Bot " + robot.robotName + " requer que voc\u00EA esteja em um canal de \u00E1udio para executar o comando solicitado");
                                continue;
                            }
                            botResponse = robot.execute({
                                command: this.robotManager.extractCommandForBot(robot, msg.content),
                                params: msg.content.split(' '),
                                rawMessage: msg.content,
                                senderId: msg.member.id,
                                senderGroupId: msg.guild.id
                            }, msg);
                            if (!botResponse) {
                                continue;
                            }
                            switch (botResponse.type) {
                                case IBotnatorResponse_1.BotnatorResponseType.String:
                                    msg.reply(botResponse.responseContent);
                                    break;
                                case IBotnatorResponse_1.BotnatorResponseType.Stream:
                                    if (!msg.member.voiceChannel) {
                                        msg.reply("O Bot " + robot.robotName + " requer que voc\u00EA esteja em um canal de \u00E1udio para executar o comando solicitado");
                                        break;
                                    }
                                    msg.member.voiceChannel.connection.playStream(botResponse.responseContent);
                                    break;
                                // TODO: IMplement the other types here
                            }
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
