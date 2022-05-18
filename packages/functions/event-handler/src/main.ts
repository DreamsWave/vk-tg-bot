import { Event, Context, VKEvent } from '@yc-bot/types';
import { initConfig, logger } from '@yc-bot/shared';
import { isPostUnique, sendMessageYMQ } from '@yc-bot/yandex-api';
import { vk } from '@yc-bot/vk-api';
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
			if (await isPostUnique(event, context)) {
				const ymqUrl = process.env.YMQ_WALL_POST_NEW_URL;
				await sendMessageYMQ(ymqUrl, vkEvent);
			}
		}

		// if (vkEvent?.type === 'message_new') {
		// 	logger.info('message_new');
		// 	const ymqUrl = process.env.YMQ_MESSAGE_NEW_URL;
		// 	await ymq.sendMessage(ymqUrl, vkEvent);
		// }
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
