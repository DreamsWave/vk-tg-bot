import { VK as VKAPI, API, getRandomId } from 'vk-io';
import dotenv from 'dotenv';
import { logger, getConfig } from '@yc-bot/shared';
dotenv.config();

interface IVK {
	// errorChatId: number;
	api: API;
	sendMessage(peerId: number | string, message: string): Promise<void>;
	// sendError(error: unknown): Promise<void>;
}

class VK implements IVK {
	// errorChatId: number;
	api: API;
	instance: VKAPI;
	constructor() {
		const config = getConfig();
		this.instance = new VKAPI({ token: config.vk_group_token });
		this.api = this.instance.api;
		// this.errorChatId = +process.env.VK_ERROR_CHAT_ID;
	}

	async sendMessage(peerId: number | string, message?: string, attachments?: string): Promise<void> {
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
					await this.api.messages.send(sendOptions);
					return;
				}
				if (!message.length) return;
				await this.api.messages.send(sendOptions);
			} catch (error) {
				logger.error(error);
				// this.sendError(error);
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// async sendError(error: any): Promise<void> {
	// 	if (this.errorChatId && this.api && error) {
	// 		try {
	// 			let message = '';
	// 			if (error.stderr) {
	// 				message = error.stderr;
	// 			} else if (error instanceof Error) {
	// 				message = error.message;
	// 			} else {
	// 				JSON.stringify(error);
	// 			}
	// 			await this.api.messages.send({ peer_id: this.errorChatId, random_id: getRandomId(), message });
	// 		} catch (error) {
	// 			logger.error(error.message);
	// 		}
	// 	}
	// }
}

export const vk = new VK();
