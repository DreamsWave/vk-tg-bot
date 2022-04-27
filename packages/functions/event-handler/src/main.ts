import { Event, Context, VKEvent } from '@yc-bot/types';
import { logger } from '@yc-bot/shared';
import { ymq } from '@yc-bot/yandex-api';
import dotenv from 'dotenv';
dotenv.config();

export const handler = async (event: Event, context: Context) => {
	logger.info('event-handler');
	logger.debug(event);
	logger.debug(context);
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

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/plain'
		},
		body: 'ok'
	};
};
