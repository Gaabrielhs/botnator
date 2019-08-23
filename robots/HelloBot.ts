import { IBotnatorRobot } from "../interfaces/IBotnatorRobot";
import {IBotnatorRequest} from '../interfaces/IBotnatorRequest';
import { IBotnatorResponse, BotnatorResponseType } from '../interfaces/IBotnatorResponse';

export class HelloBot implements IBotnatorRobot {
    robotName: 'Hello Bot';
    robotDescription: 'A simple bot. It just say hello when someone talks with him!';
    commands = [
        'ola',
        'responda'
    ];

    mainResponseType = BotnatorResponseType.String;

    execute(entrada: IBotnatorRequest): IBotnatorResponse {
        if (entrada.command === 'ola') {
            return {
                type: BotnatorResponseType.String,
                responseContent: 'Olá como vai!'
            };
        }

        if (entrada.command === 'responda') {
            return {
                type: BotnatorResponseType.String,
                responseContent: 'Estou respondendo!'
            };
        }
    }


}