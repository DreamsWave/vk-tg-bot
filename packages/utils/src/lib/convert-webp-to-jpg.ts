import webp from 'webp-converter';
import path from 'path';
import os from 'os';
import { FileInfo } from '@yc-bot/types';
import { getFileInfo } from './get-file-info';

export const convertWebpToJpg = async ({
	filepath,
	saveTo = os.tmpdir(),
	filename
}: {
	filepath: string;
	saveTo: string;
	filename: string | number;
}): Promise<FileInfo> => {
	if (!isWebp(filepath)) {
		return getFileInfo(filepath);
	}
	const newFilepath = path.join(saveTo, `c-${filename}.jpeg`);
	await webp.dwebp(filepath, newFilepath, '-o');
	const fileInfo = getFileInfo(newFilepath);
	// if (fileInfo.size > 10240) throw new Error('File is bigger than 10MB');
	return fileInfo;
};

export const isWebp = (location: string): boolean => {
	return path.extname(path.basename(location)) === '.webp';
};
