import { Post, TelegramSendEvent } from '@yc-bot/types';
import { chunkString } from '@yc-bot/utils';
import { SendMessageOptions } from 'node-telegram-bot-api';

export const sendMessage = (post: Post): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	// Разбиваем текст на чанки размером 4096 символов
	const textChunks = chunkString(post.text, 4096);
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
