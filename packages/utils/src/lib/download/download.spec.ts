import { PhotoAttachment, WallAttachment, VideoAttachment } from 'vk-io';
import { ymq, vkEvents } from '@yc-bot/mocks'
import path from 'path';
import fs from 'fs';
import { convertWebpToJpg, downloadImage } from './images'
import { logger } from '../logger';
import prepareTemp from '../prepareTemp'
import { downloadPhotoAttachments, downloadVideoAttachments, downloadAttachmentsInPost } from './attachments';
import { VK } from '@yc-bot/api'
import { downloadVideo } from './videos';

const vk = new VK(process.env.NX_VK_TOKEN)

const getPost = (body): WallAttachment => {
    const payload = JSON.parse(JSON.stringify(body))
    return new WallAttachment({ api: vk.api, payload: payload.object })
}

describe('download', () => {
    const downloadLocation = path.join(path.resolve(), 'tmp', "assets")
    beforeAll(() => {
        prepareTemp(downloadLocation)
    })
    afterAll(() => {
        prepareTemp(downloadLocation)
    })
    // beforeEach(() => {
    //     prepareTemp(downloadLocation)
    // })
    // afterEach(() => {
    //     prepareTemp(downloadLocation)
    // })
    describe("images", () => {
        describe("downloadImage", () => {
            it("should download and save jpeg, webp, png images", async () => {
                // const images = ["https://via.placeholder.com/150.jpeg", "https://via.placeholder.com/150.png"] // jpeg, png
                const images = ["https://via.placeholder.com/150.jpeg", "https://via.placeholder.com/150.webp", "https://via.placeholder.com/150.png"] // jpeg, webp, png
                for (let id = 0; id < images.length; id++) {
                    const imageLocation = await downloadImage(images[id], downloadLocation)
                    const imageExists = fs.existsSync(imageLocation)
                    expect(imageExists).toBeTruthy()
                }
            })
        })
        describe("convertWebpToJpg", () => {
            it("should convert webp image to jpg", async () => {
                const webpImageLocation = await downloadImage("https://via.placeholder.com/150.webp", downloadLocation)
                const imageInfo = await convertWebpToJpg(webpImageLocation)
                const imageExt = path.extname(path.basename(imageInfo.path))
                expect(imageExt).toBe('.jpg')
            })
        })

    })
    describe("videos", () => {
        describe('downloadVideo', () => {
            it("should download and save video", async () => {
                // const videoInfo = await downloadVideo("https://vk.com/video-29320599_456242402", "vkvideo", downloadLocation)
                // expect(fs.existsSync(videoInfo.path)).toBeTruthy()
            })
        })
    })
    describe('attachments', () => {
        describe('downloadAttachments', () => {
            jest.setTimeout(30000)
            it("should download attachments and add buffer and ext to the properties of attachments", async () => {
                const post = getPost(vkEvents.wallPostNew.withPhotoAndVideo)
                const postWithDownloadedAttachments = await downloadAttachmentsInPost(post, downloadLocation)
                const photos = postWithDownloadedAttachments.getAttachments('photo')
                for (const attach of postWithDownloadedAttachments.attachments) {
                    // expect(attach.buffer && attach.ext).toBeTruthy()
                }
            })
        })
        describe("downloadPhotoAttachments", () => {
            it("should download photo attachments and add buffer and ext properties to attachments", async () => {
                const post = getPost(vkEvents.wallPostNew.withPhoto)
                const photosOriginal = post.getAttachments('photo')
                const photos = await downloadPhotoAttachments(photosOriginal, downloadLocation)
                for (const photo of photos) {
                    expect(photo.buffer).toBeDefined()
                    // expect(photo.ext).toBeDefined()
                    expect(photo).toBeInstanceOf(PhotoAttachment)
                }
            })
        })
        describe('downloadVideoAttachments', () => {
            it("should download video attachments and add buffer and ext properties to attachments", async () => {
                const post = getPost(vkEvents.wallPostNew.withVideo)
                const videosOriginal = post.getAttachments('video')
                const videos = await downloadVideoAttachments(videosOriginal, downloadLocation)
                for (const video of videos) {
                    // expect(video.buffer).toBeDefined()
                    // expect(video.ext).toBeDefined()
                    expect(video).toBeInstanceOf(VideoAttachment)
                }
            })
        })
    })
});