import { SQS } from 'aws-sdk';
import { makeString, prepareTemp } from '@yc-bot/utils';
import dotenv from 'dotenv'
import { getAttachment, vkEvents } from '@yc-bot/mocks';
import { Post } from '@yc-bot/types';
import path from 'path';
import TG from './tg';
import { ymq } from './yc';
import { prepareMedia } from '../prepareMedia';
dotenv.config()

const tmpDir = path.join(path.resolve(), "tmp", "assets")

describe('APIs tests', () => {
    jest.setTimeout(60000)
    const tg = new TG(process.env.NX_TG_TOKEN, +process.env.NX_TG_CHAT_ID)

    beforeAll(() => {
        prepareTemp(tmpDir)
    })
    describe('Telegram API tests', () => {
        describe('sendLongMessage', () => {
            // beforeAll(() => {
            //     jest.spyOn(ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult))
            // })
            it('should send 1000 symbols text', async () => {
                try {
                    await tg.sendLongMessage(makeString(1000), { disable_notification: true })
                    expect('ok').toBe('ok');
                } catch (error) {
                    expect(false).toBeTruthy()
                }
            });
            it('should send 5000 symbols text', async () => {
                try {
                    await tg.sendLongMessage(makeString(5000), { disable_notification: true })
                    expect('ok').toBe('ok');
                } catch (error) {
                    expect(false).toBeTruthy()
                }
            });
        });
        describe('sendPost', () => {
            it('should send post with 2 photos', async () => {
                const post = vkEvents.wallPostNew.simple.object as unknown as Post
                const media = await prepareMedia([getAttachment('photo', "small"), getAttachment('photo', "normal")], { randomFilenames: true, saveTo: tmpDir })
                try {
                    await tg.sendPost(post, media, { disable_notification: true })
                } catch (error) {
                    expect(false).toBeTruthy()
                }
            })
            it('should send post with 1 photo and 1 video', async () => {
                const post = vkEvents.wallPostNew.simple.object as unknown as Post
                const media = await prepareMedia([getAttachment('photo', "small"), getAttachment('video', "small")], { randomFilenames: true, saveTo: tmpDir })
                try {
                    await tg.sendPost(post, media, { disable_notification: true })
                } catch (error) {
                    expect(false).toBeTruthy()
                }
            })
            it('should send post with 2 documents', async () => {
                const post = vkEvents.wallPostNew.simple.object as unknown as Post
                const media = await prepareMedia([getAttachment('doc', "gif"), getAttachment('doc', "gif")], { randomFilenames: true, saveTo: tmpDir })
                try {
                    await tg.sendPost(post, media, { disable_notification: true })
                } catch (error) {
                    expect(false).toBeTruthy()
                }
            })
        })
    })
    describe('Yandex Cloud API tests', () => {
        describe('Yandex Message Queue', () => {
            beforeAll(() => {
                jest.spyOn(ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult))
            })
            it('Should work', async () => {
                const url = "https://some-url.com"
                const message = { some: "data" }
                let result;
                try {
                    result = await ymq.sendMessage(url, message)
                    expect(result).toBeDefined();
                } catch (error) {
                    expect(error).toBe(/url is required/i);
                }
            });
        });
    });

});
