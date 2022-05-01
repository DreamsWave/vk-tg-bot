import { Event, Context, VKEvent } from '@yc-bot/types';
import { logger } from '@yc-bot/shared';
import { ymq } from '@yc-bot/yandex-api';
import { VK } from '@yc-bot/vk-api';
import dotenv from 'dotenv';
dotenv.config();

export const handler = async (event: Event, context: Context) => {
	const vk = new VK(process.env.VK_TOKEN, process.env.VK_ERROR_CHAT_ID);
	try {
		logger.debug(JSON.stringify(event));
		const vkEvent: VKEvent = JSON.parse(event.body) ?? {};

		if (vkEvent?.type === 'confirmation') {
			return {
				statusCode: 200,
				body: process.env.VK_CONFIRMATION ?? ''
			};
		}

		if (vkEvent?.type === 'wall_post_new') {
			logger.info('wall_post_new');
			const ymqUrl = process.env.YMQ_WALL_POST_NEW_URL;
			await ymq.sendMessage(ymqUrl, vkEvent);
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		vk.sendError(new Error(error));
	}
	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/plain'
		},
		body: 'ok'
	};
};
