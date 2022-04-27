import { SQS } from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { getAttachment } from '@yc-bot/mocks';
import { makeString, prepareTemp, prepareMedia, YC, TG } from '../';
dotenv.config();

const tmpDir = path.join(path.resolve(), 'tmp', 'assets', 'api');

describe('APIs tests', () => {
	jest.setTimeout(60000);
	const tg = new TG(process.env.NX_TG_TOKEN, +process.env.NX_TG_CHAT_ID);

	beforeAll(() => {
		prepareTemp(tmpDir);
	});
	// beforeEach(() => {
	//     prepareTemp(tmpDir)
	// })
	describe('Telegram API tests', () => {
		describe('sendLongMessage', () => {
			// beforeAll(() => {
			//     jest.spyOn(ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult))
			// })
			it('should send 1000 symbols text', async () => {
				try {
					await tg.sendMessage(makeString(1000), {
						disable_notification: true
					});
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
			it('should send 5000 symbols text', async () => {
				try {
					await tg.sendMessage(makeString(5000), {
						disable_notification: true
					});
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
		});
		describe('send', () => {
			it('should send message with 1 photo', async () => {
				const text = 'should send message with 1 photo';
				const media = await prepareMedia([getAttachment('photo', 'small')], {
					randomFilenames: true,
					saveTo: tmpDir
				});
				try {
					await tg.send(text, media, { disable_notification: true });
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
			it('should send message with 1 video', async () => {
				const text = 'should send message with 1 video';
				const media = await prepareMedia([getAttachment('video', 'small')], {
					randomFilenames: true,
					saveTo: tmpDir
				});
				try {
					await tg.send(text, media, { disable_notification: true });
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
			it('should send message with 2 photos', async () => {
				const text = 'should send message with 2 photos';
				const media = await prepareMedia([getAttachment('photo', 'small'), getAttachment('photo', 'normal')], {
					randomFilenames: true,
					saveTo: tmpDir
				});
				try {
					await tg.send(text, media, { disable_notification: true });
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
			it('should send message with 1 photo and 1 video', async () => {
				const text = 'should send message with 1 photo and 1 video';
				const media = await prepareMedia([getAttachment('photo', 'small'), getAttachment('video', 'small')], { randomFilenames: true, saveTo: tmpDir });
				try {
					await tg.send(text, media, { disable_notification: true });
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
			it('should send message with gif and pdf', async () => {
				const text = 'should send message with gif and pdf';
				const media = await prepareMedia([getAttachment('doc', 'gif'), getAttachment('doc', 'pdf')], { randomFilenames: true, saveTo: tmpDir });
				try {
					await tg.send(text, media, { disable_notification: true });
					expect(true).toBeTruthy();
				} catch (error) {
					expect(false).toBeTruthy();
				}
			});
		});
	});
	describe('Yandex Cloud API tests', () => {
		describe('Yandex Message Queue', () => {
			beforeAll(() => {
				jest.spyOn(YC.ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult));
			});
			it('Should work', async () => {
				const url = 'https://some-url.com';
				const message = { some: 'data' };
				let result;
				try {
					result = await YC.ymq.sendMessage(url, message);
					expect(result).toBeDefined();
				} catch (error) {
					expect(error).toBe(/url is required/i);
				}
			});
		});
	});
});
