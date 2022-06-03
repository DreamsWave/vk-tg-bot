import os from 'os';
import { ImageInfo, Photo, Video, Document, Files } from '@yc-bot/types';
import { getLargeSizeUrl, makeID } from './common';
import { Downloader } from '@yc-bot/downloader';

const getMediaFilesFromAttachments = async (attachments): Promise<Files> => {
	const mediaFiles = [];
	for (const attachment of attachments) {
		// photo
		if (attachment.type === 'photo') {
			const photo = attachment.photo as Photo;
			// Получаем ссылку на максимальный размер изображения
			const photoUrl = getLargeSizeUrl(photo.sizes);
			try {
				const filename = String(photo.id) ?? makeID();
				let imageInfo = null as ImageInfo;
				// Скачиваем изображение на сервер
				imageInfo = await Downloader.getImage(photoUrl, { filename, resizeOptions: { maxHeight: 10000, maxWidth: 10000, maxSize: 10240 } });
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
			const videoUrl = `https://vk.com/video${video.owner_id}_${video.id}`;
			try {
				const filename = String(video.id) ?? makeID();
				let videoInfo = null;
				videoInfo = await Downloader.getVideo(videoUrl, { filename });
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
				const filename = doc.title.split('.')[0] ?? makeID();
				let fileInfo = null;
				fileInfo = await Downloader.getFile(doc.url, { filename });
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
