import { getAttachment } from '@yc-bot/mocks';
import path from 'path';
import { prepareTemp, prepareMediaForTG } from '..';

describe('prepareMediaForTg', () => {
	jest.setTimeout(60000);
	const destination = path.join(path.resolve(), 'tmp', 'assets', 'utils');
	beforeAll(() => {
		prepareTemp(destination);
	});
	it('should prepare jpg and webp photos', async () => {
		const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'webp')];
		const media = await prepareMediaForTG(attachments, {
			randomFilenames: true,
			destination
		});
		for (const m of media) {
			expect(m.type).toBeDefined();
			expect(m.media).toBeDefined();
		}
	});
	it('should prepare vk and youtube videos', async () => {
		const attachments = [getAttachment('video', 'small'), getAttachment('video', 'youtube')];
		const media = await prepareMediaForTG(attachments, {
			randomFilenames: true,
			destination
		});
		expect(media).toHaveLength(2);
		for (const m of media) {
			expect(m.media).toBeDefined();
			expect(m.type).toBe('video');
		}
	});
	it('should prepare pdf and gif', async () => {
		const attachments = [getAttachment('doc', 'pdf'), getAttachment('doc', 'gif')];
		const media = await prepareMediaForTG(attachments, {
			randomFilenames: true,
			destination
		});
		expect(media).toHaveLength(2);
		for (const m of media) {
			expect(m.media).toBeDefined();
			expect(m.type).toBe('document');
		}
	});
});
