import { VK } from 'vk-io';
import { logger } from '@yc-bot/shared/utils';
import { getConfig } from '@yc-bot/shared/config';

export const getShortLink = async (url: string): Promise<string> => {
	const config = getConfig();
	const vk = new VK({ token: config.vk_group_token });
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
