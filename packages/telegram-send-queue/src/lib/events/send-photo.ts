import { Files, Post, TelegramSendEvent } from '@yc-bot/types';
import { SendPhotoOptions } from 'node-telegram-bot-api';

export const sendPhoto = (post: Post, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	mediaFiles.forEach((media) => {
		const event = {
			payload: {
				content: {
					media: media.path
				},
				options: {
					disable_notification: true
				} as SendPhotoOptions
			},
			method: 'sendPhoto'
		} as TelegramSendEvent;
		events.push(event);
	});
	return events;
};
