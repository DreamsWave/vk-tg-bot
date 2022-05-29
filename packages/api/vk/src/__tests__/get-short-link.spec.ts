import { wallPostNew } from 'packages/mocks/src/vk-events';
import { getShortLink } from '../lib/get-short-link';

describe('getShortLink', () => {
	it('should return shortenLink', async () => {
		const shortenLink = await getShortLink(wallPostNew.withPhoto.object.attachments[0].photo.sizes[0].url);
		expect(shortenLink).toBeTruthy();
	});
});
