import { Config } from '@yc-bot/shared/config';
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
	const conf = Config.get();
	if (conf.vk_last_post_id === postId) return false;
	return new Promise((resolve, reject) => {
		const documentClient = new AWS.DynamoDB.DocumentClient();
		documentClient.batchWrite(
			{
				ReturnConsumedCapacity: 'TOTAL',
				RequestItems: {
					[Config.configsTableName]: [
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
