import { Files, Post, TelegramSendEvent } from '@yc-bot/types';
import { SendDocumentOptions } from 'node-telegram-bot-api';

export const sendDocument = (text: string, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	mediaFiles.forEach((media) => {
		const event = {
			payload: {
				content: {
					media: media.path
				},
				options: {
					disable_notification: true
				} as SendDocumentOptions
			},
			method: 'sendDocument'
		} as TelegramSendEvent;
		events.push(event);
	});
	return events;
};
