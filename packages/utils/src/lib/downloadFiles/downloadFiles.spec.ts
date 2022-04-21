import { PhotoAttachment, WallAttachment } from 'vk-io';
import { prepareTemp, downloadPhotos } from './downloadFiles'
import { convertWebpToJpg, downloadImage } from './downloadImages'
import { ycEvents } from '@yc-bot/mocks'
import { logger } from '../logger';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('downloadFiles', () => {
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
    describe("downloadImage", () => {
        it("should download and save jpeg, webp, png images", async () => {
            const images = ["https://via.placeholder.com/150.jpeg", "https://via.placeholder.com/150.webp", "https://via.placeholder.com/150.png"] // jpeg, webp, png
            for (let id = 0; id < images.length; id++) {
                const imageLocation = await downloadImage(images[id], id, downloadLocation)
                const imageExists = fs.existsSync(imageLocation)
                expect(imageExists).toBeTruthy()
            }
        })
    })
    describe("convertWebpToJpg", () => {
        it("should convert webp image to jpg", async () => {
            const webpImageLocation = await downloadImage("https://via.placeholder.com/150.webp", 'webp', downloadLocation)
            const jpgImageLocation = await convertWebpToJpg(webpImageLocation)
            const imageExt = path.extname(path.basename(jpgImageLocation))
            expect(imageExt).toBe('.jpg')
        })
    })
    describe("Photo attachments", () => {
        it("should download and save photos and return PhotoAttachments with buffer and extension", async () => {
            const body = JSON.parse(ycEvents.messages.messages[0].details.message.body)
            const post = new WallAttachment({ api: null, payload: body.object })
            const photosOriginal = post.getAttachments('photo')
            const photos = await downloadPhotos(photosOriginal, downloadLocation)
            for (const photo of photos) {
                expect(photo.buffer).toBeDefined()
                expect(photo.ext).toBeDefined()
                expect(photo).toBeInstanceOf(PhotoAttachment)
            }
        })
    })
});