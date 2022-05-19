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
import { convertWebpToJpg, isWebp } from './convert-webp-to-jpg';
promisify(child_process.exec);
const exec = child_process.exec;

export const downloadFile = async (fileUrl: string, saveTo: string, filename: string | number): Promise<FileInfo> => {
	return new Promise((resolve, reject) => {
		const request = https.get(fileUrl, async (resp) => {
			if (resp.headers.location && resp.statusCode === 302) {
				resolve(await downloadFile(resp.headers.location, saveTo, String(filename)));
			}
			if (resp.statusCode === 200) {
				const size = Math.ceil(parseInt(resp.headers['content-length'], 10) / 1024); // kb
				const mime = resp.headers['content-type'];
				const ext = extension(mime);
				const filePath = path.join(saveTo, `${filename}.${ext}`);

				if (size > 51200)
					reject(`File is bigger than 50MB. Current size is ${Math.round(size / 1024)}MB. 
					${fileUrl}`);

				const fileStream = fs.createWriteStream(filePath);
				resp.pipe(fileStream);

				const fileInfo: FileInfo = {
					mime,
					size,
					path: filePath,
					filename,
					ext,
					buffer: ''
				};
				fileStream.on('finish', () => {
					fileStream.close();
					fileInfo.buffer = fs.createReadStream(filePath);
					resolve(fileInfo);
				});
				request.on('error', (err) => {
					reject(err);
				});
				fileStream.on('error', (err) => {
					reject(err);
				});
				request.end();
			} else {
				reject('Unknown error in file downloading');
			}
		});
	});
};

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

export interface Thumb {
	height: number;
	width: number;
	resolution: string;
	url: string;
	id: string;
}

export const downloadThumb = async (thumbUrl: string, saveTo: string, filename: string): Promise<FileInfo> => {
	let thumbInfo = await downloadFile(thumbUrl, saveTo, `${filename}_thumb`);
	if (isWebp(thumbInfo.path)) {
		thumbInfo = await convertWebpToJpg(thumbInfo.path);
	}
	const thumb = await jimp.read(thumbInfo.path);
	const { width, height } = calculateImageDimensions(thumb.bitmap.width, thumb.bitmap.height, 300, 300);
	await thumb.resize(width, height).quality(60).writeAsync(thumbInfo.path);
	const size = Math.round(fs.statSync(thumbInfo.path).size / 1024);
	if (size > 200) return null;
	thumbInfo.height = height;
	thumbInfo.width = width;
	thumbInfo.size = size;
	thumbInfo.buffer = fs.createReadStream(thumbInfo.path);
	return thumbInfo;
};

function calculateImageDimensions(width: number, height: number, maxWidth: number, maxHeight: number): { width: number; height: number } {
	if (width > height) {
		if (width > maxWidth) {
			height = Math.round((height *= maxWidth / width));
			width = maxWidth;
		}
	} else {
		if (height > maxHeight) {
			width = Math.round((width *= maxHeight / height));
			height = maxHeight;
		}
	}
	return { width, height };
}

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
