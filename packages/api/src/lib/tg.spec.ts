import { logger, makeString, prepareAttachments, prepareTemp } from '@yc-bot/utils';
import TG from './tg';
import dotenv from 'dotenv'
import { getAttachment, vkEvents } from '@yc-bot/mocks';
import { PAttachments, Post } from '@yc-bot/types';
import path from 'path';
dotenv.config()

const tmpDir = path.join(path.resolve(), "tmp", "assets")

describe('Telegram API tests', () => {
    jest.setTimeout(60000)
    const tg = new TG(process.env.NX_TG_TOKEN, +process.env.NX_TG_CHAT_ID)

    beforeAll(() => {
        prepareTemp(tmpDir)
    })
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
            const attachments = await prepareAttachments([getAttachment('photo', "small"), getAttachment('photo', "normal")], tmpDir)
            try {
                await tg.sendPost(post, attachments)
            } catch (error) {
                expect(false).toBeTruthy()
            }
        })
        it('should send post with 1 photo and 1 video', async () => {
            const post = vkEvents.wallPostNew.simple.object as unknown as Post
            const attachments = await prepareAttachments([getAttachment('photo', "small"), getAttachment('video', "small")], tmpDir)
            try {
                await tg.sendPost(post, attachments)
            } catch (error) {
                expect(false).toBeTruthy()
            }
        })
    })
});
