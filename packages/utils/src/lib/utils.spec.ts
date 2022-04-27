import { getAttachment } from '@yc-bot/mocks'
import path from 'path';
import fs from 'fs';
import prepareTemp from './prepareTemp'
import { downloadFile, downloadVideo } from './download';
import { convertWebpToJpg } from './convertWebpToJpg';
import { makeID } from './helpers';
import { prepareMedia } from './prepareMedia'

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
    describe('Prepare Media', () => {
        describe("Photos", () => {
            it('should prepare a photo', async () => {
                const attachments = [getAttachment('photo', "small")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                for (const m of media) {
                    expect(m.type).toBeDefined()
                    expect(m.media).toBeDefined()
                }
            })
            it('should prepare 2 photos', async () => {
                const attachments = [getAttachment('photo', "small"), getAttachment('photo', "small")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                for (const m of media) {
                    expect(m.type).toBeDefined()
                    expect(m.media).toBeDefined()
                }
            })
            it('should prepare jpg and webp photos', async () => {
                const attachments = [getAttachment('photo', "small"), getAttachment('photo', "webp")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                for (const m of media) {
                    expect(m.type).toBeDefined()
                    expect(m.media).toBeDefined()
                }
            })
        })
        describe('Videos', () => {
            it("should prepare a video", async () => {
                const attachments = [getAttachment('video', "small")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                for (const m of media) {
                    expect(m.type).toBeDefined()
                    expect(m.media).toBeDefined()
                }
            })
            it("should prepare 2 videos", async () => {
                const attachments = [getAttachment('video', "small"), getAttachment('video', "small")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                for (const m of media) {
                    expect(m.type).toBeDefined()
                    expect(m.media).toBeDefined()
                }
            })
            it("should prepare 1 video and ignore youtube and big video", async () => {
                const attachments = [getAttachment('video', "youtube"), getAttachment('video', "small"), getAttachment('video', "big")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                expect(media).toHaveLength(3)
                for (const m of media) {
                    expect(m.media).toBeDefined()
                    expect(m.type).toBe("video")
                }
            })
        })
        describe('Documents', () => {
            it("should prepare pdf and gif", async () => {
                const attachments = [getAttachment('doc', "pdf"), getAttachment('doc', "gif")]
                const media = await prepareMedia(attachments, { randomFilenames: true, saveTo: downloadLocation })
                expect(media).toHaveLength(2)
                for (const m of media) {
                    expect(m.media).toBeDefined()
                    expect(m.type).toBe("document")
                }
            })
        })
    })
    describe('Download', () => {
        describe("Image", () => {
            it("should download jpeg, webp, png images", async () => {
                const images = ["https://via.placeholder.com/150.jpeg", "https://via.placeholder.com/150.webp", "https://via.placeholder.com/150.png"]
                for (const image of images) {
                    const imageInfo = await downloadFile(image, downloadLocation, makeID())
                    const imageExists = fs.existsSync(imageInfo.path)
                    expect(imageExists).toBeTruthy()
                    expect(imageInfo.size).toBeGreaterThan(0)
                    expect(imageInfo.size).toBeLessThan(10000)
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
        describe("Video", () => {
            jest.setTimeout(120000)
            it("should download vk and youtube videos", async () => {
                const videoUrls = ["https://vk.com/video-191117934_456239053", "https://youtu.be/kEPfM3jSoBw"]
                for (const videoUrl of videoUrls) {
                    const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID())
                    const videoExists = fs.existsSync(videoInfo.path)
                    expect(videoExists).toBeTruthy()
                    expect(videoInfo.size).toBeGreaterThan(0)
                    expect(videoInfo.size).toBeLessThan(50000)
                }
            })
        })
        describe('Document', () => {
            it("should download pdf and gif documents", async () => {
                const docs = ["https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "https://www.easygifanimator.net/images/samples/video-to-gif-sample.gif"]
                for (const doc of docs) {
                    const imageInfo = await downloadFile(doc, downloadLocation, makeID())
                    const imageExists = fs.existsSync(imageInfo.path)
                    expect(imageExists).toBeTruthy()
                    expect(imageInfo.size).toBeGreaterThan(0)
                    expect(imageInfo.size).toBeLessThan(50000)
                }
            })
        })
    })
});