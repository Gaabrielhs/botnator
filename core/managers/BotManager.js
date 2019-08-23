"use strict";
exports.__esModule = true;
var BotManager = /** @class */ (function () {
    function BotManager(robots) {
        this.robots = robots;
    }
    /**
     *  Returns robots which can understand the given command on the param message.
     * @param message
     */
    BotManager.prototype.getBotsAvailableForMessage = function (message) {
        var selectedRobots = this.robots.filter(function (iteratedRobot) {
            var isAvailable = false;
            iteratedRobot.commands.forEach(function (command) {
                if (message.indexOf(command) > -1) {
                    isAvailable = true;
                }
            });
            return isAvailable;
        });
        return selectedRobots;
    };
    BotManager.prototype.extractCommandForBot = function (robot, rawMessage) {
        var response = null;
        robot.commands.forEach(function (command) {
            if (rawMessage.indexOf(command) > -1) {
                response = command;
            }
        });
        return response;
    };
    return BotManager;
}());
exports.BotManager = BotManager;
