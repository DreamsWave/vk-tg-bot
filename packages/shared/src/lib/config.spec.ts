import { getConfig } from './config';

describe('config', () => {
	jest.setTimeout(30000);
	it('should get config from ydb', async () => {
		try {
			const vkGroupId = process.env['VK_GROUP_ID'];
			const config = await getConfig(vkGroupId);
			expect(config.vk_group_id).toBe(vkGroupId);
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
