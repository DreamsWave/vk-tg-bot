import fs from 'fs';
import Jimp from 'jimp';

export type ImageSizes = {
	height: number;
	width: number;
};

const getImageSizes = async (filepath: string): Promise<ImageSizes> => {
	if (!fs.existsSync(filepath)) return null;
	try {
		const imageJIMP = await Jimp.read(filepath);
		const imageSizes = { height: imageJIMP.bitmap.height, width: imageJIMP.bitmap.width } as ImageSizes;
		return imageSizes;
	} catch (error) {
		return null;
	}
};

export default getImageSizes;
