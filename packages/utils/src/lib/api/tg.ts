process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import TelegramBot, { InputMedia, SendMediaGroupOptions, SendMessageOptions } from 'node-telegram-bot-api';
import { chunkString, logger, MediaType } from '../../';

export interface ITG {
	chatId: number;
	api: TelegramBot;
	send: (text: string, media?: MediaType[], options?: SendMessageOptions) => Promise<void>;
	sendMessage: (text: string, options?: SendMessageOptions) => Promise<void>;
	sendMediaMessage: (text: string, media: MediaType, options?: SendMessageOptions) => Promise<void>;
	sendMediaGroupMessage: (text: string, mediaGroup: InputMedia[], options?: SendMessageOptions) => Promise<void>;
}

const MAX_TEXT_LENGTH = 4000;
const CAPTION_TEXT_LENGTH = 1020;
export default class TG implements ITG {
	public chatId: number;
	public api: TelegramBot;

	constructor(token: string, chatId?: number | string, options?: object) {
		this.chatId = -Number(chatId) || -Number(process.env.NX_TG_CHAT_ID);
		this.api = new TelegramBot(token, options);
	}

	async send(text: string, media?: MediaType[], options?: SendMessageOptions): Promise<void> {
		try {
			if (media.length) {
				if (media.length === 1) {
					await this.sendMediaMessage(text, media[0], { ...options });
					return;
				}
				const documents = media.filter((m) => m.type === 'document');
				const photosAndVideos = media.filter((m) => m.type === 'video' || m.type === 'photo') as InputMedia[];
				if (documents.length) {
					for (const document of documents) {
						if (document.ext === 'gif') {
							await this.api.sendAnimation(this.chatId, document.media, {
								...options
							});
						} else {
							await this.api.sendDocument(this.chatId, document.media, {
								...options
							});
						}
					}
				}
				if (photosAndVideos.length) {
					await this.sendMediaGroupMessage(text, photosAndVideos, {
						...options
					});
					return;
				}
			}
			await this.sendMessage(text, { ...options });
		} catch (error) {
			const err = new Error(error);
			logger.error(err.message);
			throw err;
		}
	}

	async sendMessage(text: string, options?: SendMessageOptions): Promise<void> {
		const chunkedText = chunkString(text, 4096);
		for (let i = 0; i < chunkedText.length; i++) {
			if (i === 0) {
				await this.api.sendMessage(this.chatId, chunkedText[0], {
					...options
				});
			} else {
				await this.api.sendMessage(this.chatId, chunkedText[i], {
					...options,
					disable_notification: true
				});
			}
		}
	}

	async sendMediaMessage(text: string, media: MediaType, options?: SendMessageOptions): Promise<void> {
		if (media) {
			const [firstText, ...restText] = chunkString(text, MAX_TEXT_LENGTH, CAPTION_TEXT_LENGTH);
			if (media.type === 'photo') {
				await this.api.sendPhoto(this.chatId, media.media, {
					...options,
					caption: firstText
				});
			}
			if (media.type === 'video') {
				await this.api.sendVideo(this.chatId, media.media, {
					...options,
					caption: firstText
				});
			}
			if (media.type === 'document') {
				if (media.ext === 'gif') {
					await this.api.sendAnimation(this.chatId, media.media, {
						...options,
						caption: firstText
					});
				} else {
					await this.api.sendDocument(this.chatId, media.media, {
						...options,
						caption: firstText
					});
				}
			}
			for (const txt of restText) {
				await this.api.sendMessage(this.chatId, txt, {
					...options,
					disable_notification: true
				});
			}
		}
	}

	async sendMediaGroupMessage(
		text: string,
		mediaGroup: InputMedia[],
		mediaGroupOptions?: SendMediaGroupOptions,
		messageOptions?: SendMessageOptions
	): Promise<void> {
		if (mediaGroup.length) {
			const [firstText, ...restText] = chunkString(text, MAX_TEXT_LENGTH, CAPTION_TEXT_LENGTH);
			let media = mediaGroup.filter((m) => m.type === 'video' || m.type === 'photo') as InputMedia[];
			media[0].caption = firstText;
			media = media.slice(0, 9);
			await this.api.sendMediaGroup(this.chatId, media, {
				...mediaGroupOptions
			});
			for (const txt of restText) {
				await this.api.sendMessage(this.chatId, txt, {
					...messageOptions,
					disable_notification: true
				});
			}
		}
	}
}
