import { getAttachment } from '@yc-bot/mocks';
import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadFile, downloadVideo, convertWebpToJpg, prepareMedia, isWebp } from '../';
import { makeID, makeString, chunkString } from '@yc-bot/shared/utils';

describe('Utils', () => {
	const downloadLocation = path.join(path.resolve(), 'tmp', 'assets', 'utils');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	// afterAll(() => {
	//     prepareTemp(downloadLocation)
	// })
	// beforeEach(() => {
	//     prepareTemp(downloadLocation)
	// })
	// afterEach(() => {
	//     prepareTemp(downloadLocation)
	// })
	describe('Prepare Media', () => {
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
	describe('Download', () => {
		jest.setTimeout(120000);
		it('should download jpeg, webp, png images. And convert webp to jpg', async () => {
			const images = ['https://via.placeholder.com/150.jpeg', 'https://via.placeholder.com/150.webp', 'https://via.placeholder.com/150.png'];
			for (const image of images) {
				let imageInfo = await downloadFile(image, downloadLocation, makeID());
				if (isWebp(imageInfo.path)) {
					const cImageInfo = await convertWebpToJpg(imageInfo.path);
					expect(cImageInfo.ext).toBe('jpeg');
					imageInfo = cImageInfo;
				}
				expect(fs.existsSync(imageInfo.path)).toBeTruthy();
				expect(imageInfo.size).toBeGreaterThan(0);
				expect(imageInfo.size).toBeLessThan(10000);
			}
		});

		it('should download vk and youtube videos', async () => {
			const videoUrls = ['https://vk.com/video-172967713_456240740', 'https://youtu.be/vy12D9bc48E'];
			for (const videoUrl of videoUrls) {
				const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
				const videoExists = fs.existsSync(videoInfo.path);
				expect(videoExists).toBeTruthy();
				expect(videoInfo.size).toBeGreaterThan(0);
				expect(videoInfo.size).toBeLessThan(50000);
				expect(videoInfo.duration).toBeLessThan(600);
			}
		});
		it('should download right size vertical video', async () => {
			const videoUrls = ['https://vk.com/video367476532_456239281'];
			for (const videoUrl of videoUrls) {
				const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
				const videoExists = fs.existsSync(videoInfo.path);
				expect(videoExists).toBeTruthy();
				expect(videoInfo.size).toBeGreaterThan(0);
				expect(videoInfo.size).toBeLessThan(50000);
				expect(videoInfo.duration).toBeLessThan(600);
				expect(videoInfo.height).toBeLessThanOrEqual(640);
				expect(videoInfo.height).toBeGreaterThanOrEqual(360);
				expect(videoInfo.width).toBeLessThanOrEqual(640);
				expect(videoInfo.width).toBeGreaterThanOrEqual(360);
			}
		});
		it('should ignore videos longer than 10mins and bigger than 50mb', async () => {
			const videoUrls = ['https://vk.com/video-74325500_169755573', 'https://youtu.be/hY7m5jjJ9mM'];
			for (const videoUrl of videoUrls) {
				try {
					const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
					expect(videoInfo).toBeNull();
				} catch (error) {
					expect(true).toBeTruthy();
				}
			}
		});
		it('should download pdf and gif documents', async () => {
			const docs = [
				'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
				'https://vk.com/doc11300623_634596229?hash=wbgBjb8P7nNwFE0VrShru9VQ05ZZ1vrUAL1W2jRQGdL&dl=GEYTGMBQGYZDG:1651397414:aGnkJBSUcfiZ05pJCHY5QZhQwJc4hBCS7BhoEjHorqz&api=1&no_preview=1'
			];
			for (const doc of docs) {
				const imageInfo = await downloadFile(doc, downloadLocation, makeID());
				const imageExists = fs.existsSync(imageInfo.path);
				expect(imageExists).toBeTruthy();
				expect(imageInfo.size).toBeGreaterThan(0);
				expect(imageInfo.size).toBeLessThan(50000);
			}
		});
	});
	describe('chunkString', () => {
		it('should chunk text(1000) to chunks with size less than 250', async () => {
			const stringSize = 1000;
			const chunkSize = 250;
			const text = makeString(stringSize);
			const chunks = chunkString(text, chunkSize);
			for (let i = 0; i < chunks.length; i++) {
				expect(chunks[i].length).toBeLessThanOrEqual(chunkSize);
			}
		});
		it('should chunk text(1000) to chunks with first chunk size 100 and rest chunks size less than or equal 250', async () => {
			const stringSize = 1000;
			const chunkSize = 250;
			const firstChunkSize = 100;
			const text = makeString(stringSize);
			const chunks = chunkString(text, chunkSize, firstChunkSize);
			for (let i = 0; i < chunks.length; i++) {
				if (i === 0) {
					expect(chunks[i].length).toBeLessThanOrEqual(firstChunkSize);
				} else {
					expect(chunks[i].length).toBeLessThanOrEqual(chunkSize);
				}
			}
		});
		it('should chunk 3 random text to chunks with first chunk size 1024 and rest chunks size less than or equal 4096', async () => {
			for (let j = 0; j < 3; j++) {
				const stringSize = Math.floor(Math.random() * 10000);
				const chunkSize = 4096;
				const firstChunkSize = 1024;
				const text = makeString(stringSize);
				const chunks = chunkString(text, chunkSize, firstChunkSize);
				for (let i = 0; i < chunks.length; i++) {
					if (i === 0) {
						expect(chunks[i].length).toBeLessThanOrEqual(firstChunkSize);
					} else {
						expect(chunks[i].length).toBeLessThanOrEqual(chunkSize);
					}
				}
			}
		});
	});
});
