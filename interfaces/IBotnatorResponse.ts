export interface IBotnatorResponse {
    type: BotnatorResponseType;
    responseContent: any;
    additionalMessage?: string;
}

export enum BotnatorResponseType {
    String,
    ImageFile,
    VideoFile,
    AudioFile,
    Stream
}