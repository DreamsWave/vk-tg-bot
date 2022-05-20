import { FileInfo } from '@yc-bot/types';
import path from 'path';
import jimp from 'jimp';
import { convertWebpToJpg, isWebp } from '../convert/convert-webp-to-jpg';
import { downloadFile } from './download-file';
import { calculateImageDimensions } from '../common';
import { getFileInfo } from '../get-file-info';

// export interface Thumb {
// 	height: number;
// 	width: number;
// 	resolution: string;
// 	url: string;
// 	id: string;
// }

interface DownloadThumbOptions {
	url: string;
	saveTo: string;
	filename: string | number;
	maxWidth?: number;
	maxHeight?: number;
	maxSize?: number;
	quality?: number;
}

export const downloadThumb = async ({
	url,
	saveTo,
	filename,
	maxWidth = 320,
	maxHeight = 320,
	maxSize = 200,
	quality = 70
}: DownloadThumbOptions): Promise<FileInfo> => {
	// Скачиваем превью
	let originalThumbInfo = await downloadFile(url, saveTo, `${filename}_thumb`);

	// Если превью webp, то конвертируем в jpeg
	if (isWebp(originalThumbInfo.path)) {
		originalThumbInfo = await convertWebpToJpg({ filepath: originalThumbInfo.path, saveTo, filename });
	}

	// Изменяем размер превью
	const resizedThumbInfo = await resizeThumb({ filepath: originalThumbInfo.path, saveTo, maxHeight, maxWidth, quality, maxSize });

	if (resizedThumbInfo) {
		return resizedThumbInfo;
	} else {
		return null;
	}
};

export const resizeThumb = async ({ filepath, saveTo, maxHeight, maxWidth, quality, maxSize }): Promise<FileInfo> => {
	const thumb = await jimp.read(filepath);
	// Получаем размер превью на основе пропорций и максимальной ширины и высоты
	const { width, height } = calculateImageDimensions(thumb.bitmap.width, thumb.bitmap.height, maxWidth, maxHeight);
	const [filename, ext] = path.basename(filepath).split('.');
	const newThumbPath = path.join(saveTo, `${filename}-${quality}.${ext}`);
	// Изменяем размер превью и сохраняем в файл виде "imagename_thumb-60.jpeg"
	await thumb.resize(width, height).quality(quality).writeAsync(newThumbPath);
	const thumbInfo = getFileInfo(newThumbPath);
	// Если размер(в Кбайт) больше максимального,
	// то снижаем качество сжатия на 10%, пока не подойдет(минимум 30%),
	// либо возвращаем null
	if (thumbInfo.size >= maxSize) {
		if (quality - 20 >= 30) {
			return resizeThumb({ filepath, saveTo, maxHeight, maxWidth, maxSize, quality: quality - 20 });
		} else {
			return null;
		}
	}
	thumbInfo.height = height;
	thumbInfo.width = width;
	return thumbInfo;
};
