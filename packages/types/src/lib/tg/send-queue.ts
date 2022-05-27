import { FileOptions } from 'node-telegram-bot-api';

export type TelegramSendMethods = 'sendMessage' | 'sendPhoto' | 'sendVideo' | 'sendDocument' | 'sendAnimation' | 'sendMediaGroup' | 'sendAudio';
export type TelegramSendContent = {
	text?: string;
	media?: any;
};
export type TelegramSendPayload = {
	content: TelegramSendContent;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: any;
	fileOptions?: FileOptions;
};
export type TelegramSendEvent = {
	method: TelegramSendMethods;
	payload: TelegramSendPayload;
};
