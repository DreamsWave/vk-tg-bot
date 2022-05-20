import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

export const downloadYoutubeVideo = (videoUrl: string, saveTo: string, filename: string | number): Promise<string> => {
	return new Promise((resolve, reject) => {
		const filePath = path.join(saveTo, `${filename}.mp4`);
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
