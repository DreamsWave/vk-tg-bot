process.env['NTBA_FIX_350'] = '1';
process.env['NTBA_FIX_319'] = '1';
import Telegram from 'node-telegram-bot-api';
import { TelegramSendEvent } from '@yc-bot/types';
import { Config } from '@yc-bot/shared/config';

const sendQueue = async (queue: TelegramSendEvent[]): Promise<void> => {
	if (!queue?.length) return;
	const conf = Config.get();
	const tg = new Telegram(conf.tg_token);
	const chatId = -conf.tg_chat_id;
	for (const event of queue) {
		const {
			payload: { content, fileOptions = {}, options = {} }
		} = event;
		switch (event.method) {
			case 'sendAnimation':
				await tg.sendAnimation(chatId, content.media, options);
				break;
			// case "sendAudio":
			//     await tg.sendAudio(chatId, content.media, options)
			//     break;
			case 'sendDocument':
				await tg.sendDocument(chatId, content.media, options, fileOptions);
				break;
			case 'sendMediaGroup':
				await tg.sendMediaGroup(chatId, content.media, options);
				break;
			case 'sendMessage':
				await tg.sendMessage(chatId, content.text, options);
				break;
			case 'sendPhoto':
				await tg.sendPhoto(chatId, content.media, options, fileOptions);
				break;
			case 'sendVideo':
				await tg.sendVideo(chatId, content.media, options, fileOptions);
				break;
			default:
				continue;
		}
	}
};

export default sendQueue;
