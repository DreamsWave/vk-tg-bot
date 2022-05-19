import https from 'https';
import fs from 'fs';
import youtubeDlExec from 'youtube-dl-exec';
import { FileInfo } from '@yc-bot/types';
import path from 'path';
import { extension } from 'mime-types';
import ytdl from 'ytdl-core';
import pathToFfmpeg from 'ffmpeg-static';
import child_process from 'child_process';
import { promisify } from 'util';
import jimp from 'jimp';
import { downloadThumb } from './download-thumb';
import { convertWebpToJpg, isWebp } from '../convert-webp-to-jpg';
promisify(child_process.exec);
const exec = child_process.exec;

export const downloadVideo = async (videoUrl: string, saveTo: string, filename: string | number): Promise<FileInfo | null> => {
	let filePath = path.join(saveTo, `${filename}.mp4`);
	let fileInfo: FileInfo = null;

	const result = await youtubeDlExec(videoUrl, {
		dumpJson: true,
		format: '(mp4)[height<=720][width<=720]'
	});

	if (result.duration > 600) {
		throw new Error(`Video is longer than 10 minutes. 
		${videoUrl}`);
	}

	if (result.extractor === 'youtube') {
		filePath = await downloadYoutubeVideo(result.webpage_url, saveTo, filename);
	} else {
		await youtubeDlExec(videoUrl, {
			output: filePath,
			format: `(mp4)[height<=${result.height}][width<=${result.width}]`
		});
		filePath = await convertVideoToMP4(filePath);
	}

	const size = Math.round(fs.statSync(filePath).size / 1024); // kb
	if (size > 51200) {
		throw new Error(`Video size is bigger than 50MB. Current size is ${Math.round(size / 1024)}MB. 
		${videoUrl}`);
	}
	const [name, ext] = path.basename(filePath).split('.');
	const thumbInfo = await downloadThumb(result.thumbnail, saveTo, name);
	fileInfo = {
		ext,
		filename: name,
		mime: '',
		path: filePath,
		size,
		buffer: fs.createReadStream(filePath),
		duration: result.duration,
		height: result.height,
		width: result.width,
		thumb: thumbInfo.buffer
	};
	return fileInfo;
};

export const downloadYoutubeVideo = (videoUrl: string, saveTo: string, filename: string | number): Promise<string> => {
	return new Promise((resolve, reject) => {
		const filePath = path.join(saveTo, `${filename}.mp4`);
		const fileStream = fs.createWriteStream(filePath);
		const video = ytdl(videoUrl);
		video.pipe(fileStream);
		video.on('error', (err) => reject(err));
		video.on('end', () => {
			resolve(filePath);
		});
	});
};

export const convertVideoToMP4 = async (fileLocation: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const convertedFileLocation = path.join(path.dirname(fileLocation), `c-${path.basename(fileLocation).split('.')[0]}.mp4`);
		exec(`"${pathToFfmpeg}" -i ${fileLocation} -codec:v libx264 -preset veryfast ${convertedFileLocation}`, (err) => {
			if (err) reject(err);
			resolve(convertedFileLocation);
		});
	});
};
