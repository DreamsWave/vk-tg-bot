// import fetch from 'node-fetch';
import { VideoInfo } from '@yc-bot/types';
import os from 'os';
import { getFileInfo } from '../file-info';
import youtubeDlExec from 'youtube-dl-exec';
import { convertVideoToMP4 } from '../convert';
import path from 'path';
import ytdl from 'ytdl-core';
import fs from 'fs';
import { downloadImage } from '../download';

const downloadVideo = async (url: string, destination = os.tmpdir(), filename: string): Promise<VideoInfo> => {
	// Получаем информацию о файле
	const fileData = await youtubeDlExec(url, {
		dumpJson: true,
		format: '(mp4)[height<=720][width<=720]'
	});

	// Если видеофайл, то скачиваем как видео
	if (fileData?.ext === 'mp4' || fileData?.ext === 'webm') {
		let filePath = path.join(destination, `${filename}.${fileData.ext}`);
		// Если видео из ютуба, то скачиваем через 'ytdl-core'. Иначе скачиваем через 'youtube-dl-exec'
		if (fileData.extractor === 'youtube') {
			filePath = await downloadYoutubeVideo(fileData.webpage_url, destination, filename);
		} else {
			await youtubeDlExec(url, {
				output: filePath,
				format: `(mp4)[height<=${fileData.height}][width<=${fileData.width}]`
			});
			// Если видео из вк, то необходимо перекодировать видео
			if (fileData.extractor === 'vk') {
				filePath = await convertVideoToMP4(filePath);
			}
		}
		const videoInfo = getFileInfo(filePath) as VideoInfo;
		const thumbInfo = await downloadImage(fileData.thumbnail, destination, `${filename}-thumb`, { maxWidth: 320, maxHeight: 320, maxSize: 200 });
		videoInfo.thumb = thumbInfo;
		videoInfo.duration = fileData.duration;
		videoInfo.height = fileData.height;
		videoInfo.width = fileData.width;
		videoInfo.type = 'video';
		videoInfo.origin = url;
		return videoInfo;
	}
	return null;
};

export default downloadVideo;

export const downloadYoutubeVideo = (videoUrl: string, destination: string, filename: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const filePath = path.join(destination, `${filename}.mp4`);
		const fileStream = fs.createWriteStream(filePath);
		const video = ytdl(videoUrl);
		video.pipe(fileStream);
		video.on('error', (err) => {
			return reject(err);
		});
		// video.on('end', () => {
		// 	console.log('end');
		// 	return resolve(filePath);
		// });
		fileStream.on('finish', () => {
			return resolve(filePath);
		});
	});
};
