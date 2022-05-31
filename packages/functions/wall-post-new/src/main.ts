import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { sendQueue } from '@yc-bot/api/telegram';
import { config } from '@yc-bot/shared/config';
import { logger } from '@yc-bot/shared/utils';
import { createSendQueue } from '@yc-bot/queue';
import { isPostUnique } from '@yc-bot/api/yandex-cloud';

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const message of messages.messages) {
			logger.debug(message.details.message.body);
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const post = event.object as Post;
			if (post.marked_as_ads) continue;
			if (post.post_type !== 'post') continue;
			await config.init(event?.group_id);
			if (!config.get()) return { statusCode: 200, body: 'ok' };
			if (await isPostUnique(post.id)) {
				const queue = await createSendQueue(post);
				await sendQueue(queue);
			}
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		throw error;
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
