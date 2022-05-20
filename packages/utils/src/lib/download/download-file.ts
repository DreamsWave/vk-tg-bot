// import fetch from 'node-fetch';
import { FileInfo } from '@yc-bot/types';
import { DownloaderHelper } from 'node-downloader-helper';
import mime from 'mime';
import { getFileInfo } from '../get-file-info';
import youtubeDlExec from 'youtube-dl-exec';
import { convertVideoToMP4 } from '../convert';
import { downloadYoutubeVideo } from './download-youtube-video';
import path from 'path';

export const downloadFile = async (fileUrl: string, saveTo: string, filename: string | number): Promise<FileInfo> => {
	// Получаем информацию о файле
	let fileData = null;
	fileData = await youtubeDlExec(fileUrl, {
		dumpJson: true
	});

	// Если видеофайл, то скачиваем как видео
	if (fileData?.ext === 'mp4' || fileData?.ext === 'webm') {
		// Получаем информацию о видео с нужными размерами
		const videoInfo = await youtubeDlExec(fileUrl, {
			dumpJson: true,
			format: '(mp4)[height<=720][width<=720]'
		});
		let filePath = path.join(saveTo, `${filename}.mp4`);
		// Если видео из ютуба, то скачиваем через 'ytdl-core'. Иначе скачиваем через 'youtube-dl-exec'
		if (fileData.extractor === 'youtube') {
			filePath = await downloadYoutubeVideo(fileData.webpage_url, saveTo, filename);
		} else {
			await youtubeDlExec(fileUrl, {
				output: filePath,
				format: `(mp4)[height<=${videoInfo.height}][width<=${videoInfo.width}]`
			});
			// Если видео из вк, то необходимо перекодировать видео
			if (fileData.extractor === 'vk') {
				filePath = await convertVideoToMP4(filePath);
			}
		}
		const fileInfo = getFileInfo(filePath);
		fileInfo.duration = videoInfo.duration;
		fileInfo.height = videoInfo.height;
		fileInfo.width = videoInfo.width;
		return fileInfo;
	}
	// Или скачиваем как обычный файл
	return new Promise((resolve, reject) => {
		const dl = new DownloaderHelper(fileUrl, saveTo, {
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
