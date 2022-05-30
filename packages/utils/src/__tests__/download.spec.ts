import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadFile, downloadImage, downloadVideo, makeID } from '..';
import * as download from '../lib/download';
import { getFileInfo } from '../lib/file-info';
import { ImageInfo } from '@yc-bot/types';

describe('downloadFile', () => {
	const destination = path.join(path.resolve(), 'tmp', 'downloadFile');
	beforeAll(() => {
		prepareTemp(destination);
	});
	afterEach(() => {
		jest.clearAllMocks();
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
	const destination = path.join(path.resolve(), 'tmp', 'downloadImage');
	beforeAll(() => {
		prepareTemp(destination);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	jest.setTimeout(30000);
	it('should download image and return image info', async () => {
		const imageUrl =
			'https://sun9-60.userapi.com/s/v1/ig2/CLparBT2In21Vf00IYV_cI5FmOrE_iEru3HUyhSzvtX9eucEywkMuDdgMgSCc8eKOKlzRKtXCOR1dha1HxmeKmBb.jpg?size=150x150&quality=96&type=album';
		const filename = 'vk-image';
		const imageInfo = await downloadImage(imageUrl, destination, filename);
		expect(fs.existsSync(imageInfo.path)).toBeTruthy();
		expect(imageInfo.height).toBe(150);
		expect(imageInfo.width).toBe(150);
		expect(imageInfo.size).toBe(2);
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe(filename);
		expect(imageInfo.mime).toBe('image/jpeg');
		expect(imageInfo.type).toBe('photo');
		expect(imageInfo.origin).toBe(imageUrl);
	});
	it('should convert webp image and return image info', async () => {
		const webpInfo = getFileInfo(path.join(path.resolve(), 'assets/image-webp.webp'));
		const jpegInfo = {
			ext: 'jpeg',
			filename: 'c-some-image-name',
			mime: 'image/jpeg',
			path: 'D:\\Web\\yc-bot\\tmp\\downloadImage\\c-some-image-name.jpeg',
			size: 3,
			type: 'photo',
			height: 150,
			width: 150,
			origin: 'https://some-url.com'
		};
		jest.spyOn(download, 'downloadFile').mockResolvedValue(webpInfo);
		const imageInfo = await downloadImage('https://some-url.com', destination, 'some-image-name');
		expect(fs.existsSync(imageInfo.path)).toBeTruthy();
		expect(imageInfo.ext).toBe(jpegInfo.ext);
		expect(imageInfo.filename).toBe(jpegInfo.filename);
		expect(imageInfo.mime).toBe(jpegInfo.mime);
	});
	it('should resize image and return image info', async () => {
		const mockedImageInfo = getFileInfo(path.join(path.resolve(), 'assets/image-jpeg.jpeg'));
		jest.spyOn(download, 'downloadFile').mockResolvedValue(mockedImageInfo);
		const imageInfo = await downloadImage('https://some-url.com', destination, 'resized-image', { maxHeight: 100, maxWidth: 100 });
		expect(fs.existsSync(imageInfo.path)).toBeTruthy();
		expect(imageInfo.height).toBe(100);
		expect(imageInfo.width).toBe(100);
		expect(imageInfo.filename).toBe('image-jpeg-70');
	});
	it('should change image quality till it is allowed size and return image info', async () => {
		const mockedBigImageInfo = getFileInfo(path.join(path.resolve(), 'assets/image-big.jpeg'));
		jest.spyOn(download, 'downloadFile').mockResolvedValue(mockedBigImageInfo);
		const imageInfo = await downloadImage('https://some-url.com', destination, 'resized-image', { maxSize: 35, quality: 100 });
		expect(imageInfo.size).toBeLessThanOrEqual(32);
	});
});

describe('downloadVideo', () => {
	const destination = path.join(path.resolve(), 'tmp', 'downloadVideo');
	beforeAll(() => {
		prepareTemp(destination);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	jest.setTimeout(30000);
	it('should download vk(and convert) and youtube videos', async () => {
		const videoPreviewInfo = { ...getFileInfo(path.join(path.resolve(), 'assets/image-video-thumb.jpeg')) } as ImageInfo;
		jest.spyOn(download, 'downloadImage').mockResolvedValue(videoPreviewInfo);
		const videoUrls = ['https://vk.com/video-191117934_456239116', 'https://youtu.be/tbnLqRW9Ef0'];
		for (const url of videoUrls) {
			const videoInfo = await downloadVideo(url, destination, makeID());
			const videoExists = fs.existsSync(videoInfo.path);
			expect(videoExists).toBeTruthy();
			expect(videoInfo.size).toBeGreaterThan(0);
			expect(videoInfo.size).toBeLessThan(50000);
			expect(videoInfo.duration).toBeLessThan(600);
			expect(videoInfo.thumb?.ext).toBe('jpeg');
		}
	});
});
