import path from 'path';
import { getAttachment } from '@yc-bot/mocks';
import { makeString } from '@yc-bot/shared/utils';
import { prepareTemp, prepareMedia } from '@yc-bot/utils';
import { send } from '../';

const tmpDir = path.join(path.resolve(), 'tmp', 'assets', 'telegram-api');

describe('send', () => {
	jest.setTimeout(60000);
	beforeAll(async () => {
		prepareTemp(tmpDir);
	});
	it('should send message with 1 photo and text', async () => {
		let text = makeString(500);
		text = 'START ' + text + ' END';
		const media = await prepareMedia([getAttachment('photo', 'small')], {
			randomFilenames: true,
			saveTo: tmpDir
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
		const media = await prepareMedia([getAttachment('photo', 'small'), getAttachment('video', 'small')], {
			randomFilenames: true,
			saveTo: tmpDir
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
		const media = await prepareMedia([getAttachment('doc', 'gif')], { randomFilenames: true, saveTo: tmpDir });
		try {
			await send(text, media, { disable_notification: true });
			expect(true).toBeTruthy();
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});
});
