import { vkEvents } from '@yc-bot/mocks';
import { messageHandler } from './message-handler';
import * as commands from './commands';
import { prepareTemp } from '@yc-bot/utils';
import path from 'path';

const tmpDir = path.join(path.resolve(), 'tmp', 'message-handler');

describe('Message Handler', () => {
	jest.setTimeout(60000);
	beforeAll(() => {
		prepareTemp(tmpDir);
	});

	describe('Commands should be called', () => {
		it(`"test"`, async () => {
			const spy = jest.spyOn(commands, 'test').mockImplementation(jest.fn());
			const message = vkEvents.messageNew.simple.object;
			message.message.text = 'test';
			await messageHandler(message);
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});
		it(`"stocks"`, async () => {
			const spy = jest.spyOn(commands, 'stocks').mockImplementation(jest.fn());
			const message = vkEvents.messageNew.simple.object;
			message.message.text = 'stocks';
			await messageHandler(message);
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});
	});
	describe('test', () => {
		it(`should work`, async () => {
			try {
				const message = vkEvents.messageNew.simple.object;
				message.message.text = 'test';
				await commands.test(message);
			} catch (error) {
				expect(false).toBe(true);
			}
		});
	});
});
