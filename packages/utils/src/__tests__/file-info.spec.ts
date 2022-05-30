import fs from 'fs';
import path from 'path';
import { getFileInfo } from '..';

describe('getFileInfo', () => {
	it('should return file info', () => {
		const filepath = path.join(__dirname, '..', 'assets', 'image-jpeg.jpeg');
		const fileInfo = getFileInfo(filepath);
		expect(fileInfo.ext).toBe('jpeg');
		expect(fileInfo.filename).toBe('image-jpeg');
		expect(fileInfo.path).toBe(filepath);
		expect(fileInfo.size).toBe(2);
	});
	it('should return null if file does not exist', () => {
		const filepath = path.join(__dirname, '123321.jpegqwerty');
		const fileInfo = getFileInfo(filepath);
		expect(fileInfo).toBeNull();
	});
});
