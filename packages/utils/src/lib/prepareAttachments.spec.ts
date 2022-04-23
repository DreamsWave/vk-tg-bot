import { PhotoAttachment, WallAttachment, VideoAttachment } from 'vk-io';
import { ymq, vkEvents } from '@yc-bot/mocks'
import path from 'path';
import fs from 'fs';
import prepareTemp from './prepareTemp'
import { VK } from '@yc-bot/api'
import { prepareAttachments, prepareDoc, preparePhoto, prepareVideo } from './prepareAttachments';
import { type } from 'os';

const vk = new VK(process.env.NX_VK_TOKEN)

const getPost = (body): WallAttachment => {
    const payload = JSON.parse(JSON.stringify(body))
    return new WallAttachment({ api: vk.api, payload: payload.object })
}

describe('Prepare Attachments', () => {
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
    // describe("prepareAttachments", () => {
    //     it("should prepare photos, videos and docs", async () => {
    //         const attachments = vkEvents.wallPostNew.withPhotoVideoDoc.object.attachments
    //         const pAttachments = await prepareAttachments(attachments, { location: downloadLocation })
    //         expect('ok').toBe('ok')
    //     })
    // })
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
        jest.setTimeout(30000)
        it("should prepare video", async () => {
            const video = vkEvents.wallPostNew.withVideo.object.attachments[0]
            const pVideo = await prepareVideo(video, downloadLocation)
            expect(fs.existsSync(pVideo.info.path)).toBeTruthy()
            expect(pVideo.buffer).toBeTruthy()
            expect(pVideo.info.size).toBeGreaterThan(0)
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
});