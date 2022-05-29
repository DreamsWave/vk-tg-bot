import { getAttachment } from '@yc-bot/mocks';
import { Files } from '@yc-bot/types';
import path from 'path';
import { prepareTemp, getMediaFilesFromAttachments } from '..';

describe('getMediafilesFromAttachments', () => {
	jest.setTimeout(60000);
	const destination = path.join(path.resolve(), 'tmp', 'getMediafilesFromAttachments');
	beforeAll(() => {
		prepareTemp(destination);
	});
	it('should prepare jpg and webp photos', async () => {
		const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'webp')];
		const mediafiles = await getMediaFilesFromAttachments(attachments, {
			randomFilenames: true,
			destination
		});
		for (const media of mediafiles) {
			expect(media.type).toBe('photo');
			expect(media.mime).toBe('image/jpeg');
			expect(media.path).toBeDefined();
			expect(media.origin).toBeDefined();
		}
	});
	it('should prepare vk and youtube videos', async () => {
		const attachments = [getAttachment('video', 'small'), getAttachment('video', 'youtube')];
		const mediafiles = await getMediaFilesFromAttachments(attachments, {
			randomFilenames: true,
			destination
		});
		expect(mediafiles).toHaveLength(2);
		for (const media of mediafiles) {
			expect(media.type).toBe('video');
			expect(media.mime).toBe('video/mp4');
			expect(media.path).toBeDefined();
		}
	});
	it('should prepare pdf and gif', async () => {
		const attachments = [getAttachment('doc', 'pdf'), getAttachment('doc', 'gif')];
		const mediafiles = await getMediaFilesFromAttachments(attachments, {
			randomFilenames: true,
			destination
		});
		expect(mediafiles).toHaveLength(2);
		expect(mediafiles[0].mime).toBe('application/pdf');
		expect(mediafiles[0].ext).toBe('pdf');
		expect(mediafiles[0].type).toBe('document');
		expect(mediafiles[1].mime).toBe('image/gif');
		expect(mediafiles[1].ext).toBe('gif');
		expect(mediafiles[1].type).toBe('document');
	});
});
