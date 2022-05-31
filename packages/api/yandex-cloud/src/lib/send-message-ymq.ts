import { logger } from '@yc-bot/shared/utils';
import { SQS } from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const YMQOptions = {
	endpoint: 'https://message-queue.api.cloud.yandex.net',
	region: 'ru-central1'
};

const sendMessageYMQ = async (url: string, message: unknown, options?: { apiOptions: object; sendParams: object }): Promise<SQS.SendMessageResult> => {
	if (!url) throw new Error('Url is required');
	const { endpoint, region } = YMQOptions;
	const ymq = new SQS({
		region,
		endpoint,
		...options?.apiOptions
	});
	const params: SQS.SendMessageRequest = {
		QueueUrl: url,
		MessageBody: JSON.stringify(message) ?? '',
		...options?.sendParams
	};
	try {
		const result = await ymq.sendMessage(params).promise();
		return result;
	} catch (error) {
		logger.error(JSON.stringify(error));
		throw error;
	}
};

export default sendMessageYMQ;
