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
var IBotnatorResponse_1 = require("../interfaces/IBotnatorResponse");
var ytdl_core_1 = require("ytdl-core");
var PlayerBot = /** @class */ (function () {
    function PlayerBot() {
        this.commands = [
            'tocar',
            'pular',
            'parar',
            'sabadaço'
        ];
        this.mainResponseType = IBotnatorResponse_1.BotnatorResponseType.Stream;
        this.queue = new Map();
    }
    PlayerBot.prototype.execute = function (entrada) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.msg = params[0];
        var serverQueue = this.queue.get(entrada.senderGroupId);
        if (entrada.rawMessage.indexOf('sabadaço') > -1) {
            this.stop(entrada.rawMessage, serverQueue);
            this.msg.content = this.msg.content.replace('sabadaço', 'tocar ') + 'https://youtu.be/LCDaw0QmQQc';
            this.exec(msg, serverQueue);
            return;
        }
        if (this.msg.content.indexOf('tocar') > -1) {
            this.exec(msg, serverQueue);
            return;
        }
        if (this.msg.content.indexOf('pular') > -1) {
            this.skip(msg, serverQueue);
            return;
        }
        if (this.msg.content.indexOf('parar') > -1) {
            stop(this.msg, serverQueue);
            return;
        }
        this.msg.channel.send("Comando inv\u00E1lido");
        return;
    };
    PlayerBot.prototype.exec = function (msg, serverQueue) {
        return __awaiter(this, void 0, void 0, function () {
            var link, music, queueServer;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getLink(msg.content)];
                    case 1:
                        link = _b.sent();
                        return [4 /*yield*/, ytdl_core_1["default"].getInfo(link)];
                    case 2:
                        music = (_a = _b.sent(), title = _a.title, video_url = _a.video_url, _a);
                        if (!serverQueue) return [3 /*break*/, 3];
                        serverQueue.musics.push(music);
                        msg.channel.send("M\u00FAsica " + music.title + " adicionada a fila na posi\u00E7\u00E3o: " + serverQueue.musics.length);
                        return [3 /*break*/, 5];
                    case 3:
                        queueServer = {
                            musics: [],
                            voiceChannel: msg.member.voiceChannel,
                            textChannel: msg.channel
                        };
                        this.queue.set(msg.guild.id, queueServer);
                        queueServer.musics.push(music);
                        return [4 /*yield*/, msg.member.voiceChannel.join()["catch"](function (e) {
                                msg.channel.send("N\u00E3o consegui me conectar ao seu canal de voz");
                                return;
                            })];
                    case 4:
                        _b.sent();
                        /* console.log(`Voice channel`);
                        console.log(msg.member.voiceChannel); */
                        play(msg.guild.id, music);
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return PlayerBot;
}());
exports.PlayerBot = PlayerBot;
function play(guildId, music) {
    if (music === void 0) { music = null; }
    return __awaiter(this, void 0, void 0, function () {
        var serverQueue, stream, dispatcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverQueue = queue.get(guildId);
                    //Saindo do canal de voz
                    if (!music) {
                        serverQueue.voiceChannel.leave();
                        queue["delete"](guildId);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ytdl_core_1["default"](music.video_url)];
                case 1:
                    stream = _a.sent();
                    dispatcher = serverQueue.voiceChannel.connection.playStream(stream);
                    dispatcher.on('start', function () {
                        serverQueue.textChannel.send("Tocando: " + music.title);
                    });
                    dispatcher.on('end', function () {
                        serverQueue.musics.shift();
                        play(guildId, serverQueue.musics[0]);
                    });
                    dispatcher.on('error', function (e) {
                        console.log(e);
                        serverQueue.textChannel.send("Deu merda aqui: " + e);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function skip(msg, serverQueue) {
    if (!serverQueue) {
        // msg.channel.send(`Server sem fila ainda...`);
        console.log('Server sem fila ainda...');
        return;
    }
    serverQueue.voiceChannel.connection.dispatcher.end();
}
function stop(msg, serverQueue) {
    if (!serverQueue) {
        // msg.channel.send(`Server sem fila ainda...`);
        console.log('Server sem fila ainda...');
        return;
    }
    serverQueue.musics = [];
    serverQueue.voiceChannel.connection.dispatcher.end();
}
async;
getLink(content, any);
{
    var lastIndex = content.lastIndexOf('tocar') + 1 + ('tocar'.length);
    var search = content.substr(lastIndex);
    var link = search;
    if (!ytdl_core_1["default"].validateURL(link)) {
        link = yield ytSearch(search);
    }
    console.log("Link encontrado: " + link);
    return link;
}
