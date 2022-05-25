process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import Telegram, { SendMediaGroupOptions, SendMessageOptions, InputMedia as TGInputMedia } from 'node-telegram-bot-api';
import { FileInfo, ImageInfo, VideoInfo, InputMedia, InputMediaVideo, InputMediaPhoto, InputMediaDocument } from '@yc-bot/types';
import { chunkString, prepareMediaForTG } from '@yc-bot/utils';
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
		mediaGroup[0].caption = firstText ?? '';
		mediaGroup = mediaGroup.slice(0, 9);
		await tg.sendMediaGroup(-config.tg_chat_id, mediaGroup as TGInputMedia[], {
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
