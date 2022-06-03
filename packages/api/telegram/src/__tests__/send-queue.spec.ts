import { Temp } from '@yc-bot/utils';
import path from 'path';
import sendQueue from '../lib/send-queue';
import { queueEvents } from '@yc-bot/mocks';
import { TelegramSendEvent } from '@yc-bot/types';

describe('sendQueue', () => {
	jest.setTimeout(30000);
	const destination = path.join(path.resolve(), 'tmp');
	beforeAll(() => {
		Temp.setTmpdir(destination);
		Temp.prepare();
	});
	afterAll(() => {
		Temp.removeLocation();
	});
	it.only('should send queue with 1 sendMessage with text "test"', async () => {
		const event = queueEvents.message;
		event.payload.content.text = 'test';
		try {
			await sendQueue([event]);
		} catch (error) {
			expect(true).toBe(false);
		}
	});
	it('should send queue with 1 of each methods', async () => {
		const queue = Object.entries(queueEvents).map(([key, ev]) => ev) as TelegramSendEvent[];
		try {
			await sendQueue(queue);
		} catch (error) {
			expect(true).toBeFalsy();
		}
	});
});
