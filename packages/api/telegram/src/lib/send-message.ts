process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import Telegram, { SendMessageOptions } from 'node-telegram-bot-api';
import { chunkString } from '@yc-bot/shared/utils';
import { getConfig } from '@yc-bot/shared/config';

const MAX_TEXT_LENGTH = 4096;

export const sendMessage = async (text: string, options?: SendMessageOptions): Promise<void> => {
	if (text.length) {
		const config = getConfig();
		const tg = new Telegram(config.tg_token);
		const chunkedText = chunkString(text, MAX_TEXT_LENGTH);
		for (let i = 0; i < chunkedText.length; i++) {
			if (i === 0) {
				await tg.sendMessage(-config.tg_chat_id, chunkedText[0], {
					...options
				});
			} else {
				await tg.sendMessage(-config.tg_chat_id, chunkedText[i], {
					...options,
					disable_notification: true
				});
			}
		}
	}
};
