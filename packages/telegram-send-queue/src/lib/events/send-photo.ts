import { Files, TelegramSendEvent } from '@yc-bot/types';
import { SendMessageOptions, SendPhotoOptions } from 'node-telegram-bot-api';
import { chunkString, createLinkedPhoto } from '@yc-bot/utils';
import { MAX_CAPTION_TEXT_LENGTH, MAX_MESSAGE_TEXT_LENGTH } from '../constants';

export const sendPhoto = async (text: string, mediaFiles: Files): Promise<TelegramSendEvent[]> => {
	const events = [] as TelegramSendEvent[];
	const photo = mediaFiles[0] ?? null;
	if (photo) {
		// Если нет текста, то отправляем только фото
		if (!text || text.length === 0) {
			const event = {
				payload: {
					content: {
						media: photo.path
					},
					options: {
						disable_notification: true
					} as SendPhotoOptions
				},
				method: 'sendPhoto'
			} as TelegramSendEvent;
			events.push(event);
			// Если длина текста от 1 символа и до максимальной длины подписи фото(1024),
			// то текст добавляем в подпись к фото
		} else if (text.length >= 1 && text.length <= MAX_CAPTION_TEXT_LENGTH) {
			const event = {
				payload: {
					content: {
						media: photo.path
					},
					options: {
						disable_notification: true,
						caption: text
					} as SendPhotoOptions
				},
				method: 'sendPhoto'
			} as TelegramSendEvent;
			events.push(event);
			// Если длина текста от максимальной длины подписи к фото(1024) и до максимальной длины сообщения(4096) - 30(для ссылки на фото),
			// то ссылку на фото добавляем в текст и результат будет, как превью фото в тексте(снизу сообщения)
		} else if (text.length > MAX_CAPTION_TEXT_LENGTH && text.length <= MAX_MESSAGE_TEXT_LENGTH - 30) {
			const linkedPhoto = await createLinkedPhoto(photo.origin);
			const event = {
				payload: {
					content: {
						text: text + ' ' + linkedPhoto
					},
					options: {
						disable_notification: true
					} as SendMessageOptions
				},
				method: 'sendMessage'
			} as TelegramSendEvent;
			events.push(event);
			// Если длина текста больше максимальной длины сообщения(4096) - 30,
			// то первым сообщением отправляем фото с подписью и частью текста(1024),
			// а дальше отправляем обычные сообщения с максимальной длинной сообщения(4096)
		} else if (text.length > MAX_MESSAGE_TEXT_LENGTH - 30) {
			const [textFirstChunk, ...textRestChunks] = chunkString(text, MAX_MESSAGE_TEXT_LENGTH, MAX_CAPTION_TEXT_LENGTH);
			const event = {
				payload: {
					content: {
						media: photo.path
					},
					options: {
						disable_notification: true,
						caption: textFirstChunk
					} as SendPhotoOptions
				},
				method: 'sendPhoto'
			} as TelegramSendEvent;
			events.push(event);
			textRestChunks.forEach((textChunk) => {
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
			});
		}
	}
	return events;
};
