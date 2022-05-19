import path from 'path';
import { convertWebpToJpg, prepareTemp } from '..';

describe('convertWebpToJpg', () => {
	const downloadLocation = path.join(path.resolve(), 'tmp', 'convertWebpToJpg');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(30000);
	it('should convert webp to jpg', async () => {
		const webpImagePath = path.join(__dirname, '..', 'assets', 'image-webp.webp');
		const imageInfo = await convertWebpToJpg(webpImagePath, downloadLocation);
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe('c-image-webp');
	});
	it('should return passed image if image is not webp', async () => {
		const someImagePath = path.join(__dirname, '..', 'assets', 'image-jpeg.jpeg');
		const imageInfo = await convertWebpToJpg(someImagePath, downloadLocation);
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe('image-jpeg.jpeg');
	});
});
