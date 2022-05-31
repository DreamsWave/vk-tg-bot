import { VK } from 'vk-io';
import { logger } from '@yc-bot/shared/utils';
import { Config } from '@yc-bot/shared/config';

export const getShortLink = async (url: string): Promise<string> => {
	const conf = Config.get();
	const vk = new VK({ token: conf.vk_group_token });
	let shortUrl = '';
	if (url) {
		try {
			const result = await vk.api.utils.getShortLink({ url });
			if (result) shortUrl = result.short_url;
		} catch (error) {
			logger.error(error);
		}
	}
	return shortUrl;
};
