import path from 'path';
import { DocumentAttachment, PhotoAttachment, VideoAttachment } from 'vk-io';
import os from 'os';
import { downloadVideo, downloadFile } from './download';
import { convertWebpToJpg, isWebp } from './convertWebpToJpg';
import { makeID } from './helpers';
import { Stream } from 'stream';

const tmpDir = path.join(os.tmpdir());

export type MediaType = {
	type: 'photo' | 'video' | 'document';
	media: string | Stream | Buffer;
	ext: string;
};

export interface IPrepareMediaOptions {
	saveTo?: string;
	randomFilenames?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareMedia = async (attachments: any[], options?: IPrepareMediaOptions): Promise<MediaType[]> => {
	const { saveTo = tmpDir, randomFilenames = false } = options;
	const mediaArray = [] as MediaType[];
	for (const attachment of attachments) {
		const media = {} as MediaType;
		if (attachment.type === 'photo') {
			const photo = new PhotoAttachment({ api: null, payload: attachment.photo });
			const photoUrl = photo.largeSizeUrl;
			const filename = randomFilenames ? makeID() : photo.id;

			let imageInfo = await downloadFile(photoUrl, saveTo, filename);
			if (!imageInfo) continue;
			if (isWebp(imageInfo.path)) {
				imageInfo = await convertWebpToJpg(imageInfo.path);
			}
			media.type = 'photo';
			media.media = imageInfo.buffer;
			media.ext = imageInfo.ext;
		}
		if (attachment.type === 'video') {
			const video = new VideoAttachment({ api: null, payload: attachment.video });
			const videoUrl = `https://vk.com/video-${Math.abs(video.ownerId)}_${Math.abs(video.id)}`;
			const filename = randomFilenames ? makeID() : video.id;
			const videoInfo = await downloadVideo(videoUrl, saveTo, filename);
			if (!videoInfo) continue;
			media.type = 'video';
			media.media = videoInfo.buffer;
			media.ext = videoInfo.ext;
		}
		if (attachment.type === 'doc') {
			const doc = new DocumentAttachment({ api: null, payload: attachment.doc });
			const filename = randomFilenames ? makeID() : doc.title.split('.')[0];
			const fileInfo = await downloadFile(doc.url, saveTo, filename);
			if (!fileInfo) continue;
			media.type = 'document';
			media.media = fileInfo.buffer;
			media.ext = fileInfo.ext;
		}
		mediaArray.push(media);
	}
	return mediaArray;
};