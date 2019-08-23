import { IBotnatorRobot } from './IBotnatorRobot';
import { BotManager } from '../core/managers/BotManager';


export interface IBotnatorGateway {
    gatewayName: string;
    robotManager: BotManager;

    login(): void;

    registerEvents(): void;

    start(): void;

}