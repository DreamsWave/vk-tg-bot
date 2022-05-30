import path from 'path';
import fs from 'fs';
import { FileInfo } from '@yc-bot/types';
import mime from 'mime';

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
		type: 'document'
	};
	return fileInfo;
};

// export const getImageInfo = async (filepath: string): Promise<ImageInfo> => {
// 	if (!fs.existsSync(filepath)) return null;
// 	const imageInfo = getFileInfo(filepath) as ImageInfo;
// 	const imageJIMP = await Jimp.read(filepath);
// 	imageInfo.width = imageJIMP.bitmap.width;
// 	imageInfo.height = imageJIMP.bitmap.height;
// 	imageInfo.type = 'photo';
// 	return imageInfo;
// };

// export const getAudioInfo = async (filepath: string): Promise<AudioInfo> => {
// 	return {} as AudioInfo;
// };
