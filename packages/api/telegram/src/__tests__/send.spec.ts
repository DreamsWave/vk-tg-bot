import path from 'path';
import { getAttachment } from '@yc-bot/mocks';
import { makeString } from '@yc-bot/utils';
import { prepareTemp, prepareMediaForTG } from '@yc-bot/utils';
import { send } from '../';

describe('send', () => {
	const destination = path.join(path.resolve(), 'tmp', 'send', 'telegram-api');
	jest.setTimeout(60000);
	beforeAll(async () => {
		prepareTemp(destination);
	});
	it('should send message with 1 photo and text', async () => {
		let text = makeString(500);
		text = 'START ' + text + ' END';
		const media = await prepareMediaForTG([getAttachment('photo', 'small')], {
			randomFilenames: true,
			destination
		});
		try {
			await send(text, media, { disable_notification: true });
			expect(true).toBeTruthy();
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});
	it('should send media group with 1 photo and 1 video', async () => {
		const text = 'should send media group with 1 photo and 1 video';
		const media = await prepareMediaForTG([getAttachment('photo', 'small'), getAttachment('video', 'small')], {
			randomFilenames: true,
			destination
		});
		try {
			await send(text, media, { disable_notification: true });
			expect(true).toBeTruthy();
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});
	it('should send message with gif', async () => {
		const text = 'should send message with gif';
		const media = await prepareMediaForTG([getAttachment('doc', 'gif')], { randomFilenames: true, destination });
		try {
			await send(text, media, { disable_notification: true });
			expect(true).toBeTruthy();
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});
});
