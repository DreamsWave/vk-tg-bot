import { Files, Post, TelegramSendEvent } from '@yc-bot/types';
import { SendAnimationOptions } from 'node-telegram-bot-api';

export const sendAnimation = (post: Post, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	mediaFiles.forEach((media) => {
		const event = {
			payload: {
				content: {
					media: media.path
				},
				options: {
					disable_notification: true
				} as SendAnimationOptions
			},
			method: 'sendAnimation'
		} as TelegramSendEvent;
		events.push(event);
	});
	return events;
};
