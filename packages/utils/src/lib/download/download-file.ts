import { FileInfo } from '@yc-bot/types';
import { DownloaderHelper } from 'node-downloader-helper';
import { getFileInfo } from '../get-file-info';

export const downloadFile = async (fileUrl: string, saveTo: string, filename: string | number): Promise<FileInfo> => {
	return new Promise((resolve, reject) => {
		const dl = new DownloaderHelper(fileUrl, saveTo, { fileName: { name: String(filename) } });
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
// export const downloadFile = async (fileUrl: string, saveTo: string, filename: string | number): Promise<FileInfo> => {
// 	return new Promise((resolve, reject) => {
// 		const request = https.get(fileUrl, async (resp) => {
// 			if (resp.headers.location && resp.statusCode === 302) {
// 				resolve(await downloadFile(resp.headers.location, saveTo, String(filename)));
// 			}
// 			if (resp.statusCode === 200) {
// 				const size = Math.ceil(parseInt(resp.headers['content-length'], 10) / 1024); // kb
// 				const mime = resp.headers['content-type'];
// 				const ext = extension(mime);
// 				const filePath = path.join(saveTo, `${filename}.${ext}`);

// 				if (size > 51200)
// 					reject(`File is bigger than 50MB. Current size is ${Math.round(size / 1024)}MB.
// 					${fileUrl}`);

// 				const fileStream = fs.createWriteStream(filePath);
// 				resp.pipe(fileStream);

// 				fileStream.on('finish', () => {
// 					fileStream.close();
// 					const fileInfo = getFileInfo(filePath);
// 					resolve(fileInfo);
// 				});
// 				request.on('error', (err) => {
// 					reject(err);
// 				});
// 				fileStream.on('error', (err) => {
// 					reject(err);
// 				});
// 				request.end();
// 			} else {
// 				reject('Unknown error in file downloading');
// 			}
// 		});
// 	});
// };
