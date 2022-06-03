import { ImageInfo, ResizeOptions } from '@yc-bot/types';
import jimp from 'jimp';
import path from 'path';
import { calculateImageDimensions } from './common';
import { getFileInfo } from './file-info';

const resizeImage = async (
	filepath: string,
	destination: string,
	{ maxHeight = 10000, maxWidth = 10000, quality = 70, maxSize = 10240 }: ResizeOptions
): Promise<ImageInfo> => {
	const imageJIMP = await jimp.read(filepath);
	// Получаем размер превью на основе пропорций и максимальной ширины и высоты
	const { width, height } = calculateImageDimensions(imageJIMP.bitmap.width, imageJIMP.bitmap.height, maxWidth, maxHeight);
	const [filename, ext] = path.basename(filepath).split('.');
	const newImagePath = path.join(destination, `${filename}-${quality}.${ext}`);
	try {
		// Изменяем размер превью и сохраняем в файл виде "imagename-60.jpeg"
		const resizedImage = await imageJIMP.resize(width, height).quality(quality).writeAsync(newImagePath);
		const fileInfo = getFileInfo(newImagePath);
		// Если размер(в Кбайт) больше максимального,
		// то снижаем качество сжатия на 10%, пока не подойдет(минимум 30%),
		// либо возвращаем null
		if (fileInfo.size >= maxSize) {
			if (quality - 20 >= 30) {
				return resizeImage(filepath, destination, { maxHeight, maxWidth, maxSize, quality: quality - 20 });
			} else {
				return null;
			}
		}
		return { ...fileInfo, width: resizedImage.bitmap.width, height: resizedImage.bitmap.height, type: 'photo' };
	} catch (error) {
		return null;
	}
};

export default resizeImage;
