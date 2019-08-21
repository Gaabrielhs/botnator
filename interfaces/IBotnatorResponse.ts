export interface IBotnatorResponse {
    type: BotnatorResponseType,
    responseContent: any
}

export enum BotnatorResponseType {
    String,
    ImageFile,
    VideoFile,
    AudioFile,
    Stream
}