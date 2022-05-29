import { Post, TelegramSendEvent } from '@yc-bot/types';
import { chunkString } from '@yc-bot/utils';
import { SendMessageOptions } from 'node-telegram-bot-api';
import { MAX_MESSAGE_TEXT_LENGTH } from '../constants';

export const sendMessage = (text: string): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	// Разбиваем текст на чанки размером 4096 символов
	const textChunks = chunkString(text, MAX_MESSAGE_TEXT_LENGTH);
	for (const textChunk of textChunks) {
		// Составляем элемент для очереди
		const event = {
			payload: {
				content: {
					text: textChunk
				},
				options: {
					disable_notification: true
				} as SendMessageOptions
			},
			method: 'sendMessage'
		} as TelegramSendEvent;
		events.push(event);
	}
	return events;
};
