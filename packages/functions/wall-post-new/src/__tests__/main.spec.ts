import { handler } from '../main';
import { queueEvents, ymq } from '@yc-bot/mocks';
import { Messages, Context } from '@yc-bot/types';
import * as yc from '@yc-bot/api/yandex-cloud';
import * as queue from '@yc-bot/queue';
import * as telegram from '@yc-bot/api/telegram';
import { TelegramSendEvent } from '@yc-bot/types';

describe('Function wall-post-new', () => {
	jest.setTimeout(30000);
	it('should handle wall_post_new vk event', async () => {
		const qEvents = [queueEvents.message] as TelegramSendEvent[];
		jest.spyOn(yc, 'isPostUnique').mockResolvedValue(true);
		jest.spyOn(queue, 'createSendQueue').mockResolvedValue(qEvents);
		const sendQueue = jest.spyOn(telegram, 'sendQueue').mockResolvedValue();
		try {
			const messages: Messages = ymq.messages;
			const context: Context = {};
			const result = await handler(messages, context);
			expect(sendQueue).lastCalledWith(qEvents);
			expect(sendQueue).toBeCalledTimes(1);
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
});
