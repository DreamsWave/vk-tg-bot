import { Files, TelegramSendMethods, TelegramSendEvent } from '@yc-bot/types';
import { sendAnimation, sendAudio, sendDocument, sendMediaGroup, sendMessage, sendPhoto, sendVideo } from './events';

export const eventCreator = async (method: TelegramSendMethods, text: string, mediaFiles?: Files): Promise<TelegramSendEvent[]> => {
	switch (method) {
		case 'sendMessage':
			return sendMessage(text);
		case 'sendPhoto':
			return sendPhoto(text, mediaFiles);
		case 'sendVideo':
			return sendVideo(text, mediaFiles);
		case 'sendDocument':
			return sendDocument(text, mediaFiles);
		case 'sendAnimation':
			return sendAnimation(text, mediaFiles);
		case 'sendMediaGroup':
			return sendMediaGroup(text, mediaFiles);
		case 'sendAudio':
			return sendAudio(text, mediaFiles);
		default:
			return [];
	}
};
