import { Messages, Context, VKEvent, Message } from '@yc-bot/types';
import { logger } from '@yc-bot/shared';
import dotenv from 'dotenv';
import { vk } from '@yc-bot/vk-api';
import { messageHandler } from '@yc-bot/message-handler';
dotenv.config();

export const handler = async (messages: Messages, context: Context) => {
	try {
		for (const ycMessage of messages.messages) {
			logger.debug(ycMessage.details.message.body);
			const event: VKEvent = JSON.parse(ycMessage.details.message.body) ?? '';
			const message = event.object as Message;
			await messageHandler(message);
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		vk.sendError(error.message);
	}
	return {
		statusCode: 200,
		body: 'ok'
	};
};
