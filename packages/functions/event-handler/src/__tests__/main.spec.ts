import { vkEvents } from '@yc-bot/mocks';
import * as yc from '@yc-bot/api/yandex-cloud';
import { Event } from '@yc-bot/types';
import { handler } from '../main';

jest.mock('@yc-bot/api/yandex-cloud');

describe('Event Handler Function', () => {
	beforeAll(() => {
		jest.spyOn(yc, 'isPostUnique').mockResolvedValue(true);
		jest.spyOn(yc, 'sendMessageYMQ').mockResolvedValue({});
	});
	it('should return "ok"', async () => {
		try {
			const event = {} as Event;
			event['body'] = JSON.stringify(vkEvents.wallPostNew.simple);
			const result = await handler(event, {});
			expect(result.body).toEqual('ok');
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
