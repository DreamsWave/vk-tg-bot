import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { prepareMediaForTG } from '@yc-bot/utils';
import * as tg from '@yc-bot/api/telegram';
import { initConfig } from '@yc-bot/shared/config';
import { logger } from '@yc-bot/shared/utils';

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const message of messages.messages) {
			logger.debug(message.details.message.body);
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const config = await initConfig(event?.group_id);
			if (!config) return { statusCode: 200, body: 'ok' };
			const post = event.object as Post;
			if (post.marked_as_ads) continue;
			if (post.post_type !== 'post') continue;
			if (post.attachments) {
				const media = await prepareMediaForTG(post.attachments);
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
		// await vk.sendError(error);
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
