// import fetch from 'node-fetch';
import { FileInfo } from '@yc-bot/types';
import { DownloaderHelper } from 'node-downloader-helper';
import mime from 'mime';
import { getFileInfo } from '../file-info';

export const downloadFile = async (url: string, destination: string, filename: string): Promise<FileInfo> => {
	return new Promise((resolve, reject) => {
		const dl = new DownloaderHelper(url, destination, {
			fileName: (fileName, filePath, contentType) => `${filename}.${mime.getExtension(contentType)}`
		});
		dl.on('end', (stats) => {
			const fileInfo = getFileInfo(stats.filePath);
			return resolve(fileInfo);
		});
		dl.on('error', (err) => {
			return reject(err);
		});
		dl.start().catch((err) => {
			return reject(err);
		});
	});
};
