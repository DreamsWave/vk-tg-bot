import { logger } from '@yc-bot/shared';
import { SQS } from 'aws-sdk';

export const ymq = {
	sendMessage: async (url: string, message: unknown, options?: { apiOptions: object; sendParams: object }): Promise<SQS.SendMessageResult> => {
		if (!url) throw new Error('Url is required');
		const ymq = new SQS({
			region: 'ru-central1',
			endpoint: 'https://message-queue.api.cloud.yandex.net',
			...options?.apiOptions
		});
		const params: SQS.SendMessageRequest = {
			QueueUrl: url,
			MessageBody: JSON.stringify(message) ?? '',
			...options?.sendParams
		};
		try {
			const result = await ymq.sendMessage(params).promise();
			logger.debug(result);
			return result;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
};
