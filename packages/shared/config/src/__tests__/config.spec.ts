import { config } from '..';

describe('config', () => {
	jest.setTimeout(30000);
	it('should init config', async () => {
		try {
			const vkGroupId = process.env['VK_GROUP_ID'];
			const conf = await config.init(vkGroupId);
			expect(conf.vk_group_id).toBe(vkGroupId);
			const localConfig = config.get();
			expect(localConfig.vk_group_id).toBe(vkGroupId);
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
