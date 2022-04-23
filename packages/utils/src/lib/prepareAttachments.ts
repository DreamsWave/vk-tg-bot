import { DownloadedAttachment, PAttachment, PAttachments } from "@yc-bot/types";
import path from "path";
import fs from "fs";
import { Attachment, AttachmentType, DocumentAttachment, PhotoAttachment, VideoAttachment } from "vk-io";
import { downloadAttachmentsInPost, downloadDocAttachment, downloadPhotoAttachment, downloadPhotoAttachments, downloadVideoAttachment } from "./download/attachments";
import downloadFile from "./download/file";
import { logger } from "./logger";
import os from 'os'
import { downloadVideo } from "./download/videos";
import { convertWebpToJpg, downloadImage, isWebp } from "./download/images";

const tmpDir = path.join(os.tmpdir())

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
            const video = await prepareVideo(attachment, saveTo) // add fileInfo
            pAttachments.videos.push(video)
        }
        if (attachment.type === 'doc') {
            const doc = await prepareDoc(attachment, saveTo)
            pAttachments.docs.push(doc)
        }
    }
    return pAttachments
}

export const preparePhoto = async (attachment: any, saveTo: string = tmpDir): Promise<PAttachment> => {
    const pAttachment: PAttachment = {
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
        let imageInfo = await downloadFile(photoUrl, saveTo, String(photo.id))
        if (isWebp(imageInfo.path)) {
            imageInfo = await convertWebpToJpg(imageInfo.path)
        }
        pAttachment.info = imageInfo
        pAttachment.buffer = fs.createReadStream(imageInfo.path)
        pAttachment.originUrl = photoUrl
    } catch (error) {
        logger.error(error)
    }
    return pAttachment
}

export const prepareVideo = async (attachment: any, saveTo: string = tmpDir): Promise<PAttachment> => {
    const pAttachment: PAttachment = {
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
        const filePath = path.join(saveTo, `${video.id}.mp4`)
        const videoInfo = await downloadVideo(videoUrl, filePath)
        pAttachment.buffer = fs.createReadStream(videoInfo.path)
        pAttachment.info = videoInfo
        pAttachment.originUrl = videoUrl
    } catch (error) {
        logger.error(error)
    }
    return pAttachment
}

export const prepareDoc = async (attachment: any, downloadTo: string = tmpDir): Promise<PAttachment> => {
    const pAttachment: PAttachment = {
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
        const filename = doc.title.split('.')[0]
        const fileInfo = await downloadFile(doc.url, downloadTo, filename)
        pAttachment.originUrl = doc.url
        pAttachment.info = fileInfo
        pAttachment.buffer = fs.createReadStream(fileInfo.path)
    } catch (error) {
        logger.error(error)
    }
    return pAttachment
}