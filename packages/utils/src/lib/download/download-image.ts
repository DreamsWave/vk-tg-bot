import { ImageInfo } from '@yc-bot/types';
import path from 'path';
import convertWebpToJpg from '../convert/convert-webp-to-jpg';
import { downloadFile } from '../download';
import { resizeImage, ResizeOptions } from '../resize-image';
import { getImageSizes } from '../get-image-sizes';

const downloadImage = async (url: string, destination: string, filename: string, resizeOptions?: ResizeOptions): Promise<ImageInfo> => {
	let fileInfo = await downloadFile(url, destination, filename);
	// Если изображение webp, то конвертируем в jpeg
	if (path.extname(path.basename(fileInfo.path)) === '.webp') {
		fileInfo = await convertWebpToJpg(fileInfo.path, destination, filename);
	}

	if (resizeOptions) {
		// Изменяем размер изображения
		const resizedImageInfo = await resizeImage(fileInfo.path, destination, resizeOptions);
		if (resizedImageInfo) {
			return { ...resizedImageInfo, origin: url } as ImageInfo;
		} else {
			return null;
		}
	}
	const imageInfo = { ...fileInfo, ...(await getImageSizes(fileInfo.path)), type: 'photo', origin: url } as ImageInfo;
	return imageInfo;
};

export default downloadImage;
