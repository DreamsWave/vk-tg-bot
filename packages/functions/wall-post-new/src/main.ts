import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { sendQueue } from '@yc-bot/api/telegram';
import { Config } from '@yc-bot/shared/config';
import { logger } from '@yc-bot/shared/utils';
import { Queue } from '@yc-bot/queue';
import { getMediaFilesFromAttachments } from '@yc-bot/utils';

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const message of messages.messages) {
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const post = event.object as Post;

			if (post.marked_as_ads) continue;
			if (post.post_type !== 'post') continue;

			const config = await Config.init(event?.group_id);
			if (!config) return { statusCode: 200, body: 'ok' };

			const queue = new Queue();
			if (post.attachments) {
				const mediaFiles = await getMediaFilesFromAttachments(post.attachments, {});
				queue.addFiles(mediaFiles);
			}
			if (post.text) {
				queue.addText(post.text);
			}
			queue.addNotification();
			await sendQueue(queue.getQueue());
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
