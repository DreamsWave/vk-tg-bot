import { Event, Context, VKEvent } from '@yc-bot/types';
import { Config } from '@yc-bot/shared/config';
import { isPostUnique, sendMessageYMQ } from '@yc-bot/api/yandex-cloud';
import dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async (event: Event, context: Context) => {
	try {
		const vkEvent: VKEvent = JSON.parse(event.body) ?? {};
		const config = await Config.init(vkEvent?.group_id);
		if (!config) return { statusCode: 200, body: 'ok' };
		if (vkEvent?.type === 'confirmation') {
			return {
				statusCode: 200,
				body: config.vk_group_callback
			};
		}

		if (vkEvent?.type === 'wall_post_new') {
			if (await isPostUnique(vkEvent.object.id)) {
				const ymqUrl = process.env.YMQ_WALL_POST_NEW_URL;
				await sendMessageYMQ(ymqUrl, vkEvent);
			}
		}
	} catch (error) {
		console.error(JSON.stringify(error));
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
