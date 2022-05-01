import { VK as VKAPI, API, getRandomId } from 'vk-io';
import dotenv from 'dotenv';
dotenv.config();

interface IVK {
	errorChatId: number;
	api: API;
	sendError: (error: unknown) => Promise<void>;
}

export default class VK implements IVK {
	errorChatId: number;
	api: API;
	constructor(token: string, errorChatId?: number | string) {
		this.api = new VKAPI({ token: token ?? process.env.VK_TOKEN }).api;
		this.errorChatId = +errorChatId;
	}

	async sendError(error: unknown): Promise<void> {
		if (this.errorChatId) {
			let message = '';
			if (error instanceof Error) {
				message = error.message;
			} else {
				message = JSON.stringify(error);
			}
			await this.api.messages.send({ peer_id: this.errorChatId, random_id: getRandomId(), message });
		}
	}
}
