import { WallAttachment } from 'vk-io';
import { loremIpsum } from 'lorem-ipsum'
import { chunkString, downloadFiles, downloadImage } from '.'
import { ycEvents } from '@yc-bot/mocks'
import { logger } from './lib/logger';
import path from 'path';
import { prepareTemp } from './lib/downloadFiles';
import fs from 'fs';
import os from 'os';

function makeString(size: number) {
    return loremIpsum({
        count: size,
        format: "plain",
        units: "words",
    }).substring(0, size)
}
describe('Utils', () => {
    describe('chunkString()', () => {
        it('Should chunk text(1000) to chunks with size less than 250', async () => {
            const stringSize = 1000
            const chunkSize = 250
            const text = makeString(stringSize)
            const chunks = chunkString(text, chunkSize)
            for (let i = 0; i < chunks.length; i++) {
                expect(chunks[i].length).toBeLessThanOrEqual(chunkSize)
            }
        });
        it('Should chunk text(1000) to chunks with first chunk size 100 and rest chunks size less than or equal 250', async () => {
            const stringSize = 1000
            const chunkSize = 250
            const firstChunkSize = 100
            const text = makeString(stringSize)
            const chunks = chunkString(text, chunkSize, firstChunkSize)
            for (let i = 0; i < chunks.length; i++) {
                if (i === 0) {
                    expect(chunks[i].length).toBeLessThanOrEqual(firstChunkSize)
                } else {
                    expect(chunks[i].length).toBeLessThanOrEqual(chunkSize)
                }
            }
        });
        it('Should chunk 3 random text to chunks with first chunk size 1024 and rest chunks size less than or equal 4096', async () => {
            for (let j = 0; j < 3; j++) {
                const stringSize = Math.floor(Math.random() * 10000)
                const chunkSize = 4096
                const firstChunkSize = 1024
                const text = makeString(stringSize)
                const chunks = chunkString(text, chunkSize, firstChunkSize)
                for (let i = 0; i < chunks.length; i++) {
                    if (i === 0) {
                        expect(chunks[i].length).toBeLessThanOrEqual(firstChunkSize)
                    } else {
                        expect(chunks[i].length).toBeLessThanOrEqual(chunkSize)
                    }
                }
            }
        });
    });

    describe('downloadFiles()', () => {
        const filesLocation = path.join(path.resolve(), 'tmp', "assets")
        beforeAll(() => {
            prepareTemp(filesLocation)
        })

        describe("Photo attachments", () => {
            it("should download and save photos and return PhotoAttachments with buffer", async () => {
                const body = JSON.parse(ycEvents.messages.messages[0].details.message.body)
                const post = new WallAttachment({ api: null, payload: body.object })
                const photosOriginal = post.getAttachments('photo')
                const photos = await downloadFiles(photosOriginal, filesLocation)
                for (const photo of photos) {
                    expect(photo.buffer).toBeTruthy()
                }
            })
            it("downloadImage should download and save image", async () => {
                const fileId = 123
                const fileExt = 'png'
                await downloadImage("https://via.placeholder.com/150", fileId, filesLocation)
                const imageExists = fs.existsSync(path.join(filesLocation, `${fileId}.${fileExt}`))
                expect(imageExists).toBeTruthy()
            })
        })
    });
});
