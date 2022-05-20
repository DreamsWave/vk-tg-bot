import path from 'path';
import { convertWebpToJpg, prepareTemp } from '..';

describe('convertWebpToJpg', () => {
	const downloadLocation = path.join(path.resolve(), 'tmp', 'convertWebpToJpg');
	beforeAll(() => {
		prepareTemp(downloadLocation);
	});
	jest.setTimeout(30000);
	it('should convert webp to jpg', async () => {
		const filename = 'image-webp';
		const webpImagePath = path.join(__dirname, '..', 'assets', `${filename}.webp`);
		const imageInfo = await convertWebpToJpg({ filepath: webpImagePath, saveTo: downloadLocation, filename });
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe(`c-${filename}`);
	});
	it('should return passed image if image is not webp', async () => {
		const filename = 'image-jpeg';
		const someImagePath = path.join(__dirname, '..', 'assets', `${filename}.jpeg`);
		const imageInfo = await convertWebpToJpg({ filepath: someImagePath, saveTo: downloadLocation, filename });
		expect(imageInfo.ext).toBe('jpeg');
		expect(imageInfo.filename).toBe(`${filename}`);
	});
});
