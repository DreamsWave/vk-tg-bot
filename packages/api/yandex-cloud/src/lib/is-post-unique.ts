import { config } from '@yc-bot/shared/config';
import AWS from 'aws-sdk';

AWS.config.update({
	dynamodb: {
		endpoint: new AWS.Endpoint(process.env['AWS_ENDPOINT']),
		region: 'ru-central1-a'
	},
	accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
	secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
});

const isPostUnique = async (postId: number | string): Promise<boolean> => {
	postId = String(postId);
	const conf = config.get();
	if (conf.vk_last_post_id === postId) return false;
	return new Promise((resolve, reject) => {
		const documentClient = new AWS.DynamoDB.DocumentClient();
		documentClient.batchWrite(
			{
				ReturnConsumedCapacity: 'TOTAL',
				RequestItems: {
					[config.configsTableName]: [
						{
							PutRequest: {
								Item: {
									...conf,
									vk_last_post_id: postId
								}
							}
						}
					]
				}
			},
			function (err, data) {
				if (err) {
					return resolve(false);
				} else {
					return resolve(true);
				}
			}
		);
	});
};
export default isPostUnique;
// import { logger } from '@yc-bot/shared/utils';
// import { Session, cloudApi, serviceClients } from '@yandex-cloud/nodejs-sdk';
// import { Event, Context, VKEvent, Post } from '@yc-bot/types';
// import dotenv from 'dotenv';
// dotenv.config();

// const functionServiceOptions = {
// 	endpoint: 'serverless-functions.api.cloud.yandex.net:443'
// };

// export const isPostUnique = async (event: Event, context: Context): Promise<boolean> => {
// 	const vkEvent: VKEvent = JSON.parse(event.body) ?? {};
// 	const post = vkEvent.object as Post;
// 	if (!post.id) return false;

// 	const {
// 		serverless: {
// 			functions_function_service: { GetFunctionVersionRequest, RemoveFunctionTagRequest, SetFunctionTagRequest }
// 		}
// 	} = cloudApi;
// 	const iamToken = context?.token?.access_token ?? process.env.YC_TOKEN;
// 	const session = new Session({ iamToken });
// 	const client = session.client(serviceClients.FunctionServiceClient, functionServiceOptions.endpoint);
// 	try {
// 		const functionData = await client.getVersion(GetFunctionVersionRequest.fromPartial({ functionVersionId: context.functionVersion }));
// 		if (functionData.tags.includes(`postid_${post.id}`)) {
// 			console.log('Duplicate');
// 			return false;
// 		}
// 		const prevIdTag = functionData.tags.find((tag) => tag.split('_')[0] === 'postid');
// 		if (prevIdTag) {
// 			await client.removeTag(RemoveFunctionTagRequest.fromPartial({ functionVersionId: context.functionVersion, tag: prevIdTag }));
// 		}
// 		await client.setTag(SetFunctionTagRequest.fromPartial({ functionVersionId: context.functionVersion, tag: `postid_${post.id}` }));
// 	} catch (error) {
// 		logger.error(error);
// 		return false;
// 	}
// 	return true;
// };
