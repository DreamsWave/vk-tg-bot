
import fs from "fs"
import os from "os"
import path from "path";
import { Attachment, PhotoAttachment, VideoAttachment } from "vk-io";
import { logger } from "../logger";
import { convertWebpToJpg, downloadImage, isWebp } from './downloadImages'



// export async function downloadFiles(attachments: Attachment[], location: string = os.tmpdir()): Promise<DownloadedAttachment[]> {
//     const downloadedAttachments = [] as DownloadedAttachment[]
//     // for (const attachment of attachments) {
//     //     let downloadedAttachment = {} as DownloadedAttachment
//     //     if (attachment.type === "photo") {
//     //         const photo = attachment as PhotoAttachment
//     //         downloadedAttachment = await downloadPhotos(photo, location)
//     //     }
//     //     if (attachment.type === 'video') {
//     //         const video = attachment as VideoAttachment
//     //     }
//     //     downloadedAttachments.push(downloadedAttachment)
//     // }
//     return downloadedAttachments
// }

export interface PhotoAttachmentWithBufferAndExt extends PhotoAttachment {
    buffer: unknown,
    ext: string
}

export async function downloadPhotos(photos: PhotoAttachment[], location: string = os.tmpdir()): Promise<PhotoAttachmentWithBufferAndExt[]> {
    const newPhotos = [] as PhotoAttachmentWithBufferAndExt[]
    for (const photo of photos) {
        const newPhoto = Object.assign(Object.create(Object.getPrototypeOf(photo)), photo) as PhotoAttachmentWithBufferAndExt
        try {
            let imageLocation = await downloadImage(photo.largeSizeUrl, photo.id, location)
            if (isWebp(imageLocation)) {
                imageLocation = await convertWebpToJpg(imageLocation)
            }
            newPhoto.ext = path.extname(path.basename(imageLocation)).substring(1)
            newPhoto.buffer = fs.createReadStream(imageLocation)

        } catch (error) {
            logger.error(error)
        }
        newPhotos.push(newPhoto)
    }
    return newPhotos
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