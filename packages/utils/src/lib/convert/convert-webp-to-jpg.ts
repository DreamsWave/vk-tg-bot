import webp from 'webp-converter';
import path from 'path';
import os from 'os';
import { FileInfo } from '@yc-bot/types';
import { getFileInfo } from '../file-info';

const convertWebpToJpg = async (filepath: string, destination = os.tmpdir(), filename: string): Promise<FileInfo> => {
	if (path.extname(path.basename(filepath)) !== '.webp') {
		return getFileInfo(filepath);
	}
	const newFilepath = path.join(destination, `c-${filename}.jpeg`);
	await webp.dwebp(filepath, newFilepath, '-o');
	const fileInfo = getFileInfo(newFilepath);
	return fileInfo;
};

export default convertWebpToJpg;
