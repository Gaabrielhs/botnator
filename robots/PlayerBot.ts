import { IBotnatorRobot } from "../interfaces/IBotnatorRobot";
import { IBotnatorRequest } from "../interfaces/IBotnatorRequest";
import { IBotnatorResponse, BotnatorResponseType } from "../interfaces/IBotnatorResponse";
import {  } from "ytdl-core";

export class PlayerBot implements IBotnatorRobot {
    robotName: 'PlayerBot';
    robotDescription: 'Bot which plays music';
    commands = [
        'tocar',
        'pular',
        'parar',
        'sabadaço'
    ];

    execute(entrada: IBotnatorRequest): IBotnatorResponse {
        throw new Error("Method not implemented.");
    }

    
}