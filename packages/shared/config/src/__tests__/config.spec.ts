import { Config } from '..';
import dotenv from 'dotenv';
dotenv.config();

describe('config', () => {
	const vkGroupId = process.env['VK_GROUP_ID'];
	jest.setTimeout(30000);
	it('should return dev config', async () => {
		const nodeEnv = ['development', 'test'];
		for (const env of nodeEnv) {
			process.env['NODE_ENV'] = env;
			const devConfig = await Config.init(vkGroupId);
			expect(devConfig.vk_last_post_id).toBe(process.env['VK_LAST_POST_ID']);
			const devConfig2 = Config.get();
			expect(devConfig2.vk_last_post_id).toBe(process.env['VK_LAST_POST_ID']);
		}
	});
	it('should init config', async () => {
		try {
			process.env['NODE_ENV'] = 'production';
			await Config.init(vkGroupId);
			const conf2 = Config.get();
			expect(conf2.name).toBe('vk-tg-bot-dev');
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
