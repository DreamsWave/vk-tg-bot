import { getConfig, initConfig } from '..';

describe('config', () => {
	jest.setTimeout(30000);
	it('should init config', async () => {
		try {
			const vkGroupId = process.env['VK_GROUP_ID'];
			const config = await initConfig(vkGroupId);
			expect(config.vk_group_id).toBe(vkGroupId);
			const localConfig = getConfig();
			expect(localConfig.vk_group_id).toBe(vkGroupId);
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
