import { AudioInfo, Files, Post, TelegramSendEvent } from '@yc-bot/types';
import { SendAudioOptions } from 'node-telegram-bot-api';

export const sendAudio = (text: string, mediaFiles: Files): TelegramSendEvent[] => {
	const events = [] as TelegramSendEvent[];
	mediaFiles.forEach((media) => {
		const { duration, artist, title, path } = media as AudioInfo;
		const event = {
			payload: {
				content: {
					media: path
				},
				options: {
					disable_notification: true,
					duration,
					performer: artist,
					title
				} as SendAudioOptions
			},
			method: 'sendAudio'
		} as TelegramSendEvent;
		events.push(event);
	});
	return events;
};
