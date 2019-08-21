import { IBotnatorRobot } from './IBotnatorRobot';


export interface IBotnatorGateway {
    gatewayName: string;
    robots: IBotnatorRobot[];

    login(): void;

    registerEvents(): void;

    start(): void;

}