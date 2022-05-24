import { ImageInfo } from '@yc-bot/types';
import jimp from 'jimp';
import path from 'path';
import { calculateImageDimensions } from './common';
import { getImageInfo } from './file-info';

export type ResizeOptions = {
	maxWidth?: number;
	maxHeight?: number;
	maxSize?: number;
	quality?: number;
};

export const resizeImage = async (
	filepath: string,
	destination: string,
	{ maxHeight = 10000, maxWidth = 10000, quality = 70, maxSize = 10240 }: ResizeOptions
): Promise<ImageInfo> => {
	const imageJIMP = await jimp.read(filepath);
	// Получаем размер превью на основе пропорций и максимальной ширины и высоты
	const { width, height } = calculateImageDimensions(imageJIMP.bitmap.width, imageJIMP.bitmap.height, maxWidth, maxHeight);
	const [filename, ext] = path.basename(filepath).split('.');
	const newImagePath = path.join(destination, `${filename}-${quality}.${ext}`);
	// Изменяем размер превью и сохраняем в файл виде "imagename-60.jpeg"
	await imageJIMP.resize(width, height).quality(quality).writeAsync(newImagePath);
	const imageInfo = await getImageInfo(newImagePath);
	// Если размер(в Кбайт) больше максимального,
	// то снижаем качество сжатия на 10%, пока не подойдет(минимум 30%),
	// либо возвращаем null
	if (imageInfo.size >= maxSize) {
		if (quality - 20 >= 30) {
			return resizeImage(filepath, destination, { maxHeight, maxWidth, maxSize, quality: quality - 20 });
		} else {
			return null;
		}
	}
	return imageInfo;
};
