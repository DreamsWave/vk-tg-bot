import { Attachment, DocumentAttachment, IWallAttachmentPayload, PhotoAttachment, VideoAttachment, WallAttachment } from "vk-io";
import os from 'os'
import path from "path";
import fs from "fs";
import { convertWebpToJpg, downloadImage, isWebp } from "./images";
import { logger } from "../logger";
import { downloadVideo } from "./videos";
import { DownloadDocumentOptions, DownloadedAttachment } from '@yc-bot/types'
import { VK } from "@yc-bot/api";
import { downloadDocument } from "./documents";
import downloadFile from "./file";

export interface WallAttachmentWithDownloadedAttachments extends WallAttachment {
    attachments: Array<Attachment & DownloadedAttachment>
}
// Need fix copy of WallAttachment and attachments handling
export const downloadAttachmentsInPost = async (post: WallAttachment, location: string = os.tmpdir()): Promise<WallAttachment & WallAttachmentWithDownloadedAttachments> => {
    const newPost = Object.assign(Object.create(Object.getPrototypeOf(post)), post) as WallAttachment & WallAttachmentWithDownloadedAttachments
    const attachmentsLength = post.attachments.length
    if (post.hasAttachments('photo')) {
        const photos = await downloadPhotoAttachments(post.getAttachments('photo'), location)
        for (const photo of photos) {
            newPost.attachments.push(photo)
        }
    }
    if (post.hasAttachments('video')) {
        const videos = await downloadVideoAttachments(post.getAttachments('video'), location)
        for (const video of videos) {
            newPost.attachments.push(video)
        }
    }
    for (let i = 0; i < attachmentsLength; i++) {
        newPost.attachments.shift()
    }
    return newPost
}

export const downloadPhotoAttachments = async (photos: PhotoAttachment[], location: string = os.tmpdir()): Promise<(PhotoAttachment & DownloadedAttachment)[]> => {
    const newPhotos = [] as (PhotoAttachment & DownloadedAttachment)[]
    // for (const photo of photos) {
    //     const newPhoto = Object.assign(Object.create(Object.getPrototypeOf(photo)), photo) as PhotoAttachment & DownloadedAttachment
    //     try {
    //         let imageLocation = await downloadImage(photo.largeSizeUrl, photo.id, location)
    //         if (isWebp(imageLocation)) {
    //             imageLocation = await convertWebpToJpg(imageLocation)
    //         }
    //         // newPhoto.ext = path.extname(path.basename(imageLocation)).substring(1)
    //         newPhoto.buffer = fs.createReadStream(imageLocation)

    //     } catch (error) {
    //         logger.error(error)
    //     }
    //     newPhotos.push(newPhoto)
    // }
    return newPhotos
}

export const downloadVideoAttachments = async (videos: VideoAttachment[], location: string = os.tmpdir()): Promise<Array<VideoAttachment & DownloadedAttachment>> => {
    const vkUrl = `https://vk.com/video-`
    const downloadedVideos = [] as Array<VideoAttachment & DownloadedAttachment>
    for (const video of videos) {
        const downloadedVideo = Object.assign(Object.create(Object.getPrototypeOf(video)), video) as VideoAttachment & DownloadedAttachment
        const { id, ownerId } = video
        const videoName = `${Math.abs(ownerId)}_${Math.abs(id)}`
        const videoUrl = vkUrl + videoName
        try {
            // const videoLocation = await downloadVideo(videoUrl, videoName, location)
            // downloadedVideo.ext = path.extname(path.basename(videoLocation)).substring(1)
            // downloadedVideo.buffer = fs.createReadStream(videoLocation)
        } catch (error) {
            logger.error(error)
        }
        downloadedVideos.push(downloadedVideo)
    }
    return downloadedVideos
}

export const downloadPhotoAttachment = async (photo: PhotoAttachment, location: string = os.tmpdir()): Promise<(PhotoAttachment & DownloadedAttachment)> => {
    const newPhoto = Object.assign(Object.create(Object.getPrototypeOf(photo)), photo) as PhotoAttachment & DownloadedAttachment
    // try {
    //     let imageLocation = await downloadImage(photo.largeSizeUrl, photo.id, location)
    //     if (isWebp(imageLocation)) {
    //         imageLocation = await convertWebpToJpg(imageLocation)
    //     }
    //     newPhoto.buffer = fs.createReadStream(imageLocation)
    // } catch (error) {
    //     logger.error(error)
    // }
    return newPhoto
}

export const downloadVideoAttachment = async (video: VideoAttachment, location: string = os.tmpdir()): Promise<VideoAttachment & DownloadedAttachment> => {
    const vkUrl = `https://vk.com/video-`
    const newVideo = Object.assign(Object.create(Object.getPrototypeOf(video)), video) as VideoAttachment & DownloadedAttachment
    const { id, ownerId } = video
    const videoName = `${Math.abs(ownerId)}_${Math.abs(id)}`
    const videoUrl = vkUrl + videoName
    try {
        // const videoLocation = await downloadVideo(videoUrl, videoName, location)
        // newVideo.ext = path.extname(path.basename(videoLocation)).substring(1)
        // newVideo.buffer = fs.createReadStream(videoLocation)
        // newVideo.location = videoLocation
    } catch (error) {
        logger.error(error)
    }
    return newVideo
}

export const downloadDocAttachment = async (doc: DocumentAttachment, { filename, location, ext }: DownloadDocumentOptions): Promise<(DocumentAttachment & DownloadedAttachment)> => {
    const newDoc = Object.assign(Object.create(Object.getPrototypeOf(doc)), doc) as DocumentAttachment & DownloadedAttachment
    // try {
    //     const filePath = path.join(location, `${doc.title.split('.')[0]}.${doc.extension}`)
    //     const fileInfo = await downloadFile(doc.url, filePath)
    //     newDoc.info = fileInfo
    //     newDoc.buffer = fs.createReadStream(fileInfo.path)
    // } catch (error) {
    //     logger.error(error)
    // }
    return newDoc
}