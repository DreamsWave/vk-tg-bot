process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import Telegram, { InputMedia, SendMessageOptions } from 'node-telegram-bot-api';
import { MediaType } from '@yc-bot/types';
import { logger } from '@yc-bot/shared/utils';
import { getConfig } from '@yc-bot/shared/config';
import { sendMessage } from './send-message';
import { sendMediaMessage } from './send-media-message';
import { sendMediaGroupMessage } from './send-media-group-message';

export const send = async (text: string, media?: MediaType[], options?: SendMessageOptions): Promise<void> => {
	try {
		const config = getConfig();
		const tg = new Telegram(config.tg_token);
		if (media?.length) {
			if (media.length === 1) {
				await sendMediaMessage(text, media[0], { ...options });
				return;
			}
			const documents = media.filter((m) => m.type === 'document');
			const photosAndVideos = media.filter((m) => m.type === 'video' || m.type === 'photo') as InputMedia[];
			if (documents.length) {
				for (const document of documents) {
					if (document.ext === 'gif') {
						await tg.sendAnimation(-config.tg_chat_id, document.media, {
							...options
						});
					} else {
						await tg.sendDocument(-config.tg_chat_id, document.media, {
							...options
						});
					}
				}
			}
			if (photosAndVideos.length) {
				await sendMediaGroupMessage(text, photosAndVideos, {
					...options
				});
				return;
			}
		}
		await sendMessage(text, { ...options });
	} catch (error) {
		const err = new Error(error);
		logger.error(err.message);
		throw err;
	}
};
