import VK from './vk-api';

describe('vkApi', () => {
	const vk = new VK(process.env.VK_TOKEN, process.env.VK_ERROR_CHAT_ID);
	it('should send error to the vk chat for errors', async () => {
		try {
			await vk.sendError(new Error('Some error'));
			expect(true).toBeTruthy();
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});
});
