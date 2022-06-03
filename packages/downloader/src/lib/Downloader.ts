import { FileInfo, ImageInfo, ResizeOptions, VideoInfo } from '@yc-bot/types';
import { DownloaderHelper } from 'node-downloader-helper';
import os from 'os';
import path from 'path';
import mime from 'mime';
import { convertVideoToMP4, convertWebpToJpg, getFileInfo, getImageSizes, makeID, resizeImage, Temp } from '@yc-bot/utils';
import youtubeDlExec from 'youtube-dl-exec';
import ytdl from 'ytdl-core';
import fs from 'fs';

export interface DownloaderOptions {
	destination?: string;
}

export interface IDownloader {
	getFile(url: string, options?: { filename?: string; destination?: string }): Promise<FileInfo>;
	getVideo(url: string, options?: { filename?: string; destination?: string }): Promise<VideoInfo>;
	getImage(url: string, options?: { filename?: string; destination?: string; resizeOptions?: ResizeOptions }): Promise<ImageInfo>;
}

export default class Downloader {
	public static async getFile(url: string, options?: { filename?: string; destination?: string }): Promise<FileInfo> {
		const destination = options?.destination ?? Temp.getLocation();
		const filename = options?.filename ?? makeID();
		return new Promise((resolve, reject) => {
			const dl = new DownloaderHelper(url, destination, {
				fileName: (fileName, filePath, contentType) => `${filename}.${mime.getExtension(contentType)}`
			});
			dl.on('end', (stats) => {
				const fileInfo = getFileInfo(stats.filePath);
				return resolve({ ...fileInfo, origin: url } as FileInfo);
			});
			dl.on('error', (err) => {
				return reject(err);
			});
			dl.start().catch((err) => {
				return reject(err);
			});
		});
	}

	public static async getVideo(url: string, options?: { filename?: string; destination?: string }): Promise<VideoInfo> {
		const destination = options?.destination ?? Temp.getLocation();
		const filename = options?.filename ?? makeID();
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
				await new Promise((resolve, reject) => {
					const fileStream = fs.createWriteStream(filePath);
					const video = ytdl(fileData.webpage_url);
					video.pipe(fileStream);
					video.on('error', (err) => {
						return reject(err);
					});
					fileStream.on('finish', () => {
						return resolve(filePath);
					});
				});
			} else {
				// Либо скачиваем через youtube-dl
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
			const thumbInfo = await Downloader.getImage(fileData.thumbnail, {
				filename: `${filename}-thumb`,
				resizeOptions: {
					maxWidth: 320,
					maxHeight: 320,
					maxSize: 200
				}
			});
			videoInfo.thumb = thumbInfo;
			videoInfo.duration = fileData.duration;
			videoInfo.height = fileData.height;
			videoInfo.width = fileData.width;
			videoInfo.type = 'video';
			videoInfo.origin = url;
			return videoInfo;
		}
		return null;
	}

	public static async getImage(
		url: string,
		options?: {
			filename?: string;
			destination?: string;
			resizeOptions?: ResizeOptions;
		}
	): Promise<ImageInfo> {
		const destination = options?.destination ?? Temp.getLocation();
		const filename = options?.filename ?? makeID();
		let fileInfo = await Downloader.getFile(url, { filename });
		// Если изображение webp, то конвертируем в jpeg
		if (path.extname(path.basename(fileInfo.path)) === '.webp') {
			fileInfo = await convertWebpToJpg(fileInfo.path, destination, fileInfo.filename);
		}

		if (options?.resizeOptions) {
			// Изменяем размер изображения
			const resizedImageInfo = await resizeImage(fileInfo.path, destination, options?.resizeOptions);
			if (resizedImageInfo) {
				return { ...resizedImageInfo, origin: url } as ImageInfo;
			} else {
				return null;
			}
		}
		const imageInfo = { ...fileInfo, ...(await getImageSizes(fileInfo.path)), type: 'photo', origin: url } as ImageInfo;
		return imageInfo;
	}
}
