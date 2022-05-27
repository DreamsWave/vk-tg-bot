import { Files, Post, TelegramSendMethods, TelegramSendEvent } from '@yc-bot/types';
import { sendAnimation, sendAudio, sendDocument, sendMediaGroup, sendMessage, sendPhoto, sendVideo } from './events';

export const eventCreator = (method: TelegramSendMethods, post: Post, mediaFiles?: Files): TelegramSendEvent[] => {
	switch (method) {
		case 'sendMessage':
			return sendMessage(post);
		case 'sendPhoto':
			return sendPhoto(post, mediaFiles);
		case 'sendVideo':
			return sendVideo(post, mediaFiles);
		case 'sendDocument':
			return sendDocument(post, mediaFiles);
		case 'sendAnimation':
			return sendAnimation(post, mediaFiles);
		case 'sendMediaGroup':
			return sendMediaGroup(post, mediaFiles);
		case 'sendAudio':
			return sendAudio(post, mediaFiles);
		default:
			return [];
	}
};
