// import {  WallAttachment } from 'vk-io';
import { vkEvents, getVideo } from '@yc-bot/mocks'
import path from 'path';
import fs from 'fs';
import prepareTemp from './prepareTemp'
// import { VK } from '@yc-bot/api'
import { prepareAttachments, prepareDoc, preparePhoto, prepareVideo } from './prepareAttachments';
import { downloadFile } from './download';
import { convertWebpToJpg } from './convertWebpToJpg';

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
                const attachments = vkEvents.wallPostNew.withPhotoVideoDoc.object.attachments
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
                const photo = vkEvents.wallPostNew.withPhoto.object.attachments[0]
                const pPhoto = await preparePhoto(photo, downloadLocation)
                expect(fs.existsSync(pPhoto.info.path)).toBeTruthy()
                expect(pPhoto.buffer).toBeTruthy()
                expect(pPhoto.info.size).toBeGreaterThan(0)
            })
            it("should prepare webp photo", async () => {
                const size = { ...vkEvents.wallPostNew.withPhoto.object.attachments[0].photo.sizes[0], url: "https://via.placeholder.com/150.webp" }
                let attachment = vkEvents.wallPostNew.withPhoto.object.attachments[0]
                attachment = { type: attachment.type, photo: { ...attachment.photo, sizes: [size] } }
                const photo = attachment
                const pPhoto = await preparePhoto(photo, downloadLocation)
                expect(fs.existsSync(pPhoto.info.path)).toBeTruthy()
                expect(pPhoto.buffer).toBeTruthy()
                expect(pPhoto.info.size).toBeGreaterThan(0)
                expect(pPhoto.info.ext).toBe("jpg")
            })
        })
        describe("prepareVideo", () => {
            jest.setTimeout(60000)
            it("should prepare video", async () => {
                const video = getVideo("normal")
                const pVideo = await prepareVideo(video, downloadLocation)
                expect(fs.existsSync(pVideo.info.path)).toBeTruthy()
                expect(pVideo.buffer).toBeTruthy()
                expect(pVideo.info.size).toBeGreaterThan(0)
                expect(pVideo.info.size).toBeLessThan(50000)
            })
            it("should ignore long video", async () => {
                const video = getVideo("big")
                const pVideo = await prepareVideo(video, downloadLocation)
                expect(pVideo).toBeFalsy()
            })
            it("should ignore video from youtube", async () => {
                const video = getVideo("youtube")
                const pVideo = await prepareVideo(video, downloadLocation)
                expect(pVideo).toBeFalsy()
            })
        })
        describe("prepareDoc", () => {
            jest.setTimeout(30000)
            it("should prepare gif", async () => {
                const doc = vkEvents.wallPostNew.withDoc.object.attachments[0]
                const pDoc = await prepareDoc(doc, downloadLocation)
                expect(fs.existsSync(pDoc.info.path)).toBeTruthy()
                expect(pDoc.buffer).toBeTruthy()
                expect(pDoc.info.size).toBeGreaterThan(0)
            })
            it("should prepare document", async () => {
                const doc = vkEvents.wallPostNew.withDocPDF.object.attachments[0]
                const pDoc = await prepareDoc(doc, downloadLocation)
                expect(fs.existsSync(pDoc.info.path)).toBeTruthy()
                expect(pDoc.buffer).toBeTruthy()
                expect(pDoc.info.size).toBeGreaterThan(0)
            })
        })
    })

    describe('Download', () => {
        describe("Image", () => {
            it("should download and save jpeg, webp, png images", async () => {
                const images = ["https://via.placeholder.com/150.jpeg", "https://via.placeholder.com/150.webp", "https://via.placeholder.com/150.png"] // jpeg, webp, png
                for (let id = 0; id < images.length; id++) {
                    const imageInfo = await downloadFile(images[id], downloadLocation, `pic-${id}`)
                    const imageExists = fs.existsSync(imageInfo.path)
                    expect(imageExists).toBeTruthy()
                    expect(imageInfo.size).toBeGreaterThan(0)
                    expect(imageInfo.size).toBeLessThan(50000)
                }
            })
            it("should convert webp image to jpg", async () => {
                const image = "https://via.placeholder.com/150.webp"
                const imageInfo = await downloadFile(image, downloadLocation, `webp-image`)
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