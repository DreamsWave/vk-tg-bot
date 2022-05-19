import { getAttachment } from '@yc-bot/mocks';
import path from 'path';
import { prepareTemp, prepareMedia } from '..';

describe('prepareMedia', () => {
	jest.setTimeout(60000);
	const downloadLocation = path.join(path.resolve(), 'tmp', 'assets', 'utils');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	it('should prepare jpg and webp photos', async () => {
		const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'webp')];
		const media = await prepareMedia(attachments, {
			randomFilenames: true,
			saveTo: downloadLocation
		});
		for (const m of media) {
			expect(m.type).toBeDefined();
			expect(m.media).toBeDefined();
		}
	});
	it('should prepare vk and youtube videos', async () => {
		const attachments = [getAttachment('video', 'small'), getAttachment('video', 'youtube')];
		const media = await prepareMedia(attachments, {
			randomFilenames: true,
			saveTo: downloadLocation
		});
		expect(media).toHaveLength(2);
		for (const m of media) {
			expect(m.media).toBeDefined();
			expect(m.type).toBe('video');
		}
	});
	it('should prepare pdf and gif', async () => {
		const attachments = [getAttachment('doc', 'pdf'), getAttachment('doc', 'gif')];
		const media = await prepareMedia(attachments, {
			randomFilenames: true,
			saveTo: downloadLocation
		});
		expect(media).toHaveLength(2);
		for (const m of media) {
			expect(m.media).toBeDefined();
			expect(m.type).toBe('document');
		}
	});
});
