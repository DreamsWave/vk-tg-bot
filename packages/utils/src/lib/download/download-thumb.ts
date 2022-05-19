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
import { convertWebpToJpg, isWebp } from '../convert-webp-to-jpg';
import { downloadFile } from './download-file';
import { calculateImageDimensions } from '../common';
promisify(child_process.exec);
const exec = child_process.exec;

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
