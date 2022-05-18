process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import TelegramBot, { InputMedia, SendMediaGroupOptions, SendMessageOptions } from 'node-telegram-bot-api';
import { FileInfo, MediaType } from '@yc-bot/types';
import { logger, chunkString, createLinkedPhoto, getConfig } from '@yc-bot/shared';
import { Stream } from 'stream';

export interface ITG {
	chatId: number;
	api: TelegramBot;
	send: (text: string, media?: MediaType[], options?: SendMessageOptions) => Promise<void>;
	sendMessage: (text: string, options?: SendMessageOptions) => Promise<void>;
	sendMediaMessage: (text: string, media: MediaType, options?: SendMessageOptions) => Promise<void>;
	sendMediaGroupMessage: (text: string, mediaGroup: InputMedia[], options?: SendMessageOptions) => Promise<void>;
}

const MAX_TEXT_LENGTH = 4096;
const CAPTION_TEXT_LENGTH = 1024;
export default class TG implements ITG {
	public chatId: number;
	public api: TelegramBot;

	constructor(options?: object) {
		const config = getConfig();
		this.chatId = -Number(config.tg_chat_id);
		this.api = new TelegramBot(config.tg_token, options);
	}

	async send(text: string, media?: MediaType[], options?: SendMessageOptions): Promise<void> {
		try {
			if (media?.length) {
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
		if (text.length) {
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
	}

	async sendMediaMessage(text: string, media: MediaType, options?: SendMessageOptions): Promise<void> {
		if (media) {
			const [firstText, ...restText] = chunkString(text, MAX_TEXT_LENGTH, CAPTION_TEXT_LENGTH);

			if (media.type === 'photo') {
				const originUrl = media.origin ?? '';
				const linkPhoto = createLinkedPhoto(originUrl);
				const textWithLink = text + '\n' + linkPhoto;
				const textLength = textWithLink.length;
				if (textLength > CAPTION_TEXT_LENGTH && textLength < MAX_TEXT_LENGTH) {
					await this.api.sendMessage(this.chatId, textWithLink, { parse_mode: 'HTML' });
					return;
				} else {
					await this.api.sendPhoto(this.chatId, media.media, {
						...options,
						caption: firstText ?? ''
					});
				}
			}

			if (media.type === 'video') {
				await this.api.sendVideo(this.chatId, media.media, {
					...options,
					duration: media.duration,
					height: media.height,
					width: media.width,
					thumb: media.thumb,
					supports_streaming: true,
					caption: firstText ?? ''
				} as TelegramBot.SendVideoOptions & { thumb?: Stream | string | Buffer; supports_streaming?: boolean });
			}

			if (media.type === 'document') {
				if (media.ext === 'gif') {
					await this.api.sendAnimation(this.chatId, media.media, {
						...options,
						caption: firstText ?? ''
					});
				} else {
					await this.api.sendDocument(this.chatId, media.media, {
						...options,
						caption: firstText ?? ''
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
			const mediaVP = mediaGroup.filter((m) => m.type === 'video' || m.type === 'photo') as (InputMedia & FileInfo)[];
			let media = mediaVP.map((m) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { thumb, ...rest } = m;
				return { ...rest };
			});
			media[0].caption = firstText ?? '';
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
