import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { prepareMedia } from '@yc-bot/utils';
import { TG } from '@yc-bot/telegram-api';
import { getConfig, logger } from '@yc-bot/shared';
import dotenv from 'dotenv';
import { vk } from '@yc-bot/vk-api';
dotenv.config();

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const message of messages.messages) {
			logger.debug(message.details.message.body);
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const config = await getConfig(event?.group_id);
			if (!config) return { statusCode: 200, body: 'ok' };
			const tg = new TG(config.tg_token, config.tg_chat_id);
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
		await vk.sendError(error);
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
