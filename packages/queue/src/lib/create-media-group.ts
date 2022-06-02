import { FileType, ImageInfo, VideoInfo } from '@yc-bot/types';
import { InputMedia, InputMediaPhoto, InputMediaVideo } from 'node-telegram-bot-api';

const createMediaGroup = (media: FileType[]): InputMedia[] => {
	const mediaGroup = [] as InputMedia[];
	media.forEach((file) => {
		if (file.type === 'photo') {
			const { path } = file as ImageInfo;
			const mediaEl = {
				type: 'photo',
				media: path
			} as InputMediaPhoto;
			mediaGroup.push(mediaEl);
		} else if (file.type === 'video') {
			const { duration, width, height, path } = file as VideoInfo;
			const mediaEl = {
				type: 'video',
				media: path,
				supports_streaming: true,
				duration,
				width,
				height
			} as InputMediaVideo;
			mediaGroup.push(mediaEl);
		}
	});
	return mediaGroup;
};

export default createMediaGroup;
