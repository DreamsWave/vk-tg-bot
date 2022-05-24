import path from 'path';
import { getFileInfo, getImageInfo } from '..';

describe('getFileInfo', () => {
	it('should return file info', () => {
		const filepath = path.join(__dirname, '..', 'assets', 'image-jpeg.jpeg');
		const fileInfo = getFileInfo(filepath);
		expect(fileInfo.ext).toBe('jpeg');
		expect(fileInfo.filename).toBe('image-jpeg');
		expect(fileInfo.path).toBe(filepath);
		expect(fileInfo.size).toBe(1);
		expect(fileInfo.buffer).toBeTruthy();
	});
	it('should return null if file does not exist', () => {
		const filepath = path.join(__dirname, '123321.jpegqwerty');
		const fileInfo = getFileInfo(filepath);
		expect(fileInfo).toBeNull();
	});
});
describe('getImageInfo', () => {
	it('should return image info', async () => {
		const filepath = path.join(__dirname, '..', 'assets', 'image-jpeg.jpeg');
		const imageInfo = await getImageInfo(filepath);
		expect(imageInfo.width).toBe(150);
		expect(imageInfo.height).toBe(150);
	});
	it('should return null if image does not exist', async () => {
		const filepath = path.join(__dirname, '123321.jpegqwerty');
		const imageInfo = await getImageInfo(filepath);
		expect(imageInfo).toBeNull();
	});
});
