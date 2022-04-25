// import {  WallAttachment } from 'vk-io';
import { getAttachment } from '@yc-bot/mocks'
import path from 'path';
import fs from 'fs';
import prepareTemp from './prepareTemp'
// import { VK } from '@yc-bot/api'
import { prepareAttachments, prepareDoc, preparePhoto, prepareVideo } from './prepareAttachments';
import { downloadFile } from './download';
import { convertWebpToJpg } from './convertWebpToJpg';
import { makeID } from './helpers';

// const vk = new VK(process.env.NX_VK_TOKEN)

// const getPost = (body): WallAttachment => {
//     const payload = JSON.parse(JSON.stringify(body))
//     return new WallAttachment({ api: vk.api, payload: payload.object })
// }

describe('Utils', () => {
    const downloadLocation = path.join(path.resolve(), 'tmp', "assets")
    beforeAll(() => {
        prepareTemp(downloadLocation)
    })
    // afterAll(() => {
    //     prepareTemp(downloadLocation)
    // })
    // beforeEach(() => {
    //     prepareTemp(downloadLocation)
    // })
    // afterEach(() => {
    //     prepareTemp(downloadLocation)
    // })
    describe("Prepare Attachments", () => {
        describe("prepareAttachments", () => {
            it("should prepare photos, videos and docs", async () => {
                const attachments = [getAttachment("photo", "small"), getAttachment("video", "small"), getAttachment("doc", "gif")]
                const pAttachments = await prepareAttachments(attachments, downloadLocation)
                expect(pAttachments.photos.length).toBe(1)
                expect(pAttachments.videos.length).toBe(1)
                expect(pAttachments.docs.length).toBe(1)
                expect(pAttachments.photos[0].buffer).toBeTruthy()
                expect(pAttachments.videos[0].buffer).toBeTruthy()
                expect(pAttachments.docs[0].buffer).toBeTruthy()
            })
        })
        describe("preparePhoto", () => {
            it("should prepare photo", async () => {
                const photo = await preparePhoto(getAttachment("photo", "small"), downloadLocation, makeID())
                expect(fs.existsSync(photo.info.path)).toBeTruthy()
                expect(photo.buffer).toBeTruthy()
                expect(photo.info.size).toBeGreaterThan(0)
            })
            it("should prepare webp photo", async () => {
                const photo = await preparePhoto(getAttachment("photo", "webp"), downloadLocation, makeID())
                expect(fs.existsSync(photo.info.path)).toBeTruthy()
                expect(photo.buffer).toBeTruthy()
                expect(photo.info.size).toBeGreaterThan(0)
                expect(photo.info.ext).toBe("jpg")
            })
        })
        describe("prepareVideo", () => {
            jest.setTimeout(60000)
            it("should prepare video", async () => {
                const video = await prepareVideo(getAttachment("video", "small"), downloadLocation, makeID())
                expect(fs.existsSync(video.info.path)).toBeTruthy()
                expect(video.buffer).toBeTruthy()
                expect(video.info.size).toBeGreaterThan(0)
                expect(video.info.size).toBeLessThan(50000)
            })
            it("should ignore long video", async () => {
                const video = await prepareVideo(getAttachment("video", "big"), downloadLocation, makeID())
                expect(video).toBeFalsy()
            })
            it("should ignore video from youtube", async () => {
                const video = await prepareVideo(getAttachment("video", "youtube"), downloadLocation, makeID())
                expect(video).toBeFalsy()
            })
        })
        describe("prepareDoc", () => {
            jest.setTimeout(30000)
            it("should prepare gif", async () => {
                const gif = await prepareDoc(getAttachment("doc", "gif"), downloadLocation, makeID())
                expect(fs.existsSync(gif.info.path)).toBeTruthy()
                expect(gif.buffer).toBeTruthy()
                expect(gif.info.size).toBeGreaterThan(0)
            })
            it("should prepare pdf", async () => {
                const pdf = await prepareDoc(getAttachment("doc", "pdf"), downloadLocation, makeID())
                expect(fs.existsSync(pdf.info.path)).toBeTruthy()
                expect(pdf.buffer).toBeTruthy()
                expect(pdf.info.size).toBeGreaterThan(0)
            })
        })
    })

    describe('Download', () => {
        describe("Image", () => {
            it("should download and save jpeg, webp, png images", async () => {
                const images = ["https://via.placeholder.com/150.jpeg", "https://via.placeholder.com/150.webp", "https://via.placeholder.com/150.png"] // jpeg, webp, png
                for (let id = 0; id < images.length; id++) {
                    const imageInfo = await downloadFile(images[id], downloadLocation, makeID())
                    const imageExists = fs.existsSync(imageInfo.path)
                    expect(imageExists).toBeTruthy()
                    expect(imageInfo.size).toBeGreaterThan(0)
                    expect(imageInfo.size).toBeLessThan(50000)
                }
            })
            it("should convert webp image to jpg", async () => {
                const image = "https://via.placeholder.com/150.webp"
                const imageInfo = await downloadFile(image, downloadLocation, makeID())
                const convertedImageInfo = await convertWebpToJpg(imageInfo.path)
                const imageExists = fs.existsSync(convertedImageInfo.path)
                expect(imageExists).toBeTruthy()
                expect(convertedImageInfo.ext).toBe('jpg')
                expect(convertedImageInfo.size).toBeGreaterThan(0)
                expect(convertedImageInfo.size).toBeLessThan(50000)
            })
        })
    })
});