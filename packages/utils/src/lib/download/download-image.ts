import { ImageInfo } from '@yc-bot/types';
import { convertWebpToJpg, isWebp } from '../convert/convert-webp-to-jpg';
import { downloadFile } from './download-file';
import { getImageInfo } from '../file-info';
import { resizeImage, ResizeOptions } from '../resize-image';

// export interface Thumb {
// 	height: number;
// 	width: number;
// 	resolution: string;
// 	url: string;
// 	id: string;
// }

export const downloadImage = async (url: string, destination: string, filename: string, resizeOptions?: ResizeOptions): Promise<ImageInfo> => {
	// Скачиваем превью
	const fileInfo = await downloadFile(url, destination, filename);
	let imageInfo = await getImageInfo(fileInfo.path);
	// Если превью webp, то конвертируем в jpeg
	if (isWebp(imageInfo.path)) {
		imageInfo = await convertWebpToJpg(imageInfo.path, destination, filename);
	}

	if (resizeOptions !== undefined) {
		// Изменяем размер превью
		const resizedImageInfo = await resizeImage(imageInfo.path, destination, resizeOptions);
		if (resizedImageInfo) {
			return resizedImageInfo;
		} else {
			return null;
		}
	}
	return imageInfo;
};
