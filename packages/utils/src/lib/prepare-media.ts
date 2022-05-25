import { DocumentAttachment, PhotoAttachment, VideoAttachment } from 'vk-io';
import os from 'os';
import { downloadFile, downloadImage, downloadVideo } from './download';
import { convertWebpToJpg, isWebp } from './convert/convert-webp-to-jpg';
import { makeID } from './common';
import { ImageInfo, MediaType } from '@yc-bot/types';
import { InputMedia, InputMediaPhoto, InputMediaVideo, InputMediaDocument } from '@yc-bot/types';
export interface IPrepareMediaOptions {
	destination?: string;
	randomFilenames?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareMediaForTG = async (attachments: any[], options?: IPrepareMediaOptions): Promise<InputMedia[]> => {
	const destination = options?.destination ?? os.tmpdir();
	const randomFilenames = options?.randomFilenames;
	let mediaArray = [] as InputMedia[];

	for (const attachment of attachments) {
		const media = {} as MediaType;
		if (attachment.type === 'photo') {
			const photo = new PhotoAttachment({ api: null, payload: attachment.photo });
			const photoUrl = photo.largeSizeUrl;
			try {
				const filename = randomFilenames ? makeID() : String(photo.id);
				let imageInfo = null as ImageInfo;
				imageInfo = await downloadImage(photoUrl, destination, filename, { maxHeight: 10000, maxWidth: 10000, maxSize: 10240 });
				if (!imageInfo) continue;
				if (isWebp(imageInfo.path)) {
					imageInfo = await convertWebpToJpg(imageInfo.path, destination, filename);
				}
				const media = {
					type: 'photo',
					media: imageInfo.buffer
				} as InputMediaPhoto;
				mediaArray.push(media);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${photoUrl}`;
				}
				throw error;
			}
		}
		if (attachment.type === 'video') {
			const video = new VideoAttachment({ api: null, payload: attachment.video });
			const videoUrl = `https://m.vk.com/video${video.ownerId}_${video.id}`;
			try {
				const filename = randomFilenames ? makeID() : String(video.id);
				let videoInfo = null;
				videoInfo = await downloadVideo(videoUrl, destination, filename);
				if (!videoInfo) continue;
				const media = {
					type: 'video',
					media: videoInfo.buffer,
					duration: videoInfo.duration,
					height: videoInfo.height,
					width: videoInfo.width,
					supports_streaming: true
					// thumb: videoInfo.thumb.buffer
				} as InputMediaVideo;
				mediaArray.push(media);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${videoUrl}`;
				}
				throw error;
			}
		}
		if (attachment.type === 'doc') {
			const doc = new DocumentAttachment({ api: null, payload: attachment.doc });
			try {
				const filename = randomFilenames ? makeID() : doc.title.split('.')[0];
				let fileInfo = null;
				fileInfo = await downloadFile(doc.url, destination, filename);
				if (!fileInfo) continue;
				const media = {
					type: 'document',
					media: fileInfo.buffer
				} as InputMediaDocument;
				mediaArray.push(media);
			} catch (error) {
				if (error.stderr) {
					error.stderr += ` ${doc.url}`;
				}
				throw error;
			}
		}
	}
	mediaArray = mediaArray.filter((media) => media.media);

	return mediaArray;
};
