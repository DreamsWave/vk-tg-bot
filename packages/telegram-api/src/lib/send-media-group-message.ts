process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import Telegram, { InputMedia, SendMediaGroupOptions, SendMessageOptions } from 'node-telegram-bot-api';
import { FileInfo } from '@yc-bot/types';
import { chunkString } from '@yc-bot/shared/utils';
import { getConfig } from '@yc-bot/shared/config';

const MAX_TEXT_LENGTH = 4096;
const CAPTION_TEXT_LENGTH = 1024;

export const sendMediaGroupMessage = async (
	text: string,
	mediaGroup: InputMedia[],
	mediaGroupOptions?: SendMediaGroupOptions,
	messageOptions?: SendMessageOptions
): Promise<void> => {
	if (mediaGroup.length) {
		const config = getConfig();
		const tg = new Telegram(config.tg_token);
		const [firstText, ...restText] = chunkString(text, MAX_TEXT_LENGTH, CAPTION_TEXT_LENGTH);
		const mediaVP = mediaGroup.filter((m) => m.type === 'video' || m.type === 'photo') as (InputMedia & FileInfo)[];
		let media = mediaVP.map((m) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { thumb, ...rest } = m;
			return { ...rest };
		});
		media[0].caption = firstText ?? '';
		media = media.slice(0, 9);
		await tg.sendMediaGroup(-config.tg_chat_id, media, {
			...mediaGroupOptions
		});
		for (const txt of restText) {
			await tg.sendMessage(-config.tg_chat_id, txt, {
				...messageOptions,
				disable_notification: true
			});
		}
	}
};
