import path from 'path';
import fs from 'fs';
import { FileInfo } from '@yc-bot/types';
import mime from 'mime';

export const getFileInfo = (filepath: string): FileInfo => {
	if (!fs.existsSync(filepath)) return null;
	const [filename, ext] = path.basename(filepath).split('.');
	const size = Math.round(fs.statSync(filepath).size / 1024); // kb
	const fileInfo: FileInfo = {
		ext,
		filename,
		mime: mime.getType(ext),
		path: filepath,
		size,
		buffer: fs.createReadStream(filepath)
	};
	return fileInfo;
};
