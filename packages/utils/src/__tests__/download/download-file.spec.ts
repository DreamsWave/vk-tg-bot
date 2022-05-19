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
	it('should throw error', async () => {
		const pdfUrl = 'https://www.w3.org/qweqwewqew/qweqweqwewqe.qweqwewqe';
		const fileId = makeID();
		try {
			await downloadFile(pdfUrl, downloadLocation, fileId);
		} catch (error) {
			expect(error.status).toBe(404);
		}
	});
});
