import { Event, Context, VKEvent } from '@yc-bot/types';
import { initConfig } from '@yc-bot/shared/config';
import { logger } from '@yc-bot/shared/utils';
import * as yc from '@yc-bot/api/yandex-cloud';
import dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async (event: Event, context: Context) => {
	try {
		const vkEvent: VKEvent = JSON.parse(event.body) ?? {};
		const config = await initConfig(vkEvent?.group_id);
		if (!config) return { statusCode: 200, body: 'ok' };

		if (vkEvent?.type === 'confirmation') {
			return {
				statusCode: 200,
				body: config.vk_group_callback
			};
		}

		if (vkEvent?.type === 'wall_post_new') {
			if (await yc.isPostUnique(event, context)) {
				const ymqUrl = process.env.YMQ_WALL_POST_NEW_URL;
				await yc.sendMessageYMQ(ymqUrl, vkEvent);
			}
		}
	} catch (error) {
		console.log(error);
		logger.error(JSON.stringify(error));
		// await vk.sendError(error);
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
