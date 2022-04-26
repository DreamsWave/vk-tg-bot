import { PAttachment, PAttachments } from "@yc-bot/types";
import path from "path";
import fs from "fs";
import { DocumentAttachment, PhotoAttachment, VideoAttachment } from "vk-io";
import { logger } from "./logger";
import os from 'os'
import { downloadVideo, downloadFile } from "./download";
import { convertWebpToJpg, isWebp } from "./convertWebpToJpg";
import { makeID } from "./helpers";

const tmpDir = path.join(os.tmpdir())

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function prepareAttachments(attachments: any[], saveTo: string = tmpDir): Promise<PAttachments> {
    const pAttachments: PAttachments = {
        photos: [],
        videos: [],
        docs: []
    }
    for (const attachment of attachments) {
        if (attachment.type === "photo") {
            const photo = await preparePhoto(attachment, saveTo)
            pAttachments.photos.push(photo)
        }
        if (attachment.type === 'video') {
            const video = await prepareVideo(attachment, saveTo)
            if (video) pAttachments.videos.push(video)
        }
        if (attachment.type === 'doc') {
            const doc = await prepareDoc(attachment, saveTo)
            pAttachments.docs.push(doc)
        }
    }
    return pAttachments
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const preparePhoto = async (attachment: any, saveTo: string = tmpDir, filename?: number | string): Promise<PAttachment> => {
    const pAttachment: PAttachment = {
        type: '',
        buffer: null,
        info: {
            ext: "",
            filename: "",
            mime: "",
            path: "",
            size: null
        },
        origin: attachment,
        originUrl: ""
    }
    try {
        const photo = new PhotoAttachment({ api: null, payload: attachment.photo })
        const photoUrl = photo.largeSizeUrl
        let imageInfo = await downloadFile(photoUrl, saveTo, filename ?? String(photo.id))
        if (isWebp(imageInfo.path)) {
            imageInfo = await convertWebpToJpg(imageInfo.path)
        }
        pAttachment.type = "photo"
        pAttachment.info = imageInfo
        pAttachment.buffer = fs.createReadStream(imageInfo.path)
        pAttachment.originUrl = photoUrl
    } catch (error) {
        logger.error(error)
    }
    return pAttachment
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareVideo = async (attachment: any, saveTo: string = tmpDir, filename?: number | string): Promise<PAttachment> => {
    const pAttachment: PAttachment = {
        type: '',
        buffer: null,
        info: {
            ext: "",
            filename: "",
            mime: "",
            path: "",
            size: null
        },
        origin: attachment,
        originUrl: ""
    }
    try {
        const video = new VideoAttachment({ api: null, payload: attachment.video })
        const videoUrl = `https://vk.com/video-${Math.abs(video.ownerId)}_${Math.abs(video.id)}`
        const filePath = path.join(saveTo, `${filename ?? video.id}.%(ext)s`)
        const videoInfo = await downloadVideo(videoUrl, filePath)
        if (!videoInfo) return null
        pAttachment.type = "video"
        pAttachment.buffer = fs.createReadStream(videoInfo.path)
        pAttachment.info = videoInfo
        pAttachment.originUrl = videoUrl
    } catch (error) {
        logger.error(error)
    }
    return pAttachment
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareDoc = async (attachment: any, downloadTo: string = tmpDir, filename?: number | string): Promise<PAttachment> => {
    const pAttachment: PAttachment = {
        type: '',
        buffer: null,
        info: {
            ext: "",
            filename: "",
            mime: "",
            path: "",
            size: null
        },
        origin: attachment,
        originUrl: ""
    }
    try {
        const doc = new DocumentAttachment({ api: null, payload: attachment.doc })
        const docTitle = doc.title.split('.')[0]
        const fileInfo = await downloadFile(doc.url, downloadTo, filename ?? docTitle)
        pAttachment.type = "document"
        pAttachment.originUrl = doc.url
        pAttachment.info = fileInfo
        pAttachment.buffer = fs.createReadStream(fileInfo.path)
    } catch (error) {
        logger.error(error)
    }
    return pAttachment
}