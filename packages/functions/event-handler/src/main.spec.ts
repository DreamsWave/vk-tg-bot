import { vkEvents } from '@yc-bot/mocks';
import * as yandex from '@yc-bot/yandex-api';
import { Event } from '@yc-bot/types';
import { handler } from './main';

jest.mock('@yc-bot/yandex-api');

describe('Event Handler Function', () => {
	beforeAll(() => {
		jest.spyOn(yandex, 'isPostUnique').mockResolvedValue(true);
		jest.spyOn(yandex, 'sendMessageYMQ').mockResolvedValue({});
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
