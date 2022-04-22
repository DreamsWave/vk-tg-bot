import { Attachment, IWallAttachmentPayload, PhotoAttachment, VideoAttachment, WallAttachment } from "vk-io";
import os from 'os'
import path from "path";
import fs from "fs";
import { convertWebpToJpg, downloadImage, isWebp } from "./images";
import { logger } from "../logger";
import { downloadVideo } from "./videos";
import { DownloadedAttachment } from '@yc-bot/types'
import { VK } from "@yc-bot/api";

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
    for (const photo of photos) {
        const newPhoto = Object.assign(Object.create(Object.getPrototypeOf(photo)), photo) as PhotoAttachment & DownloadedAttachment
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

export const downloadVideoAttachments = async (videos: VideoAttachment[], location: string = os.tmpdir()): Promise<Array<VideoAttachment & DownloadedAttachment>> => {
    const vkUrl = `https://vk.com/video-`
    const downloadedVideos = [] as Array<VideoAttachment & DownloadedAttachment>
    for (const video of videos) {
        const downloadedVideo = Object.assign(Object.create(Object.getPrototypeOf(video)), video) as VideoAttachment & DownloadedAttachment
        const { id, ownerId } = video
        const videoName = `${Math.abs(ownerId)}_${Math.abs(id)}`
        const videoUrl = vkUrl + videoName
        try {
            const videoLocation = await downloadVideo(videoUrl, videoName, location)
            downloadedVideo.ext = path.extname(path.basename(videoLocation)).substring(1)
            downloadedVideo.buffer = fs.createReadStream(videoLocation)
        } catch (error) {
            logger.error(error)
        }
        downloadedVideos.push(downloadedVideo)
    }
    return downloadedVideos
}