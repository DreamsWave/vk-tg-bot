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
	let fileInfo = await downloadFile(url, destination, filename);

	// Если превью webp, то конвертируем в jpeg
	if (isWebp(fileInfo.path)) {
		fileInfo = await convertWebpToJpg({ filepath: fileInfo.path, destination, filename });
	}

	if (resizeOptions !== undefined) {
		// Изменяем размер превью
		const resizedImageInfo = await resizeImage(fileInfo.path, destination, resizeOptions);
		if (resizedImageInfo) {
			return resizedImageInfo;
		} else {
			return null;
		}
	}
	return await getImageInfo(fileInfo.path);
};
