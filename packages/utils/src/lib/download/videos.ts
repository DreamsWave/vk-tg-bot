import https from "https";
import { extension } from "mime-types";
import path from 'path'
import fs from "fs"
import os from "os"
import { logger } from "../logger";
import { VideoAttachment } from "vk-io";

interface VideoAttachmentWithBuffer extends VideoAttachment {
    buffer: unknown;
    ext: string;
}

export const downloadVideoAttachment = async (video: VideoAttachment[]):  => {

}

export function downloadVideo(videoUrl: string, filename: number | string, location: string = os.tmpdir()): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(videoUrl, async resp => {
            const contentType = resp.headers["content-type"];
            const ext: string = extension(contentType);
            const imagePath = path.join(location, `${filename}.${ext}`);
            const fileStream = fs.createWriteStream(imagePath)
            await Promise.resolve(resp.pipe(fileStream))
            resolve(imagePath)
        })
    })
}
