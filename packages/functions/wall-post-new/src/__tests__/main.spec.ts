import { handler } from '../main';
import { filesInfo, ymq } from '@yc-bot/mocks';
import { Messages, Context } from '@yc-bot/types';
import * as telegram from '@yc-bot/api/telegram';
import * as utils from '@yc-bot/utils';

describe('Function wall-post-new', () => {
	jest.setTimeout(30000);
	it.only('should handle wall_post_new vk event', async () => {
		jest.spyOn(utils, 'getMediaFilesFromAttachments').mockResolvedValue([filesInfo.imageJpeg]);
		const sendQueue = jest.spyOn(telegram, 'sendQueue').mockResolvedValue();
		try {
			const messages: Messages = ymq.messages;
			const context: Context = {};
			const result = await handler(messages, context);
			expect(sendQueue).toBeCalledTimes(1);
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
		jest.clearAllMocks();
	});
});
