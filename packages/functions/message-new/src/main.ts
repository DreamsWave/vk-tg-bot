import { Messages, Context, VKEvent, Message } from '@yc-bot/types';
import { initConfig, logger } from '@yc-bot/shared';
import dotenv from 'dotenv';
import { vk } from '@yc-bot/vk-api';
import { messageHandler } from '@yc-bot/message-handler';
dotenv.config();

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const ycMessage of messages.messages) {
			logger.debug(ycMessage.details.message.body);
			const event: VKEvent = JSON.parse(ycMessage.details.message.body) ?? null;
			const config = await initConfig(event?.group_id);
			if (!config) return { statusCode: 200, body: 'ok' };
			const message = event.object as Message;
			await messageHandler(message);
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		// await vk.sendError(error);
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
