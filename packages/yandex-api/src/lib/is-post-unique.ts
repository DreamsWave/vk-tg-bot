import { logger } from '@yc-bot/shared/utils';
import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk';
import { Event, Context, VKEvent, Post } from '@yc-bot/types';
import dotenv from 'dotenv';
dotenv.config();

const functionServiceOptions = {
	endpoint: 'serverless-functions.api.cloud.yandex.net:443'
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
	const iamToken = context?.token?.access_token ?? process.env.YC_TOKEN;
	const session = new Session({ iamToken });
	const client = session.client(serviceClients.FunctionServiceClient, functionServiceOptions.endpoint);
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
