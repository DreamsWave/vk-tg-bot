import path from 'path';
import fs from 'fs';
import { prepareTemp, downloadThumb } from '../..';
import { makeID } from '@yc-bot/shared/utils';
import { getFileInfo } from '../../lib/get-file-info';
import * as mDownloadFile from '../../lib/download/download-file';
import { resizeThumb } from '../../lib/download';

const downloadLocation = path.join(path.resolve(), 'tmp', 'download-thumb');
describe('downloadThumb', () => {
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(30000);
	it('should download thumb', async () => {
		const imageUrl = 'https://i.mycdn.me/getVideoPreview?id=1927326272101&idx=9&type=39&tkn=o_bZXZCEuBcY9dYlE-0O8x6Rj84&fn=vid_w';
		const fileId = makeID();
		const downloadThumbOptions = {
			url: imageUrl,
			filename: fileId,
			saveTo: downloadLocation,
			maxWidth: 320,
			maxHeight: 320,
			maxSize: 200,
			quality: 70
		};
		const fileInfo = await downloadThumb(downloadThumbOptions);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.size).toBeLessThan(downloadThumbOptions.maxSize);
		expect(fileInfo.width).toBeLessThanOrEqual(downloadThumbOptions.maxWidth);
		expect(fileInfo.height).toBeLessThanOrEqual(downloadThumbOptions.maxHeight);
		expect(fileInfo.ext).toBe('jpeg');
		expect(fileInfo.mime).toBe('image/jpeg');
		expect(fileInfo.filename).toBe(`${downloadThumbOptions.filename}_thumb-${downloadThumbOptions.quality}`);
	});
	it('should convert webp thumb to jpeg', async () => {
		jest.spyOn(mDownloadFile, 'downloadFile').mockResolvedValue(getFileInfo(path.join(__dirname, '../../assets/image-webp.webp')));

		const imageUrl = 'https://i.mycdn.me/getVideoPreview?id=1927326272101&idx=9&type=39&tkn=o_bZXZCEuBcY9dYlE-0O8x6Rj84&fn=vid_w';
		const fileId = makeID();
		const downloadThumbOptions = {
			url: imageUrl,
			filename: `${fileId}_thumb`,
			saveTo: downloadLocation
		};
		const fileInfo = await downloadThumb(downloadThumbOptions);
		expect(fs.existsSync(fileInfo.path)).toBeTruthy();
		expect(fileInfo.ext).toBe('jpeg');
		expect(fileInfo.mime).toBe('image/jpeg');
		expect(fileInfo.filename).toBe(`c-${downloadThumbOptions.filename}-70`);
	});
});

describe('resizeThumb', () => {
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(30000);
	it('should lower quality if thumb size is higher than maxSize', async () => {
		const resizeThumbOptions = {
			filepath: path.join(__dirname, '../../assets/big-image.jpeg'),
			saveTo: downloadLocation,
			maxSize: 31,
			maxHeight: 1000,
			maxWidth: 1000,
			quality: 100
		};
		const resizedThumbInfo = await resizeThumb(resizeThumbOptions);
		expect(resizedThumbInfo.size).toBeLessThanOrEqual(resizeThumbOptions.maxSize);
	});
});
