import { getAttachment } from '@yc-bot/mocks';
import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadFile, downloadVideo, convertWebpToJpg, prepareMedia } from '../';
import { makeID, makeString, chunkString } from '@yc-bot/shared';

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
		describe('Photos', () => {
			it('should prepare a photo', async () => {
				const attachments = [getAttachment('photo', 'small')];
				const media = await prepareMedia(attachments, {
					randomFilenames: true,
					saveTo: downloadLocation
				});
				for (const m of media) {
					expect(m.type).toBeDefined();
					expect(m.media).toBeDefined();
				}
			});
			it('should prepare 2 photos', async () => {
				const attachments = [getAttachment('photo', 'small'), getAttachment('photo', 'normal')];
				const media = await prepareMedia(attachments, {
					randomFilenames: true,
					saveTo: downloadLocation
				});
				for (const m of media) {
					expect(m.type).toBeDefined();
					expect(m.media).toBeDefined();
				}
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
		});
		describe('Videos', () => {
			it('should prepare a video', async () => {
				const attachments = [getAttachment('video', 'small')];
				const media = await prepareMedia(attachments, {
					randomFilenames: true,
					saveTo: downloadLocation
				});
				for (const m of media) {
					expect(m.type).toBeDefined();
					expect(m.media).toBeDefined();
				}
			});
			it('should prepare 2 videos', async () => {
				const attachments = [getAttachment('video', 'small'), getAttachment('video', 'small')];
				const media = await prepareMedia(attachments, {
					randomFilenames: true,
					saveTo: downloadLocation
				});
				for (const m of media) {
					expect(m.type).toBeDefined();
					expect(m.media).toBeDefined();
				}
			});
			it('should prepare 1 video and ignore youtube and big video', async () => {
				const attachments = [getAttachment('video', 'youtube'), getAttachment('video', 'small'), getAttachment('video', 'big')];
				const media = await prepareMedia(attachments, {
					randomFilenames: true,
					saveTo: downloadLocation
				});
				expect(media).toHaveLength(3);
				for (const m of media) {
					expect(m.media).toBeDefined();
					expect(m.type).toBe('video');
				}
			});
		});
		describe('Documents', () => {
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
	});
	describe('Download', () => {
		describe('Image', () => {
			it('should download jpeg, webp, png images', async () => {
				const images = ['https://via.placeholder.com/150.jpeg', 'https://via.placeholder.com/150.webp', 'https://via.placeholder.com/150.png'];
				for (const image of images) {
					const imageInfo = await downloadFile(image, downloadLocation, makeID());
					const imageExists = fs.existsSync(imageInfo.path);
					expect(imageExists).toBeTruthy();
					expect(imageInfo.size).toBeGreaterThan(0);
					expect(imageInfo.size).toBeLessThan(10000);
				}
			});
			it('should convert webp image to jpg', async () => {
				const image = 'https://via.placeholder.com/150.webp';
				const imageInfo = await downloadFile(image, downloadLocation, makeID());
				const convertedImageInfo = await convertWebpToJpg(imageInfo.path);
				const imageExists = fs.existsSync(convertedImageInfo.path);
				expect(imageExists).toBeTruthy();
				expect(convertedImageInfo.ext).toBe('jpg');
				expect(convertedImageInfo.size).toBeGreaterThan(0);
				expect(convertedImageInfo.size).toBeLessThan(50000);
			});
		});
		describe('Video', () => {
			jest.setTimeout(120000);
			it('should download vk and youtube videos', async () => {
				const videoUrls = ['https://vk.com/video-191117934_456239053', 'https://youtu.be/kEPfM3jSoBw'];
				for (const videoUrl of videoUrls) {
					const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
					const videoExists = fs.existsSync(videoInfo.path);
					expect(videoExists).toBeTruthy();
					expect(videoInfo.size).toBeGreaterThan(0);
					expect(videoInfo.size).toBeLessThan(50000);
				}
			});
		});
		describe('Document', () => {
			it('should download pdf and gif documents', async () => {
				const docs = [
					'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
					'https://www.easygifanimator.net/images/samples/video-to-gif-sample.gif'
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
