import { Files, Post, TelegramSendEvent, VideoInfo } from '@yc-bot/types';
import { chunkString } from '@yc-bot/utils';
import { SendMessageOptions, SendVideoOptions } from 'node-telegram-bot-api';
import { MAX_CAPTION_TEXT_LENGTH, MAX_MESSAGE_TEXT_LENGTH } from '../constants';

export const sendVideo = (text: string, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	const video = (mediaFiles[0] ?? null) as VideoInfo;
	if (!video) return events;
	const { path, duration, height, width, thumb } = video;
	if (!text || text.length === 0) {
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
	} else if (text.length >= 1) {
		const [textFirstChunk, ...textRestChunks] = chunkString(text, MAX_MESSAGE_TEXT_LENGTH, MAX_CAPTION_TEXT_LENGTH);
		const event = {
			payload: {
				content: {
					media: path
				},
				options: {
					caption: textFirstChunk,
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

	return events;
};
