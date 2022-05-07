import { Event, Context, VKEvent, Post } from '@yc-bot/types';
import { logger } from '@yc-bot/shared';
import { isPostUnique, ymq } from '@yc-bot/yandex-api';
import { vk } from '@yc-bot/vk-api';
import dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async (event: Event, context: Context) => {
	try {
		const vkEvent: VKEvent = JSON.parse(event.body) ?? {};
		logger.debug(JSON.stringify(vkEvent));

		if (vkEvent?.type === 'confirmation') {
			return {
				statusCode: 200,
				body: process.env.VK_CONFIRMATION ?? ''
			};
		}

		if (vkEvent?.type === 'wall_post_new') {
			logger.info('wall_post_new');
			if (await isPostUnique(event, context)) {
				const ymqUrl = process.env.YMQ_WALL_POST_NEW_URL;
				await ymq.sendMessage(ymqUrl, vkEvent);
			}
		}

		if (vkEvent?.type === 'message_new') {
			logger.info('message_new');
			const ymqUrl = process.env.YMQ_MESSAGE_NEW_URL;
			await ymq.sendMessage(ymqUrl, vkEvent);
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		await vk.sendError(error);
	}
	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/plain'
		},
		body: 'ok'
	};
};
