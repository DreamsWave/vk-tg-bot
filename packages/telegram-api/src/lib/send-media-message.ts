process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import Telegram, { SendMessageOptions, SendVideoOptions } from 'node-telegram-bot-api';
import { MediaType } from '@yc-bot/types';
import { chunkString, createLinkedPhoto } from '@yc-bot/shared/utils';
import { getConfig } from '@yc-bot/shared/config';
import { Stream } from 'stream';

const MAX_TEXT_LENGTH = 4096;
const CAPTION_TEXT_LENGTH = 1024;

export const sendMediaMessage = async (text: string, media: MediaType, options?: SendMessageOptions): Promise<void> => {
	if (media) {
		const [firstText, ...restText] = chunkString(text, MAX_TEXT_LENGTH, CAPTION_TEXT_LENGTH);
		const config = getConfig();
		const tg = new Telegram(config.tg_token);
		if (media.type === 'photo') {
			const originUrl = media.origin ?? '';
			const linkPhoto = createLinkedPhoto(originUrl);
			const textWithLink = text + '\n' + linkPhoto;
			const textLength = textWithLink.length;
			if (textLength > CAPTION_TEXT_LENGTH && textLength < MAX_TEXT_LENGTH) {
				await tg.sendMessage(-config.tg_chat_id, textWithLink, { parse_mode: 'HTML' });
				return;
			} else {
				await tg.sendPhoto(-config.tg_chat_id, media.media, {
					...options,
					caption: firstText ?? ''
				});
			}
		}

		if (media.type === 'video') {
			await tg.sendVideo(-config.tg_chat_id, media.media, {
				...options,
				duration: media.duration,
				height: media.height,
				width: media.width,
				thumb: media.thumb,
				supports_streaming: true,
				caption: firstText ?? ''
			} as SendVideoOptions & { thumb?: Stream | string | Buffer; supports_streaming?: boolean });
		}

		if (media.type === 'document') {
			if (media.ext === 'gif') {
				await tg.sendAnimation(-config.tg_chat_id, media.media, {
					...options,
					caption: firstText ?? ''
				});
			} else {
				await tg.sendDocument(-config.tg_chat_id, media.media, {
					...options,
					caption: firstText ?? ''
				});
			}
		}

		for (const txt of restText) {
			await tg.sendMessage(-config.tg_chat_id, txt, {
				...options,
				disable_notification: true
			});
		}
	}
};
