import { ImageInfo, Photo, Video, Document, Files } from '@yc-bot/types';
import { getLargeSizeUrl } from './common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
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
				// const filename = String(photo.id);
				let imageInfo = null as ImageInfo;
				// Скачиваем изображение на сервер
				imageInfo = await Downloader.getImage(photoUrl, { resizeOptions: { maxHeight: 10000, maxWidth: 10000, maxSize: 10240 } });
				if (!imageInfo) continue;
				// Skip photo if file size is greater than 10MB
				if (imageInfo.size >= 10240) continue;
				mediaFiles.push(imageInfo);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${photoUrl}`;
				}
				console.log(JSON.stringify(error));
			}
		}
		if (attachment.type === 'video') {
			const video = attachment.video as Video;
			// Skip video if longer than 15 minutes
			if (video.duration > 900) continue;
			const videoUrl = `https://vk.com/video${video.owner_id}_${video.id}`;
			try {
				// const filename = String(video.id);
				let videoInfo = null;
				videoInfo = await Downloader.getVideo(videoUrl);
				if (!videoInfo) continue;
				// Skip video if file size is greater than 50MB
				if (videoInfo.size >= 51200) continue;
				mediaFiles.push(videoInfo);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${videoUrl}`;
				}
				console.log(JSON.stringify(error));
			}
		}
		if (attachment.type === 'doc') {
			const doc = attachment.doc as Document;
			try {
				// const filename = doc.title?.split('.')[0] ?? '';
				let fileInfo = null;
				fileInfo = await Downloader.getFile(doc.url);
				if (!fileInfo) continue;
				// Skip photo if file size is greater than 50MB
				if (fileInfo.size >= 51200) continue;
				fileInfo.type = 'document';
				mediaFiles.push(fileInfo);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${doc.url}`;
				}
				console.log(JSON.stringify(error));
			}
		}
	}
	return mediaFiles;
};

export default getMediaFilesFromAttachments;
