import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadFile } from '../..';
import { makeID } from '@yc-bot/shared/utils';

describe('downloadFile', () => {
	const downloadLocation = path.join(path.resolve(), 'tmp', 'download-file');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(30000);
	it('should download jpeg', async () => {
		const imageUrl = 'https://via.placeholder.com/150.jpeg';
		const fileId = makeID();
		const fileInfo = await downloadFile(imageUrl, downloadLocation, fileId);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.size).toBe(1);
		expect(fileInfo.ext).toBe('jpeg');
		expect(fileInfo.mime).toBe('image/jpeg');
		expect(fileInfo.filename).toBe(String(fileId));
	});
	it('should download pdf', async () => {
		const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
		const fileId = makeID();
		const fileInfo = await downloadFile(pdfUrl, downloadLocation, fileId);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.size).toBe(13);
		expect(fileInfo.ext).toBe('pdf');
		expect(fileInfo.mime).toBe('application/pdf');
		expect(fileInfo.filename).toBe(String(fileId));
	});
	it('should download vk video', async () => {
		const videoUrl = 'https://vk.com/video-191117934_456239115';
		const fileId = makeID();
		const fileInfo = await downloadFile(videoUrl, downloadLocation, fileId);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.size).toBe(40);
		expect(fileInfo.height).toBe(360);
		expect(fileInfo.width).toBe(638);
		expect(fileInfo.duration).toBe(1);
		expect(fileInfo.ext).toBe('mp4');
		expect(fileInfo.mime).toBe('video/mp4');
		expect(fileInfo.filename).toBe(`c-${fileId}`);
	});
	it('should download youtube video', async () => {
		const videoUrl = 'https://www.youtube.com/watch?v=tbnLqRW9Ef0';
		const fileId = makeID();
		const fileInfo = await downloadFile(videoUrl, downloadLocation, fileId);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.size).toBe(18);
		expect(fileInfo.height).toBe(360);
		expect(fileInfo.width).toBe(640);
		expect(fileInfo.duration).toBe(1);
		expect(fileInfo.ext).toBe('mp4');
		expect(fileInfo.mime).toBe('video/mp4');
		expect(fileInfo.filename).toBe(String(fileId));
	});
	it.todo('should throw error');
});
