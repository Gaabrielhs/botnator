import { IBotnatorRequest } from './IBotnatorRequest';
import { IBotnatorResponse, BotnatorResponseType } from './IBotnatorResponse';

export interface IBotnatorRobot {
    robotName: string;
    robotDescription: string;
    commands: string[];

    mainResponseType: BotnatorResponseType;

    execute(entrada: IBotnatorRequest, ...params: any): IBotnatorResponse;
}