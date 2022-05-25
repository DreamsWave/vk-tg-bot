import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadFile, convertWebpToJpg, isWebp, downloadImage, downloadVideo, makeID } from '..';
import * as spyOnDownloadFile from '../lib/download/download-file';
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

describe('downloadVideo', () => {
	const destination = path.join(path.resolve(), 'tmp', 'downloadVideo');
	beforeAll(() => {
		prepareTemp(destination);
	});
	jest.setTimeout(30000);
	it('should download vk and youtube videos', async () => {
		const videoUrls = ['https://vk.com/video-191117934_456239116', 'https://youtu.be/tbnLqRW9Ef0'];
		for (const url of videoUrls) {
			const videoInfo = await downloadVideo(url, destination, makeID());
			const videoExists = fs.existsSync(videoInfo.path);
			expect(videoExists).toBeTruthy();
			expect(videoInfo.size).toBeGreaterThan(0);
			expect(videoInfo.size).toBeLessThan(50000);
			expect(videoInfo.duration).toBeLessThan(600);
		}
	});
});
