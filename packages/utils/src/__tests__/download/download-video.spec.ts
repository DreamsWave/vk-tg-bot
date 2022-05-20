import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadVideo } from '../..';
import { makeID } from '@yc-bot/shared/utils';

describe('downloadVideo', () => {
	const downloadLocation = path.join(path.resolve(), 'tmp', 'download-video');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(60000);

	it('should download vk and youtube videos', async () => {
		const videoUrl = 'https://vk.com/video-172967713_456240740';
		const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
		const videoExists = fs.existsSync(videoInfo.path);
		expect(videoExists).toBeTruthy();
		expect(videoInfo.size).toBeGreaterThan(0);
		expect(videoInfo.size).toBeLessThan(50000);
		expect(videoInfo.duration).toBeLessThan(600);
	});
});
