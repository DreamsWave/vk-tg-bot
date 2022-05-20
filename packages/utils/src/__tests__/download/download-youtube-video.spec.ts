import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadYoutubeVideo } from '../..';
import { makeID } from '@yc-bot/shared/utils';

describe('downloadYoutubeVideo', () => {
	const downloadLocation = path.join(path.resolve(), 'tmp', 'download-youtube-video');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(60000);

	it.todo('should download vk and youtube videos');
	// it('should download vk and youtube videos', async () => {
	// 	const videoUrl = 'https://www.youtube.com/watch?v=tbnLqRW9Ef0';
	// 	const filename = makeID();
	// 	const videoPath = await downloadYoutubeVideo(videoUrl, downloadLocation, filename);
	// 	expect(fs.existsSync(videoPath)).toBeTruthy();
	// });
});
