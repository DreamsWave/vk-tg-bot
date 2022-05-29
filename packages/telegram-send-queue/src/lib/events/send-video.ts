import { Files, Post, TelegramSendEvent, VideoInfo } from '@yc-bot/types';
import { SendVideoOptions } from 'node-telegram-bot-api';

export const sendVideo = (text: string, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	mediaFiles.forEach((media) => {
		const { path, duration, height, width, thumb } = media as VideoInfo;
		const event = {
			payload: {
				content: {
					media: path
				},
				options: {
					disable_notification: true,
					duration,
					height,
					width,
					thumb: thumb.path,
					supports_streaming: true
				} as SendVideoOptions
			},
			method: 'sendVideo'
		} as TelegramSendEvent;
		events.push(event);
	});
	return events;
};
