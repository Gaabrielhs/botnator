import { IBotnatorRobot } from "../../interfaces/IBotnatorRobot";

export class BotManager {
    constructor(protected robots: IBotnatorRobot[]) { }

    /**
     *  Returns robots which can understand the given command on the param message.
     * @param message 
     */
    getBotsAvailableForMessage(message: string): IBotnatorRobot[] {
        const selectedRobots = this.robots.filter(iteratedRobot => {
            var isAvailable = false;
            iteratedRobot.commands.forEach(command => {
                if (message.indexOf(command) > -1) {
                    isAvailable = true;
                }
            });
            return isAvailable;
        });
        return selectedRobots;
    }

    extractCommandForBot(robot: IBotnatorRobot, rawMessage: string): string {
        let response: string = null;
        robot.commands.forEach(command => {
            if (rawMessage.indexOf(command) > -1) {
                response = command;
            }
        })
        return response;
    }
}