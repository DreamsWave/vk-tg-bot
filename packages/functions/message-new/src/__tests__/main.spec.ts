import { vkEvents } from '@yc-bot/mocks';
import { Messages } from '@yc-bot/types';
import { handler } from '../main';

describe('Message New Function', () => {
	it('should return "ok"', async () => {
		const messages = { messages: [{ details: { message: { body: '' } } }] } as Messages;
		messages.messages[0].details.message.body = JSON.stringify(vkEvents.messageNew.simple);
		const result = await handler(messages, {});
		expect(result.body).toEqual('ok');
	});
});
