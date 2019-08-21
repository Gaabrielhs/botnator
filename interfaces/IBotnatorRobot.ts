import { IBotnatorRequest } from './IBotnatorRequest';
import { IBotnatorResponse } from './IBotnatorResponse';

export interface IBotnatorRobot {
    robotName: string;
    robotDescription: string;
    commands: string[];

    execute(entrada: IBotnatorRequest): IBotnatorResponse;
}