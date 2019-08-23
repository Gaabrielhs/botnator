export interface IBotnatorRequest {
    
    rawMessage: string;

    command: string;

    params: string[];

    senderId: string;

    senderGroupId: string;

}