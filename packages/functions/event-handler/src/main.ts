import { Event, Context, VKEvent } from '@yc-bot/types';
import { logger } from '@yc-bot/utils';
import { YC } from '@yc-bot/utils';

export const handler = async (event: Event, context: Context) => {
	logger.info('event-handler');
	logger.debug(event);
	logger.debug(context);
	const vkEvent: VKEvent = JSON.parse(event.body) ?? {};

	if (vkEvent?.type === 'confirmation') {
		return {
			statusCode: 200,
			body: process.env.NX_VK_CONFIRMATION ?? ''
		};
	}

	if (vkEvent?.type === 'wall_post_new') {
		logger.info('wall_post_new');
		const ymqUrl = process.env.NX_YMQ_WALL_POST_NEW_URL;
		await YC.ymq.sendMessage(ymqUrl, vkEvent);
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/plain'
		},
		body: 'ok'
	};
};
