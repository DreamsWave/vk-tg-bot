import os from 'os';
import { FileInfo, ImageInfo, Photo, Video, Document, VideoInfo, Files } from '@yc-bot/types';
import { getLargeSizeUrl, makeID } from './common';
import { convertWebpToJpg } from './convert';
import { downloadFile, downloadImage, downloadVideo } from './download';

const getMediaFilesFromAttachments = async (
	attachments,
	{ destination = os.tmpdir(), randomFilenames = false }: { destination?: string; randomFilenames?: boolean }
): Promise<Files> => {
	const mediaFiles = [];
	for (const attachment of attachments) {
		// photo
		if (attachment.type === 'photo') {
			const photo = attachment.photo as Photo;
			// Получаем ссылку на максимальный размер изображения
			const photoUrl = getLargeSizeUrl(photo.sizes);
			try {
				const filename = randomFilenames ? makeID() : String(photo.id);
				let imageInfo = null as ImageInfo;
				// Скачиваем изображение на сервер
				imageInfo = await downloadImage(photoUrl, destination, filename, { maxHeight: 10000, maxWidth: 10000, maxSize: 10240 });
				if (!imageInfo) continue;
				mediaFiles.push(imageInfo);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${photoUrl}`;
				}
			}
		}
		if (attachment.type === 'video') {
			const video = attachment.video as Video;
			const videoUrl = `https://m.vk.com/video${video.owner_id}_${video.id}`;
			try {
				const filename = randomFilenames ? makeID() : String(video.id);
				let videoInfo = null;
				videoInfo = await downloadVideo(videoUrl, destination, filename);
				if (!videoInfo) continue;
				mediaFiles.push(videoInfo);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${videoUrl}`;
				}
			}
		}
		if (attachment.type === 'doc') {
			const doc = attachment.doc as Document;
			try {
				const filename = randomFilenames ? makeID() : doc.title.split('.')[0];
				let fileInfo = null;
				fileInfo = await downloadFile(doc.url, destination, filename);
				if (!fileInfo) continue;
				fileInfo.type = 'document';
				mediaFiles.push(fileInfo);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${doc.url}`;
				}
			}
		}
	}
	return mediaFiles;
};

export default getMediaFilesFromAttachments;
