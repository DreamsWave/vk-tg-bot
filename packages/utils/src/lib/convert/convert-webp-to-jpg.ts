import webp from 'webp-converter';
import path from 'path';
import os from 'os';
import { ImageInfo } from '@yc-bot/types';
import { getImageInfo } from '../file-info';

export const convertWebpToJpg = async (filepath: string, destination = os.tmpdir(), filename: string): Promise<ImageInfo> => {
	if (!isWebp(filepath)) {
		return await getImageInfo(filepath);
	}
	const newFilepath = path.join(destination, `c-${filename}.jpeg`);
	await webp.dwebp(filepath, newFilepath, '-o');
	const imageInfo = getImageInfo(newFilepath);
	// if (fileInfo.size > 10240) throw new Error('File is bigger than 10MB');
	return imageInfo;
};

export const isWebp = (location: string): boolean => {
	return path.extname(path.basename(location)) === '.webp';
};
