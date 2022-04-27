import { vkEvents } from '@yc-bot/mocks';
import { ymq } from '@yc-bot/yandex-api';
import { SQS } from 'aws-sdk';
import { Event } from '@yc-bot/types';
import { handler } from './main';

describe('Event Handler Function', () => {
	beforeAll(() => {
		jest.spyOn(ymq, 'sendMessage').mockImplementation(() => Promise.resolve({} as SQS.SendMessageResult));
	});
	it('should return "ok"', async () => {
		const event = {} as Event;
		event['body'] = JSON.stringify(vkEvents.wallPostNew.simple);
		const result = await handler(event, {});
		expect(result.body).toEqual('ok');
	});
});
