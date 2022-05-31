import { handler } from '../main';
import { ymq } from '@yc-bot/mocks';
import { Messages, Context } from '@yc-bot/types';

describe('Function wall-post-new', () => {
	jest.setTimeout(30000);
	it('should handle wall_post_new vk event and return { statusCode: 200, body: ok }', async () => {
		try {
			const messages: Messages = ymq.messages;
			const context: Context = {};
			const result = await handler(messages, context);
			expect(result.body).toBe('ok');
			expect(result.statusCode).toBe(200);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
});
