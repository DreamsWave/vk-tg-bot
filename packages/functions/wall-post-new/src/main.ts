import { Messages, Context, VKEvent, Post } from '@yc-bot/types';
import { prepareMedia, TG } from '@yc-bot/utils';
import { logger } from '@yc-bot/shared';
import dotenv from 'dotenv';
dotenv.config();

export const handler = async (messages: Messages, context: Context) => {
	logger.info('wall-post-new');
	logger.info(messages);
	logger.info(context);
	const tg = new TG(process.env.NX_TG_TOKEN, process.env.NX_TG_CHAT_ID);
	try {
		for (const message of messages.messages) {
			const event: VKEvent = JSON.parse(message.details.message.body) ?? '';
			const post = event.object as Post;
			if (post.marked_as_ads) continue;
			if (post.post_type !== 'post') continue;
			if (post.attachments) {
				const media = await prepareMedia(post.attachments);
				if (media.length) {
					await tg.send(post.text, media);
				} else {
					tg.send(post.text);
				}
			} else {
				tg.send(post.text);
			}
		}
	} catch (error) {
		logger.error(error);
		// send error to some chat
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
