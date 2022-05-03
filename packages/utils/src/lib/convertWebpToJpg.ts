import webp from 'webp-converter';
import path from 'path';
import fs from 'fs';
import { logger } from '@yc-bot/shared';
import { FileInfo } from '@yc-bot/types';
import { promisify } from 'util';
const unlink = promisify(fs.unlink);

export const convertWebpToJpg = async (filePath: string): Promise<FileInfo> => {
	const fullFilename = path.basename(filePath);
	const fileExt = path.extname(fullFilename);
	const name = path.basename(filePath, fileExt);
	if (!isWebp(filePath)) {
		logger.warn(`convertWebpToJpg expected webp image but got: ${fileExt}`);
		return null;
	}
	const newfilePath = path.join(path.dirname(filePath), `${name}.jpeg`);
	await webp.dwebp(filePath, newfilePath, '-o');
	await unlink(filePath);
	const size = Math.round(fs.statSync(newfilePath).size / 1024); // kb
	if (size > 10240) throw new Error('File is bigger than 10MB');
	const [filename, ext] = path.basename(newfilePath).split('.');
	const fileInfo: FileInfo = {
		ext,
		filename,
		mime: 'image/jpeg',
		path: newfilePath,
		size,
		buffer: fs.createReadStream(newfilePath)
	};

	return fileInfo;
};

export const isWebp = (location: string): boolean => {
	return path.extname(path.basename(location)) === '.webp';
};
