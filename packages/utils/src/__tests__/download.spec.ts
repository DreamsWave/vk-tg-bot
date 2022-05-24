import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadFile, convertWebpToJpg, isWebp, downloadImage } from '..';
import * as spyOnDownloadFile from '../lib/download/download-file';
import { makeID } from '@yc-bot/shared/utils';
import { getFileInfo } from '../lib/file-info';

describe('downloadFile', () => {
	const destination = path.join(path.resolve(), 'tmp', 'downloadFile');
	beforeAll(() => {
		prepareTemp(destination);
	});
	jest.setTimeout(30000);
	it('should download file', async () => {
		const filename = makeID();
		const fileInfo = await downloadFile('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', destination, filename);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.mime).toBe('application/pdf');
		expect(fileInfo.ext).toBe('pdf');
		expect(fileInfo.filename).toBe(filename);
		expect(fileInfo.size).toBe(14);
	});
	it('should throw error', async () => {
		try {
			await downloadFile('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf123123', destination, makeID());
		} catch (error) {
			expect(error.message).toBe('Response status was 300');
		}
	});
});

describe('downloadImage', () => {
	// import * as spyOnDownloadFile from "../lib/download/download-file"
	// jest.mock('../lib/download/download-file');
	const destination = path.join(path.resolve(), 'tmp', 'downloadImage');
	beforeAll(() => {
		prepareTemp(destination);
	});
	jest.setTimeout(30000);
	it('should return image info', async () => {
		jest.spyOn(spyOnDownloadFile, 'downloadFile').mockResolvedValue(getFileInfo(path.join(__dirname, '../assets/image-jpeg.jpeg')));
		const imageInfo = await downloadImage('https://some-url.com', destination, 'name');
		expect(fs.existsSync(imageInfo.path)).toBeTruthy();
		expect(imageInfo.height).toBe(150);
		expect(imageInfo.width).toBe(150);
		expect(imageInfo.size).toBe(2);
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe('image-jpeg');
		expect(imageInfo.mime).toBe('image/jpeg');
	});
	it('should convert webp image and return image info', async () => {
		jest.spyOn(spyOnDownloadFile, 'downloadFile').mockResolvedValue(getFileInfo(path.join(__dirname, '../assets/image-webp.webp')));
		const imageInfo = await downloadImage('https://some-url.com', destination, 'imagename');
		expect(fs.existsSync(imageInfo.path)).toBeTruthy();
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe('c-imagename');
		expect(imageInfo.mime).toBe('image/jpeg');
	});
	it('should resize image and return image info', async () => {
		jest.spyOn(spyOnDownloadFile, 'downloadFile').mockResolvedValue(getFileInfo(path.join(__dirname, '../assets/image-jpeg.jpeg')));
		const imageInfo = await downloadImage('https://some-url.com', destination, 'resized-image', { maxHeight: 100, maxWidth: 100 });
		expect(fs.existsSync(imageInfo.path)).toBeTruthy();
		expect(imageInfo.height).toBe(100);
		expect(imageInfo.width).toBe(100);
		expect(imageInfo.filename).toBe('image-jpeg-70');
	});
	it('should change image quality till it is allowed size and return image info', async () => {
		jest.spyOn(spyOnDownloadFile, 'downloadFile').mockResolvedValue(getFileInfo(path.join(__dirname, '../assets/image-big.jpeg')));
		const imageInfo = await downloadImage('https://some-url.com', destination, 'resized-image', { maxSize: 35, quality: 100 });
		expect(imageInfo.size).toBeLessThanOrEqual(35);
	});
});

// it('should download vk and youtube videos', async () => {
// 	const videoUrls = ['https://vk.com/video-172967713_456240740', 'https://youtu.be/vy12D9bc48E'];
// 	for (const videoUrl of videoUrls) {
// 		const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
// 		const videoExists = fs.existsSync(videoInfo.path);
// 		expect(videoExists).toBeTruthy();
// 		expect(videoInfo.size).toBeGreaterThan(0);
// 		expect(videoInfo.size).toBeLessThan(50000);
// 		expect(videoInfo.duration).toBeLessThan(600);
// 	}
// });
// it('should download right size vertical video', async () => {
// 	const videoUrls = ['https://vk.com/video367476532_456239281'];
// 	for (const videoUrl of videoUrls) {
// 		const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
// 		const videoExists = fs.existsSync(videoInfo.path);
// 		expect(videoExists).toBeTruthy();
// 		expect(videoInfo.size).toBeGreaterThan(0);
// 		expect(videoInfo.size).toBeLessThan(50000);
// 		expect(videoInfo.duration).toBeLessThan(600);
// 		expect(videoInfo.height).toBeLessThanOrEqual(640);
// 		expect(videoInfo.height).toBeGreaterThanOrEqual(360);
// 		expect(videoInfo.width).toBeLessThanOrEqual(640);
// 		expect(videoInfo.width).toBeGreaterThanOrEqual(360);
// 	}
// });
// it('should ignore videos longer than 10mins and bigger than 50mb', async () => {
// 	const videoUrls = ['https://vk.com/video-74325500_169755573', 'https://youtu.be/hY7m5jjJ9mM'];
// 	for (const videoUrl of videoUrls) {
// 		try {
// 			const videoInfo = await downloadVideo(videoUrl, downloadLocation, makeID());
// 			expect(videoInfo).toBeNull();
// 		} catch (error) {
// 			expect(true).toBeTruthy();
// 		}
// 	}
// });
// it('should download pdf and gif documents', async () => {
// 	const docs = [
// 		'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
// 		'https://vk.com/doc11300623_634596229?hash=wbgBjb8P7nNwFE0VrShru9VQ05ZZ1vrUAL1W2jRQGdL&dl=GEYTGMBQGYZDG:1651397414:aGnkJBSUcfiZ05pJCHY5QZhQwJc4hBCS7BhoEjHorqz&api=1&no_preview=1'
// 	];
// 	for (const doc of docs) {
// 		const imageInfo = await downloadFile(doc, downloadLocation, makeID());
// 		const imageExists = fs.existsSync(imageInfo.path);
// 		expect(imageExists).toBeTruthy();
// 		expect(imageInfo.size).toBeGreaterThan(0);
// 		expect(imageInfo.size).toBeLessThan(50000);
// 	}
// });
