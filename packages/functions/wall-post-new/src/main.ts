import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { prepareMedia } from '@yc-bot/utils';
import { TG } from '@yc-bot/telegram-api';
import { logger } from '@yc-bot/shared';
import dotenv from 'dotenv';
import { vk } from '@yc-bot/vk-api';
dotenv.config();

export const handler = async (messages: Messages, context: Context) => {
	try {
		const tg = new TG(process.env.TG_TOKEN, process.env.TG_CHAT_ID);
		for (const message of messages.messages) {
			logger.debug(message.details.message.body);
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const post = event.object as Post;
			if (post.marked_as_ads) continue;
			if (post.post_type !== 'post') continue;
			if (post.attachments) {
				const media = await prepareMedia(post.attachments);
				if (media?.length) {
					await tg.send(post.text, media);
				} else {
					tg.send(post.text);
				}
			} else {
				tg.send(post.text);
			}
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		vk.sendError(error.message);
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
