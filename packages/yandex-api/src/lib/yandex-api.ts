import { getConfig, logger } from '@yc-bot/shared';
import { SQS } from 'aws-sdk';
import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk';
import { Event, Context, VKEvent, Post } from '@yc-bot/types';

const config = getConfig();

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
			logger.debug(JSON.stringify(result));
			return result;
		} catch (error) {
			logger.error(JSON.stringify(error));
			throw error;
		}
	}
};

export const isPostUnique = async (event: Event, context: Context): Promise<boolean> => {
	const vkEvent: VKEvent = JSON.parse(event.body) ?? {};
	const post = vkEvent.object as Post;
	if (!post.id) return false;

	const {
		serverless: {
			functions_function_service: { GetFunctionVersionRequest, RemoveFunctionTagRequest, SetFunctionTagRequest }
		}
	} = cloudApi;
	const session = new Session({ iamToken: context.token.access_token ?? process.env.YC_TOKEN });
	const client = session.client(serviceClients.FunctionServiceClient, 'serverless-functions.api.cloud.yandex.net:443');
	try {
		const functionData = await client.getVersion(GetFunctionVersionRequest.fromPartial({ functionVersionId: context.functionVersion }));
		if (functionData.tags.includes(`postid_${post.id}`)) {
			console.log('Duplicate');
			return false;
		}
		const prevIdTag = functionData.tags.find((tag) => tag.split('_')[0] === 'postid');
		if (prevIdTag) {
			await client.removeTag(RemoveFunctionTagRequest.fromPartial({ functionVersionId: context.functionVersion, tag: prevIdTag }));
		}
		await client.setTag(SetFunctionTagRequest.fromPartial({ functionVersionId: context.functionVersion, tag: `postid_${post.id}` }));
	} catch (error) {
		logger.error(error);
		return false;
	}
	return true;
};
