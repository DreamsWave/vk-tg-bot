import { TelegramSendMethods, TelegramSendEvent, ImageInfo, FileInfo, VideoInfo, AudioInfo, FileType } from '@yc-bot/types';
import { SendAudioOptions, SendVideoOptions } from 'node-telegram-bot-api';
import createMediaGroup from './create-media-group';

export interface CreateEventOptions {
	method: TelegramSendMethods;
	text?: string;
	media?: FileType | FileType[];
	options?: any;
}

const createEvent = ({ method, text, media, options }: CreateEventOptions): TelegramSendEvent => {
	const event = { method, payload: { content: {}, options: { disable_notification: true } } } as TelegramSendEvent;
	if (method === 'sendMessage') {
		event.payload.content.text = text;
	}
	if (method === 'sendPhoto') {
		const { path, origin } = media as ImageInfo;
		if (origin) event.payload.origin = origin;
		event.payload.content.media = path;
	}
	if (method === 'sendVideo') {
		const { duration, height, width, thumb, path, origin } = media as VideoInfo;
		if (origin) event.payload.origin = origin;
		event.payload.content.media = path;
		event.payload.options = { ...event.payload.options, duration, height, width, thumb: thumb.path, supports_streaming: true } as SendVideoOptions;
	}
	if (method === 'sendDocument') {
		const { path, origin } = media as FileInfo;
		if (origin) event.payload.origin = origin;
		event.payload.content.media = path;
	}
	if (method === 'sendAnimation') {
		const { path, origin } = media as FileInfo;
		if (origin) event.payload.origin = origin;
		event.payload.content.media = path;
	}
	if (method === 'sendAudio') {
		const { path, duration, artist, title, origin } = media as AudioInfo;
		if (origin) event.payload.origin = origin;
		event.payload.content.media = path;
		event.payload.options = { ...event.payload.options, duration, performer: artist, title } as SendAudioOptions;
	}
	if (method === 'sendMediaGroup') {
		const files = media as FileType[];
		const mediaGroup = createMediaGroup(files);
		event.payload.content.media = mediaGroup;
	}

	event.payload.options = { ...event.payload.options, ...options };

	if (event.method && (event.payload.content.media || event.payload.content.text)) {
		return event;
	}
	return null;
};

export default createEvent;
