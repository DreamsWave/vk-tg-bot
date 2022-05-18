import { VK, getRandomId } from 'vk-io';
import { logger } from '@yc-bot/shared/utils';
import { getConfig } from '@yc-bot/shared/config';

export const sendMessage = async (peerId: number | string, message?: string, attachments?: string): Promise<void> => {
	const config = getConfig();
	const vk = new VK({ token: config.vk_group_token });
	if (peerId) {
		try {
			const sendOptions = { peer_id: +peerId, message, random_id: getRandomId() } as {
				peer_id: number;
				message?: string;
				random_id: number;
				attachment?: string;
			};
			if (attachments) {
				sendOptions.attachment = attachments;
				await vk.api.messages.send(sendOptions);
				return;
			}
			if (!message.length) return;
			await vk.api.messages.send(sendOptions);
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
};
