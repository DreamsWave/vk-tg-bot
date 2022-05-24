import path from 'path';
import fs from 'fs';
import { FileInfo, ImageInfo } from '@yc-bot/types';
import mime from 'mime';
import Jimp from 'jimp';

export const getFileInfo = (filepath: string): FileInfo => {
	if (!fs.existsSync(filepath)) return null;
	const [filename, ext] = path.basename(filepath).split('.');
	const fileSize = fs.statSync(filepath).size;
	const size = Math.ceil(fileSize / 1000); // kb
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

export const getImageInfo = async (filepath: string): Promise<ImageInfo> => {
	if (!fs.existsSync(filepath)) return null;
	const imageInfo = getFileInfo(filepath) as ImageInfo;
	const imageJIMP = await Jimp.read(filepath);
	imageInfo.width = imageJIMP.bitmap.width;
	imageInfo.height = imageJIMP.bitmap.height;
	return imageInfo;
};
