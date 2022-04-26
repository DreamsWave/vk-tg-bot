export interface PAttachments {
    photos: PAttachment[],
    videos: PAttachment[],
    docs: PAttachment[]
}
export interface PAttachment extends DownloadedAttachment {
    type: string,
    origin: any,
    originUrl: string
}
export interface DownloadedAttachment {
    buffer: unknown,
    info: FileInfo
}
export interface FileInfo {
    mime: string,
    size: number,
    path: string,
    ext: string,
    filename: string | number,
}
export interface DownloadDocumentOptions {
    filename: string | number,
    location?: string,
    ext: string
}