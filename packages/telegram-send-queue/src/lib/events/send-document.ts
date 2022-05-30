import { FileInfo, Files, TelegramSendEvent } from '@yc-bot/types';
import { SendAnimationOptions, SendDocumentOptions } from 'node-telegram-bot-api';

export const sendDocument = (text: string, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	const doc = (mediaFiles[0] ?? null) as FileInfo;
	if (!doc) return events;
	if (doc.ext === 'gif') {
		const event = {
			payload: {
				content: {
					media: doc.path
				},
				options: {
					disable_notification: true
				} as SendAnimationOptions
			},
			method: 'sendAnimation'
		} as TelegramSendEvent;
		events.push(event);
	} else {
		const event = {
			payload: {
				content: {
					media: doc.path
				},
				options: {
					disable_notification: true
				} as SendDocumentOptions
			},
			method: 'sendDocument'
		} as TelegramSendEvent;
		events.push(event);
	}

	return events;
};
