import { extension } from "mime-types";
import webp from "webp-converter"
import fs from "fs"
import os from "os"
import path from 'path'
import { Attachment, PhotoAttachment, VideoAttachment } from "vk-io";
import { logger } from "./logger";
import https from "https";

interface DownloadedAttachment extends Attachment {
    buffer?: unknown
}

export async function downloadFiles(attachments: Attachment[], location: string = os.tmpdir()): Promise<DownloadedAttachment[]> {
    const downloadedAttachments = [] as DownloadedAttachment[]
    for (const attachment of attachments) {
        let downloadedAttachment = {} as DownloadedAttachment
        if (attachment.type === "photo") {
            const photo = attachment as PhotoAttachment
            downloadedAttachment = await downloadPhoto(photo, location)
        }
        if (attachment.type === 'video') {
            const video = attachment as VideoAttachment
        }
        downloadedAttachments.push(downloadedAttachment)
    }
    return downloadedAttachments
}

export async function downloadPhoto<T extends PhotoAttachment & { buffer?: unknown }>(photo: T, location: string = os.tmpdir()): Promise<T> {

    try {
        photo.buffer = await downloadImage(photo.largeSizeUrl, photo.id, location)
    } catch (error) {
        logger.error(error)
    }
    return photo
}

export function downloadImage(imageUrl: string, id: number, location: string = os.tmpdir()): Promise<unknown> {
    return new Promise((resolve, reject) => {
        https.get(imageUrl, async resp => {
            const contentType = resp.headers["content-type"];
            const ext: string = extension(contentType);
            const imagePath = path.join(location, `${id}.${ext}`);
            const fileStream = fs.createWriteStream(imagePath)
            await Promise.resolve(resp.pipe(fileStream))

            if (ext === "webp") {
                const newImagePath = path.join(location, `${id}.jpg`);
                await webp.dwebp(imagePath, newImagePath, "-o");
                resolve(fs.readFileSync(newImagePath))
            } else {
                resolve(fs.readFileSync(imagePath))
            }
        })
    })

}

export function prepareTemp(location: string): void {
    const tempLocation = location || os.tmpdir()
    fs.mkdir(tempLocation, { recursive: true }, (err) => {
        if (err) {
            logger.error(err)
            throw err
        }
        fs.readdir(tempLocation, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(`${tempLocation}/${file}`, (err) => {
                    if (err) throw err;
                });
            }
        });
    })
}