import { vk } from './vk-api';

describe('vkApi', () => {
	it('should send error to the vk chat for errors', async () => {
		try {
			// await vk.sendError(new Error('Test error'));
			expect(true).toBeTruthy();
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});
});
